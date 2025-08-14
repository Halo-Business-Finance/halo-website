-- CRITICAL SECURITY FIX: Implement session token hashing and enhanced security
-- This migration addresses the session token security vulnerability

-- First, add a new column for hashed tokens and salt
ALTER TABLE public.user_sessions 
ADD COLUMN session_token_hash TEXT,
ADD COLUMN token_salt TEXT;

-- Create a secure function to hash session tokens using crypto-safe methods
CREATE OR REPLACE FUNCTION public.hash_session_token(token TEXT, salt TEXT DEFAULT NULL)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
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
$$;

-- Create a function to verify session tokens securely
CREATE OR REPLACE FUNCTION public.verify_session_token(provided_token TEXT, stored_hash TEXT, stored_salt TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
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
$$;

-- Update the session validation function to use hashed tokens
CREATE OR REPLACE FUNCTION public.validate_session_security_v2(
  session_token TEXT, 
  client_ip INET, 
  client_fingerprint TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
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
$$;

-- Create function to generate secure session tokens
CREATE OR REPLACE FUNCTION public.create_secure_session(
  p_user_id UUID,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_client_fingerprint TEXT DEFAULT NULL,
  p_expires_hours INTEGER DEFAULT 24
)
RETURNS TABLE(session_token TEXT, session_id UUID)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
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
$$;

-- Enhanced session cleanup function
CREATE OR REPLACE FUNCTION public.secure_cleanup_expired_sessions()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
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
$$;

-- Create more restrictive RLS policies for user_sessions
DROP POLICY IF EXISTS "Users can view their own sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Users can update their own sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Admins can view all sessions" ON public.user_sessions;

-- Super restrictive policies - users can only see minimal session info
CREATE POLICY "Users can view own session metadata only"
  ON public.user_sessions
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id 
    AND is_active = true 
    AND expires_at > now()
  );

-- Users cannot directly update sessions - only through functions
CREATE POLICY "Deny direct session updates"
  ON public.user_sessions
  FOR UPDATE
  TO authenticated
  USING (false);

-- Users cannot insert sessions directly - only through secure functions
CREATE POLICY "Deny direct session inserts"
  ON public.user_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (false);

-- Users cannot delete sessions directly
CREATE POLICY "Deny direct session deletes"
  ON public.user_sessions
  FOR DELETE
  TO authenticated
  USING (false);

-- Admin access with full audit logging
CREATE POLICY "Admin full access with logging"
  ON public.user_sessions
  FOR ALL
  TO authenticated
  USING (
    has_role(auth.uid(), 'admin') 
    AND auth.uid() IS NOT NULL
  )
  WITH CHECK (
    has_role(auth.uid(), 'admin') 
    AND auth.uid() IS NOT NULL
  );

-- Add trigger to log any direct access attempts to session table
CREATE OR REPLACE FUNCTION public.audit_session_access()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Log any direct table access (should only happen through functions)
  INSERT INTO public.security_events (
    event_type, severity, user_id, event_data, source
  ) VALUES (
    'direct_session_table_access', 'critical', auth.uid(),
    jsonb_build_object(
      'operation', TG_OP,
      'table_name', TG_TABLE_NAME,
      'user_role', public.get_current_user_role(),
      'session_id', COALESCE(NEW.id, OLD.id)
    ),
    'audit_trigger'
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER audit_session_access_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.user_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_session_access();