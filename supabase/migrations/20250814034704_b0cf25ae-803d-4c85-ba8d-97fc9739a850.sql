-- SECURE SESSION TOKEN STORAGE FIX - PART 2
-- Drop existing function and recreate with proper security

-- Drop the existing function that conflicts
DROP FUNCTION IF EXISTS public.hash_session_token(text, text);

-- Create secure session management functions
CREATE OR REPLACE FUNCTION public.generate_session_token()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  token text;
BEGIN
  -- Generate a cryptographically secure random token
  token := encode(gen_random_bytes(32), 'base64');
  
  -- Return the raw token (will be hashed before storage)
  RETURN token;
END;
$$;

-- Create function to hash session tokens with salt
CREATE OR REPLACE FUNCTION public.hash_session_token(token text, salt text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- Use SHA-256 with salt for secure hashing
  RETURN encode(digest(token || salt, 'sha256'), 'hex');
END;
$$;

-- Create secure session creation function
CREATE OR REPLACE FUNCTION public.create_secure_session(
  p_user_id uuid,
  p_client_ip inet,
  p_user_agent text,
  p_client_fingerprint text,
  p_expires_hours integer DEFAULT 24
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  session_token text;
  token_salt text;
  token_hash text;
  session_record record;
  expires_time timestamp with time zone;
BEGIN
  -- Check if user exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'Invalid user ID';
  END IF;
  
  -- Generate secure token and salt
  session_token := public.generate_session_token();
  token_salt := encode(gen_random_bytes(16), 'base64');
  token_hash := public.hash_session_token(session_token, token_salt);
  
  -- Calculate expiration time
  expires_time := now() + (p_expires_hours || ' hours')::interval;
  
  -- Invalidate any existing sessions for this user (security measure)
  UPDATE public.user_sessions 
  SET is_active = false 
  WHERE user_id = p_user_id AND is_active = true;
  
  -- Create new session record with hashed token
  INSERT INTO public.user_sessions (
    user_id,
    session_token,        -- This will store the hash
    session_token_hash,   -- Backup hash field
    token_salt,
    ip_address,
    user_agent,
    client_fingerprint,
    expires_at,
    security_level
  ) VALUES (
    p_user_id,
    token_hash,           -- Store hash, not plain token
    token_hash,           -- Duplicate for safety
    token_salt,
    p_client_ip,
    p_user_agent,
    p_client_fingerprint,
    expires_time,
    'normal'
  ) RETURNING * INTO session_record;
  
  -- Log session creation
  INSERT INTO public.security_events (
    event_type, severity, user_id, ip_address, event_data, source
  ) VALUES (
    'secure_session_created', 'info', p_user_id, p_client_ip,
    jsonb_build_object(
      'session_id', session_record.id,
      'expires_at', expires_time,
      'user_agent', p_user_agent,
      'security_level', 'normal'
    ),
    'session_management'
  );
  
  -- Return the plain token (client needs this) and session info
  RETURN jsonb_build_object(
    'session_token', session_token,  -- Plain token for client
    'session_id', session_record.id,
    'expires_at', expires_time,
    'security_level', 'normal'
  );
END;
$$;

-- Create secure session validation function
CREATE OR REPLACE FUNCTION public.validate_secure_session(
  p_session_token text,
  p_client_ip inet,
  p_client_fingerprint text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  session_record public.user_sessions;
  computed_hash text;
  is_valid boolean := false;
  anomaly_data jsonb;
BEGIN
  -- Find session by trying to match hash
  FOR session_record IN 
    SELECT * FROM public.user_sessions 
    WHERE is_active = true 
    AND expires_at > now()
  LOOP
    -- Compute hash with the session's salt
    computed_hash := public.hash_session_token(p_session_token, session_record.token_salt);
    
    -- Check if this matches the stored hash
    IF computed_hash = session_record.session_token THEN
      -- Found matching session, now validate security constraints
      
      -- Check for session anomalies
      SELECT public.detect_advanced_session_anomaly(
        session_record.id,
        p_client_ip,
        session_record.user_agent,
        p_client_fingerprint
      ) INTO anomaly_data;
      
      -- Allow session if no critical anomalies detected
      IF (anomaly_data->>'risk_level')::text != 'critical' THEN
        is_valid := true;
        
        -- Update last activity
        UPDATE public.user_sessions 
        SET 
          last_activity = now(),
          access_count = access_count + 1,
          last_security_check = now()
        WHERE id = session_record.id;
        
        -- Log successful validation
        INSERT INTO public.security_events (
          event_type, severity, user_id, ip_address, event_data, source
        ) VALUES (
          'secure_session_validated', 'info', session_record.user_id, p_client_ip,
          jsonb_build_object(
            'session_id', session_record.id,
            'access_count', session_record.access_count + 1,
            'anomaly_score', anomaly_data->>'score'
          ),
          'session_validation'
        );
        
        EXIT; -- Found valid session, break loop
      ELSE
        -- Critical anomaly detected, invalidate session
        UPDATE public.user_sessions 
        SET is_active = false 
        WHERE id = session_record.id;
        
        INSERT INTO public.security_events (
          event_type, severity, user_id, ip_address, event_data, source
        ) VALUES (
          'session_invalidated_anomaly', 'critical', session_record.user_id, p_client_ip,
          jsonb_build_object(
            'session_id', session_record.id,
            'anomaly_data', anomaly_data
          ),
          'session_security'
        );
      END IF;
    END IF;
  END LOOP;
  
  -- Log failed validation if no valid session found
  IF NOT is_valid THEN
    INSERT INTO public.security_events (
      event_type, severity, ip_address, event_data, source
    ) VALUES (
      'session_validation_failed', 'medium', p_client_ip,
      jsonb_build_object(
        'provided_token_length', length(p_session_token),
        'client_fingerprint', p_client_fingerprint
      ),
      'session_validation'
    );
  END IF;
  
  RETURN jsonb_build_object(
    'is_valid', is_valid,
    'user_id', CASE WHEN is_valid THEN session_record.user_id ELSE NULL END,
    'session_id', CASE WHEN is_valid THEN session_record.id ELSE NULL END,
    'security_level', CASE WHEN is_valid THEN session_record.security_level ELSE NULL END
  );
END;
$$;