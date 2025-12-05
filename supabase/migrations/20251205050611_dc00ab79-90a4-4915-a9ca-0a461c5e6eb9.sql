-- Fix function name conflict by dropping all existing verify_admin_password variants
-- and consolidating to a single secure version

-- Drop all existing function signatures for verify_admin_password
DROP FUNCTION IF EXISTS public.verify_admin_password(text, text);
DROP FUNCTION IF EXISTS public.verify_admin_password(text, text, text);
DROP FUNCTION IF EXISTS public.verify_admin_password(uuid, text);

-- Create the single secure version
CREATE OR REPLACE FUNCTION public.secure_verify_admin_password(
  p_admin_email text,
  p_password_hash text
)
RETURNS TABLE (
  admin_id uuid,
  is_valid boolean,
  is_locked boolean,
  failed_attempts integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_admin_id uuid;
  v_stored_hash text;
  v_locked_until timestamptz;
  v_failed_attempts integer;
BEGIN
  -- Get admin user id
  SELECT au.id INTO v_admin_id
  FROM admin_users au
  WHERE au.email = p_admin_email AND au.is_active = true;

  IF v_admin_id IS NULL THEN
    RETURN QUERY SELECT NULL::uuid, false, false, 0;
    RETURN;
  END IF;

  -- Get credential data
  SELECT 
    au.password_hash,
    au.account_locked_until,
    au.failed_login_attempts
  INTO v_stored_hash, v_locked_until, v_failed_attempts
  FROM admin_users au
  WHERE au.id = v_admin_id;

  -- Check if account is locked
  IF v_locked_until IS NOT NULL AND v_locked_until > now() THEN
    RETURN QUERY SELECT v_admin_id, false, true, v_failed_attempts;
    RETURN;
  END IF;

  -- Verify password hash
  IF v_stored_hash = p_password_hash THEN
    -- Reset failed attempts on success
    UPDATE admin_users SET failed_login_attempts = 0 WHERE id = v_admin_id;
    RETURN QUERY SELECT v_admin_id, true, false, 0;
  ELSE
    -- Increment failed attempts
    UPDATE admin_users 
    SET failed_login_attempts = failed_login_attempts + 1,
        account_locked_until = CASE 
          WHEN failed_login_attempts >= 4 THEN now() + interval '15 minutes'
          ELSE NULL
        END
    WHERE id = v_admin_id;
    
    RETURN QUERY SELECT v_admin_id, false, false, v_failed_attempts + 1;
  END IF;
END;
$$;

-- Grant execute only to authenticated users
REVOKE EXECUTE ON FUNCTION public.secure_verify_admin_password FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.secure_verify_admin_password TO authenticated;
GRANT EXECUTE ON FUNCTION public.secure_verify_admin_password TO service_role;

COMMENT ON FUNCTION public.secure_verify_admin_password IS 'Securely verify admin password without exposing hash. Returns validation result only.';