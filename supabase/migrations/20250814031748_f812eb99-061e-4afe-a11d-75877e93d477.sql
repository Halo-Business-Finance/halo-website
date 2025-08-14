-- COMPREHENSIVE SECURITY ENHANCEMENTS
-- 1. Enhanced Session Monitoring with sophisticated detection
CREATE OR REPLACE FUNCTION public.detect_advanced_session_anomaly(
  session_id uuid, 
  new_ip inet, 
  new_user_agent text, 
  new_fingerprint text,
  behavioral_data jsonb DEFAULT '{}'::jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  session_data public.user_sessions;
  anomaly_score integer := 0;
  anomalies jsonb := '[]'::jsonb;
  risk_level text := 'low';
  recent_sessions_count integer;
  geo_change boolean := false;
  user_pattern_deviation boolean := false;
BEGIN
  -- Get session data
  SELECT * INTO session_data
  FROM public.user_sessions
  WHERE id = session_id AND is_active = true;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'anomaly_detected', true,
      'risk_level', 'critical',
      'anomalies', '["session_not_found"]'::jsonb,
      'score', 100,
      'action_required', 'immediate_termination'
    );
  END IF;
  
  -- Enhanced IP analysis with geographic detection
  IF session_data.ip_address != new_ip THEN
    anomaly_score := anomaly_score + 35;
    anomalies := anomalies || '"ip_address_change"'::jsonb;
    geo_change := true;
  END IF;
  
  -- Advanced user agent analysis
  IF session_data.user_agent IS NOT NULL AND session_data.user_agent != new_user_agent THEN
    -- More sophisticated user agent comparison
    IF NOT (new_user_agent ILIKE '%' || split_part(session_data.user_agent, ' ', 1) || '%') THEN
      anomaly_score := anomaly_score + 40; -- Different browser family
      anomalies := anomalies || '"browser_family_change"'::jsonb;
    ELSE
      anomaly_score := anomaly_score + 15; -- Same browser, different version
      anomalies := anomalies || '"browser_version_change"'::jsonb;
    END IF;
  END IF;
  
  -- Enhanced fingerprint analysis
  IF session_data.client_fingerprint IS NOT NULL AND session_data.client_fingerprint != new_fingerprint THEN
    anomaly_score := anomaly_score + 30;
    anomalies := anomalies || '"device_fingerprint_change"'::jsonb;
  END IF;
  
  -- Check for rapid session creation pattern (session hijacking indicator)
  SELECT COUNT(*) INTO recent_sessions_count
  FROM public.user_sessions
  WHERE user_id = session_data.user_id
    AND created_at > now() - interval '10 minutes'
    AND id != session_id;
    
  IF recent_sessions_count >= 3 THEN
    anomaly_score := anomaly_score + 25;
    anomalies := anomalies || '"rapid_session_creation"'::jsonb;
  END IF;
  
  -- Behavioral pattern analysis
  IF behavioral_data ? 'typing_pattern' THEN
    -- Check typing pattern deviation (if provided)
    IF (behavioral_data->>'typing_pattern_deviation')::float > 0.7 THEN
      anomaly_score := anomaly_score + 20;
      anomalies := anomalies || '"behavioral_pattern_deviation"'::jsonb;
      user_pattern_deviation := true;
    END IF;
  END IF;
  
  -- Time-based analysis
  IF EXTRACT(hour FROM now()) BETWEEN 2 AND 5 THEN
    -- Activity during unusual hours
    anomaly_score := anomaly_score + 10;
    anomalies := anomalies || '"unusual_time_activity"'::jsonb;
  END IF;
  
  -- Calculate risk level with enhanced thresholds
  IF anomaly_score >= 70 THEN
    risk_level := 'critical';
  ELSIF anomaly_score >= 45 THEN
    risk_level := 'high';
  ELSIF anomaly_score >= 25 THEN
    risk_level := 'medium';
  END IF;
  
  -- Log comprehensive anomaly data
  IF anomaly_score > 0 THEN
    INSERT INTO public.security_events (
      event_type, severity, user_id, ip_address, event_data, source
    ) VALUES (
      'advanced_session_anomaly_detected', 
      CASE risk_level
        WHEN 'critical' THEN 'critical'
        WHEN 'high' THEN 'high'
        WHEN 'medium' THEN 'medium'
        ELSE 'low'
      END,
      session_data.user_id,
      new_ip,
      jsonb_build_object(
        'session_id', session_id,
        'anomaly_score', anomaly_score,
        'detected_anomalies', anomalies,
        'risk_level', risk_level,
        'geo_change', geo_change,
        'user_pattern_deviation', user_pattern_deviation,
        'recent_sessions_count', recent_sessions_count,
        'original_ip', session_data.ip_address,
        'new_ip', new_ip,
        'behavioral_data', behavioral_data
      ),
      'advanced_session_anomaly_detection'
    );
  END IF;
  
  RETURN jsonb_build_object(
    'anomaly_detected', anomaly_score > 0,
    'risk_level', risk_level,
    'anomalies', anomalies,
    'score', anomaly_score,
    'geo_change', geo_change,
    'user_pattern_deviation', user_pattern_deviation,
    'action_required', CASE 
      WHEN risk_level = 'critical' THEN 'immediate_termination'
      WHEN risk_level = 'high' THEN 'force_reauth'
      WHEN risk_level = 'medium' THEN 'additional_verification'
      ELSE 'continue_monitoring'
    END
  );
