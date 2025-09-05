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

-- Remove any overly permissive direct table access policies
DROP POLICY IF EXISTS "Secure admin consultation access with audit" ON public.consultations;

-- Create a more restrictive admin policy that requires explicit authorization context
CREATE POLICY "Restricted admin consultation access with context verification" 
ON public.consultations 
FOR ALL
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND has_role(auth.uid(), 'admin') 
  AND (
    -- Allow access only through our secure function or with explicit context
    current_setting('app.secure_admin_access', true) = 'authorized'
    OR current_setting('app.trigger_context', true) = 'system_operation'
  )
)
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND has_role(auth.uid(), 'admin')
);

-- Create a safer table for consultation analytics that contains no PII
CREATE TABLE IF NOT EXISTS public.consultation_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id uuid REFERENCES public.consultations(id) ON DELETE CASCADE,
  loan_program text NOT NULL,
  loan_size_category text NOT NULL,
  timeframe_category text NOT NULL,
  status text NOT NULL,
  created_date date NOT NULL,
  created_hour integer NOT NULL,
  region_code text, -- Geographic region, not specific location
  industry_category text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on analytics table
ALTER TABLE public.consultation_analytics ENABLE ROW LEVEL SECURITY;

-- Admin-only access to analytics
CREATE POLICY "Admin only consultation analytics access" 
ON public.consultation_analytics 
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Service role access for automated processes
CREATE POLICY "Service role consultation analytics access" 
ON public.consultation_analytics 
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Create trigger to automatically populate analytics table (without PII)
CREATE OR REPLACE FUNCTION public.populate_consultation_analytics()
RETURNS TRIGGER AS $$
BEGIN
  -- Only populate analytics on INSERT of new consultations
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.consultation_analytics (
      consultation_id,
      loan_program,
      loan_size_category,
      timeframe_category,
      status,
      created_date,
      created_hour
    ) VALUES (
      NEW.id,
      NEW.loan_program,
      CASE 
        WHEN NEW.loan_amount ILIKE '%under%' OR NEW.loan_amount ILIKE '%<50%' THEN 'small'
        WHEN NEW.loan_amount ILIKE '%50k-250k%' THEN 'medium' 
        WHEN NEW.loan_amount ILIKE '%250k-500k%' THEN 'large'
        ELSE 'enterprise'
      END,
      CASE 
        WHEN NEW.timeframe ILIKE '%immediate%' OR NEW.timeframe ILIKE '%asap%' THEN 'urgent'
        WHEN NEW.timeframe ILIKE '%30 days%' OR NEW.timeframe ILIKE '%month%' THEN 'short_term'
        WHEN NEW.timeframe ILIKE '%90 days%' OR NEW.timeframe ILIKE '%quarter%' THEN 'medium_term'
        ELSE 'long_term'
      END,
      NEW.status,
      DATE(NEW.created_at),
      EXTRACT(hour FROM NEW.created_at)::integer
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for analytics population
DROP TRIGGER IF EXISTS consultation_analytics_trigger ON public.consultations;
CREATE TRIGGER consultation_analytics_trigger
  AFTER INSERT ON public.consultations
  FOR EACH ROW EXECUTE FUNCTION public.populate_consultation_analytics();

-- Update the secure admin function to set the required context
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
  
  -- Set secure access context
  PERFORM set_config('app.secure_admin_access', 'authorized', true);
  
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
    mask_sensitive_data(c.encrypted_name, 'name') as masked_name,
    mask_sensitive_data(c.encrypted_email, 'email') as masked_email,
    mask_sensitive_data(c.encrypted_phone, 'phone') as masked_phone,
    CASE 
      WHEN c.company IS NOT NULL AND length(c.company) > 2 
      THEN left(c.company, 20) || CASE WHEN length(c.company) > 20 THEN '...' ELSE '' END
      ELSE 'Business Entity'
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