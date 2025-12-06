-- Block public/anonymous access to rate_limit_configs table
-- Only authenticated admins and service role should access this table

CREATE POLICY "Block anonymous rate limit config access"
ON public.rate_limit_configs
AS RESTRICTIVE
FOR SELECT
USING (auth.uid() IS NOT NULL OR auth.role() = 'service_role');