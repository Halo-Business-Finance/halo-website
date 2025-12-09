-- Fix the security definer view issue by using SECURITY INVOKER (the default)
-- Drop and recreate the view without SECURITY DEFINER

DROP VIEW IF EXISTS public.admin_profile_secure;

-- Create a standard view (SECURITY INVOKER by default)
-- RLS on admin_users table will still apply to the underlying table
CREATE VIEW public.admin_profile_secure 
WITH (security_invoker = true)
AS
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
COMMENT ON VIEW public.admin_profile_secure IS 'Secure view of admin_users excluding password_hash, password_salt, mfa_secret_encrypted, password_algorithm, password_iterations, and credential_audit_trail. Uses SECURITY INVOKER so RLS policies on admin_users are enforced.';

-- Grant appropriate permissions
GRANT SELECT ON public.admin_profile_secure TO authenticated;
GRANT SELECT ON public.admin_profile_secure TO service_role;