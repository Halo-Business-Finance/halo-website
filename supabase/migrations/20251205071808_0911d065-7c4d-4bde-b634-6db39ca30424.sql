-- Fix 1: Drop overly permissive profiles policy
-- The existing "Secure profile access" policy already handles proper access control
DROP POLICY IF EXISTS "authenticated_users_can_read_profiles" ON public.profiles;

-- Fix 2: Drop the weak security_logs policy that uses current_setting
DROP POLICY IF EXISTS "Admins can view security logs" ON public.security_logs;

-- Create proper RLS policy for security_logs using auth.uid() and has_role()
CREATE POLICY "Authenticated admins can view security logs" 
ON public.security_logs 
FOR SELECT 
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Add service role policy for system operations on security_logs
CREATE POLICY "Service role can manage security logs" 
ON public.security_logs 
FOR ALL 
TO service_role
USING (true)
WITH CHECK (true);