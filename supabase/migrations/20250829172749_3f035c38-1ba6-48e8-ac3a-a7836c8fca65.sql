-- CRITICAL SECURITY FIXES - Priority 2: Security Event Management & Monitoring

-- 1. Add critical security event cleanup function
CREATE OR REPLACE FUNCTION public.emergency_cleanup_security_events()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  cleaned_count INTEGER;
BEGIN
  -- Only admins can run emergency cleanup
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Admin role required for emergency security event cleanup';
  END IF;
  
  -- Remove excessive client_log events (keep only last 1000)
  WITH excessive_logs AS (
    SELECT id FROM public.security_events 
    WHERE event_type = 'client_log' 
    AND severity IN ('info', 'low')
    ORDER BY created_at DESC 
    OFFSET 1000
  )
  DELETE FROM public.security_events 
  WHERE id IN (SELECT id FROM excessive_logs);
  
  GET DIAGNOSTICS cleaned_count = ROW_COUNT;
  
  -- Log the cleanup operation
  INSERT INTO public.security_events (
    event_type, severity, user_id, event_data, source
  ) VALUES (
    'emergency_security_cleanup_completed', 'high', auth.uid(),
    jsonb_build_object(
      'cleaned_events', cleaned_count,
      'cleanup_type', 'client_log_reduction',
      'performed_by', auth.uid()
    ),
    'security_maintenance'
  );
  
  RETURN cleaned_count;
END;
$$;

