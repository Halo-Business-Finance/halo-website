-- Block public/anonymous access to security_configs table
-- Only authenticated admins and service role should access this table

CREATE POLICY "Block anonymous security config access"
ON public.security_configs
AS RESTRICTIVE
FOR SELECT
USING (auth.uid() IS NOT NULL OR auth.role() = 'service_role');