-- Add explicit RESTRICTIVE policies to block anonymous access on sensitive tables
-- Using SELECT command since RESTRICTIVE FOR ALL with INSERT causes issues

-- Block anonymous access to admin_users
CREATE POLICY "Block anonymous admin_users access" 
ON public.admin_users 
AS RESTRICTIVE
FOR SELECT
USING ((auth.uid() IS NOT NULL) OR (auth.role() = 'service_role'::text));

-- Block anonymous access to admin_sessions
CREATE POLICY "Block anonymous admin_sessions access" 
ON public.admin_sessions 
AS RESTRICTIVE
FOR SELECT
USING ((auth.uid() IS NOT NULL) OR (auth.role() = 'service_role'::text));

-- Block anonymous access to security_events
CREATE POLICY "Block anonymous security_events access" 
ON public.security_events 
AS RESTRICTIVE
FOR SELECT
USING ((auth.uid() IS NOT NULL) OR (auth.role() = 'service_role'::text));

-- Block anonymous access to security_alerts
CREATE POLICY "Block anonymous security_alerts access" 
ON public.security_alerts 
AS RESTRICTIVE
FOR SELECT
USING ((auth.uid() IS NOT NULL) OR (auth.role() = 'service_role'::text));

-- Block anonymous access to rate_limit_configs
CREATE POLICY "Block anonymous rate_limit_configs access" 
ON public.rate_limit_configs 
AS RESTRICTIVE
FOR SELECT
USING ((auth.uid() IS NOT NULL) OR (auth.role() = 'service_role'::text));

-- Block anonymous access to encryption_keys
CREATE POLICY "Block anonymous encryption_keys access" 
ON public.encryption_keys 
AS RESTRICTIVE
FOR SELECT
USING ((auth.uid() IS NOT NULL) OR (auth.role() = 'service_role'::text));

-- Block anonymous access to admin_password_changes
CREATE POLICY "Block anonymous admin_password_changes access" 
ON public.admin_password_changes 
AS RESTRICTIVE
FOR SELECT
USING ((auth.uid() IS NOT NULL) OR (auth.role() = 'service_role'::text));

-- Block anonymous access to lead_submissions
CREATE POLICY "Block anonymous lead_submissions access" 
ON public.lead_submissions 
AS RESTRICTIVE
FOR SELECT
USING ((auth.uid() IS NOT NULL) OR (auth.role() = 'service_role'::text));

-- Block anonymous access to security_logs
CREATE POLICY "Block anonymous security_logs access" 
ON public.security_logs 
AS RESTRICTIVE
FOR SELECT
USING ((auth.uid() IS NOT NULL) OR (auth.role() = 'service_role'::text));

-- Block anonymous access to admin_audit_log (drop existing first)
DROP POLICY IF EXISTS "Block anonymous audit log access" ON public.admin_audit_log;
CREATE POLICY "Block anonymous admin_audit_log access" 
ON public.admin_audit_log 
AS RESTRICTIVE
FOR SELECT
USING ((auth.uid() IS NOT NULL) OR (auth.role() = 'service_role'::text));

-- Block anonymous access to user_sessions if exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_sessions') THEN
    EXECUTE 'CREATE POLICY "Block anonymous user_sessions access" 
    ON public.user_sessions 
    AS RESTRICTIVE
    FOR SELECT
    USING ((auth.uid() IS NOT NULL) OR (auth.role() = ''service_role''::text))';
  END IF;
END $$;

-- Block anonymous access to applications
CREATE POLICY "Block anonymous applications access" 
ON public.applications 
AS RESTRICTIVE
FOR SELECT
USING ((auth.uid() IS NOT NULL) OR (auth.role() = 'service_role'::text));

-- Block anonymous access to consultations (drop the existing one first)
DROP POLICY IF EXISTS "Block anonymous consultation access" ON public.consultations;
CREATE POLICY "Block anonymous consultations access" 
ON public.consultations 
AS RESTRICTIVE
FOR SELECT
USING ((auth.uid() IS NOT NULL) OR (auth.role() = 'service_role'::text));