-- Fix security linter warning: Function Search Path Mutable
-- Update function to have immutable search_path for security

-- Update the log_encryption_key_access function with proper search_path
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