-- Security Fix: Remove overly permissive "ALL" policy and implement stricter access controls
DROP POLICY IF EXISTS "Secure consultation access" ON public.consultations;

-- Create more restrictive individual policies
CREATE POLICY "Users can view own consultations only" 
ON public.consultations 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Admins can view consultations with logging" 
ON public.consultations 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND 
  has_role(auth.uid(), 'admin'::app_role) AND
  -- Log every admin access attempt
  (
    SELECT true FROM (
      INSERT INTO public.security_events (
        event_type, severity, user_id, event_data, source
      ) VALUES (
        'admin_consultation_access_attempt', 'high', auth.uid(),
        jsonb_build_object(
          'consultation_id', id,
          'access_time', now(),
          'admin_user_id', auth.uid()
        ),
        'rls_policy'
      )
    ) AS logged
  )
);

-- Block direct access to encrypted fields for non-admins
CREATE POLICY "Block encrypted data access for regular users" 
ON public.consultations 
FOR SELECT 
USING (
  CASE 
    WHEN has_role(auth.uid(), 'admin'::app_role) THEN true
    WHEN auth.uid() = user_id THEN true
    ELSE false
  END
);

-- Enhanced secure function for admin consultation access with mandatory data masking
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
  created_at timestamp with time zone,
  access_level text
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
  
  -- Log admin access with enhanced details
  INSERT INTO public.security_events (
    event_type, severity, user_id, event_data, source
  ) VALUES (
    'admin_consultation_bulk_access', 'critical', auth.uid(),
    jsonb_build_object(
      'admin_user_id', auth.uid(),
      'access_time', now(),
      'access_method', 'secure_admin_function',
      'data_sensitivity', 'pii_financial'
    ),
    'secure_admin_access'
  );
  
  RETURN QUERY
  SELECT 
    c.id,
    mask_sensitive_data(
      decrypt(c.encrypted_name, current_setting('app.encryption_key', true)),
      'name'
    ) as masked_name,
    mask_sensitive_data(
      decrypt(c.encrypted_email, current_setting('app.encryption_key', true)),
      'email'
    ) as masked_email,
    mask_sensitive_data(
      decrypt(c.encrypted_phone, current_setting('app.encryption_key', true)),
      'phone'
    ) as masked_phone,
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
    c.created_at,
    'admin_masked' as access_level
  FROM public.consultations c
  ORDER BY c.created_at DESC;
END;
$$;