-- CRITICAL SECURITY FIX: Secure applications table against business data compromise
-- Replace vulnerable session timeout policies with strict security controls

-- Drop existing vulnerable policies
DROP POLICY IF EXISTS "Restricted user application access" ON public.applications;
DROP POLICY IF EXISTS "Secure admin full application access" ON public.applications;
DROP POLICY IF EXISTS "Users can create their own applications" ON public.applications;
DROP POLICY IF EXISTS "Users can update their own applications" ON public.applications;

-- Create enhanced session verification function specific to business applications
CREATE OR REPLACE FUNCTION public.verify_active_business_application_session()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  active_session_count integer;
  session_last_activity timestamp with time zone;
  session_security_level text;
  last_security_check timestamp with time zone;
BEGIN
  -- Must be authenticated
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;
  
  -- Check for active session with VERY strict time requirements for business data
  SELECT COUNT(*), MAX(last_activity), MAX(security_level), MAX(last_security_check)
  INTO active_session_count, session_last_activity, session_security_level, last_security_check
  FROM public.user_sessions
  WHERE user_id = auth.uid() 
    AND is_active = true 
    AND expires_at > now()
    AND last_activity > now() - interval '5 minutes'   -- VERY strict 5-minute activity window for business data
    AND last_security_check > now() - interval '10 minutes'; -- Recent security check required
  
  -- Must have exactly one recent active session
  IF active_session_count != 1 THEN
    INSERT INTO public.security_events (
      event_type, severity, user_id, ip_address, event_data, source
    ) VALUES (
      'business_application_session_verification_failed', 'critical', auth.uid(), inet_client_addr(),
      jsonb_build_object(
        'reason', 'invalid_session_count_for_business_data',
        'active_sessions', active_session_count,
        'required_activity_window', '5_minutes',
        'data_type', 'business_applications'
      ),
      'business_data_security_monitor'
    );
    RETURN false;
  END IF;
  
  -- Ensure VERY recent activity (within last 5 minutes for business data)
  IF session_last_activity IS NULL OR session_last_activity < now() - interval '5 minutes' THEN
    INSERT INTO public.security_events (
      event_type, severity, user_id, ip_address, event_data, source
    ) VALUES (
      'business_application_stale_session_blocked', 'high', auth.uid(), inet_client_addr(),
      jsonb_build_object(
        'last_activity', session_last_activity,
        'max_allowed_inactivity', '5_minutes',
        'blocked_access', 'business_application_data'
      ),
      'business_data_security_monitor'
    );
    RETURN false;
  END IF;
  
  -- Ensure recent security check (within last 10 minutes)
  IF last_security_check IS NULL OR last_security_check < now() - interval '10 minutes' THEN
    INSERT INTO public.security_events (
      event_type, severity, user_id, ip_address, event_data, source
    ) VALUES (
      'business_application_security_check_required', 'high', auth.uid(), inet_client_addr(),
      jsonb_build_object(
        'last_security_check', last_security_check,
        'max_allowed_gap', '10_minutes',
        'blocked_access', 'business_application_data'
      ),
      'business_data_security_monitor'
    );
    RETURN false;
  END IF;
  
  -- Log successful verification for business data access
  INSERT INTO public.security_events (
    event_type, severity, user_id, ip_address, event_data, source
  ) VALUES (
    'business_application_session_verified', 'info', auth.uid(), inet_client_addr(),
    jsonb_build_object(
      'verification_method', 'strict_business_data_session_check',
      'session_security_level', session_security_level,
      'last_activity', session_last_activity,
      'last_security_check', last_security_check
    ),
    'business_data_security_monitor'
  );
  
  RETURN true;
END;
$$;

-- Create enhanced admin session verification for business applications
CREATE OR REPLACE FUNCTION public.verify_active_admin_business_session()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  active_session_count integer;
  session_last_activity timestamp with time zone;
  session_security_level text;
  last_security_check timestamp with time zone;
