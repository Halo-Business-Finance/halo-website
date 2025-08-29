-- CRITICAL SECURITY FIXES - Priority 1: Database Access Control

-- 1. Fix encryption_keys table - restrict to service role only (CRITICAL)
DROP POLICY IF EXISTS "Encryption keys delete - service role only" ON public.encryption_keys;
DROP POLICY IF EXISTS "Encryption keys insert - service role only" ON public.encryption_keys;
DROP POLICY IF EXISTS "Encryption keys select - service role only" ON public.encryption_keys;
DROP POLICY IF EXISTS "Encryption keys update - service role only" ON public.encryption_keys;

CREATE POLICY "Encryption keys - service role only" 
ON public.encryption_keys FOR ALL 
USING (auth.role() = 'service_role'::text)
WITH CHECK (auth.role() = 'service_role'::text);

-- 2. Fix user_sessions table - restrict access properly (CRITICAL)
DROP POLICY IF EXISTS "User sessions - service role only" ON public.user_sessions;

CREATE POLICY "User sessions - admin and service role only" 
ON public.user_sessions FOR SELECT 
USING (
  auth.role() = 'service_role'::text OR 
  (auth.uid() IS NOT NULL AND has_role(auth.uid(), 'admin'))
);

CREATE POLICY "User sessions - service role manage only" 
ON public.user_sessions FOR INSERT, UPDATE, DELETE 
USING (auth.role() = 'service_role'::text)
WITH CHECK (auth.role() = 'service_role'::text);

-- 3. Fix security_events table - add proper admin access (CRITICAL)
DROP POLICY IF EXISTS "Security events - admin select only" ON public.security_events;
DROP POLICY IF EXISTS "Security events - service role insert only" ON public.security_events;

CREATE POLICY "Security events - admin select with auth check" 
ON public.security_events FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND has_role(auth.uid(), 'admin')
);

CREATE POLICY "Security events - service role all operations" 
ON public.security_events FOR INSERT, UPDATE, DELETE 
USING (auth.role() = 'service_role'::text)
WITH CHECK (auth.role() = 'service_role'::text);

-- 4. Fix audit_logs table - strengthen access control (CRITICAL)
DROP POLICY IF EXISTS "Audit logs - admin view only" ON public.audit_logs;
DROP POLICY IF EXISTS "Audit logs - service role insert only" ON public.audit_logs;

CREATE POLICY "Audit logs - admin select with auth check" 
ON public.audit_logs FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND has_role(auth.uid(), 'admin')
);

CREATE POLICY "Audit logs - service role operations only" 
ON public.audit_logs FOR INSERT, UPDATE, DELETE 
USING (auth.role() = 'service_role'::text)
WITH CHECK (auth.role() = 'service_role'::text);

-- 5. Fix security_access_audit table - proper access control
DROP POLICY IF EXISTS "Only admins can view security audit logs" ON public.security_access_audit;
DROP POLICY IF EXISTS "System functions only can insert audit logs" ON public.security_access_audit;

CREATE POLICY "Security audit logs - admin view with auth" 
ON public.security_access_audit FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND has_role(auth.uid(), 'admin')
);

CREATE POLICY "Security audit logs - service role insert only" 
ON public.security_access_audit FOR INSERT 
WITH CHECK (auth.role() = 'service_role'::text);

-- 6. Add critical security event cleanup function (Priority 2)
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

-- 7. Add data masking function for sensitive information
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

-- 8. Enhanced rate limiting for authentication events
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

-- 9. Add comprehensive security monitoring function
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

-- 10. Log all critical security fixes applied
INSERT INTO public.security_events (
  event_type,
  severity,
  event_data,
  source
) VALUES (
  'critical_security_fixes_applied',
  'critical',
  jsonb_build_object(
    'fixes_applied', ARRAY[
      'encryption_keys_access_restricted',
      'user_sessions_access_controlled',
      'security_events_admin_only',
      'audit_logs_secured',
      'emergency_cleanup_function_added',
      'data_masking_implemented',
      'auth_rate_limiting_enhanced',
      'security_monitoring_functions_added'
    ],
    'timestamp', now(),
    'priority', 'critical_security_remediation'
  ),
  'security_migration'
);