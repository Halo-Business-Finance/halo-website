-- Drop overly permissive INSERT policy on security_events table
-- The existing "Service role can manage security events" policy provides proper INSERT access
DROP POLICY IF EXISTS "System can insert security events" ON security_events;