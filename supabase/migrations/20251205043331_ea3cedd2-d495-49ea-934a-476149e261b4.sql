-- Add explicit SELECT policy for rate_limit_configs to prevent attackers from discovering rate limiting thresholds
-- Only admins and service role should be able to read rate limit configurations

-- First, add a permissive SELECT policy for admins
CREATE POLICY "Admin only SELECT rate limit configs"
ON public.rate_limit_configs
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Add a permissive SELECT policy for service role
CREATE POLICY "Service role SELECT rate limit configs"
ON public.rate_limit_configs
FOR SELECT
TO service_role
USING (true);