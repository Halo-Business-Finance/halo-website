-- CRITICAL SECURITY FIX: Harden remaining security-sensitive tables
-- Address vulnerabilities in security_configs, user_sessions, security_events, and audit_logs

-- 1. SECURITY CONFIGS TABLE - Drop ALL existing policies first
DO $$ 
DECLARE
    pol_name text;
BEGIN
    FOR pol_name IN 
        SELECT policyname FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'security_configs'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || pol_name || '" ON public.security_configs';
    END LOOP;
END $$;

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

-- 2. USER SESSIONS TABLE - Drop existing policies
DO $$ 
DECLARE
    pol_name text;
BEGIN
    FOR pol_name IN 
        SELECT policyname FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'user_sessions'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || pol_name || '" ON public.user_sessions';
    END LOOP;
END $$;

-- Create strict service-role-only policies
CREATE POLICY "User sessions - service role only" 
ON public.user_sessions 
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 3. SECURITY EVENTS TABLE - Drop existing policies
DO $$ 
DECLARE
    pol_name text;
BEGIN
    FOR pol_name IN 
        SELECT policyname FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'security_events'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || pol_name || '" ON public.security_events';
    END LOOP;
END $$;

-- Create stricter security events policies
CREATE POLICY "Security events - service role insert only" 
ON public.security_events 
FOR INSERT 
WITH CHECK (current_setting('role', true) = 'service_role');

CREATE POLICY "Security events - admin select only" 
ON public.security_events 
FOR SELECT 
USING (has_role(auth.uid(), 'admin') AND auth.uid() IS NOT NULL);

-- 4. AUDIT LOGS TABLE - Drop existing policies
DO $$ 
DECLARE
    pol_name text;
BEGIN
    FOR pol_name IN 
        SELECT policyname FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'audit_logs'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || pol_name || '" ON public.audit_logs';
    END LOOP;
END $$;

-- Create admin-only audit log access
CREATE POLICY "Audit logs - admin view only" 
ON public.audit_logs 
FOR SELECT 
USING (has_role(auth.uid(), 'admin') AND auth.uid() IS NOT NULL);

CREATE POLICY "Audit logs - service role insert only" 
ON public.audit_logs 
FOR INSERT 
WITH CHECK (current_setting('role', true) = 'service_role');

-- 5. Add audit logging function for encryption key access
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
  AFTER INSERT OR UPDATE OR DELETE ON public.encryption_keys
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