-- 2. Add data masking function for sensitive information
CREATE OR REPLACE FUNCTION public.mask_pii_data(
  data_text TEXT, 
  data_type TEXT, 
  user_role TEXT DEFAULT 'user'
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Admins can see unmasked data
  IF user_role = 'admin' THEN
    RETURN data_text;
  END IF;
  
  -- Apply masking based on data type
  CASE data_type
    WHEN 'email' THEN
      RETURN substring(data_text, 1, 2) || '***@' || 
             substring(split_part(data_text, '@', 2), 1, 1) || '***' ||
             substring(split_part(data_text, '@', 2) from '\..+$');
    WHEN 'phone' THEN
      RETURN '(***) ***-' || right(regexp_replace(data_text, '[^\d]', '', 'g'), 4);
    WHEN 'name' THEN
      RETURN substring(data_text, 1, 1) || '***';
    WHEN 'business_ein' THEN
      RETURN '**-*******';
    ELSE
      RETURN '***REDACTED***';
  END CASE;
END;
$$;

-- 3. Enhanced rate limiting for authentication events
CREATE OR REPLACE FUNCTION public.check_auth_rate_limit(
  p_identifier TEXT,
  p_action TEXT,
  p_limit INTEGER DEFAULT 5,
  p_window_minutes INTEGER DEFAULT 15
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  attempts_count INTEGER;
  window_start TIMESTAMP WITH TIME ZONE;
  is_blocked BOOLEAN := false;
BEGIN
  window_start := now() - (p_window_minutes || ' minutes')::INTERVAL;
  
  -- Count recent authentication attempts
  SELECT COUNT(*) INTO attempts_count
  FROM public.security_events
  WHERE event_data->>'identifier' = p_identifier
    AND event_type ILIKE '%auth%'
    AND event_data->>'action' = p_action
    AND created_at > window_start;
  
  is_blocked := attempts_count >= p_limit;
  
  -- Log rate limit check
  INSERT INTO public.security_events (
    event_type, severity, event_data, source, ip_address
  ) VALUES (
    'auth_rate_limit_check',
    CASE WHEN is_blocked THEN 'high' ELSE 'info' END,
    jsonb_build_object(
      'identifier', p_identifier,
      'action', p_action,
      'attempts_count', attempts_count,
      'limit', p_limit,
      'window_minutes', p_window_minutes,
      'blocked', is_blocked
    ),
    'auth_rate_limiter',
    inet_client_addr()
  );
  
  RETURN jsonb_build_object(
    'allowed', NOT is_blocked,
    'attempts_count', attempts_count,
    'limit', p_limit,
    'window_minutes', p_window_minutes,
    'reset_time', window_start + (p_window_minutes || ' minutes')::INTERVAL
  );
END;
$$;

-- 4. Add comprehensive security monitoring function
CREATE OR REPLACE FUNCTION public.detect_security_anomalies()
RETURNS TABLE(
  anomaly_type TEXT,
  severity TEXT,
  count INTEGER,
  recommendation TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  -- Detect multiple failed auth attempts
  SELECT 
    'excessive_auth_failures'::TEXT as anomaly_type,
    'critical'::TEXT as severity,
    COUNT(*)::INTEGER as count,
    'Implement IP blocking and investigate potential brute force attack'::TEXT as recommendation
  FROM public.security_events
  WHERE event_type ILIKE '%auth%'
    AND severity = 'high'
    AND created_at > now() - INTERVAL '1 hour'
  HAVING COUNT(*) >= 10
  
  UNION ALL
  
  -- Detect suspicious role changes
  SELECT 
    'suspicious_role_changes'::TEXT,
    'high'::TEXT,
    COUNT(*)::INTEGER,
    'Review all recent role assignments for legitimacy'::TEXT
  FROM public.security_events
  WHERE event_type ILIKE '%role%'
    AND severity IN ('high', 'critical')
    AND created_at > now() - INTERVAL '24 hours'
  HAVING COUNT(*) >= 3
  
  UNION ALL
  
  -- Detect excessive data access
  SELECT 
    'excessive_data_access'::TEXT,
    'medium'::TEXT,
    COUNT(*)::INTEGER,
    'Monitor user data access patterns for potential data harvesting'::TEXT
  FROM public.security_events
  WHERE event_type ILIKE '%consultation%'
    AND created_at > now() - INTERVAL '1 hour'
  HAVING COUNT(*) >= 50;
END;
$$;

-- 5. Enhanced secure consultation data function with PII masking
CREATE OR REPLACE FUNCTION public.get_secure_consultation_data_enhanced(consultation_id uuid)
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
SET search_path TO 'public'
AS $$
DECLARE
  current_user_role TEXT;
BEGIN
  -- Get current user role
  SELECT get_current_user_role() INTO current_user_role;
  
  -- Enhanced security: Only allow access with proper authorization
  IF NOT (
    (auth.uid() IS NOT NULL AND EXISTS(
      SELECT 1 FROM public.consultations c 
      WHERE c.id = consultation_id AND c.user_id = auth.uid()
    )) OR
    has_role(auth.uid(), 'admin')
  ) THEN
    RAISE EXCEPTION 'Unauthorized access to consultation data';
  END IF;
  
  -- Log the secure access with enhanced details
  INSERT INTO public.security_events (
    event_type,
    severity,
    user_id,
    event_data,
    source
  ) VALUES (
    'secure_consultation_data_accessed_enhanced',
    'medium',
    auth.uid(),
    jsonb_build_object(
      'consultation_id', consultation_id,
      'access_method', 'enhanced_secure_data_function',
      'data_sensitivity', 'high',
      'user_role', current_user_role,
      'pii_masking_applied', current_user_role != 'admin'
    ),
    'enhanced_data_protection'
  );
  
  -- Return data with enhanced masking
  RETURN QUERY
  SELECT 
    c.id,
    mask_pii_data(c.encrypted_name, 'name', current_user_role) as masked_name,
    mask_pii_data(c.encrypted_email, 'email', current_user_role) as masked_email,
    mask_pii_data(c.encrypted_phone, 'phone', current_user_role) as masked_phone,
    CASE 
      WHEN current_user_role = 'admin' THEN c.company
      ELSE mask_pii_data(COALESCE(c.company, 'BUSINESS'), 'name', current_user_role)
    END as company,
    c.loan_program,
    CASE 
      WHEN c.loan_amount ILIKE '%under%' OR c.loan_amount ILIKE '%<50%' THEN 'Small Business'
      WHEN c.loan_amount ILIKE '%50k-250k%' THEN 'Medium Business'
      WHEN c.loan_amount ILIKE '%250k-500k%' THEN 'Large Business'
      ELSE 'Enterprise'
    END as loan_amount_category,
    c.timeframe,
    c.status,
    c.created_at
  FROM public.consultations c
  WHERE c.id = consultation_id;
END;
$$;

-- 6. Log all security monitoring functions
INSERT INTO public.security_events (
  event_type,
  severity,
  event_data,
  source
) VALUES (
  'security_monitoring_functions_deployed',
  'critical',
  jsonb_build_object(
    'functions_deployed', ARRAY[
      'emergency_cleanup_security_events',
      'mask_pii_data',
      'check_auth_rate_limit',
      'detect_security_anomalies',
      'get_secure_consultation_data_enhanced'
    ],
    'timestamp', now(),
    'priority', 'critical_security_remediation_phase_2'
  ),
  'security_migration'
);