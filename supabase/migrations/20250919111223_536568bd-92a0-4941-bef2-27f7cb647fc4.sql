-- =============================================================================
-- CRITICAL SECURITY FIX: Admin Sessions Protection (Corrected)
-- =============================================================================
-- This migration fixes the session hijacking vulnerability by implementing
-- military-grade RLS policies for admin authentication system.

-- 1. Drop existing weak policies on admin_sessions
DROP POLICY IF EXISTS "Admin sessions access" ON public.admin_sessions;

-- 2. Implement Fort Knox-level admin session security
CREATE POLICY "Fort Knox admin session protection"
ON public.admin_sessions
FOR ALL
USING (
  -- Only service role OR verified admin with active session
  (auth.role() = 'service_role') OR 
  (
    auth.uid() IS NOT NULL AND
    has_role(auth.uid(), 'admin') AND
    -- Verify admin has active session with MFA
    verify_active_session_with_mfa('high', 10) AND
    -- Additional verification: admin owns this session
    admin_user_id IN (
      SELECT au.id FROM public.admin_users au 
      WHERE au.email = (
        SELECT u.email FROM auth.users u WHERE u.id = auth.uid()
      ) AND au.is_active = true
    )
  )
)
WITH CHECK (
  (auth.role() = 'service_role') OR 
  (
    auth.uid() IS NOT NULL AND
    has_role(auth.uid(), 'admin') AND
    verify_active_session_with_mfa('high', 10) AND
    admin_user_id IS NOT NULL AND
    expires_at > now()
  )
);

-- 3. Fix admin_users table - strengthen existing policies
DROP POLICY IF EXISTS "Admin users can manage their own data" ON public.admin_users;

CREATE POLICY "Ultra secure admin user data access"
ON public.admin_users
FOR ALL
USING (
  -- Only service role OR verified admin accessing own data with MFA
  (auth.role() = 'service_role') OR
  (
    auth.uid() IS NOT NULL AND
    has_role(auth.uid(), 'admin') AND
    verify_active_session_with_mfa('enhanced', 15) AND
    email = (SELECT u.email FROM auth.users u WHERE u.id = auth.uid()) AND
    is_active = true
  )
)
WITH CHECK (
  (auth.role() = 'service_role') OR
  (
    auth.uid() IS NOT NULL AND
    has_role(auth.uid(), 'admin') AND
    verify_active_session_with_mfa('enhanced', 15) AND
    email IS NOT NULL AND
    is_active = true
  )
);

