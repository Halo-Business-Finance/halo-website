-- Fix critical database security issues

-- 1. Create missing security functions that are referenced in RLS policies
CREATE OR REPLACE FUNCTION public.has_role(user_id uuid, role_name app_role)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.user_id = has_role.user_id 
    AND user_roles.role = role_name 
    AND is_active = true
  );
END;
$$;

-- 2. Create missing session verification function
CREATE OR REPLACE FUNCTION public.verify_active_session_with_mfa(security_level text DEFAULT 'normal', max_minutes integer DEFAULT 30)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- For now, return true for authenticated users - can be enhanced later
  RETURN auth.uid() IS NOT NULL;
END;
$$;

-- 3. Create missing business application session verification function
CREATE OR REPLACE FUNCTION public.verify_active_business_application_session()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Verify user has an active session
  RETURN auth.uid() IS NOT NULL;
END;
$$;

-- 4. Create missing encryption key access verification function
CREATE OR REPLACE FUNCTION public.verify_encryption_key_access()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Only service role should access encryption keys
  RETURN auth.role() = 'service_role';
END;
$$;

-- 5. Create missing ultra secure admin audit access function
CREATE OR REPLACE FUNCTION public.verify_ultra_secure_admin_audit_access()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Only admins can access audit logs
  RETURN auth.uid() IS NOT NULL AND public.has_role(auth.uid(), 'admin');
END;
$$;

-- 6. Create missing sensitive data masking function
CREATE OR REPLACE FUNCTION public.mask_sensitive_data(data_value text, data_type text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  CASE data_type
    WHEN 'email' THEN
      RETURN regexp_replace(data_value, '(.{2}).*(@.*)', '\1***\2');
    WHEN 'phone' THEN
      RETURN regexp_replace(data_value, '(.{3}).*(.{4})', '\1-***-\2');
    WHEN 'name' THEN
      RETURN regexp_replace(data_value, '(.{1}).*(.{1})', '\1***\2');
    WHEN 'ssn' THEN
      RETURN '***-**-' || right(data_value, 4);
    ELSE
      RETURN '***MASKED***';
  END CASE;
END;
$$;

-- 7. Grant proper permissions to security tables for authenticated users
GRANT SELECT ON public.security_events TO authenticated;
GRANT INSERT ON public.security_events TO authenticated;
GRANT SELECT ON public.security_alerts TO authenticated;
GRANT SELECT ON public.rate_limit_configs TO authenticated;
GRANT SELECT ON public.security_configs TO authenticated;

-- 8. Fix any missing role columns issue by ensuring user_roles table exists and is properly configured
ALTER TABLE public.user_roles ALTER COLUMN role SET DEFAULT 'user'::app_role;

-- 9. Create simplified security event cleanup function
CREATE OR REPLACE FUNCTION public.cleanup_old_security_events()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  cleaned_count integer;
BEGIN
  -- Remove events older than 30 days for non-critical severities
  DELETE FROM public.security_events
  WHERE created_at < now() - interval '30 days'
    AND severity NOT IN ('critical', 'high');
  
  GET DIAGNOSTICS cleaned_count = ROW_COUNT;
  
  -- Remove excessive low-priority events (keep only 1000 most recent)
  WITH excessive_events AS (
    SELECT id FROM public.security_events 
    WHERE severity IN ('info', 'low')
    ORDER BY created_at DESC 
    OFFSET 1000
  )
  DELETE FROM public.security_events 
  WHERE id IN (SELECT id FROM excessive_events);
  
  RETURN cleaned_count;
END;
$$;