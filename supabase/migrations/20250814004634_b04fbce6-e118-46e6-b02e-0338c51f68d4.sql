-- Fix the security definer view warning by removing security_barrier property
-- and implementing proper RLS policies instead

-- Drop and recreate the secure view without security_barrier
DROP VIEW IF EXISTS consultations_secure;

-- Create a new secure view that relies on RLS policies instead of security definer
CREATE VIEW consultations_secure AS
SELECT 
  id,
  CASE 
    WHEN has_role(auth.uid(), 'admin') THEN name
    WHEN auth.uid() = user_id THEN name
    ELSE mask_sensitive_data(name, 'name')
  END as name,
  CASE 
    WHEN has_role(auth.uid(), 'admin') THEN email
    WHEN auth.uid() = user_id THEN email  
    ELSE mask_sensitive_data(email, 'email')
  END as email,
  CASE 
    WHEN has_role(auth.uid(), 'admin') THEN phone
    WHEN auth.uid() = user_id THEN phone
    ELSE mask_sensitive_data(phone, 'phone')
  END as phone,
  CASE 
    WHEN has_role(auth.uid(), 'admin') THEN company
    WHEN auth.uid() = user_id THEN company
    ELSE '***REDACTED***'
  END as company,
  loan_program,
  CASE 
    WHEN has_role(auth.uid(), 'admin') THEN loan_amount
    WHEN auth.uid() = user_id THEN loan_amount
    ELSE 'CONFIDENTIAL'
  END as loan_amount,
  timeframe,
  CASE 
    WHEN has_role(auth.uid(), 'admin') THEN message
    WHEN auth.uid() = user_id THEN message
    ELSE 'CONFIDENTIAL'
  END as message,
  created_at,
  updated_at,
  status,
  user_id
FROM public.consultations;

-- Create an alternative secure function for sensitive data access
-- This is a better approach than a security definer view
CREATE OR REPLACE FUNCTION get_consultation_secure(consultation_id uuid)
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
  status text,
  user_id uuid
) AS $$
BEGIN
  -- Check if user has permission to access this consultation
  IF NOT (
    EXISTS(SELECT 1 FROM public.consultations c WHERE c.id = consultation_id AND c.user_id = auth.uid()) OR
    has_role(auth.uid(), 'admin') OR
    has_role(auth.uid(), 'moderator')
  ) THEN
    RAISE EXCEPTION 'Insufficient permissions to access consultation data';
  END IF;
  
  -- Log the secure access
  INSERT INTO public.security_events (
    event_type,
    severity,
    user_id,
    event_data,
    source
  ) VALUES (
    'secure_consultation_access',
    'medium',
    auth.uid(),
    jsonb_build_object(
      'consultation_id', consultation_id,
      'access_method', 'secure_function',
      'user_role', public.get_current_user_role()
    ),
    'secure_function'
  );
  
  -- Return the data based on user permissions
  RETURN QUERY
  SELECT 
    c.id,
    CASE 
      WHEN has_role(auth.uid(), 'admin') OR auth.uid() = c.user_id THEN c.name
      ELSE mask_sensitive_data(c.name, 'name')
    END as name,
    CASE 
      WHEN has_role(auth.uid(), 'admin') OR auth.uid() = c.user_id THEN c.email  
      ELSE mask_sensitive_data(c.email, 'email')
    END as email,
    CASE 
      WHEN has_role(auth.uid(), 'admin') OR auth.uid() = c.user_id THEN c.phone
      ELSE mask_sensitive_data(c.phone, 'phone')
    END as phone,
    CASE 
      WHEN has_role(auth.uid(), 'admin') OR auth.uid() = c.user_id THEN c.company
      ELSE '***REDACTED***'
    END as company,
    c.loan_program,
    CASE 
      WHEN has_role(auth.uid(), 'admin') OR auth.uid() = c.user_id THEN c.loan_amount
      ELSE 'CONFIDENTIAL'
    END as loan_amount,
    c.timeframe,
    CASE 
      WHEN has_role(auth.uid(), 'admin') OR auth.uid() = c.user_id THEN c.message
      ELSE 'CONFIDENTIAL'
    END as message,
    c.created_at,
    c.updated_at,
    c.status,
    c.user_id
  FROM public.consultations c
  WHERE c.id = consultation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';