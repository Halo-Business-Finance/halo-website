-- CRITICAL SECURITY FIX: Secure encryption_keys table access
-- Drop all existing policies and implement strict service-role-only access

-- Drop all existing policies on encryption_keys table
DROP POLICY IF EXISTS "Service role only encryption keys access" ON public.encryption_keys;
DROP POLICY IF EXISTS "Strict service role encryption keys select" ON public.encryption_keys;
DROP POLICY IF EXISTS "Strict service role encryption keys insert" ON public.encryption_keys;
DROP POLICY IF EXISTS "Strict service role encryption keys update" ON public.encryption_keys;
DROP POLICY IF EXISTS "Strict service role encryption keys delete" ON public.encryption_keys;

-- Create new strict service-role-only policies
CREATE POLICY "Encryption keys select - service role only" 
ON public.encryption_keys 
FOR SELECT 
TO service_role
USING (true);

CREATE POLICY "Encryption keys insert - service role only" 
ON public.encryption_keys 
FOR INSERT 
TO service_role
WITH CHECK (true);

CREATE POLICY "Encryption keys update - service role only" 
ON public.encryption_keys 
FOR UPDATE 
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Encryption keys delete - service role only" 
ON public.encryption_keys 
FOR DELETE 
TO service_role
USING (true);

-- Log this critical security fix
INSERT INTO public.security_events (
  event_type,
  severity,
  event_data,
  source
) VALUES (
  'encryption_keys_security_hardened',
  'critical',
  jsonb_build_object(
    'action', 'RLS_policies_restricted_to_service_role',
    'timestamp', now(),
    'security_impact', 'High - Prevents unauthorized access to encryption keys'
  ),
  'security_migration'
);