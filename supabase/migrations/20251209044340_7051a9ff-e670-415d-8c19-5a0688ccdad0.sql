-- Create a secure admin profile view excluding sensitive credential fields
-- This view can be used for admin profile queries without exposing password/MFA secrets

CREATE OR REPLACE VIEW public.admin_profile_secure AS
SELECT 
    id,
    email,
    full_name,
    role,
    security_clearance_level,
    is_active,
    mfa_enabled,
    failed_login_attempts,
    account_locked_until,
    last_login_at,
    password_last_changed,
    created_at,
    updated_at
FROM public.admin_users;

-- Add comment explaining the view's purpose
COMMENT ON VIEW public.admin_profile_secure IS 'Secure view of admin_users excluding password_hash, password_salt, mfa_secret_encrypted, password_algorithm, password_iterations, and credential_audit_trail for safer queries';

-- Grant appropriate permissions
GRANT SELECT ON public.admin_profile_secure TO authenticated;

-- Create RLS-like security using a security definer function
CREATE OR REPLACE FUNCTION public.get_admin_profile_by_email(admin_email text)
RETURNS TABLE (
    id uuid,
    email text,
    full_name text,
    role text,
    security_clearance_level text,
    is_active boolean,
    mfa_enabled boolean,
    failed_login_attempts integer,
    account_locked_until timestamptz,
    last_login_at timestamptz,
    password_last_changed timestamptz,
    created_at timestamptz,
    updated_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Only allow admins to query their own profile or service role to query any
    IF auth.role() = 'service_role' THEN
        RETURN QUERY
        SELECT 
            au.id,
            au.email,
            au.full_name,
            au.role,
            au.security_clearance_level,
            au.is_active,
            au.mfa_enabled,
            au.failed_login_attempts,
            au.account_locked_until,
            au.last_login_at,
            au.password_last_changed,
            au.created_at,
            au.updated_at
        FROM admin_users au
        WHERE au.email = admin_email;
    ELSIF auth.uid() IS NOT NULL THEN
        -- Verify the requesting user matches the email they're querying
        IF EXISTS (
            SELECT 1 FROM auth.users u 
            WHERE u.id = auth.uid() 
            AND u.email = admin_email
        ) THEN
            RETURN QUERY
            SELECT 
                au.id,
                au.email,
                au.full_name,
                au.role,
                au.security_clearance_level,
                au.is_active,
                au.mfa_enabled,
                au.failed_login_attempts,
                au.account_locked_until,
                au.last_login_at,
                au.password_last_changed,
                au.created_at,
                au.updated_at
            FROM admin_users au
            WHERE au.email = admin_email
            AND au.is_active = true;
        END IF;
    END IF;
    
    -- Return empty if not authorized
    RETURN;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_admin_profile_by_email(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_admin_profile_by_email(text) TO service_role;