-- CRITICAL SECURITY FIXES - Priority 1: Database Access Control (Fixed Syntax)

-- 1. Fix encryption_keys table - restrict to service role only (CRITICAL)
DROP POLICY IF EXISTS "Encryption keys delete - service role only" ON public.encryption_keys;
DROP POLICY IF EXISTS "Encryption keys insert - service role only" ON public.encryption_keys;
DROP POLICY IF EXISTS "Encryption keys select - service role only" ON public.encryption_keys;
DROP POLICY IF EXISTS "Encryption keys update - service role only" ON public.encryption_keys;

CREATE POLICY "Encryption keys - service role only" 
ON public.encryption_keys FOR ALL 
USING (auth.role() = 'service_role'::text)
WITH CHECK (auth.role() = 'service_role'::text);

-- 2. Fix user_sessions table - restrict access properly (CRITICAL)
DROP POLICY IF EXISTS "User sessions - service role only" ON public.user_sessions;

-- Split the policies by operation type
CREATE POLICY "User sessions - admin and service role select" 
ON public.user_sessions FOR SELECT 
USING (
  auth.role() = 'service_role'::text OR 
  (auth.uid() IS NOT NULL AND has_role(auth.uid(), 'admin'))
);

CREATE POLICY "User sessions - service role insert" 
ON public.user_sessions FOR INSERT 
WITH CHECK (auth.role() = 'service_role'::text);

CREATE POLICY "User sessions - service role update" 
ON public.user_sessions FOR UPDATE 
USING (auth.role() = 'service_role'::text)
WITH CHECK (auth.role() = 'service_role'::text);

CREATE POLICY "User sessions - service role delete" 
ON public.user_sessions FOR DELETE 
USING (auth.role() = 'service_role'::text);

-- 3. Fix security_events table - add proper admin access (CRITICAL)
DROP POLICY IF EXISTS "Security events - admin select only" ON public.security_events;
DROP POLICY IF EXISTS "Security events - service role insert only" ON public.security_events;

CREATE POLICY "Security events - admin select with auth check" 
ON public.security_events FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND has_role(auth.uid(), 'admin')
);

CREATE POLICY "Security events - service role insert" 
ON public.security_events FOR INSERT 
WITH CHECK (auth.role() = 'service_role'::text);

CREATE POLICY "Security events - service role update" 
ON public.security_events FOR UPDATE 
USING (auth.role() = 'service_role'::text)
WITH CHECK (auth.role() = 'service_role'::text);

CREATE POLICY "Security events - service role delete" 
ON public.security_events FOR DELETE 
USING (auth.role() = 'service_role'::text);

-- 4. Fix audit_logs table - strengthen access control (CRITICAL)
DROP POLICY IF EXISTS "Audit logs - admin view only" ON public.audit_logs;
DROP POLICY IF EXISTS "Audit logs - service role insert only" ON public.audit_logs;

CREATE POLICY "Audit logs - admin select with auth check" 
ON public.audit_logs FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND has_role(auth.uid(), 'admin')
);

CREATE POLICY "Audit logs - service role insert" 
ON public.audit_logs FOR INSERT 
WITH CHECK (auth.role() = 'service_role'::text);

CREATE POLICY "Audit logs - service role update" 
ON public.audit_logs FOR UPDATE 
USING (auth.role() = 'service_role'::text)
WITH CHECK (auth.role() = 'service_role'::text);

CREATE POLICY "Audit logs - service role delete" 
ON public.audit_logs FOR DELETE 
USING (auth.role() = 'service_role'::text);

-- 5. Fix security_access_audit table - proper access control
DROP POLICY IF EXISTS "Only admins can view security audit logs" ON public.security_access_audit;
DROP POLICY IF EXISTS "System functions only can insert audit logs" ON public.security_access_audit;

CREATE POLICY "Security audit logs - admin view with auth" 
ON public.security_access_audit FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND has_role(auth.uid(), 'admin')
);

CREATE POLICY "Security audit logs - service role insert only" 
ON public.security_access_audit FOR INSERT 
WITH CHECK (auth.role() = 'service_role'::text);

-- Log the completion of access control fixes
INSERT INTO public.security_events (
  event_type,
  severity,
  event_data,
  source
) VALUES (
  'critical_access_control_fixes_applied',
  'critical',
  jsonb_build_object(
    'fixes_applied', ARRAY[
      'encryption_keys_access_restricted',
      'user_sessions_access_controlled',
      'security_events_admin_only',
      'audit_logs_secured',
      'security_access_audit_secured'
    ],
    'timestamp', now(),
    'priority', 'critical_security_remediation_phase_1'
  ),
  'security_migration'
);