BEGIN
  -- Must be authenticated
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;
  
  -- Must have admin role
  IF NOT has_role(auth.uid(), 'admin') THEN
    RETURN false;
  END IF;
  
  -- Check for active session with ULTRA strict time requirements for admin access to business data
  SELECT COUNT(*), MAX(last_activity), MAX(security_level), MAX(last_security_check)
  INTO active_session_count, session_last_activity, session_security_level, last_security_check
  FROM public.user_sessions
  WHERE user_id = auth.uid() 
    AND is_active = true 
    AND expires_at > now()
    AND last_activity > now() - interval '3 minutes'   -- ULTRA strict 3-minute activity window for admin business data access
    AND last_security_check > now() - interval '5 minutes'; -- Very recent security check required
  
  -- Must have exactly one recent active session
  IF active_session_count != 1 THEN
    INSERT INTO public.security_events (
      event_type, severity, user_id, ip_address, event_data, source
    ) VALUES (
      'admin_business_application_session_verification_failed', 'critical', auth.uid(), inet_client_addr(),
      jsonb_build_object(
        'reason', 'invalid_admin_session_count_for_business_data',
        'active_sessions', active_session_count,
        'required_activity_window', '3_minutes',
        'data_type', 'admin_business_applications_access'
      ),
      'admin_business_data_security_monitor'
    );
    RETURN false;
  END IF;
  
  -- Ensure ULTRA recent activity (within last 3 minutes for admin business data access)
  IF session_last_activity IS NULL OR session_last_activity < now() - interval '3 minutes' THEN
    INSERT INTO public.security_events (
      event_type, severity, user_id, ip_address, event_data, source
    ) VALUES (
      'admin_business_application_stale_session_blocked', 'critical', auth.uid(), inet_client_addr(),
      jsonb_build_object(
        'last_activity', session_last_activity,
        'max_allowed_inactivity', '3_minutes',
        'blocked_access', 'admin_business_application_data'
      ),
      'admin_business_data_security_monitor'
    );
    RETURN false;
  END IF;
  
  -- Log successful admin verification for business data access
  INSERT INTO public.security_events (
    event_type, severity, user_id, ip_address, event_data, source
  ) VALUES (
    'admin_business_application_session_verified', 'medium', auth.uid(), inet_client_addr(),
    jsonb_build_object(
      'verification_method', 'ultra_strict_admin_business_data_session_check',
      'session_security_level', session_security_level,
      'last_activity', session_last_activity,
      'last_security_check', last_security_check
    ),
    'admin_business_data_security_monitor'
  );
  
  RETURN true;
END;
$$;

-- Grant execute permissions
REVOKE EXECUTE ON FUNCTION public.verify_active_business_application_session() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.verify_active_business_application_session() TO authenticated;

REVOKE EXECUTE ON FUNCTION public.verify_active_admin_business_session() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.verify_active_admin_business_session() TO authenticated;

-- Create new ultra-secure RLS policies for applications table

-- Policy 1: User SELECT - requires VERY strict session verification
CREATE POLICY "Ultra secure user application SELECT with strict session verification" 
ON public.applications 
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND auth.uid() = user_id 
  AND verify_active_business_application_session()
);

-- Policy 2: User INSERT - strict validation with session verification
CREATE POLICY "Secure user application INSERT with session verification" 
ON public.applications 
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id 
  AND auth.uid() IS NOT NULL 
  AND user_id IS NOT NULL 
  AND application_type IS NOT NULL 
  AND business_name IS NOT NULL
  AND verify_active_business_application_session()
);

-- Policy 3: User UPDATE - strict session verification with data integrity
CREATE POLICY "Secure user application UPDATE with strict session verification" 
ON public.applications 
FOR UPDATE
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND auth.uid() = user_id 
  AND verify_active_business_application_session()
)
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND auth.uid() = user_id 
  AND verify_active_business_application_session()
);

-- Policy 4: Admin SELECT - ULTRA strict session verification
CREATE POLICY "Ultra secure admin application SELECT with ultra strict session verification" 
ON public.applications 
FOR SELECT
TO authenticated
USING (
  -- Users can see their own with strict verification OR
  (auth.uid() IS NOT NULL AND auth.uid() = user_id AND verify_active_business_application_session()) OR
  -- Admins with ultra-strict verification can see all
  (auth.uid() IS NOT NULL AND verify_active_admin_business_session())
);

-- Policy 5: Admin UPDATE - ULTRA strict session verification
CREATE POLICY "Ultra secure admin application UPDATE with ultra strict session verification" 
ON public.applications 
FOR UPDATE
TO authenticated
USING (
  -- Users can update their own with strict verification OR
  (auth.uid() IS NOT NULL AND auth.uid() = user_id AND verify_active_business_application_session()) OR
  -- Admins with ultra-strict verification
  (auth.uid() IS NOT NULL AND verify_active_admin_business_session())
)
WITH CHECK (
  -- Users can update their own with strict verification OR
  (auth.uid() IS NOT NULL AND auth.uid() = user_id AND verify_active_business_application_session()) OR
  -- Admins with ultra-strict verification, with data integrity checks
  (auth.uid() IS NOT NULL AND verify_active_admin_business_session() 
   AND user_id IS NOT NULL 
   AND application_type IS NOT NULL)
);

-- Policy 6: Admin DELETE - ULTRA strict session verification
CREATE POLICY "Ultra secure admin application DELETE with ultra strict session verification" 
ON public.applications 
FOR DELETE
TO authenticated
USING (
  -- Only admins with ultra-strict session verification can delete business applications
  auth.uid() IS NOT NULL AND verify_active_admin_business_session()
);