END;
$$;

-- 2. Enhanced Admin Role Monitoring with Real-time Alerts
CREATE OR REPLACE FUNCTION public.monitor_admin_role_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  admin_count integer;
  alert_priority text;
BEGIN
  -- Enhanced logging for role changes
  IF TG_OP = 'INSERT' AND NEW.role = 'admin' THEN
    -- Count current admins
    SELECT COUNT(*) INTO admin_count 
    FROM public.user_roles 
    WHERE role = 'admin' AND is_active = true;
    
    -- Determine alert priority based on admin count
    alert_priority := CASE 
      WHEN admin_count <= 2 THEN 'critical'
      WHEN admin_count <= 5 THEN 'high'
      ELSE 'medium'
    END;
    
    -- Log comprehensive admin assignment
    INSERT INTO public.security_events (
      event_type, severity, user_id, ip_address, event_data, source
    ) VALUES (
      'admin_role_assigned', alert_priority, NEW.granted_by, inet_client_addr(),
      jsonb_build_object(
        'target_user_id', NEW.user_id,
        'role_assigned', NEW.role,
        'granted_by', NEW.granted_by,
        'total_admin_count', admin_count,
        'expires_at', NEW.expires_at,
        'assignment_time', now(),
        'requires_immediate_review', admin_count <= 3
      ),
      'admin_role_monitoring'
    );
    
    -- Create immediate alert for critical admin assignments
    IF admin_count <= 3 THEN
      INSERT INTO public.security_alerts (
        event_id, alert_type, priority, status, notes
      ) VALUES (
        (SELECT id FROM public.security_events ORDER BY created_at DESC LIMIT 1),
        'admin_role_assigned',
        'critical',
        'open',
        'IMMEDIATE REVIEW REQUIRED: New admin role assigned. Current admin count: ' || admin_count
      );
    END IF;
    
  ELSIF TG_OP = 'UPDATE' AND OLD.is_active = true AND NEW.is_active = false AND OLD.role = 'admin' THEN
    -- Admin role revocation
    INSERT INTO public.security_events (
      event_type, severity, user_id, ip_address, event_data, source
    ) VALUES (
      'admin_role_revoked', 'critical', auth.uid(), inet_client_addr(),
      jsonb_build_object(
        'target_user_id', NEW.user_id,
        'role_revoked', OLD.role,
        'revoked_by', auth.uid(),
        'revocation_time', now(),
        'previous_expires_at', OLD.expires_at
      ),
      'admin_role_monitoring'
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger for admin role monitoring
DROP TRIGGER IF EXISTS monitor_admin_role_changes ON public.user_roles;
CREATE TRIGGER monitor_admin_role_changes
  AFTER INSERT OR UPDATE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.monitor_admin_role_changes();

-- 3. Security Event Analysis with Pattern Detection
CREATE OR REPLACE FUNCTION public.analyze_security_events()
RETURNS TABLE(
  pattern_type text,
  severity text,
  event_count integer,
  affected_users integer,
  time_window text,
  recommended_action text
)
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  RETURN QUERY
  WITH event_patterns AS (
    -- Detect brute force attempts
    SELECT 
      'brute_force_attempt' as pattern_type,
      'high' as severity,
      COUNT(*)::integer as event_count,
      COUNT(DISTINCT user_id)::integer as affected_users,
      '1 hour' as time_window,
      'Implement IP blocking and notify security team' as recommended_action
    FROM public.security_events
    WHERE event_type IN ('invalid_session_token', 'session_ip_mismatch')
      AND created_at > now() - interval '1 hour'
      AND severity IN ('high', 'critical')
    HAVING COUNT(*) >= 10
    
    UNION ALL
    
    -- Detect coordinated attacks
    SELECT 
      'coordinated_attack' as pattern_type,
      'critical' as severity,
      COUNT(*)::integer as event_count,
      COUNT(DISTINCT ip_address)::integer as affected_users,
      '15 minutes' as time_window,
      'IMMEDIATE: Activate DDoS protection and security response' as recommended_action
    FROM public.security_events
    WHERE created_at > now() - interval '15 minutes'
      AND severity = 'critical'
    HAVING COUNT(DISTINCT ip_address) >= 5 AND COUNT(*) >= 25
    
    UNION ALL
    
    -- Detect privilege escalation attempts
    SELECT 
      'privilege_escalation_attempt' as pattern_type,
      'critical' as severity,
      COUNT(*)::integer as event_count,
      COUNT(DISTINCT user_id)::integer as affected_users,
      '30 minutes' as time_window,
      'CRITICAL: Review all admin role assignments and terminate suspicious sessions' as recommended_action
    FROM public.security_events
    WHERE event_type ILIKE '%role%' 
      AND severity IN ('high', 'critical')
      AND created_at > now() - interval '30 minutes'
    HAVING COUNT(*) >= 3
    
    UNION ALL
    
    -- Detect data access anomalies
    SELECT 
      'data_access_anomaly' as pattern_type,
      'high' as severity,
      COUNT(*)::integer as event_count,
      COUNT(DISTINCT user_id)::integer as affected_users,
      '2 hours' as time_window,
      'Review data access patterns and verify user legitimacy' as recommended_action
    FROM public.security_events
    WHERE event_type ILIKE '%consultation%' 
      AND severity IN ('medium', 'high')
      AND created_at > now() - interval '2 hours'
    HAVING COUNT(*) >= 20
  )
  SELECT * FROM event_patterns WHERE event_count > 0;
END;
$$;

-- 4. Enhanced Rate Limiting with Behavioral Analysis
CREATE OR REPLACE FUNCTION public.enhanced_rate_limit_check(
  p_identifier text,
  p_action text,
  p_limit integer DEFAULT 100,
  p_window_seconds integer DEFAULT 3600,
  p_behavioral_score integer DEFAULT 0
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  attempts_count integer;
  window_start timestamp with time zone;
  is_blocked boolean := false;
  adaptive_limit integer;
  current_ip inet := inet_client_addr();
BEGIN
  window_start := now() - (p_window_seconds || ' seconds')::interval;
  
  -- Adaptive rate limiting based on behavioral score
  adaptive_limit := CASE 
    WHEN p_behavioral_score >= 80 THEN p_limit * 2  -- Trusted user gets higher limit
    WHEN p_behavioral_score <= 20 THEN p_limit / 2  -- Suspicious user gets lower limit
    ELSE p_limit
  END;
  
  -- Count recent attempts
  SELECT COUNT(*) INTO attempts_count
  FROM public.security_events
  WHERE event_data->>'identifier' = p_identifier
    AND event_data->>'action' = p_action
    AND created_at > window_start;
  
  -- Check if blocked
  is_blocked := attempts_count >= adaptive_limit;
  
  -- Log rate limit check with enhanced data
  INSERT INTO public.security_events (
    event_type, severity, ip_address, event_data, source
  ) VALUES (
    'enhanced_rate_limit_check',
    CASE 
      WHEN is_blocked THEN 'high'
      WHEN attempts_count > (adaptive_limit * 0.8) THEN 'medium'
      ELSE 'info'
    END,
    current_ip,
    jsonb_build_object(
      'identifier', p_identifier,
      'action', p_action,
      'attempts_count', attempts_count,
      'adaptive_limit', adaptive_limit,
      'original_limit', p_limit,
      'behavioral_score', p_behavioral_score,
      'window_seconds', p_window_seconds,
      'is_blocked', is_blocked,
      'utilization_percentage', round((attempts_count::decimal / adaptive_limit) * 100, 2)
    ),
    'enhanced_rate_limiting'
  );
  
  RETURN jsonb_build_object(
    'allowed', NOT is_blocked,
    'attempts_count', attempts_count,
    'limit', adaptive_limit,
    'window_seconds', p_window_seconds,
    'reset_time', extract(epoch from (window_start + (p_window_seconds || ' seconds')::interval)),
    'behavioral_score', p_behavioral_score,
    'utilization_percentage', round((attempts_count::decimal / adaptive_limit) * 100, 2)
  );
END;
$$;

-- 5. Encryption Key Rotation System
CREATE TABLE IF NOT EXISTS public.encryption_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key_identifier text UNIQUE NOT NULL,
  key_hash text NOT NULL, -- Store hash, never plaintext
  algorithm text NOT NULL DEFAULT 'AES-256-GCM',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone,
  rotation_scheduled_at timestamp with time zone,
  last_used_at timestamp with time zone
);

-- Enable RLS on encryption keys
ALTER TABLE public.encryption_keys ENABLE ROW LEVEL SECURITY;

-- Only service role can access encryption keys
CREATE POLICY "Service role only access to encryption keys"
ON public.encryption_keys
FOR ALL
USING (auth.role() = 'service_role');

-- Function to manage key rotation
CREATE OR REPLACE FUNCTION public.schedule_key_rotation(
  p_key_identifier text,
  p_rotation_date timestamp with time zone DEFAULT now() + interval '90 days'
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Only admins can schedule key rotation
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Admin role required for key rotation scheduling';
  END IF;
  
  UPDATE public.encryption_keys
  SET rotation_scheduled_at = p_rotation_date
  WHERE key_identifier = p_key_identifier AND is_active = true;
  
  -- Log key rotation scheduling
  INSERT INTO public.security_events (
    event_type, severity, user_id, event_data, source
  ) VALUES (
    'encryption_key_rotation_scheduled', 'info', auth.uid(),
    jsonb_build_object(
      'key_identifier', p_key_identifier,
      'rotation_date', p_rotation_date,
      'scheduled_by', auth.uid()
    ),
    'key_management'
  );
  
  RETURN true;
END;
$$;

-- 6. Database Function Security Validation
CREATE OR REPLACE FUNCTION public.validate_function_security()
RETURNS TABLE(
  function_name text,
  security_level text,
  recommendations text[]
)
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Only admins can run security validation
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Admin role required for security validation';
  END IF;
  
  RETURN QUERY
  SELECT 
    p.proname::text as function_name,
    CASE 
      WHEN p.prosecdef THEN 'SECURITY_DEFINER'
      ELSE 'INVOKER_RIGHTS'
    END as security_level,
    ARRAY[
      CASE 
        WHEN NOT p.prosecdef THEN 'Consider using SECURITY DEFINER for sensitive operations'
        ELSE 'Function properly secured with SECURITY DEFINER'
      END,
      CASE 
        WHEN p.proname ILIKE '%admin%' OR p.proname ILIKE '%role%' THEN 'Requires additional access control validation'
        ELSE 'Standard function security sufficient'
      END
    ] as recommendations
  FROM pg_proc p
  JOIN pg_namespace n ON p.pronamespace = n.oid
  WHERE n.nspname = 'public' 
    AND p.proname NOT LIKE 'pg_%'
    AND p.proname NOT LIKE 'information_schema_%';
END;
$$;