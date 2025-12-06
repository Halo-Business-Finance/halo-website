-- Drop existing overlapping policies on rate_limit_configs
DROP POLICY IF EXISTS "Admin only SELECT rate limit configs" ON public.rate_limit_configs;
DROP POLICY IF EXISTS "Block anonymous rate limit config access" ON public.rate_limit_configs;
DROP POLICY IF EXISTS "Secure admin management of rate limit configs" ON public.rate_limit_configs;
DROP POLICY IF EXISTS "Service role access to rate limit configs" ON public.rate_limit_configs;

-- Create clean, secure policies

-- Service role has full access (PERMISSIVE base)
CREATE POLICY "Service role full access"
ON public.rate_limit_configs
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Verified admins can read rate limit configs
CREATE POLICY "Verified admins can read rate limits"
ON public.rate_limit_configs
FOR SELECT
USING (
  auth.uid() IS NOT NULL 
  AND has_role(auth.uid(), 'admin'::app_role)
  AND verify_active_session_with_mfa('normal'::text, 30)
);

-- Verified admins can manage rate limit configs with enhanced verification
CREATE POLICY "Verified admins can manage rate limits"
ON public.rate_limit_configs
FOR ALL
USING (
  auth.uid() IS NOT NULL 
  AND has_role(auth.uid(), 'admin'::app_role)
  AND verify_active_session_with_mfa('enhanced'::text, 15)
)
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND has_role(auth.uid(), 'admin'::app_role)
  AND endpoint IS NOT NULL
);