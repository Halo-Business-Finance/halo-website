-- Fix security warnings: Set proper search paths for functions

-- Fix log_encryption_key_access function
CREATE OR REPLACE FUNCTION log_encryption_key_access()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path TO ''
AS $$
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
$$;

-- Fix audit_sensitive_data_access function
CREATE OR REPLACE FUNCTION audit_sensitive_data_access()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  IF TG_TABLE_NAME IN ('consultations', 'encryption_keys', 'security_events') THEN
    INSERT INTO public.security_access_audit (
      user_id,
      action,
      table_name,
      record_id,
      ip_address,
      risk_assessment
    ) VALUES (
      auth.uid(),
      TG_OP,
      TG_TABLE_NAME,
      COALESCE(NEW.id, OLD.id),
      inet_client_addr(),
      CASE TG_TABLE_NAME
        WHEN 'encryption_keys' THEN 'critical'
        WHEN 'security_events' THEN 'high'
        ELSE 'normal'
      END
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;