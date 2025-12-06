-- Fix the SECURITY DEFINER view issue by dropping and recreating as SECURITY INVOKER
DROP VIEW IF EXISTS public.admin_users_secure;

-- Recreate view with SECURITY INVOKER (default, uses caller's permissions)
CREATE VIEW public.admin_users_secure 
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
  last_login_at,
  created_at,
  updated_at,
  failed_login_attempts,
  account_locked_until,
  -- Mask sensitive fields - never expose password data
  '********'::text as password_hash_masked,
  '********'::text as password_salt_masked,
  CASE WHEN mfa_secret_encrypted IS NOT NULL THEN '[ENCRYPTED]'::text ELSE NULL END as mfa_status
FROM public.admin_users;

-- Revoke access and only grant to service_role
REVOKE ALL ON public.admin_users_secure FROM PUBLIC;
REVOKE ALL ON public.admin_users_secure FROM authenticated;
GRANT SELECT ON public.admin_users_secure TO service_role;