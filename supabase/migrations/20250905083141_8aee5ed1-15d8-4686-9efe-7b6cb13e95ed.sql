-- Create function for intelligent security event cleanup to prevent log flooding
CREATE OR REPLACE FUNCTION public.intelligent_security_event_cleanup()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  cleaned_count INTEGER := 0;
BEGIN
  -- Remove excessive client_log events older than 1 hour, keep only most recent 50
  WITH excessive_client_logs AS (
    SELECT id FROM public.security_events 
    WHERE event_type = 'client_log' 
    AND severity IN ('info', 'low')
    AND created_at < now() - interval '1 hour'
    ORDER BY created_at DESC 
    OFFSET 50
  )
  DELETE FROM public.security_events 
  WHERE id IN (SELECT id FROM excessive_client_logs);
  
  GET DIAGNOSTICS cleaned_count = ROW_COUNT;
  
  -- Additional cleanup for rate limit events older than 24 hours
  DELETE FROM public.security_events 
  WHERE event_type LIKE '%rate_limit%' 
  AND severity = 'info'
  AND created_at < now() - interval '24 hours';
  
  RETURN cleaned_count;
END;
$$;

-- Create zero trust verification function
CREATE OR REPLACE FUNCTION public.verify_zero_trust_session(
  p_user_id uuid,
  p_device_fingerprint text,
  p_trust_score integer DEFAULT 70
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  session_valid boolean := false;
  recent_anomalies integer := 0;
BEGIN
  -- Check for active session with matching device fingerprint
  SELECT EXISTS(
    SELECT 1 FROM public.user_sessions 
    WHERE user_id = p_user_id 
    AND client_fingerprint = p_device_fingerprint
    AND is_active = true 
    AND expires_at > now()
    AND last_activity > now() - interval '30 minutes'
  ) INTO session_valid;
  
  -- Check for recent security anomalies
  SELECT COUNT(*) INTO recent_anomalies
  FROM public.security_events
  WHERE user_id = p_user_id
  AND severity IN ('high', 'critical')
  AND created_at > now() - interval '1 hour';
  
  -- Session is valid if active session exists, no recent critical events, and meets trust score
  RETURN session_valid AND recent_anomalies = 0 AND p_trust_score >= 70;
END;
$$;

-- Create access elevation verification function
CREATE OR REPLACE FUNCTION public.verify_access_elevation(
  p_user_id uuid,
  p_required_level text,
  p_current_trust_score integer
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  min_scores jsonb := '{"normal": 70, "elevated": 85, "critical": 95}';
  required_score integer;
  can_elevate boolean := false;
  boost_amount integer := 0;
BEGIN
  required_score := (min_scores->p_required_level)::integer;
  
  -- Check if elevation is possible based on user's security history
  IF p_current_trust_score >= 50 THEN
    CASE p_required_level
      WHEN 'normal' THEN
        boost_amount := LEAST(20, required_score - p_current_trust_score);
        can_elevate := true;
      WHEN 'elevated' THEN
        IF p_current_trust_score >= 60 THEN
          boost_amount := LEAST(25, required_score - p_current_trust_score);
          can_elevate := true;
        END IF;
      WHEN 'critical' THEN
        IF p_current_trust_score >= 75 THEN
          boost_amount := LEAST(20, required_score - p_current_trust_score);
          can_elevate := true;
        END IF;
    END CASE;
  END IF;
  
  -- Log elevation attempt
  INSERT INTO public.security_events (
    event_type, user_id, severity, event_data, source
  ) VALUES (
    'access_elevation_verification', p_user_id, 'info',
    jsonb_build_object(
      'required_level', p_required_level,
      'current_score', p_current_trust_score,
      'can_elevate', can_elevate,
      'boost_amount', boost_amount
    ),
    'zero_trust_system'
  );
  
  RETURN jsonb_build_object(
    'can_elevate', can_elevate,
    'boost_amount', boost_amount,
    'new_score', p_current_trust_score + boost_amount,
    'required_score', required_score
  );
END;
$$;

-- Create behavioral analysis function for zero trust
CREATE OR REPLACE FUNCTION public.analyze_behavioral_patterns(
  p_user_id uuid,
  p_behavioral_data jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  anomaly_score integer := 0;
  anomalies text[] := ARRAY[]::text[];
  is_bot_like boolean := false;
BEGIN
  -- Check for bot-like behavior
  IF (p_behavioral_data->>'mouseMovements')::integer = 0 
     AND (p_behavioral_data->>'keystrokes')::integer > 100 THEN
    anomaly_score := anomaly_score + 30;
    anomalies := array_append(anomalies, 'Bot-like behavior detected');
    is_bot_like := true;
  END IF;
  
  -- Check for excessive activity
  IF (p_behavioral_data->>'pageViews')::integer > 100 
     OR (p_behavioral_data->>'clickPatterns')::integer > 1000 THEN
    anomaly_score := anomaly_score + 20;
    anomalies := array_append(anomalies, 'Excessive activity detected');
  END IF;
  
  -- Check session duration
  IF (p_behavioral_data->>'sessionDuration')::integer > 28800000 THEN -- 8 hours
    anomaly_score := anomaly_score + 15;
    anomalies := array_append(anomalies, 'Unusually long session');
  END IF;
  
  -- Store behavioral analysis
  INSERT INTO public.security_events (
    event_type, user_id, severity, event_data, source
  ) VALUES (
    'behavioral_analysis', p_user_id, 
    CASE 
      WHEN anomaly_score >= 50 THEN 'high'
      WHEN anomaly_score >= 25 THEN 'medium'
      ELSE 'info'
    END,
    jsonb_build_object(
      'anomaly_score', anomaly_score,
      'anomalies', anomalies,
      'behavioral_data', p_behavioral_data,
      'is_bot_like', is_bot_like
    ),
    'zero_trust_behavioral_analysis'
  );
  
  RETURN jsonb_build_object(
    'anomaly_score', anomaly_score,
    'anomalies', anomalies,
    'is_bot_like', is_bot_like,
    'trust_impact', GREATEST(0, 100 - anomaly_score)
  );
END;
$$;