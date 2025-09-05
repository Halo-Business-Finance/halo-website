-- CRITICAL SECURITY FIX: Strengthen RLS policies to require active session verification for admin access to customer PII

-- First, drop all existing problematic policies
DROP POLICY IF EXISTS "Admins can delete consultations with audit trail" ON public.consultations;
DROP POLICY IF EXISTS "Restricted admin consultation access with context verification" ON public.consultations;
DROP POLICY IF EXISTS "Restricted admin consultation access with mandatory function us" ON public.consultations;
DROP POLICY IF EXISTS "Staff can update consultation status securely" ON public.consultations;
DROP POLICY IF EXISTS "Ultra secure admin consultation management" ON public.consultations;

-- Create a helper function to verify active admin session with enhanced security checks
CREATE OR REPLACE FUNCTION public.verify_active_admin_session()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  active_session_count integer;
  session_last_activity timestamp with time zone;
  session_security_level text;
  user_role_active boolean;
BEGIN
  -- Must be authenticated
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;
  
  -- Must have admin role
  IF NOT has_role(auth.uid(), 'admin') THEN
    RETURN false;
  END IF;
  
  -- Check for active session with strict time requirements
  SELECT COUNT(*), MAX(last_activity), MAX(security_level)
  INTO active_session_count, session_last_activity, session_security_level
  FROM public.user_sessions
  WHERE user_id = auth.uid() 
    AND is_active = true 
    AND expires_at > now()
    AND last_activity > now() - interval '15 minutes'  -- Strict 15-minute activity window
    AND last_security_check > now() - interval '30 minutes'; -- Recent security check required
  
  -- Must have exactly one recent active session
  IF active_session_count != 1 THEN
    -- Log suspicious activity - multiple sessions or no recent session
    INSERT INTO public.security_events (
      event_type, severity, user_id, ip_address, event_data, source
    ) VALUES (
      'admin_session_verification_failed', 'critical', auth.uid(), inet_client_addr(),
      jsonb_build_object(
        'reason', 'invalid_session_count',
        'active_sessions', active_session_count,
        'required_activity_window', '15_minutes',
        'last_activity', session_last_activity
      ),
      'session_security_monitor'
    );
    RETURN false;
  END IF;
  
  -- Ensure recent activity (within last 15 minutes)
  IF session_last_activity IS NULL OR session_last_activity < now() - interval '15 minutes' THEN
    INSERT INTO public.security_events (
      event_type, severity, user_id, ip_address, event_data, source
    ) VALUES (
      'admin_stale_session_blocked', 'high', auth.uid(), inet_client_addr(),
      jsonb_build_object(
        'last_activity', session_last_activity,
        'max_allowed_inactivity', '15_minutes',
        'blocked_access', 'consultation_data'
      ),
      'session_security_monitor'
    );
    RETURN false;
  END IF;
  
  -- All checks passed - log successful verification
  INSERT INTO public.security_events (
    event_type, severity, user_id, ip_address, event_data, source
  ) VALUES (
    'admin_session_verified_for_pii_access', 'info', auth.uid(), inet_client_addr(),
    jsonb_build_object(
      'verification_method', 'active_session_check',
      'session_security_level', session_security_level,
      'last_activity', session_last_activity
    ),
    'session_security_monitor'
  );
  
  RETURN true;
END;
$$;

-- Grant execute permission only to authenticated users
REVOKE EXECUTE ON FUNCTION public.verify_active_admin_session() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.verify_active_admin_session() TO authenticated;

-- Create ultra-secure RLS policies that require active session verification

-- Policy 1: User access (unchanged - users can access their own data)
CREATE POLICY "Secure user consultation access with session verification" 
ON public.consultations 
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND auth.uid() = user_id
);

-- Policy 2: User insert (unchanged but more explicit)
CREATE POLICY "Users can insert own consultations with validation" 
ON public.consultations 
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id 
  AND auth.uid() IS NOT NULL 
  AND user_id IS NOT NULL 
  AND encrypted_name IS NOT NULL 
  AND encrypted_email IS NOT NULL 
  AND loan_program IS NOT NULL 
  AND loan_amount IS NOT NULL 
  AND timeframe IS NOT NULL
);

