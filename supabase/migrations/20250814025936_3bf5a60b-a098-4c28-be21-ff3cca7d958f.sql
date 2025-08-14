-- Fix conflicting RLS policies on user_sessions table
-- Drop all existing policies to start clean
DROP POLICY IF EXISTS "Block all direct session access" ON public.user_sessions;
DROP POLICY IF EXISTS "System functions only can access sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Deny direct session updates" ON public.user_sessions;
DROP POLICY IF EXISTS "Deny direct session inserts" ON public.user_sessions;
DROP POLICY IF EXISTS "Deny direct session deletes" ON public.user_sessions;

-- Create single, comprehensive policy that only allows service role access
CREATE POLICY "Service role only access to sessions" 
ON public.user_sessions 
FOR ALL 
USING (auth.role() = 'service_role') 
WITH CHECK (auth.role() = 'service_role');

-- Also fix conflicting policies on other security tables
DROP POLICY IF EXISTS "Service role can manage security events" ON public.security_events;
DROP POLICY IF EXISTS "Block direct access to security events" ON public.security_events;

CREATE POLICY "Service role only access to security events" 
ON public.security_events 
FOR ALL 
USING (auth.role() = 'service_role') 
WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role can manage security alerts" ON public.security_alerts;
DROP POLICY IF EXISTS "Block direct access to security alerts" ON public.security_alerts;

CREATE POLICY "Service role only access to security alerts" 
ON public.security_alerts 
FOR ALL 
USING (auth.role() = 'service_role') 
WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role can manage security configs" ON public.security_configs;
DROP POLICY IF EXISTS "Block direct access to security configs" ON public.security_configs;

CREATE POLICY "Service role only access to security configs" 
ON public.security_configs 
FOR ALL 
USING (auth.role() = 'service_role') 
WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role can manage rate limit configs" ON public.rate_limit_configs;
DROP POLICY IF EXISTS "Block direct access to rate limit configs" ON public.rate_limit_configs;

CREATE POLICY "Service role only access to rate limit configs" 
ON public.rate_limit_configs 
FOR ALL 
USING (auth.role() = 'service_role') 
WITH CHECK (auth.role() = 'service_role');