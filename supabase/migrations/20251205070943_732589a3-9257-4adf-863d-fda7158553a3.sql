-- Drop the weak policy that uses current_setting
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.admin_audit_log;

-- Create proper RLS policy using auth.uid() and has_role()
CREATE POLICY "Authenticated admins can view audit logs" 
ON public.admin_audit_log 
FOR SELECT 
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Add service role policy for system operations
CREATE POLICY "Service role can manage audit logs" 
ON public.admin_audit_log 
FOR ALL 
TO service_role
USING (true)
WITH CHECK (true);