-- Block anonymous access to admin_users table (contains password hashes, MFA secrets)
CREATE POLICY "Block anonymous admin users access"
ON public.admin_users
AS RESTRICTIVE
FOR SELECT
USING (auth.uid() IS NOT NULL OR auth.role() = 'service_role');

-- Block anonymous access to admin_sessions table (contains session tokens)
CREATE POLICY "Block anonymous admin sessions access"
ON public.admin_sessions
AS RESTRICTIVE
FOR SELECT
USING (auth.uid() IS NOT NULL OR auth.role() = 'service_role');

-- Block anonymous access to consultations table (contains encrypted PII)
CREATE POLICY "Block anonymous consultation access"
ON public.consultations
AS RESTRICTIVE
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Block anonymous access to admin_audit_log table (contains admin activity)
CREATE POLICY "Block anonymous audit log access"
ON public.admin_audit_log
AS RESTRICTIVE
FOR SELECT
USING (auth.uid() IS NOT NULL OR auth.role() = 'service_role');