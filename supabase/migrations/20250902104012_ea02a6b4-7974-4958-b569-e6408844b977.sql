-- Fix security_configs table RLS policies to be more restrictive
-- Drop existing permissive policies and recreate as restrictive policies

DROP POLICY IF EXISTS "Secure admin-only access to security configs" ON public.security_configs;
DROP POLICY IF EXISTS "Service role access to security configs" ON public.security_configs;

-- Create restrictive policies that explicitly deny anonymous access
CREATE POLICY "Admin access to security configs"
  ON public.security_configs
  AS RESTRICTIVE
  FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) AND auth.uid() IS NOT NULL)
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) AND auth.uid() IS NOT NULL);

CREATE POLICY "Service role access to security configs"
  ON public.security_configs
  AS RESTRICTIVE
  FOR ALL
  TO service_role
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Explicitly deny anonymous access
CREATE POLICY "Deny anonymous access to security configs"
  ON public.security_configs
  AS RESTRICTIVE
  FOR ALL
  TO anon
  USING (false);

-- Log the security configuration update
INSERT INTO public.security_events (
  event_type,
  severity,
  event_data,
  source
) VALUES (
  'security_configs_rls_hardened',
  'info',
  jsonb_build_object(
    'action', 'rls_policies_updated',
    'table', 'security_configs',
    'security_level', 'hardened'
  ),
  'security_maintenance'
);