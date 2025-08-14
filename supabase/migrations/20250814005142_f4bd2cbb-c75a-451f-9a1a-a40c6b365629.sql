-- Fix the trigger syntax error - PostgreSQL triggers don't support SELECT events
-- Only log actual data modifications (INSERT, UPDATE, DELETE)

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
    'security_infrastructure_modified',
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

-- Create triggers for security infrastructure modification logging
CREATE TRIGGER security_configs_modify_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.security_configs
  FOR EACH ROW
  EXECUTE FUNCTION log_security_infrastructure_access();

CREATE TRIGGER rate_limit_configs_modify_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.rate_limit_configs
  FOR EACH ROW
  EXECUTE FUNCTION log_security_infrastructure_access();

CREATE TRIGGER security_alerts_modify_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.security_alerts
  FOR EACH ROW
  EXECUTE FUNCTION log_security_infrastructure_access();