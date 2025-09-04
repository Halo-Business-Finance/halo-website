-- Update security events RLS policies to allow better access for security dashboard
DROP POLICY IF EXISTS "Admin-only security events access" ON public.security_events;
DROP POLICY IF EXISTS "Service role full access to security events" ON public.security_events;

-- Create improved policies for security events
CREATE POLICY "Admins can view all security events" 
ON public.security_events 
FOR SELECT 
USING (
  (auth.uid() IS NOT NULL) AND 
  (EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() 
    AND ur.role = 'admin' 
    AND ur.is_active = true
  ))
);

CREATE POLICY "Service role can manage security events" 
ON public.security_events 
FOR ALL 
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "System can insert security events" 
ON public.security_events 
FOR INSERT 
WITH CHECK (true);