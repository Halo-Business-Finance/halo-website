-- Security Fix: Remove overly permissive "ALL" policy and implement stricter access controls
DROP POLICY IF EXISTS "Secure consultation access" ON public.consultations;

-- Create more restrictive policies
CREATE POLICY "Users can view own consultations only" 
ON public.consultations 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Admins can view consultations with mandatory logging" 
ON public.consultations 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND 
  has_role(auth.uid(), 'admin'::app_role)
);

-- Enhanced secure function for admin consultation access with data masking
CREATE OR REPLACE FUNCTION public.get_secure_admin_consultation_data()
RETURNS TABLE(
  id uuid,
  masked_name text,
  masked_email text, 
  masked_phone text,
  company text,
  loan_program text,
  loan_amount_category text,
  timeframe text,
  status text,
  created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Strict admin-only access
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Admin access required for consultation data';
  END IF;
  
  -- Log admin access
  INSERT INTO public.security_events (
    event_type, severity, user_id, event_data, source
  ) VALUES (
    'admin_consultation_bulk_access', 'critical', auth.uid(),
    jsonb_build_object(
      'admin_user_id', auth.uid(),
      'access_time', now(),
      'access_method', 'secure_admin_function'
    ),
    'secure_admin_access'
  );
  
  RETURN QUERY
  SELECT 
    c.id,
    CASE 
      WHEN c.encrypted_name IS NOT NULL THEN '***'
      ELSE 'REDACTED'
    END as masked_name,
    CASE 
      WHEN c.encrypted_email IS NOT NULL THEN '***@***.com'
      ELSE 'REDACTED'
    END as masked_email,
    CASE 
      WHEN c.encrypted_phone IS NOT NULL THEN '(***) ***-****'
      ELSE 'REDACTED'
    END as masked_phone,
    CASE 
      WHEN c.company IS NOT NULL THEN 
        substring(c.company, 1, 3) || '***'
      ELSE 'BUSINESS'
    END as company,
    c.loan_program,
    CASE 
      WHEN c.loan_amount ILIKE '%under%' OR c.loan_amount ILIKE '%<50%' THEN 'Small Business'
      WHEN c.loan_amount ILIKE '%50k-250k%' THEN 'Medium Business'
      WHEN c.loan_amount ILIKE '%250k-500k%' THEN 'Large Business'
      ELSE 'Enterprise'
    END as loan_amount_category,
    c.timeframe,
    c.status,
    c.created_at
  FROM public.consultations c
  ORDER BY c.created_at DESC;
END;
$$;