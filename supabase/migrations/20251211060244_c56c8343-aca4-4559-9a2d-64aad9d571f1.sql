-- Fix Critical RLS Policy Vulnerabilities
-- Issue: Policies with USING: true / WITH CHECK: true allow ANY user access

-- =====================================================
-- FIX 1: encryption_keys table
-- =====================================================

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Service role only encryption key access" ON encryption_keys;

-- Create properly restricted service_role-only policy
CREATE POLICY "Service role only encryption key management"
ON encryption_keys
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- =====================================================
-- FIX 2: consultation_analytics table  
-- =====================================================

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Service role consultation analytics access" ON consultation_analytics;

-- Create properly restricted service_role-only policy
CREATE POLICY "Service role only consultation analytics management"
ON consultation_analytics
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- =====================================================
-- Log the security fix
-- =====================================================
INSERT INTO security_events (
  event_type,
  severity,
  event_data,
  source
) VALUES (
  'critical_rls_policy_fix_applied',
  'critical',
  jsonb_build_object(
    'fixed_tables', ARRAY['encryption_keys', 'consultation_analytics'],
    'vulnerability', 'overly_permissive_all_policy',
    'remediation', 'restricted_to_service_role_only',
    'applied_at', now(),
    'requires_key_rotation', true
  ),
  'security_migration'
);