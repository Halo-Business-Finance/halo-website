-- CRITICAL SECURITY FIX: Harden remaining security-sensitive tables
-- Address vulnerabilities in security_configs, user_sessions, security_events, and audit_logs

-- 1. SECURITY CONFIGS TABLE - Restrict to admin-only access
DROP POLICY IF EXISTS "Enhanced security config management" ON public.security_configs;
DROP POLICY IF EXISTS "Authenticated admins can manage security configs" ON public.security_configs;

-- Create strict admin-only policies for security_configs
CREATE POLICY "Security configs - admin select only" 
ON public.security_configs 
FOR SELECT 
USING (has_role(auth.uid(), 'admin') AND auth.uid() IS NOT NULL);

CREATE POLICY "Security configs - admin insert only" 
ON public.security_configs 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin') AND auth.uid() IS NOT NULL);

CREATE POLICY "Security configs - admin update only" 
ON public.security_configs 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin') AND auth.uid() IS NOT NULL)
WITH CHECK (has_role(auth.uid(), 'admin') AND auth.uid() IS NOT NULL);

CREATE POLICY "Security configs - admin delete only" 
ON public.security_configs 
FOR DELETE 
USING (has_role(auth.uid(), 'admin') AND auth.uid() IS NOT NULL);

-- 2. USER SESSIONS TABLE - Already restricted to service role, but add user context validation
DROP POLICY IF EXISTS "Service role only access to sessions" ON public.user_sessions;

-- Create strict service-role-only policies with enhanced security
CREATE POLICY "User sessions - service role only" 
ON public.user_sessions 
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 3. SECURITY EVENTS TABLE - Restrict unauthenticated access
DROP POLICY IF EXISTS "Restricted security event logging" ON public.security_events;

-- Create stricter security events policies
CREATE POLICY "Security events - service role and authenticated admin insert" 
ON public.security_events 
FOR INSERT 
WITH CHECK (
  (current_setting('role', true) = 'service_role') OR 
  (has_role(auth.uid(), 'admin') AND auth.uid() IS NOT NULL)
);

-- 4. AUDIT LOGS TABLE - Restrict user access to own audit logs
DROP POLICY IF EXISTS "Users can view their own audit logs" ON public.audit_logs;

-- Create admin-only audit log access
CREATE POLICY "Audit logs - admin view only" 
ON public.audit_logs 
FOR SELECT 
USING (has_role(auth.uid(), 'admin') AND auth.uid() IS NOT NULL);

-- 5. Add audit logging trigger for encryption key access
CREATE OR REPLACE FUNCTION public.log_encryption_key_access()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.security_events (
    event_type,
    severity,
    event_data,
    source,
    ip_address
  ) VALUES (
    'encryption_key_accessed',
    'critical',
    jsonb_build_object(
      'operation', TG_OP,
      'key_identifier', COALESCE(NEW.key_identifier, OLD.key_identifier),
      'access_time', now(),
      'role', current_setting('role')
    ),
    'encryption_key_monitor',
    inet_client_addr()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply the trigger to encryption_keys table
DROP TRIGGER IF EXISTS encryption_key_access_audit ON public.encryption_keys;
CREATE TRIGGER encryption_key_access_audit
  AFTER SELECT OR INSERT OR UPDATE OR DELETE ON public.encryption_keys
  FOR EACH ROW EXECUTE FUNCTION public.log_encryption_key_access();

-- Log this critical security hardening
INSERT INTO public.security_events (
  event_type,
  severity,
  event_data,
  source
) VALUES (
  'critical_security_hardening_complete',
  'critical',
  jsonb_build_object(
    'action', 'Multi_table_security_hardening',
    'tables_secured', ARRAY['security_configs', 'user_sessions', 'security_events', 'audit_logs', 'encryption_keys'],
    'timestamp', now(),
    'security_impact', 'Critical - Prevents unauthorized access to sensitive security infrastructure'
  ),
  'security_migration'
);