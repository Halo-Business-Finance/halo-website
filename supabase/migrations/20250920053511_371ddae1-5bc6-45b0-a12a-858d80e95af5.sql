-- Create missing security functions that are referenced in RLS policies

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

-- Update remaining problematic policies

-- Update security_events policies for better admin access
DROP POLICY IF EXISTS "Fort Knox security events access" ON public.security_events;

CREATE POLICY "Enhanced admin security events access"
ON public.security_events
FOR SELECT
TO authenticated
USING (
  auth.role() = 'service_role' OR
  (
    auth.uid() IS NOT NULL AND 
    public.has_role(auth.uid(), 'admin') AND
    public.verify_active_session_with_mfa('normal', 60)
  )
);

-- Update security_alerts policies
DROP POLICY IF EXISTS "Fort Knox security alerts access" ON public.security_alerts;

CREATE POLICY "Admin security alerts access"
ON public.security_alerts
FOR ALL
TO authenticated
USING (
  auth.role() = 'service_role' OR
  (
    auth.uid() IS NOT NULL AND 
    public.has_role(auth.uid(), 'admin') AND
    public.verify_active_session_with_mfa('normal', 60)
  )
)
WITH CHECK (
  auth.role() = 'service_role' OR
  (
    auth.uid() IS NOT NULL AND 
    public.has_role(auth.uid(), 'admin')
  )
);

-- Update security_configs for better admin management
DROP POLICY IF EXISTS "Block anonymous security config access" ON public.security_configs;
DROP POLICY IF EXISTS "Strict admin-only security config access" ON public.security_configs;

CREATE POLICY "Admin security config management"
ON public.security_configs
FOR ALL
TO authenticated
USING (
  auth.role() = 'service_role' OR
  (
    auth.uid() IS NOT NULL AND 
    public.has_role(auth.uid(), 'admin')
  )
)
WITH CHECK (
  auth.role() = 'service_role' OR
  (
    auth.uid() IS NOT NULL AND 
    public.has_role(auth.uid(), 'admin') AND
    config_key IS NOT NULL AND
    config_value IS NOT NULL
  )
);