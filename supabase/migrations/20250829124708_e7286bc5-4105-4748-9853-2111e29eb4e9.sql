-- SECURITY FIX: Ensure audit_logs table has proper RLS policies that require authentication
-- Drop existing policies that may be too permissive
DROP POLICY IF EXISTS "Admins can view all audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "System can insert audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Users can view their own audit logs" ON public.audit_logs;

-- Create new secure policies that strictly require authentication
CREATE POLICY "Admins can view all audit logs" ON public.audit_logs
FOR SELECT 
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Service role can insert audit logs" ON public.audit_logs
FOR INSERT 
TO service_role
WITH CHECK (true);

CREATE POLICY "Users can view their own audit logs" ON public.audit_logs
FOR SELECT 
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND auth.uid() = user_id
);

-- Fix other security issues identified in the scan
-- SECURITY FIX: encryption_keys table - restrict to service role only
DROP POLICY IF EXISTS "Ultra secure encryption keys access" ON public.encryption_keys;
CREATE POLICY "Service role only encryption keys access" ON public.encryption_keys
FOR ALL 
TO service_role
USING (true)
WITH CHECK (true);

-- SECURITY FIX: user_sessions table - already properly restricted to service role
-- No changes needed as it already has "Service role only access to sessions" policy

-- SECURITY FIX: security_events table - ensure only authenticated admins can view
DROP POLICY IF EXISTS "Admins can view all security events" ON public.security_events;
DROP POLICY IF EXISTS "Admins only can view security events" ON public.security_events;
CREATE POLICY "Authenticated admins can view security events" ON public.security_events
FOR SELECT 
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- SECURITY FIX: security_configs table - ensure only authenticated admins can access
DROP POLICY IF EXISTS "Admins only can manage security configs" ON public.security_configs;
CREATE POLICY "Authenticated admins can manage security configs" ON public.security_configs
FOR ALL 
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND has_role(auth.uid(), 'admin'::app_role)
)
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- SECURITY FIX: rate_limit_configs table - ensure only authenticated staff can access
DROP POLICY IF EXISTS "Admins can manage rate limit configs" ON public.rate_limit_configs;
DROP POLICY IF EXISTS "Moderators can view rate limit configs" ON public.rate_limit_configs;
CREATE POLICY "Authenticated admins can manage rate limit configs" ON public.rate_limit_configs
FOR ALL 
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND has_role(auth.uid(), 'admin'::app_role)
)
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Authenticated moderators can view rate limit configs" ON public.rate_limit_configs
FOR SELECT 
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND (
    has_role(auth.uid(), 'admin'::app_role) 
    OR has_role(auth.uid(), 'moderator'::app_role)
  )
);