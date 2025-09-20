-- Create missing security functions that are referenced in RLS policies
-- Keep exact parameter names to match existing policy references

-- Function to verify active business application session
CREATE OR REPLACE FUNCTION public.verify_active_business_application_session()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;
  
  -- Check for active session within last 30 minutes
  RETURN EXISTS(
    SELECT 1 FROM public.user_sessions
    WHERE user_id = auth.uid()
    AND is_active = true
    AND expires_at > now()
    AND last_activity > (now() - interval '30 minutes')
  );
END;
$$;

-- Function to verify ultra secure admin audit access
CREATE OR REPLACE FUNCTION public.verify_ultra_secure_admin_audit_access()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;
  
  -- Only admins with recent active sessions can access audit data
  RETURN (
    public.has_role(auth.uid(), 'admin') AND
    EXISTS(
      SELECT 1 FROM public.user_sessions
      WHERE user_id = auth.uid()
      AND is_active = true
      AND expires_at > now()
      AND last_security_check > (now() - interval '15 minutes')
      AND security_level IN ('enhanced', 'high')
    )
  );
END;
$$;

-- Function to verify encryption key access
CREATE OR REPLACE FUNCTION public.verify_encryption_key_access()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only service role should access encryption keys directly
  RETURN auth.role() = 'service_role';
END;
$$;

-- Now update problematic RLS policies

-- Fix encryption_keys table policies
DROP POLICY IF EXISTS "Deny anonymous access to encryption keys" ON public.encryption_keys;
DROP POLICY IF EXISTS "Deny authenticated access to encryption keys" ON public.encryption_keys;
DROP POLICY IF EXISTS "Maximum security encryption key fortress" ON public.encryption_keys;

CREATE POLICY "Service role only encryption key access"
ON public.encryption_keys
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Fix admin_users table policies
DROP POLICY IF EXISTS "Block_Direct_Admin_Users_Access" ON public.admin_users;
DROP POLICY IF EXISTS "Service_Role_Admin_Users_Access" ON public.admin_users;

CREATE POLICY "Service role admin users access"
ON public.admin_users
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Admin can view own profile"
ON public.admin_users
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL AND 
  EXISTS(
    SELECT 1 FROM auth.users u 
    WHERE u.id = auth.uid() 
    AND u.email = admin_users.email
  ) AND
  public.has_role(auth.uid(), 'admin')
);

-- Update security_access_audit policies to allow proper admin access
DROP POLICY IF EXISTS "Ultra secure admin audit access with multi-factor verification" ON public.security_access_audit;

CREATE POLICY "Admin can view security access audit"
ON public.security_access_audit
FOR SELECT
TO authenticated
USING (public.verify_ultra_secure_admin_audit_access());

CREATE POLICY "System can log security access"
ON public.security_access_audit
FOR INSERT
TO authenticated
USING (true)
WITH CHECK (true);

-- Update admin_sessions policies to allow proper session management
DROP POLICY IF EXISTS "Military_Grade_Admin_Session_Protection" ON public.admin_sessions;

CREATE POLICY "Service role admin session management"
ON public.admin_sessions
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Admins can view own sessions"
ON public.admin_sessions
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL AND
  public.has_role(auth.uid(), 'admin') AND
  EXISTS(
    SELECT 1 FROM public.admin_users au
    JOIN auth.users u ON au.email = u.email
    WHERE u.id = auth.uid() 
    AND au.id = admin_sessions.admin_user_id
    AND au.is_active = true
  )
);