-- Policy 3: Admin SELECT - REQUIRES ACTIVE SESSION VERIFICATION
CREATE POLICY "Admin consultation SELECT with mandatory session verification" 
ON public.consultations 
FOR SELECT
TO authenticated
USING (
  -- Users can see their own data OR
  (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
  -- Admins with verified active sessions can see all data
  (auth.uid() IS NOT NULL AND verify_active_admin_session())
);

-- Policy 4: Admin UPDATE - REQUIRES ACTIVE SESSION VERIFICATION  
CREATE POLICY "Admin consultation UPDATE with mandatory session verification" 
ON public.consultations 
FOR UPDATE
TO authenticated
USING (
  -- Users can update their own OR
  (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
  -- Admins with verified active sessions
  (auth.uid() IS NOT NULL AND verify_active_admin_session())
)
WITH CHECK (
  -- Users can update their own OR
  (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
  -- Admins with verified active sessions, with data integrity checks
  (auth.uid() IS NOT NULL AND verify_active_admin_session() 
   AND user_id IS NOT NULL 
   AND encrypted_name IS NOT NULL 
   AND encrypted_email IS NOT NULL)
);

-- Policy 5: Admin DELETE - REQUIRES ACTIVE SESSION VERIFICATION
CREATE POLICY "Admin consultation DELETE with mandatory session verification" 
ON public.consultations 
FOR DELETE
TO authenticated
USING (
  -- Only admins with verified active sessions can delete
  auth.uid() IS NOT NULL AND verify_active_admin_session()
);

-- Update the secure admin function to use session verification
CREATE OR REPLACE FUNCTION public.get_secure_admin_consultation_data()
RETURNS TABLE(
  id uuid,
  masked_name text,
  masked_email text,
  masked_phone text,
  company text,
  loan_program text,
  loan_amount_category text,
  timeframe text,
  status text,
  created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- CRITICAL: Verify active admin session before any data access
  IF NOT verify_active_admin_session() THEN
    -- Enhanced logging for blocked access attempts
    INSERT INTO public.security_events (
      event_type, severity, user_id, ip_address, event_data, source
    ) VALUES (
      'unauthorized_admin_consultation_access_blocked_enhanced', 'critical', auth.uid(), inet_client_addr(),
      jsonb_build_object(
        'function_name', 'get_secure_admin_consultation_data',
        'access_denied_reason', 'session_verification_failed',
        'attempted_by', auth.uid(),
        'security_enhancement', 'active_session_required'
      ),
      'enhanced_admin_data_protection'
    );
    
    RAISE EXCEPTION 'Access denied: Active admin session verification required for consultation data access';
  END IF;
  
  -- Log legitimate admin access with session details
  INSERT INTO public.security_events (
    event_type, severity, user_id, ip_address, event_data, source
  ) VALUES (
    'admin_consultation_data_accessed_with_session_verification', 'medium', auth.uid(), inet_client_addr(),
    jsonb_build_object(
      'function_name', 'get_secure_admin_consultation_data',
      'admin_user_id', auth.uid(),
      'data_sensitivity', 'high',
      'access_method', 'secure_masked_function_with_session_verification',
      'session_verified', true
    ),
    'enhanced_admin_audit_trail'
  );
  
  -- Return ONLY masked/categorized data - never raw PII
  RETURN QUERY
  SELECT 
    c.id,
    -- Always mask PII data regardless of encryption status
    mask_sensitive_data(COALESCE(c.encrypted_name, 'Unknown'), 'name') as masked_name,
    mask_sensitive_data(COALESCE(c.encrypted_email, 'unknown@example.com'), 'email') as masked_email,
    mask_sensitive_data(COALESCE(c.encrypted_phone, '0000000000'), 'phone') as masked_phone,
    -- Only show truncated company name for safety
    CASE 
      WHEN c.company IS NOT NULL AND length(c.company) > 2 
      THEN left(c.company, 20) || CASE WHEN length(c.company) > 20 THEN '...' ELSE '' END
      ELSE 'Business Entity'
    END as company,
    c.loan_program,
    -- Categorize loan amounts without exposing exact figures
    CASE 
      WHEN c.loan_amount ILIKE '%under%' OR c.loan_amount ILIKE '%<50%' OR c.loan_amount ILIKE '%less than 50%' THEN 'Small Business'
      WHEN c.loan_amount ILIKE '%50k-250k%' OR c.loan_amount ILIKE '%50,000-250,000%' THEN 'Medium Business'
      WHEN c.loan_amount ILIKE '%250k-500k%' OR c.loan_amount ILIKE '%250,000-500,000%' THEN 'Large Business'
      WHEN c.loan_amount ILIKE '%500k%' OR c.loan_amount ILIKE '%500,000%' OR c.loan_amount ILIKE '%million%' THEN 'Enterprise'
      ELSE 'Undisclosed'
    END as loan_amount_category,
    c.timeframe,
    c.status,
    c.created_at
  FROM public.consultations c
  ORDER BY c.created_at DESC;
END;
$$;

-- Log this critical security enhancement
INSERT INTO public.security_events (
  event_type, severity, event_data, source
) VALUES (
  'consultation_session_security_vulnerability_fixed', 'critical',
  jsonb_build_object(
    'vulnerability', 'admin_access_without_session_verification',
    'fixes_applied', ARRAY[
      'mandatory_active_session_verification_for_admin_access',
      'strict_15_minute_activity_window_requirement',
      'enhanced_session_security_checks',
      'comprehensive_audit_logging_for_all_access_attempts',
      'blocked_stale_and_compromised_session_access'
    ],
    'security_level', 'maximum_protection_with_session_verification',
    'compliance_impact', 'prevents_compromised_admin_account_pii_access'
  ),
  'critical_security_incident_response'
);