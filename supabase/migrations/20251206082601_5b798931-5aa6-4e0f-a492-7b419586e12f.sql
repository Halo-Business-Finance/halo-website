-- Automatic Encryption Key Rotation System

-- Function to rotate encryption keys automatically
CREATE OR REPLACE FUNCTION public.rotate_encryption_keys()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  rotated_count integer := 0;
  new_key_id uuid;
  old_key record;
  rotation_results jsonb := '[]'::jsonb;
BEGIN
  -- Only service role can rotate keys
  IF auth.role() != 'service_role' THEN
    RAISE EXCEPTION 'Only service role can rotate encryption keys';
  END IF;
  
  -- Find keys that need rotation (expired or approaching expiration)
  FOR old_key IN 
    SELECT id, key_identifier, algorithm, expires_at
    FROM public.encryption_keys
    WHERE is_active = true
    AND (
      expires_at < now() + interval '7 days'  -- Rotate 7 days before expiry
      OR rotation_scheduled_at <= now()
    )
  LOOP
    -- Deactivate old key
    UPDATE public.encryption_keys
    SET is_active = false,
        rotation_scheduled_at = now()
    WHERE id = old_key.id;
    
    -- Create new key with same identifier
    INSERT INTO public.encryption_keys (
      key_identifier,
      algorithm,
      key_hash,
      key_encryption_salt,
      expires_at,
      is_active
    ) VALUES (
      old_key.key_identifier || '_v' || extract(epoch from now())::text,
      old_key.algorithm,
      encode(extensions.digest(extensions.gen_random_bytes(64)::text || now()::text, 'sha512'), 'hex'),
      encode(extensions.gen_random_bytes(32), 'hex'),
      now() + interval '90 days',
      true
    ) RETURNING id INTO new_key_id;
    
    rotated_count := rotated_count + 1;
    rotation_results := rotation_results || jsonb_build_object(
      'old_key_id', old_key.id,
      'new_key_id', new_key_id,
      'key_identifier', old_key.key_identifier,
      'rotated_at', now()
    );
  END LOOP;
  
  -- Log rotation event
  IF rotated_count > 0 THEN
    INSERT INTO public.security_events (
      event_type, severity, event_data, source
    ) VALUES (
      'encryption_keys_rotated', 'high',
      jsonb_build_object(
        'rotated_count', rotated_count,
        'rotation_results', rotation_results,
        'rotation_timestamp', now()
      ),
      'key_rotation_service'
    );
  END IF;
  
  RETURN jsonb_build_object(
    'success', true,
    'rotated_count', rotated_count,
    'rotation_results', rotation_results,
    'next_rotation_check', now() + interval '1 day'
  );
END;
$$;

-- Function to check key health and schedule rotations
CREATE OR REPLACE FUNCTION public.check_encryption_key_health()
RETURNS TABLE(
  key_id uuid,
  key_identifier text,
  status text,
  days_until_expiry integer,
  needs_rotation boolean,
  last_used_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only admins can check key health
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Admin role required to check key health';
  END IF;
  
  RETURN QUERY
  SELECT 
    ek.id as key_id,
    ek.key_identifier,
    CASE 
      WHEN NOT ek.is_active THEN 'inactive'
      WHEN ek.expires_at < now() THEN 'expired'
      WHEN ek.expires_at < now() + interval '7 days' THEN 'expiring_soon'
      ELSE 'healthy'
    END as status,
    EXTRACT(day FROM (ek.expires_at - now()))::integer as days_until_expiry,
    (ek.expires_at < now() + interval '7 days' OR ek.rotation_scheduled_at <= now()) as needs_rotation,
    ek.last_used_at
  FROM public.encryption_keys ek
  WHERE ek.is_active = true
  ORDER BY ek.expires_at ASC;
END;
$$;

-- Remove plain text session_token from admin_sessions (keep only hash)
-- First check if the column exists and drop it
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'admin_sessions' 
    AND column_name = 'session_token'
  ) THEN
    -- Create a backup of hashes before dropping
    UPDATE public.admin_sessions
    SET session_token_hash = COALESCE(
      session_token_hash,
      encode(extensions.digest(session_token || COALESCE(token_salt, ''), 'sha256'), 'hex')
    )
    WHERE session_token IS NOT NULL AND session_token_hash IS NULL;
    
    -- Drop the plain text column
    ALTER TABLE public.admin_sessions DROP COLUMN session_token;
  END IF;
END $$;

-- Create secure view for admin_users that masks sensitive fields
CREATE OR REPLACE VIEW public.admin_users_secure AS
SELECT 
  id,
  email,
  full_name,
  role,
  security_clearance_level,
  is_active,
  mfa_enabled,
  last_login_at,
  created_at,
  updated_at,
  failed_login_attempts,
  account_locked_until,
  -- Mask sensitive fields
  '********' as password_hash_masked,
  '********' as password_salt_masked,
  CASE WHEN mfa_secret_encrypted IS NOT NULL THEN '[ENCRYPTED]' ELSE NULL END as mfa_status
FROM public.admin_users;

-- Grant access to secure view only
GRANT SELECT ON public.admin_users_secure TO authenticated;

-- Revoke direct table access from authenticated users (keep service_role)
REVOKE ALL ON public.admin_users FROM authenticated;

-- Create function for secure admin credential verification (no direct table access needed)
CREATE OR REPLACE FUNCTION public.verify_admin_credentials_secure(
  p_email text,
  p_password_hash text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  admin_record record;
  is_valid boolean := false;
BEGIN
  -- Get admin record
  SELECT id, password_hash, password_salt, is_active, account_locked_until, failed_login_attempts, mfa_enabled
  INTO admin_record
  FROM public.admin_users
  WHERE email = p_email;
  
  IF admin_record IS NULL THEN
    RETURN jsonb_build_object('valid', false, 'reason', 'not_found');
  END IF;
  
  IF NOT admin_record.is_active THEN
    RETURN jsonb_build_object('valid', false, 'reason', 'inactive');
  END IF;
  
  IF admin_record.account_locked_until IS NOT NULL AND admin_record.account_locked_until > now() THEN
    RETURN jsonb_build_object('valid', false, 'reason', 'locked', 'locked_until', admin_record.account_locked_until);
  END IF;
  
  -- Verify password hash matches
  is_valid := admin_record.password_hash = p_password_hash;
  
  IF is_valid THEN
    -- Reset failed attempts
    UPDATE public.admin_users SET failed_login_attempts = 0 WHERE id = admin_record.id;
    
    RETURN jsonb_build_object(
      'valid', true, 
      'admin_id', admin_record.id,
      'requires_mfa', admin_record.mfa_enabled
    );
  ELSE
    -- Increment failed attempts
    UPDATE public.admin_users 
    SET failed_login_attempts = failed_login_attempts + 1,
        account_locked_until = CASE 
          WHEN failed_login_attempts >= 4 THEN now() + interval '15 minutes'
          ELSE NULL
        END
    WHERE id = admin_record.id;
    
    RETURN jsonb_build_object('valid', false, 'reason', 'invalid_credentials');
  END IF;
END;
$$;

-- Log key rotation system activation
INSERT INTO public.security_events (
  event_type, severity, event_data, source
) VALUES (
  'key_rotation_system_activated', 'info',
  jsonb_build_object(
    'activation_timestamp', now(),
    'rotation_interval_days', 90,
    'early_rotation_days', 7
  ),
  'security_migration'
);