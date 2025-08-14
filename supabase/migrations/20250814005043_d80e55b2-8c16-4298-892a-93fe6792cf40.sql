-- Fix remaining security infrastructure issues
-- These are admin-only tables that need proper access restrictions

-- Fix security_configs table - make it admin-only accessible
DROP POLICY IF EXISTS "Admins can manage security configs" ON public.security_configs;

CREATE POLICY "Only admins can access security configs" ON public.security_configs
FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin') AND auth.uid() IS NOT NULL)
WITH CHECK (has_role(auth.uid(), 'admin') AND auth.uid() IS NOT NULL);

-- Fix rate_limit_configs table - make it admin-only accessible  
DROP POLICY IF EXISTS "Admins can manage rate limit configs" ON public.rate_limit_configs;

CREATE POLICY "Only admins can access rate limit configs" ON public.rate_limit_configs
FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin') AND auth.uid() IS NOT NULL)
WITH CHECK (has_role(auth.uid(), 'admin') AND auth.uid() IS NOT NULL);

-- Fix security_alerts table - make it admin/moderator only accessible
DROP POLICY IF EXISTS "Admins can manage all security alerts" ON public.security_alerts;
DROP POLICY IF EXISTS "Moderators can view security alerts" ON public.security_alerts;

CREATE POLICY "Only admins can manage security alerts" ON public.security_alerts
FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin') AND auth.uid() IS NOT NULL)
WITH CHECK (has_role(auth.uid(), 'admin') AND auth.uid() IS NOT NULL);

CREATE POLICY "Moderators can view security alerts" ON public.security_alerts
FOR SELECT TO authenticated
USING (
  (has_role(auth.uid(), 'moderator') OR has_role(auth.uid(), 'admin')) 
  AND auth.uid() IS NOT NULL
);

-- Add additional logging for security infrastructure access
CREATE OR REPLACE FUNCTION log_security_infrastructure_access()
RETURNS trigger AS $$
BEGIN
  -- Log access to security infrastructure tables
  INSERT INTO public.security_events (
    event_type,
    severity,
    user_id,
    ip_address,
    event_data,
    source
  ) VALUES (
    'security_infrastructure_access',
    'critical',
    auth.uid(),
    inet_client_addr(),
    jsonb_build_object(
      'table_name', TG_TABLE_NAME,
      'operation', TG_OP,
      'resource_id', COALESCE(NEW.id, OLD.id),
      'user_role', public.get_current_user_role(),
      'timestamp', now()
    ),
    'security_infrastructure'
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Create triggers for security infrastructure access logging
CREATE TRIGGER security_configs_access_trigger
  AFTER SELECT OR INSERT OR UPDATE OR DELETE ON public.security_configs
  FOR EACH ROW
  EXECUTE FUNCTION log_security_infrastructure_access();

CREATE TRIGGER rate_limit_configs_access_trigger
  AFTER SELECT OR INSERT OR UPDATE OR DELETE ON public.rate_limit_configs
  FOR EACH ROW
  EXECUTE FUNCTION log_security_infrastructure_access();

CREATE TRIGGER security_alerts_access_trigger
  AFTER SELECT OR INSERT OR UPDATE OR DELETE ON public.security_alerts
  FOR EACH ROW
  EXECUTE FUNCTION log_security_infrastructure_access();