-- Drop overly permissive audit log INSERT policy
-- The existing "Service role can insert security access audit logs" and 
-- "Service role insert access to security audit logs" policies provide proper protection
DROP POLICY IF EXISTS "System can log security access" ON security_access_audit;

-- Drop session-setting-based policy that could potentially be manipulated
-- The existing "Secure system status history creation" policy provides proper coverage
DROP POLICY IF EXISTS "Database triggers can create status history" ON application_status_history;