-- Fix the search path security warning for the consultation function

CREATE OR REPLACE FUNCTION public.secure_consultation_data()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Enhanced logging for all consultation access
  IF TG_OP IN ('INSERT', 'UPDATE', 'DELETE') THEN
    INSERT INTO public.security_events (
      event_type, severity, user_id, ip_address, event_data, source
    ) VALUES (
      CASE TG_OP
        WHEN 'INSERT' THEN 'consultation_created'
        WHEN 'UPDATE' THEN 'consultation_modified'
        WHEN 'DELETE' THEN 'consultation_deleted'
      END,
      CASE TG_OP
        WHEN 'DELETE' THEN 'high'
        ELSE 'info'
      END,
      auth.uid(),
      inet_client_addr(),
      jsonb_build_object(
        'consultation_id', COALESCE(NEW.id, OLD.id),
        'operation', TG_OP,
        'loan_program', COALESCE(NEW.loan_program, OLD.loan_program),
        'timestamp', now()
      ),
      'database'
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;