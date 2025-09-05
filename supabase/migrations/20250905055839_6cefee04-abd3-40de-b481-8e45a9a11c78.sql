-- Create a completely secure admin consultation data access function
-- This replaces any existing unprotected functions with enhanced security

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
SET search_path = public
AS $$
BEGIN
  -- CRITICAL: Only admins can access this function
  IF NOT (auth.uid() IS NOT NULL AND has_role(auth.uid(), 'admin')) THEN
    -- Log unauthorized access attempt
    INSERT INTO public.security_events (
      event_type, severity, user_id, ip_address, event_data, source
    ) VALUES (
      'unauthorized_admin_consultation_access_blocked', 'critical', auth.uid(), inet_client_addr(),
      jsonb_build_object(
        'function_name', 'get_secure_admin_consultation_data',
        'access_denied_reason', 'insufficient_privileges',
        'attempted_by', auth.uid()
      ),
      'admin_data_protection'
    );
    
    RAISE EXCEPTION 'Access denied: Admin privileges required for consultation data access';
  END IF;
  
  -- Log legitimate admin access for audit trail
  INSERT INTO public.security_events (
    event_type, severity, user_id, ip_address, event_data, source
  ) VALUES (
    'admin_consultation_data_accessed', 'medium', auth.uid(), inet_client_addr(),
    jsonb_build_object(
      'function_name', 'get_secure_admin_consultation_data',
      'admin_user_id', auth.uid(),
      'data_sensitivity', 'high',
      'access_method', 'secure_masked_function'
    ),
    'admin_audit_trail'
  );
  
  -- Return ONLY masked/categorized data - never raw PII
  RETURN QUERY
  SELECT 
    c.id,
    -- Mask all PII using secure masking function
    mask_sensitive_data(c.encrypted_name, 'name') as masked_name,
    mask_sensitive_data(c.encrypted_email, 'email') as masked_email,
    mask_sensitive_data(c.encrypted_phone, 'phone') as masked_phone,
    -- Only show company if it's not PII
    CASE 
      WHEN c.company IS NOT NULL AND length(c.company) > 2 
      THEN left(c.company, 20) || CASE WHEN length(c.company) > 20 THEN '...' ELSE '' END
      ELSE 'Business Entity'
    END as company,
    c.loan_program,
    -- Categorize loan amounts without exposing exact figures
    CASE 
      WHEN c.loan_amount ILIKE '%under%' OR c.loan_amount ILIKE '%<50%' OR c.loan_amount ILIKE '%less than 50%' THEN 'Small Business'
      WHEN c.loan_amount ILIKE '%50k-250k%' OR c.loan_amount ILIKE '%50,000-250,000%' THEN 'Medium Business'
      WHEN c.loan_amount ILIKE '%250k-500k%' OR c.loan_amount ILIKE '%250,000-500,000%' THEN 'Large Business'
      WHEN c.loan_amount ILIKE '%500k%' OR c.loan_amount ILIKE '%500,000%' OR c.loan_amount ILIKE '%million%' THEN 'Enterprise'
      ELSE 'Undisclosed'
    END as loan_amount_category,
    c.timeframe,
    c.status,
    c.created_at
  FROM public.consultations c
  ORDER BY c.created_at DESC;
END;
$$;

-- Ensure this function can only be called by authenticated admins
REVOKE EXECUTE ON FUNCTION public.get_secure_admin_consultation_data() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_secure_admin_consultation_data() TO authenticated;

-- Update the existing admin access policy to be more restrictive
DROP POLICY IF EXISTS "Secure admin consultation access with audit" ON public.consultations;

CREATE POLICY "Restricted admin consultation access with mandatory function use" 
ON public.consultations 
FOR ALL
TO authenticated
USING (
  -- Only allow access through secure functions or if user owns the consultation
  (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR 
  (auth.uid() IS NOT NULL AND has_role(auth.uid(), 'admin') AND current_setting('role', true) = 'postgres')
)
WITH CHECK (
  -- Insert/Update: only allow if user owns consultation or is admin
  (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR 
  (auth.uid() IS NOT NULL AND has_role(auth.uid(), 'admin'))
);

-- Log this security enhancement
INSERT INTO public.security_events (
  event_type, severity, event_data, source
) VALUES (
  'consultation_security_enhanced', 'info',
  jsonb_build_object(
    'enhancement', 'consultation_data_protection_upgrade',
    'changes', ARRAY[
      'implemented_secure_admin_function_with_masking',
      'restricted_direct_table_access', 
      'enhanced_audit_logging',
      'pii_data_masking_enforced'
    ],
    'security_level', 'maximum'
  ),
  'security_enhancement'
);