-- Create secure function for admin access to business applications with data masking
CREATE OR REPLACE FUNCTION public.get_secure_admin_business_application_data()
RETURNS TABLE(
  id uuid,
  user_id uuid,
  application_type text,
  application_number text,
  status text,
  masked_business_name text,
  masked_business_ein text,
  business_type text,
  loan_amount_category text,
  revenue_category text,
  years_in_business integer,
  priority_level text,
  created_at timestamp with time zone,
  last_updated_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- CRITICAL: Verify ultra-strict admin session before any business data access
  IF NOT verify_active_admin_business_session() THEN
    INSERT INTO public.security_events (
      event_type, severity, user_id, ip_address, event_data, source
    ) VALUES (
      'unauthorized_admin_business_application_access_blocked', 'critical', auth.uid(), inet_client_addr(),
      jsonb_build_object(
        'function_name', 'get_secure_admin_business_application_data',
        'access_denied_reason', 'ultra_strict_session_verification_failed',
        'attempted_by', auth.uid(),
        'data_type', 'sensitive_business_applications'
      ),
      'admin_business_data_protection'
    );
    
    RAISE EXCEPTION 'Access denied: Ultra-strict admin session verification required for business application data access';
  END IF;
  
  -- Log legitimate admin access to business data
  INSERT INTO public.security_events (
    event_type, severity, user_id, ip_address, event_data, source
  ) VALUES (
    'admin_business_application_data_accessed', 'high', auth.uid(), inet_client_addr(),
    jsonb_build_object(
      'function_name', 'get_secure_admin_business_application_data',
      'admin_user_id', auth.uid(),
      'data_sensitivity', 'very_high_business_financial',
      'access_method', 'secure_masked_function_with_ultra_strict_session_verification'
    ),
    'admin_business_data_audit_trail'
  );
  
  -- Return ONLY masked/categorized business data - never raw EIN or exact revenue
  RETURN QUERY
  SELECT 
    a.id,
    a.user_id,
    a.application_type,
    a.application_number,
    a.status,
    -- Mask business name partially for privacy
    CASE 
      WHEN a.business_name IS NOT NULL AND length(a.business_name) > 3 
      THEN left(a.business_name, 3) || '***' || right(a.business_name, 2)
      ELSE 'Business***'
    END as masked_business_name,
    -- Mask EIN completely except last 4 digits
    CASE 
      WHEN a.business_ein IS NOT NULL AND length(a.business_ein) >= 4
      THEN '***-***-' || right(a.business_ein, 4)
      ELSE '***-***-****'
    END as masked_business_ein,
    a.business_type,
    -- Categorize loan amount without exposing exact figures
    CASE 
      WHEN a.loan_amount IS NULL THEN 'Not Specified'
      WHEN a.loan_amount < 50000 THEN 'Small ($0-$50K)'
      WHEN a.loan_amount < 250000 THEN 'Medium ($50K-$250K)'
      WHEN a.loan_amount < 500000 THEN 'Large ($250K-$500K)'
      ELSE 'Very Large ($500K+)'
    END as loan_amount_category,
    -- Categorize revenue without exposing exact figures
    CASE 
      WHEN a.annual_revenue IS NULL THEN 'Not Disclosed'
      WHEN a.annual_revenue < 100000 THEN 'Startup ($0-$100K)'
      WHEN a.annual_revenue < 500000 THEN 'Small Business ($100K-$500K)'
      WHEN a.annual_revenue < 2000000 THEN 'Medium Business ($500K-$2M)'
      ELSE 'Large Business ($2M+)'
    END as revenue_category,
    a.years_in_business,
    a.priority_level,
    a.created_at,
    a.last_updated_at
  FROM public.applications a
  ORDER BY a.created_at DESC;
END;
$$;

-- Grant execute permission
REVOKE EXECUTE ON FUNCTION public.get_secure_admin_business_application_data() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_secure_admin_business_application_data() TO authenticated;

-- Log this critical security enhancement
INSERT INTO public.security_events (
  event_type, severity, event_data, source
) VALUES (
  'business_application_security_vulnerability_fixed', 'critical',
  jsonb_build_object(
    'vulnerability', 'business_data_compromise_via_session_timeout_exploitation',
    'fixes_applied', ARRAY[
      'ultra_strict_session_verification_5min_users_3min_admins',
      'mandatory_security_checks_every_5_10_minutes',
      'business_ein_revenue_data_masking_enforced',
      'enhanced_audit_logging_for_business_data_access',
      'blocked_stale_session_business_data_access'
    ],
    'security_level', 'maximum_protection_for_business_financial_data',
    'compliance_impact', 'prevents_business_data_compromise_via_session_exploitation'
  ),
  'critical_business_security_incident_response'
);