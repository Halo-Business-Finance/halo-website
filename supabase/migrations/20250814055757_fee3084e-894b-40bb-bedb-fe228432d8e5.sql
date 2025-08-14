-- Fix the function parameter conflict and create enhanced database-level PII protection

-- Drop existing function first
DROP FUNCTION IF EXISTS public.mask_sensitive_data(text, text);

-- Create function to mask sensitive data for display
CREATE OR REPLACE FUNCTION public.mask_sensitive_data(data_text text, data_type text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  IF data_text IS NULL OR data_text = '' THEN
    RETURN data_text;
  END IF;
  
  CASE data_type
    WHEN 'email' THEN
      -- Mask email: j***@e***e.com
      RETURN substring(data_text, 1, 1) || '***@' || 
             substring(split_part(data_text, '@', 2), 1, 1) || '***' ||
             substring(split_part(data_text, '@', 2) from '\.(.+)$');
    WHEN 'phone' THEN
      -- Mask phone: (***) ***-1234
      RETURN '(***) ***-' || right(regexp_replace(data_text, '[^\d]', '', 'g'), 4);
    WHEN 'name' THEN
      -- Mask name: J*** D***
      RETURN substring(data_text, 1, 1) || '***' || 
             CASE WHEN position(' ' in data_text) > 0 
                  THEN ' ' || substring(split_part(data_text, ' ', 2), 1, 1) || '***'
                  ELSE ''
             END;
    ELSE
      RETURN '***REDACTED***';
  END CASE;
END;
$$;

-- Enhanced consultation validation trigger to prevent user_id manipulation
CREATE OR REPLACE FUNCTION public.validate_consultation_security()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- Ensure user_id is not null and matches authenticated user
  IF NEW.user_id IS NULL THEN
    RAISE EXCEPTION 'user_id cannot be null for consultation submissions';
  END IF;
  
  -- Critical: Prevent user_id manipulation by ensuring it matches auth.uid()
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required for consultation submission';
  END IF;
  
  IF NEW.user_id != auth.uid() THEN
    -- Log security violation attempt
    INSERT INTO public.security_events (
      event_type, severity, user_id, ip_address, event_data, source
    ) VALUES (
      'consultation_user_id_manipulation_attempt', 'critical', auth.uid(), inet_client_addr(),
      jsonb_build_object(
        'attempted_user_id', NEW.user_id,
        'actual_user_id', auth.uid(),
        'consultation_data', jsonb_build_object(
          'loan_program', NEW.loan_program,
          'company', NEW.company
        )
      ),
      'database_trigger'
    );
    
    RAISE EXCEPTION 'Security violation: user_id manipulation detected';
  END IF;
  
  -- Validate encrypted fields contain encrypted data (basic check)
  IF NEW.encrypted_name IS NOT NULL AND length(NEW.encrypted_name) < 10 THEN
    RAISE EXCEPTION 'Invalid encrypted name format';
  END IF;
  
  IF NEW.encrypted_email IS NOT NULL AND length(NEW.encrypted_email) < 10 THEN
    RAISE EXCEPTION 'Invalid encrypted email format';
  END IF;
  
  -- Set user_id to authenticated user (defensive programming)
  NEW.user_id := auth.uid();
  
  RETURN NEW;
END;
$$;

-- Create or replace the trigger
DROP TRIGGER IF EXISTS validate_consultation_security_trigger ON public.consultations;
CREATE TRIGGER validate_consultation_security_trigger
  BEFORE INSERT OR UPDATE ON public.consultations
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_consultation_security();