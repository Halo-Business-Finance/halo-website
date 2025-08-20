-- Fix RLS policies to allow authenticated users to log their own security events during signup/auth

-- Add policy for authenticated users to log security events during authentication
CREATE POLICY "Users can log their own security events during auth" 
ON public.security_events 
FOR INSERT 
WITH CHECK (
  (auth.uid() = user_id) OR 
  (auth.uid() IS NULL AND event_type IN ('user_signup_success', 'signup_attempt_failed', 'password_reset_requested'))
);

-- Allow service role functions to insert security configurations
CREATE POLICY "Service functions can insert security configs" 
ON public.security_configs 
FOR INSERT 
WITH CHECK (
  (current_setting('role', true) = 'service_role') OR 
  (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role')
);

-- Allow unauthenticated users to trigger security events during signup
CREATE POLICY "Allow security event logging during signup" 
ON public.security_events 
FOR INSERT 
WITH CHECK (
  event_type IN ('csrf_token_generated', 'enhanced_csrf_token_generated', 'encryption_key_generated', 'enhanced_encryption_key_generated') OR
  source IN ('enhanced_csrf_generation', 'enhanced_key_generation', 'secure_auth')
);