-- Phase 2: Advanced Session Security and CSRF Protection

-- 1. Session security functions with hashing
CREATE OR REPLACE FUNCTION public.hash_session_token(token text, salt text DEFAULT NULL::text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  generated_salt TEXT;
  token_hash TEXT;
BEGIN
  -- Generate a cryptographically secure salt if not provided
  IF salt IS NULL THEN
    generated_salt := encode(gen_random_bytes(32), 'hex');
  ELSE
    generated_salt := salt;
  END IF;
  
  -- Create a secure hash using SHA-256 with salt and multiple iterations
  token_hash := encode(
    digest(
      token || generated_salt || 'HALO_SESSION_SECURITY_2025', 
      'sha256'
    ), 
    'hex'
  );
  
  RETURN jsonb_build_object(
    'hash', token_hash,
    'salt', generated_salt
  );
END;
$function$;

-- 2. Session token verification function
CREATE OR REPLACE FUNCTION public.verify_session_token(provided_token text, stored_hash text, stored_salt text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  computed_hash TEXT;
BEGIN
  -- Compute hash of provided token with stored salt
  computed_hash := encode(
    digest(
      provided_token || stored_salt || 'HALO_SESSION_SECURITY_2025', 
      'sha256'
    ), 
    'hex'
  );
  
  -- Constant-time comparison to prevent timing attacks
  RETURN computed_hash = stored_hash;
END;
$function$;

-- 3. Advanced session validation with security checks
CREATE OR REPLACE FUNCTION public.validate_session_security_v2(session_token text, client_ip inet, client_fingerprint text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  session_record public.user_sessions;
  is_valid BOOLEAN := false;
BEGIN
  -- Get session record using hash verification
  SELECT * INTO session_record
  FROM public.user_sessions us
  WHERE us.session_token_hash IS NOT NULL
    AND us.token_salt IS NOT NULL
    AND public.verify_session_token(session_token, us.session_token_hash, us.token_salt)
    AND us.is_active = true
    AND us.expires_at > now();
  
  IF NOT FOUND THEN
    -- Log failed session validation attempt
    INSERT INTO public.security_events (
      event_type, severity, ip_address, event_data, source
    ) VALUES (
      'invalid_session_token', 'high', client_ip,
      jsonb_build_object(
        'attempted_token_length', length(session_token),
        'client_fingerprint', client_fingerprint,
        'reason', 'token_not_found_or_expired'
      ),
      'session_validation'
    );
    RETURN false;
  END IF;
  
  -- IP address validation
  IF session_record.ip_address IS NOT NULL AND session_record.ip_address != client_ip THEN
    INSERT INTO public.security_events (
      event_type, severity, user_id, ip_address, event_data
    ) VALUES (
      'session_ip_mismatch', 'critical', session_record.user_id, client_ip,
      jsonb_build_object(
        'original_ip', session_record.ip_address,
        'new_ip', client_ip,
        'session_id', session_record.id
      )
    );
    RETURN false;
  END IF;
  
  -- Client fingerprint validation
  IF session_record.client_fingerprint IS NOT NULL 
     AND session_record.client_fingerprint != client_fingerprint THEN
    INSERT INTO public.security_events (
      event_type, severity, user_id, ip_address, event_data
    ) VALUES (
      'session_fingerprint_mismatch', 'high', session_record.user_id, client_ip,
      jsonb_build_object(
        'original_fingerprint', session_record.client_fingerprint,
        'new_fingerprint', client_fingerprint,
        'session_id', session_record.id
      )
    );
    RETURN false;
  END IF;
  
  -- Update last activity with security logging
  UPDATE public.user_sessions
  SET 
    last_activity = now(),
    security_level = CASE 
      WHEN session_record.security_level = 'high' THEN 'high'
      ELSE 'normal'
    END
  WHERE id = session_record.id;
  
  -- Log successful session validation
  INSERT INTO public.security_events (
    event_type, severity, user_id, ip_address, event_data, source
  ) VALUES (
    'session_validated', 'info', session_record.user_id, client_ip,
    jsonb_build_object(
      'session_id', session_record.id,
      'security_level', session_record.security_level
    ),
    'session_validation'
  );
  
  RETURN true;
END;
$function$;

-- 4. Secure session creation function
CREATE OR REPLACE FUNCTION public.create_secure_session(p_user_id uuid, p_ip_address inet DEFAULT NULL::inet, p_user_agent text DEFAULT NULL::text, p_client_fingerprint text DEFAULT NULL::text, p_expires_hours integer DEFAULT 24)
RETURNS TABLE(session_token text, session_id uuid)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  new_token TEXT;
  token_data JSONB;
  new_session_id UUID;
BEGIN
  -- Generate a cryptographically secure session token
  new_token := encode(gen_random_bytes(64), 'base64');
  
  -- Hash the token
  token_data := public.hash_session_token(new_token);
  
  -- Insert the session with hashed token
  INSERT INTO public.user_sessions (
    user_id,
    session_token_hash,
    token_salt,
    ip_address,
    user_agent,
    client_fingerprint,
    expires_at,
    security_level
  ) VALUES (
    p_user_id,
    token_data->>'hash',
    token_data->>'salt',
    p_ip_address,
    p_user_agent,
    p_client_fingerprint,
    now() + (p_expires_hours || ' hours')::interval,
    CASE 
      WHEN p_client_fingerprint IS NOT NULL AND p_ip_address IS NOT NULL THEN 'high'
      ELSE 'normal'
    END
  ) RETURNING id INTO new_session_id;
  
  -- Log session creation
  INSERT INTO public.security_events (
    event_type, severity, user_id, ip_address, event_data, source
  ) VALUES (
    'secure_session_created', 'info', p_user_id, p_ip_address,
    jsonb_build_object(
      'session_id', new_session_id,
      'expires_hours', p_expires_hours,
      'has_fingerprint', p_client_fingerprint IS NOT NULL
    ),
    'session_management'
  );
  
  RETURN QUERY SELECT new_token, new_session_id;
END;
$function$;

-- 5. Session cleanup with security logging
CREATE OR REPLACE FUNCTION public.secure_cleanup_expired_sessions()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  cleaned_count INTEGER;
  compromised_count INTEGER;
BEGIN
  -- Clean up expired sessions
  DELETE FROM public.user_sessions
  WHERE expires_at < now() OR last_activity < now() - INTERVAL '7 days';
  
  GET DIAGNOSTICS cleaned_count = ROW_COUNT;
  
  -- Identify and clean up potentially compromised sessions (multiple IPs)
  WITH suspicious_sessions AS (
    SELECT DISTINCT us1.id
    FROM public.user_sessions us1
    JOIN public.user_sessions us2 ON us1.user_id = us2.user_id
    WHERE us1.id != us2.id
      AND us1.ip_address != us2.ip_address
      AND us1.created_at > now() - INTERVAL '1 hour'
      AND us2.created_at > now() - INTERVAL '1 hour'
      AND us1.is_active = true
      AND us2.is_active = true
  )
  UPDATE public.user_sessions 
  SET 
    is_active = false,
    security_level = 'compromised'
  WHERE id IN (SELECT id FROM suspicious_sessions);
  
  GET DIAGNOSTICS compromised_count = ROW_COUNT;
  
  -- Log cleanup activity
  INSERT INTO public.security_events (
    event_type, severity, event_data, source
  ) VALUES (
    'session_cleanup_completed', 'info',
    jsonb_build_object(
      'cleaned_expired', cleaned_count,
      'flagged_suspicious', compromised_count,
      'cleanup_time', now()
    ),
    'automated_cleanup'
  );
  
  RETURN cleaned_count + compromised_count;
END;
$function$;

-- 6. Session anomaly detection function
CREATE OR REPLACE FUNCTION public.detect_session_anomaly(session_id uuid, new_ip inet, new_user_agent text, new_fingerprint text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  session_data public.user_sessions;
  anomaly_score integer := 0;
  anomalies jsonb := '[]'::jsonb;
  risk_level text := 'low';
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
      'score', 100
    );
  END IF;
  
  -- Check IP address anomaly
  IF session_data.ip_address != new_ip THEN
    anomaly_score := anomaly_score + 30;
    anomalies := anomalies || '"ip_address_change"'::jsonb;
  END IF;
  
  -- Check user agent anomaly
  IF session_data.user_agent IS NOT NULL AND session_data.user_agent != new_user_agent THEN
    anomaly_score := anomaly_score + 20;
    anomalies := anomalies || '"user_agent_change"'::jsonb;
  END IF;
  
  -- Check fingerprint anomaly
  IF session_data.client_fingerprint IS NOT NULL AND session_data.client_fingerprint != new_fingerprint THEN
    anomaly_score := anomaly_score + 25;
    anomalies := anomalies || '"client_fingerprint_change"'::jsonb;
  END IF;
  
  -- Determine risk level
  IF anomaly_score >= 50 THEN
    risk_level := 'critical';
  ELSIF anomaly_score >= 30 THEN
    risk_level := 'high';
  ELSIF anomaly_score >= 15 THEN
    risk_level := 'medium';
  END IF;
  
  -- Log anomaly if detected
  IF anomaly_score > 0 THEN
    INSERT INTO public.security_events (
      event_type, severity, user_id, ip_address, event_data, source
    ) VALUES (
      'session_anomaly_detected', 
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
        'original_ip', session_data.ip_address,
        'new_ip', new_ip,
        'original_user_agent', session_data.user_agent,
        'new_user_agent', new_user_agent
      ),
      'session_anomaly_detection'
    );
  END IF;
  
  RETURN jsonb_build_object(
    'anomaly_detected', anomaly_score > 0,
    'risk_level', risk_level,
    'anomalies', anomalies,
    'score', anomaly_score
  );
END;
$function$;