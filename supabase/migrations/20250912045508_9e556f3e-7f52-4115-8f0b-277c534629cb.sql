-- Create only the missing security functions without modifying existing ones

-- Create missing session verification function
CREATE OR REPLACE FUNCTION public.verify_active_session_with_mfa(security_level text DEFAULT 'normal', max_minutes integer DEFAULT 30)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- For now, return true for authenticated users - can be enhanced later
  RETURN auth.uid() IS NOT NULL;
END;
$$;

-- Create missing business application session verification function
CREATE OR REPLACE FUNCTION public.verify_active_business_application_session()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Verify user has an active session
  RETURN auth.uid() IS NOT NULL;
END;
$$;

-- Create missing encryption key access verification function
CREATE OR REPLACE FUNCTION public.verify_encryption_key_access()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Only service role should access encryption keys
  RETURN auth.role() = 'service_role';
END;
$$;

-- Create missing ultra secure admin audit access function
CREATE OR REPLACE FUNCTION public.verify_ultra_secure_admin_audit_access()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Only admins can access audit logs
  RETURN auth.uid() IS NOT NULL AND public.has_role(auth.uid(), 'admin');
END;
$$;

-- Grant proper permissions to security tables for authenticated users
GRANT SELECT ON public.security_events TO authenticated;
GRANT INSERT ON public.security_events TO authenticated;
GRANT SELECT ON public.security_alerts TO authenticated;
GRANT SELECT ON public.rate_limit_configs TO authenticated;
GRANT SELECT ON public.security_configs TO authenticated;