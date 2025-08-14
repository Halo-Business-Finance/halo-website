-- Remove the consultations_secure view entirely to resolve security definer warning
-- The secure function approach is more appropriate for sensitive data access

DROP VIEW IF EXISTS consultations_secure;

-- Add additional secure access functions for different use cases
CREATE OR REPLACE FUNCTION get_consultations_list_secure()
RETURNS TABLE (
  id uuid,
  name text,
  email text,
  loan_program text,
  loan_amount text,
  status text,
  created_at timestamptz,
  user_id uuid
) AS $$
BEGIN
  -- Only admins and moderators can list consultations
  IF NOT (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'moderator')) THEN
    RAISE EXCEPTION 'Insufficient permissions to list consultation data';
  END IF;
  
  -- Log the access
  INSERT INTO public.security_events (
    event_type,
    severity,
    user_id,
    event_data,
    source
  ) VALUES (
    'consultation_list_accessed',
    'high',
    auth.uid(),
    jsonb_build_object(
      'access_method', 'secure_list_function',
      'user_role', public.get_current_user_role()
    ),
    'secure_function'
  );
  
  -- Return masked data for moderators, full data for admins
  RETURN QUERY
  SELECT 
    c.id,
    CASE 
      WHEN has_role(auth.uid(), 'admin') THEN c.name
      ELSE mask_sensitive_data(c.name, 'name')
    END as name,
    CASE 
      WHEN has_role(auth.uid(), 'admin') THEN c.email  
      ELSE mask_sensitive_data(c.email, 'email')
    END as email,
    c.loan_program,
    CASE 
      WHEN has_role(auth.uid(), 'admin') THEN c.loan_amount
      ELSE 'CONFIDENTIAL'
    END as loan_amount,
    c.status,
    c.created_at,
    c.user_id
  FROM public.consultations c
  ORDER BY c.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Create function for users to get their own consultation data
CREATE OR REPLACE FUNCTION get_my_consultations()
RETURNS TABLE (
  id uuid,
  name text,
  email text,
  phone text,
  company text,
  loan_program text,
  loan_amount text,
  timeframe text,
  message text,
  created_at timestamptz,
  updated_at timestamptz,
  status text
) AS $$
BEGIN
  -- Only authenticated users can access their own data
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Return only the user's own consultations
  RETURN QUERY
  SELECT 
    c.id,
    c.name,
    c.email,
    c.phone,
    c.company,
    c.loan_program,
    c.loan_amount,
    c.timeframe,
    c.message,
    c.created_at,
    c.updated_at,
    c.status
  FROM public.consultations c
  WHERE c.user_id = auth.uid()
  ORDER BY c.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Create additional security constraints
-- Ensure email addresses are properly formatted and not duplicated frequently
CREATE OR REPLACE FUNCTION prevent_consultation_spam()
RETURNS trigger AS $$
DECLARE
  recent_count integer;
BEGIN
  -- Check for spam submissions (same email/user within 1 hour)
  SELECT COUNT(*) INTO recent_count
  FROM public.consultations
  WHERE (email = NEW.email OR user_id = NEW.user_id)
    AND created_at > now() - interval '1 hour'
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid);
  
  IF recent_count >= 3 THEN
    -- Log potential spam attempt
    INSERT INTO public.security_events (
      event_type,
      severity,
      user_id,
      event_data,
      source
    ) VALUES (
      'potential_spam_consultation',
      'high',
      auth.uid(),
      jsonb_build_object(
        'email', NEW.email,
        'user_id', NEW.user_id,
        'recent_submissions', recent_count
      ),
      'spam_prevention'
    );
    
    RAISE EXCEPTION 'Too many consultation requests. Please wait before submitting another request.';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Create trigger for spam prevention
CREATE TRIGGER prevent_consultation_spam_trigger
  BEFORE INSERT ON public.consultations
  FOR EACH ROW
  EXECUTE FUNCTION prevent_consultation_spam();