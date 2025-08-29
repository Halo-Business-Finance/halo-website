-- Fix security warning: Function Search Path Mutable
-- Set search_path parameter for the log_encryption_key_access function

-- Update the function to set the search_path parameter for security
CREATE OR REPLACE FUNCTION public.log_encryption_key_access()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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

-- Log the security patch
INSERT INTO public.security_events (
  event_type,
  severity,
  event_data,
  source
) VALUES (
  'function_security_path_fixed',
  'info',
  jsonb_build_object(
    'action', 'Fixed function search_path security warning',
    'function_name', 'log_encryption_key_access',
    'timestamp', now()
  ),
  'security_migration'
);