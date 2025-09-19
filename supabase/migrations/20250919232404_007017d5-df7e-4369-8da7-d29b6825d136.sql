-- Drop existing has_role function that has conflicting signature
DROP FUNCTION IF EXISTS public.has_role(uuid, app_role);

-- Create the has_role function with proper signature
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = _user_id 
    AND role = _role 
    AND is_active = true 
    AND (expires_at IS NULL OR expires_at > now())
  );
END;
$$;

-- Function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_role text;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN 'anonymous';
  END IF;
  
  SELECT role::text INTO user_role
  FROM public.user_roles 
  WHERE user_id = auth.uid() 
  AND is_active = true 
  AND (expires_at IS NULL OR expires_at > now())
  ORDER BY granted_at DESC
  LIMIT 1;
  
  RETURN COALESCE(user_role, 'user');
END;
$$;

-- Function to verify active session with MFA
CREATE OR REPLACE FUNCTION public.verify_active_session_with_mfa(required_level text DEFAULT 'normal', max_age_minutes integer DEFAULT 30)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  session_valid boolean := false;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;
  
  -- Check for active session within time limit
  SELECT EXISTS(
    SELECT 1 FROM public.user_sessions
    WHERE user_id = auth.uid()
    AND is_active = true
    AND expires_at > now()
    AND last_activity > (now() - (max_age_minutes || ' minutes')::interval)
    AND (required_level = 'normal' OR security_level = required_level OR security_level = 'enhanced')
  ) INTO session_valid;
  
  RETURN session_valid;
END;
$$;

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