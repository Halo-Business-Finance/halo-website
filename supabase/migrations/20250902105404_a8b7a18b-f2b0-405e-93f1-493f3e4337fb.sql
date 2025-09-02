-- Harden encryption_keys table security with restrictive policies
-- Drop existing policy and recreate as restrictive policies with explicit denies

DROP POLICY IF EXISTS "Encryption keys - service role only" ON public.encryption_keys;

-- Create restrictive service role access policy
CREATE POLICY "Service role only access to encryption keys"
  ON public.encryption_keys
  AS RESTRICTIVE
  FOR ALL
  TO service_role
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Explicitly deny authenticated users access
CREATE POLICY "Deny authenticated access to encryption keys"
  ON public.encryption_keys
  AS RESTRICTIVE
  FOR ALL
  TO authenticated
  USING (false);

-- Explicitly deny anonymous access
CREATE POLICY "Deny anonymous access to encryption keys"
  ON public.encryption_keys
  AS RESTRICTIVE
  FOR ALL
  TO anon
  USING (false);

-- Log the encryption key security hardening
INSERT INTO public.security_events (
  event_type,
  severity,
  event_data,
  source
) VALUES (
  'encryption_keys_security_hardened',
  'critical',
  jsonb_build_object(
    'action', 'rls_policies_hardened',
    'table', 'encryption_keys',
    'security_level', 'maximum_restriction',
    'access_restricted_to', 'service_role_only'
  ),
  'security_maintenance'
);