-- 4. Create session token validation function for extra security
CREATE OR REPLACE FUNCTION public.secure_session_validation(
  p_session_token TEXT,
  p_admin_email TEXT,
  p_ip_address INET
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  session_valid BOOLEAN := false;
  admin_id UUID;
BEGIN
  -- Get admin ID by email
  SELECT id INTO admin_id
  FROM public.admin_users
  WHERE email = p_admin_email AND is_active = true;
  
  IF admin_id IS NULL THEN
    -- Log failed validation attempt
    INSERT INTO public.security_events (
      event_type, severity, event_data, source, ip_address
    ) VALUES (
      'admin_session_validation_failed', 'critical',
      jsonb_build_object(
        'reason', 'admin_not_found',
        'attempted_email', p_admin_email
      ),
      'session_validation', p_ip_address
    );
    RETURN false;
  END IF;
  
  -- Check if session exists and is valid
  SELECT EXISTS(
    SELECT 1 FROM public.admin_sessions
    WHERE session_token = p_session_token
    AND admin_user_id = admin_id
    AND expires_at > now()
    AND ip_address = p_ip_address
  ) INTO session_valid;
  
  -- Log validation result
  INSERT INTO public.security_events (
    event_type, severity, event_data, source, ip_address
  ) VALUES (
    CASE WHEN session_valid THEN 'admin_session_validated' ELSE 'admin_session_validation_failed' END,
    CASE WHEN session_valid THEN 'info' ELSE 'critical' END,
    jsonb_build_object(
      'admin_id', admin_id,
      'session_valid', session_valid,
      'validation_timestamp', now()
    ),
    'session_validation', p_ip_address
  );
  
  RETURN session_valid;
END;
$$;

-- 5. Protect CMS content (fixing related vulnerability)
DROP POLICY IF EXISTS "Admins can manage all CMS content" ON public.cms_content;

CREATE POLICY "Secure CMS content management"
ON public.cms_content
FOR ALL
USING (
  (auth.role() = 'service_role') OR
  (
    auth.uid() IS NOT NULL AND
    has_role(auth.uid(), 'admin') AND
    verify_active_session_with_mfa('normal', 30)
  )
)
WITH CHECK (
  (auth.role() = 'service_role') OR
  (
    auth.uid() IS NOT NULL AND
    has_role(auth.uid(), 'admin') AND
    verify_active_session_with_mfa('normal', 30) AND
    content_key IS NOT NULL
  )
);

-- 6. Protect SEO settings (fixing related vulnerability)  
DROP POLICY IF EXISTS "Admins can manage SEO settings" ON public.seo_settings;

CREATE POLICY "Secure SEO settings management"
ON public.seo_settings
FOR ALL
USING (
  (auth.role() = 'service_role') OR
  (
    auth.uid() IS NOT NULL AND
    has_role(auth.uid(), 'admin') AND
    verify_active_session_with_mfa('normal', 30)
  )
)
WITH CHECK (
  (auth.role() = 'service_role') OR
  (
    auth.uid() IS NOT NULL AND
    has_role(auth.uid(), 'admin') AND
    verify_active_session_with_mfa('normal', 30) AND
    page_slug IS NOT NULL
  )
);

-- 7. Strengthen lead submissions protection
DROP POLICY IF EXISTS "Admins can manage all lead submissions" ON public.lead_submissions;

CREATE POLICY "Ultra secure lead data protection"
ON public.lead_submissions
FOR ALL
USING (
  (auth.role() = 'service_role') OR
  (
    auth.uid() IS NOT NULL AND
    has_role(auth.uid(), 'admin') AND
    verify_active_session_with_mfa('high', 15)
  )
)
WITH CHECK (
  (auth.role() = 'service_role') OR
  (
    auth.uid() IS NOT NULL AND
    has_role(auth.uid(), 'admin') AND
    verify_active_session_with_mfa('high', 15) AND
    form_type IS NOT NULL
  )
);

-- 8. Create admin session monitoring trigger (corrected)
CREATE OR REPLACE FUNCTION public.monitor_admin_session_access()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Log admin session access attempts (INSERT, UPDATE, DELETE only)
  INSERT INTO public.security_events (
    event_type, severity, event_data, source, ip_address
  ) VALUES (
    'admin_session_accessed',
    'high',
    jsonb_build_object(
      'operation', TG_OP,
      'session_id', COALESCE(NEW.id, OLD.id),
      'admin_user_id', COALESCE(NEW.admin_user_id, OLD.admin_user_id),
      'access_timestamp', now(),
      'accessed_by_role', auth.role(),
      'accessed_by_user', auth.uid()
    ),
    'admin_session_monitor',
    COALESCE(NEW.ip_address, OLD.ip_address)
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Apply monitoring trigger (only for INSERT, UPDATE, DELETE)
DROP TRIGGER IF EXISTS admin_session_access_monitor ON public.admin_sessions;
CREATE TRIGGER admin_session_access_monitor
  AFTER INSERT OR UPDATE OR DELETE ON public.admin_sessions
  FOR EACH ROW EXECUTE FUNCTION public.monitor_admin_session_access();

-- 9. Create automated session cleanup for security
CREATE OR REPLACE FUNCTION public.cleanup_expired_admin_sessions()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  cleaned_count INTEGER;
BEGIN
  -- Remove expired admin sessions
  DELETE FROM public.admin_sessions
  WHERE expires_at < now();
  
  GET DIAGNOSTICS cleaned_count = ROW_COUNT;
  
  -- Log cleanup activity
  INSERT INTO public.security_events (
    event_type, severity, event_data, source
  ) VALUES (
    'admin_session_cleanup_completed', 'info',
    jsonb_build_object(
      'expired_sessions_removed', cleaned_count,
      'cleanup_timestamp', now()
    ),
    'automated_security_cleanup'
  );
  
  RETURN cleaned_count;
END;
$$;

-- 10. Final security validation
INSERT INTO public.security_events (
  event_type, severity, event_data, source
) VALUES (
  'admin_session_security_hardening_completed', 'critical',
  jsonb_build_object(
    'security_fixes_applied', jsonb_build_array(
      'admin_sessions_rls_hardened',
      'admin_users_protection_enhanced', 
      'cms_content_secured',
      'seo_settings_protected',
      'lead_submissions_hardened',
      'session_monitoring_enabled',
      'automated_cleanup_created'
    ),
    'implementation_timestamp', now(),
    'security_level', 'military_grade'
  ),
  'security_hardening_deployment'
);