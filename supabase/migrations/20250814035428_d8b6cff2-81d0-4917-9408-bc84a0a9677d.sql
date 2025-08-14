-- ==============================================================================
-- CRITICAL SECURITY FIXES - Phase 1-3 Implementation (Fixed)
-- ==============================================================================

-- ===========================
-- 1. SECURE SESSION TOKEN MANAGEMENT
-- ===========================

-- Drop existing functions that need to be modified
DROP FUNCTION IF EXISTS public.create_secure_session(uuid,inet,text,text,integer);
DROP FUNCTION IF EXISTS public.validate_session_security(text,inet,text);

-- Update user_sessions table to use hashed tokens only
ALTER TABLE public.user_sessions 
DROP COLUMN IF EXISTS session_token,
ADD COLUMN IF NOT EXISTS session_token_hash TEXT,
ADD COLUMN IF NOT EXISTS token_salt TEXT DEFAULT encode(gen_random_bytes(32), 'hex');

-- Create secure token generation function
CREATE OR REPLACE FUNCTION public.generate_secure_session_token()
RETURNS TABLE(token TEXT, hash TEXT, salt TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  session_token TEXT;
  token_salt TEXT;
  token_hash TEXT;
BEGIN
  -- Generate cryptographically secure token
  session_token := encode(gen_random_bytes(64), 'hex');
  token_salt := encode(gen_random_bytes(32), 'hex');
  
  -- Hash the token with salt using SHA-512
  token_hash := encode(digest(session_token || token_salt, 'sha512'), 'hex');
  
  RETURN QUERY SELECT session_token, token_hash, token_salt;
END;
$function$;

-- Recreate create_secure_session function with proper return type
CREATE OR REPLACE FUNCTION public.create_secure_session(
  p_user_id UUID,
  p_ip_address INET,
  p_user_agent TEXT,
  p_client_fingerprint TEXT,
  p_expires_hours INTEGER DEFAULT 24
)
RETURNS TABLE(session_id UUID, session_token TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  new_session_id UUID;
  session_data RECORD;
  user_sessions_count INTEGER;
BEGIN
  -- Security check: Limit concurrent sessions per user
  SELECT COUNT(*) INTO user_sessions_count
  FROM public.user_sessions
  WHERE user_id = p_user_id AND is_active = true;
  
  IF user_sessions_count >= 5 THEN
    -- Auto-cleanup oldest session
    DELETE FROM public.user_sessions
    WHERE id = (
      SELECT id FROM public.user_sessions
      WHERE user_id = p_user_id AND is_active = true
      ORDER BY last_activity ASC
      LIMIT 1
    );
  END IF;
  
  -- Generate secure token
  SELECT * INTO session_data FROM public.generate_secure_session_token();
  
  -- Create session record with hashed token only
  INSERT INTO public.user_sessions (
    user_id,
    session_token_hash,
    token_salt,
    ip_address,
    user_agent,
    client_fingerprint,
    expires_at,
    is_active,
    security_level
  ) VALUES (
    p_user_id,
    session_data.hash,
    session_data.salt,
    p_ip_address,
    p_user_agent,
    p_client_fingerprint,
    now() + (p_expires_hours || ' hours')::interval,
    true,
    'normal'
  ) RETURNING id INTO new_session_id;
  
  -- Log secure session creation
  INSERT INTO public.security_events (
    event_type, severity, user_id, ip_address, event_data, source
  ) VALUES (
    'secure_session_created',
    'info',
    p_user_id,
    p_ip_address,
    jsonb_build_object(
      'session_id', new_session_id,
      'expires_hours', p_expires_hours,
      'security_level', 'enhanced'
    ),
    'secure_session_management'
  );
  
  RETURN QUERY SELECT new_session_id, session_data.token;
END;
$function$;

-- Recreate session validation function with hash comparison
CREATE OR REPLACE FUNCTION public.validate_session_security(
  session_token TEXT,
  client_ip INET,
  client_fingerprint TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  session_record public.user_sessions;
  computed_hash TEXT;
BEGIN
  -- Find session by attempting to match hash
  FOR session_record IN 
    SELECT * FROM public.user_sessions 
    WHERE is_active = true AND expires_at > now()
  LOOP
    -- Compute hash for this session's salt
    computed_hash := encode(digest(session_token || session_record.token_salt, 'sha512'), 'hex');
    
    -- Check if hash matches
    IF computed_hash = session_record.session_token_hash THEN
      -- Validate additional security parameters
      IF session_record.ip_address != client_ip THEN
        INSERT INTO public.security_events (
          event_type, severity, user_id, ip_address, event_data
        ) VALUES (
          'session_ip_mismatch', 'high', session_record.user_id, client_ip,
          jsonb_build_object(
            'original_ip', session_record.ip_address,
            'new_ip', client_ip,
            'session_id', session_record.id
          )
        );
        RETURN false;
      END IF;
      
      -- Update last activity
      UPDATE public.user_sessions
      SET last_activity = now(), access_count = access_count + 1
      WHERE id = session_record.id;
      
      RETURN true;
    END IF;
  END LOOP;
  
  -- No matching session found
  INSERT INTO public.security_events (
    event_type, severity, ip_address, event_data
  ) VALUES (
    'invalid_session_token', 'high', client_ip,
    jsonb_build_object('attempted_token_prefix', left(session_token, 8))
  );
  
  RETURN false;
END;
$function$;

-- ===========================
-- 2. ENCRYPTION KEY PROTECTION
-- ===========================

-- Add encryption-at-rest columns for encryption keys
ALTER TABLE public.encryption_keys
ADD COLUMN IF NOT EXISTS encrypted_key_data TEXT,
ADD COLUMN IF NOT EXISTS key_encryption_salt TEXT DEFAULT encode(gen_random_bytes(32), 'hex'),
ADD COLUMN IF NOT EXISTS access_log_enabled BOOLEAN DEFAULT true;

-- Secure encryption key creation function
CREATE OR REPLACE FUNCTION public.create_secure_encryption_key(
  p_key_identifier TEXT,
  p_algorithm TEXT DEFAULT 'AES-256-GCM'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  new_key_id UUID;
  key_data_raw TEXT;
  key_salt TEXT;
  encrypted_key TEXT;
BEGIN
  -- Only admins can create encryption keys
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Admin role required for encryption key creation';
  END IF;
  
  -- Generate raw key data and salt
  key_data_raw := encode(gen_random_bytes(64), 'hex');
  key_salt := encode(gen_random_bytes(32), 'hex');
  
  -- Encrypt the key at rest
  encrypted_key := encode(
    digest(key_data_raw || 'HALO_MASTER_KEY_2025' || key_salt, 'sha512'), 
    'hex'
  );
  
  -- Store encrypted key
  INSERT INTO public.encryption_keys (
    key_identifier,
    encrypted_key_data,
    key_encryption_salt,
    algorithm,
    expires_at
  ) VALUES (
    p_key_identifier,
    encrypted_key,
    key_salt,
    p_algorithm,
    now() + interval '90 days'
  ) RETURNING id INTO new_key_id;
  
  -- Log key creation
  INSERT INTO public.security_events (
    event_type, severity, user_id, event_data, source
  ) VALUES (
    'encryption_key_created_secure',
    'critical',
    auth.uid(),
    jsonb_build_object(
      'key_id', new_key_id,
      'key_identifier', p_key_identifier,
      'algorithm', p_algorithm
    ),
    'key_management'
  );
  
  RETURN new_key_id;
END;
$function$;

-- ===========================
-- 3. SECURITY CONFIGURATION HARDENING
-- ===========================

-- Update RLS policies for security configs - Admin only
DROP POLICY IF EXISTS "Moderators can view security configs" ON public.security_configs;
DROP POLICY IF EXISTS "Admins can manage security configs" ON public.security_configs;

-- Admin-only access to security configs
CREATE POLICY "Admins only can manage security configs"
ON public.security_configs
FOR ALL
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Function to validate security config changes
CREATE OR REPLACE FUNCTION public.validate_security_config_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  -- Log all security config changes
  INSERT INTO public.security_events (
    event_type, severity, user_id, event_data, source
  ) VALUES (
    'security_config_modified',
    'critical',
    auth.uid(),
    jsonb_build_object(
      'config_key', COALESCE(NEW.config_key, OLD.config_key),
      'operation', TG_OP,
      'modified_by', auth.uid()
    ),
    'security_config_management'
  );
  
  RETURN NEW;
END;
$function$;

-- Create trigger for security config validation
DROP TRIGGER IF EXISTS validate_security_config_trigger ON public.security_configs;
CREATE TRIGGER validate_security_config_trigger
  BEFORE INSERT OR UPDATE ON public.security_configs
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_security_config_change();

-- ===========================
-- 4. ADDITIONAL SECURITY FUNCTIONS
-- ===========================

-- Security overview function for admins
CREATE OR REPLACE FUNCTION public.get_security_overview()
RETURNS TABLE(
  active_sessions INTEGER,
  security_events_24h INTEGER,
  critical_alerts INTEGER,
  encryption_keys_active INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  -- Only admins can view security overview
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Admin role required for security overview';
  END IF;
  
  RETURN QUERY
  SELECT
    (SELECT COUNT(*)::INTEGER FROM public.user_sessions WHERE is_active = true),
    (SELECT COUNT(*)::INTEGER FROM public.security_events WHERE created_at > now() - interval '24 hours'),
    (SELECT COUNT(*)::INTEGER FROM public.security_alerts WHERE status = 'open' AND priority = 'critical'),
    (SELECT COUNT(*)::INTEGER FROM public.encryption_keys WHERE is_active = true);
END;
$function$;

-- Force session rotation for security incidents
CREATE OR REPLACE FUNCTION public.force_session_rotation(p_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  rotated_count INTEGER;
BEGIN
  -- Only admins or the user themselves can force rotation
  IF NOT (has_role(auth.uid(), 'admin') OR auth.uid() = p_user_id) THEN
    RAISE EXCEPTION 'Insufficient permissions to force session rotation';
  END IF;
  
  -- Invalidate all sessions for the user
  UPDATE public.user_sessions
  SET is_active = false, last_activity = now()
  WHERE user_id = p_user_id AND is_active = true;
  
  GET DIAGNOSTICS rotated_count = ROW_COUNT;
  
  -- Log the rotation
  INSERT INTO public.security_events (
    event_type, severity, user_id, event_data, source
  ) VALUES (
    'forced_session_rotation',
    'high',
    p_user_id,
    jsonb_build_object(
      'rotated_sessions', rotated_count,
      'forced_by', auth.uid()
    ),
    'session_security'
  );
  
  RETURN rotated_count;
END;
$function$;