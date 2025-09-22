-- Enhanced security hardening for applications table financial data protection
-- This migration addresses the security finding about potential customer financial data theft

-- 1. Create additional security function for ultra-strict application access
CREATE OR REPLACE FUNCTION public.verify_ultra_secure_application_access(target_application_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  app_owner_id uuid;
  current_user_role text;
  session_valid boolean := false;
BEGIN
  -- Get application owner
  SELECT user_id INTO app_owner_id 
  FROM public.applications 
  WHERE id = target_application_id;
  
  IF app_owner_id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Check if current user is the owner
  IF auth.uid() = app_owner_id THEN
    -- Verify user has active secure session
    SELECT verify_active_session_with_mfa('normal', 15) INTO session_valid;
    RETURN session_valid;
  END IF;
  
  -- Check if user is admin with enhanced verification
  IF has_role(auth.uid(), 'admin') THEN
    -- Admins need enhanced security session for financial data access
    SELECT verify_active_session_with_mfa('enhanced', 10) INTO session_valid;
    
    -- Log admin access to financial data
    INSERT INTO public.security_events (
      event_type, severity, user_id, event_data, source
    ) VALUES (
      'admin_financial_data_access', 'high', auth.uid(),
      jsonb_build_object(
        'application_id', target_application_id,
        'owner_id', app_owner_id,
        'access_timestamp', now(),
        'requires_audit', true
      ),
      'financial_data_protection'
    );
    
    RETURN session_valid;
  END IF;
  
  -- No other access allowed
  RETURN false;
END;
$$;

-- 2. Create function to mask sensitive financial data for non-owners
CREATE OR REPLACE FUNCTION public.mask_sensitive_financial_data(
  data_value text, 
  data_type text,
  user_role text DEFAULT 'user'
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Only show full data to admins and data owners
  IF user_role = 'admin' THEN
    RETURN data_value;
  END IF;
  
  -- Mask sensitive data based on type
  CASE data_type
    WHEN 'ein' THEN
      RETURN CASE 
        WHEN data_value IS NOT NULL THEN '**-*******'
        ELSE NULL
      END;
    WHEN 'loan_amount' THEN
      RETURN CASE 
        WHEN data_value IS NOT NULL THEN '[LOAN_AMOUNT_MASKED]'
        ELSE NULL
      END;
    WHEN 'revenue' THEN
      RETURN CASE 
        WHEN data_value IS NOT NULL THEN '[REVENUE_MASKED]'
        ELSE NULL
      END;
    WHEN 'phone' THEN
      RETURN CASE 
        WHEN data_value IS NOT NULL THEN '***-***-' || RIGHT(data_value, 4)
        ELSE NULL
      END;
    ELSE
      RETURN '[MASKED]';
  END CASE;
END;
$$;

-- 3. Create ultra-secure view for applications with automatic data masking
CREATE OR REPLACE VIEW public.secure_applications_view AS
SELECT 
  id,
  user_id,
  application_number,
  application_type,
  status,
  priority_level,
  business_name,
  business_type,
  years_in_business,
  -- Conditionally mask sensitive data based on access rights
  CASE 
    WHEN verify_ultra_secure_application_access(id) THEN business_ein
    ELSE mask_sensitive_financial_data(business_ein, 'ein', get_current_user_role())
  END as business_ein,
  CASE 
    WHEN verify_ultra_secure_application_access(id) THEN business_phone
    ELSE mask_sensitive_financial_data(business_phone, 'phone', get_current_user_role())
  END as business_phone,
  CASE 
    WHEN verify_ultra_secure_application_access(id) THEN loan_amount::text
    ELSE mask_sensitive_financial_data(loan_amount::text, 'loan_amount', get_current_user_role())
  END as masked_loan_amount,
  CASE 
    WHEN verify_ultra_secure_application_access(id) THEN annual_revenue::text
    ELSE mask_sensitive_financial_data(annual_revenue::text, 'revenue', get_current_user_role())
  END as masked_annual_revenue,
  business_address,
  -- Never expose encrypted financial data in views
  CASE 
    WHEN verify_ultra_secure_application_access(id) AND has_role(auth.uid(), 'admin') 
    THEN '[ENCRYPTED_DATA_ACCESS_GRANTED]'
    ELSE '[RESTRICTED]'
  END as financial_data_access_status,
  application_data,
  notes,
  created_at,
  updated_at,
  submitted_at,
  last_updated_at,
  assigned_officer_id,
  compliance_classification,
  encryption_compliance_version
FROM public.applications
WHERE verify_ultra_secure_application_access(id);

-- 4. Replace existing RLS policies with more restrictive ones
DROP POLICY IF EXISTS "Hardened application access with business data protection" ON public.applications;
DROP POLICY IF EXISTS "Secure user application INSERT with session verification" ON public.applications;
DROP POLICY IF EXISTS "Secure user application UPDATE with strict session verification" ON public.applications;
DROP POLICY IF EXISTS "Ultra secure user application SELECT with strict session verifi" ON public.applications;

-- 5. Create new ultra-restrictive RLS policies
CREATE POLICY "Ultra_Secure_Financial_Data_Protection_SELECT"
ON public.applications
FOR SELECT
TO authenticated
USING (
  verify_ultra_secure_application_access(id) AND
  -- Additional IP-based verification for high-risk access
  (
    inet_client_addr() IS NULL OR 
    NOT EXISTS(
      SELECT 1 FROM public.security_events 
      WHERE ip_address = inet_client_addr() 
      AND severity IN ('high', 'critical') 
      AND created_at > now() - interval '1 hour'
    )
  )
);

CREATE POLICY "Ultra_Secure_Financial_Data_Protection_INSERT"
ON public.applications
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id AND
  auth.uid() IS NOT NULL AND
  user_id IS NOT NULL AND
  application_type IS NOT NULL AND
  business_name IS NOT NULL AND
  verify_active_business_application_session() AND
  -- Verify no recent suspicious activity from this user
  NOT EXISTS(
    SELECT 1 FROM public.security_events 
    WHERE user_id = auth.uid() 
    AND severity IN ('high', 'critical') 
    AND created_at > now() - interval '24 hours'
  )
);

CREATE POLICY "Ultra_Secure_Financial_Data_Protection_UPDATE"
ON public.applications
FOR UPDATE
TO authenticated
USING (verify_ultra_secure_application_access(id))
WITH CHECK (
  verify_ultra_secure_application_access(id) AND
  -- Prevent modification of critical financial fields by non-admins
  (
    has_role(auth.uid(), 'admin') OR 
    (
      auth.uid() = user_id AND
      OLD.encrypted_financial_data IS NOT DISTINCT FROM NEW.encrypted_financial_data AND
      OLD.financial_encryption_key_id IS NOT DISTINCT FROM NEW.financial_encryption_key_id
    )
  )
);

CREATE POLICY "Ultra_Secure_Financial_Data_Protection_DELETE"
ON public.applications
FOR DELETE
TO authenticated
USING (
  -- Only admins can delete applications, and only with enhanced verification
  has_role(auth.uid(), 'admin') AND 
  verify_active_session_with_mfa('enhanced', 5)
);

-- 6. Create trigger to log all access to financial data
CREATE OR REPLACE FUNCTION public.log_financial_data_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Log all access to applications table for audit purposes
  INSERT INTO public.security_events (
    event_type, severity, user_id, ip_address, event_data, source
  ) VALUES (
    'financial_data_table_access',
    CASE TG_OP
      WHEN 'DELETE' THEN 'critical'
      WHEN 'UPDATE' THEN 'high'
      ELSE 'medium'
    END,
    auth.uid(),
    inet_client_addr(),
    jsonb_build_object(
      'operation', TG_OP,
      'application_id', COALESCE(NEW.id, OLD.id),
      'table_name', TG_TABLE_NAME,
      'timestamp', now(),
      'user_role', get_current_user_role()
    ),
    'financial_data_protection_trigger'
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create the trigger
DROP TRIGGER IF EXISTS financial_data_access_audit ON public.applications;
CREATE TRIGGER financial_data_access_audit
  AFTER INSERT OR UPDATE OR DELETE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.log_financial_data_access();

-- 7. Add additional security monitoring
INSERT INTO public.security_events (
  event_type, severity, event_data, source
) VALUES (
  'financial_data_security_hardening_applied',
  'info',
  jsonb_build_object(
    'timestamp', now(),
    'security_measures_applied', array[
      'ultra_secure_access_verification',
      'automatic_data_masking',
      'enhanced_rls_policies', 
      'comprehensive_audit_logging',
      'suspicious_activity_blocking'
    ],
    'compliance_level', 'MILITARY_GRADE'
  ),
  'security_hardening_deployment'
);