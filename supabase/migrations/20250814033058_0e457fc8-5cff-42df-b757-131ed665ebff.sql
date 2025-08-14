-- FIX SECURITY TABLE ACCESS ISSUES (CORRECTED)
-- These changes address the security warnings by implementing proper RLS policies
-- while maintaining strict access controls for sensitive security data

-- 1. Fix security_events table access - Allow admins and moderators to view events
DROP POLICY IF EXISTS "Service role only access to security events" ON public.security_events;

-- Create graduated access policies for security events
CREATE POLICY "Admins can view all security events"
ON public.security_events
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Moderators can view non-critical security events"
ON public.security_events
FOR SELECT
USING (
  has_role(auth.uid(), 'moderator') 
  AND severity NOT IN ('critical')
);

CREATE POLICY "Service role can manage all security events"
ON public.security_events
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- 2. Fix security_alerts table access - Allow security personnel to view and manage alerts
DROP POLICY IF EXISTS "Service role only access to security alerts" ON public.security_alerts;

CREATE POLICY "Admins can manage all security alerts"
ON public.security_alerts
FOR ALL
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Moderators can view security alerts"
ON public.security_alerts
FOR SELECT
USING (has_role(auth.uid(), 'moderator'));

CREATE POLICY "Moderators can update security alerts"
ON public.security_alerts
FOR UPDATE
USING (has_role(auth.uid(), 'moderator'))
WITH CHECK (has_role(auth.uid(), 'moderator'));

CREATE POLICY "Service role can manage all security alerts"
ON public.security_alerts
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- 3. Fix security_configs table access - Restrict to admins only with read access for moderators
DROP POLICY IF EXISTS "Service role only access to security configs" ON public.security_configs;

CREATE POLICY "Admins can manage security configs"
ON public.security_configs
FOR ALL
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Moderators can view security configs"
ON public.security_configs
FOR SELECT
USING (has_role(auth.uid(), 'moderator'));

CREATE POLICY "Service role can manage all security configs"
ON public.security_configs
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- 4. Fix rate_limit_configs table access - Allow admins to manage, moderators to view
DROP POLICY IF EXISTS "Service role only access to rate limit configs" ON public.rate_limit_configs;

CREATE POLICY "Admins can manage rate limit configs"
ON public.rate_limit_configs
FOR ALL
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Moderators can view rate limit configs"
ON public.rate_limit_configs
FOR SELECT
USING (has_role(auth.uid(), 'moderator'));

CREATE POLICY "Service role can manage all rate limit configs"
ON public.rate_limit_configs
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');