-- Drop the conflicting policies and create new ones
DROP POLICY IF EXISTS "Users can log their own security events during auth" ON public.security_events;
DROP POLICY IF EXISTS "Service functions can insert security configs" ON public.security_configs;
DROP POLICY IF EXISTS "Allow security event logging during signup" ON public.security_events;

-- Create a more permissive policy for security events during authentication flows
CREATE POLICY "Enhanced security event logging" 
ON public.security_events 
FOR INSERT 
WITH CHECK (
  -- Allow service role (for edge functions)
  (current_setting('role', true) = 'service_role') OR
  -- Allow authenticated users to log their own events
  (auth.uid() = user_id) OR
  -- Allow unauthenticated signup/auth events
  (auth.uid() IS NULL AND event_type IN ('user_signup_success', 'signup_attempt_failed', 'password_reset_requested', 'enhanced_csrf_token_generated', 'enhanced_encryption_key_generated'))
);

-- Create policy for security configs that allows edge functions
CREATE POLICY "Enhanced security config management" 
ON public.security_configs 
FOR INSERT 
WITH CHECK (
  -- Allow service role (for edge functions)
  (current_setting('role', true) = 'service_role') OR
  -- Allow admin users
  has_role(auth.uid(), 'admin'::app_role) OR
  -- Allow for CSRF tokens during authentication (temporary config)
  (config_key ILIKE 'csrf_token_%' AND auth.uid() IS NOT NULL)
);