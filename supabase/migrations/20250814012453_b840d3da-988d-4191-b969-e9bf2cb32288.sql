-- Secure the security infrastructure tables by revoking API access
-- This prevents direct access to sensitive security data through the API

-- Revoke API access to security tables - force all access through secure edge function
REVOKE ALL ON public.security_events FROM anon, authenticated;
REVOKE ALL ON public.security_alerts FROM anon, authenticated;
REVOKE ALL ON public.security_configs FROM anon, authenticated;
REVOKE ALL ON public.rate_limit_configs FROM anon, authenticated;

-- Grant access only to service role (used by edge functions)
GRANT SELECT, INSERT, UPDATE ON public.security_events TO service_role;
GRANT SELECT, INSERT, UPDATE ON public.security_alerts TO service_role;
GRANT SELECT, INSERT, UPDATE ON public.security_configs TO service_role;
GRANT SELECT, INSERT, UPDATE ON public.rate_limit_configs TO service_role;

-- Update RLS policies to be even more restrictive for these tables
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own security events" ON public.security_events;
DROP POLICY IF EXISTS "Admins can view all security events" ON public.security_events;
DROP POLICY IF EXISTS "Authenticated users can log security events" ON public.security_events;
DROP POLICY IF EXISTS "Authenticated users can log security events via function" ON public.security_events;

-- Create service-role only policies for security_events
CREATE POLICY "Service role can manage security events"
  ON public.security_events
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Block all direct access to security_events for regular users
CREATE POLICY "Block direct access to security events"
  ON public.security_events
  FOR ALL
  TO authenticated, anon
  USING (false)
  WITH CHECK (false);

-- Update security_alerts policies
DROP POLICY IF EXISTS "Admins can manage all security alerts" ON public.security_alerts;
DROP POLICY IF EXISTS "Moderators can view security alerts" ON public.security_alerts;

CREATE POLICY "Service role can manage security alerts"
  ON public.security_alerts
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Block direct access to security alerts"
  ON public.security_alerts
  FOR ALL
  TO authenticated, anon
  USING (false)
  WITH CHECK (false);

-- Update security_configs policies (already restrictive, but make service-role only)
DROP POLICY IF EXISTS "Admin only SELECT security configs" ON public.security_configs;
DROP POLICY IF EXISTS "Admin only INSERT security configs" ON public.security_configs;
DROP POLICY IF EXISTS "Admin only UPDATE security configs" ON public.security_configs;
DROP POLICY IF EXISTS "Admin only DELETE security configs" ON public.security_configs;

CREATE POLICY "Service role can manage security configs"
  ON public.security_configs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Block direct access to security configs"
  ON public.security_configs
  FOR ALL
  TO authenticated, anon
  USING (false)
  WITH CHECK (false);

-- Update rate_limit_configs policies
DROP POLICY IF EXISTS "Admin only SELECT rate limit configs" ON public.rate_limit_configs;
DROP POLICY IF EXISTS "Admin only INSERT rate limit configs" ON public.rate_limit_configs;
DROP POLICY IF EXISTS "Admin only UPDATE rate limit configs" ON public.rate_limit_configs;
DROP POLICY IF EXISTS "Admin only DELETE rate limit configs" ON public.rate_limit_configs;

CREATE POLICY "Service role can manage rate limit configs"
  ON public.rate_limit_configs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Block direct access to rate limit configs"
  ON public.rate_limit_configs
  FOR ALL
  TO authenticated, anon
  USING (false)
  WITH CHECK (false);