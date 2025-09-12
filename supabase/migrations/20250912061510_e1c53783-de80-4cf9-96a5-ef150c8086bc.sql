-- Critical Security Fixes Migration (Fixed)
-- Priority 1: Business Data Protection & Customer PII Safeguards

-- 1. Enhanced Business Application Data Protection
CREATE OR REPLACE FUNCTION public.mask_sensitive_data(data_value text, data_type text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  IF data_value IS NULL THEN
    RETURN '***NULL***';
  END IF;
  
  CASE data_type
    WHEN 'email' THEN
      RETURN CASE 
        WHEN data_value LIKE '%@%' THEN 
          split_part(data_value, '@', 1)::text || '***@' || split_part(split_part(data_value, '@', 2), '.', 1) || '.***'
        ELSE '***EMAIL***'
      END;
    WHEN 'phone' THEN
      RETURN CASE 
        WHEN length(data_value) >= 10 THEN left(data_value, 3) || '-***-' || right(data_value, 4)
        ELSE '***PHONE***'
      END;
    WHEN 'name' THEN
      RETURN CASE 
        WHEN length(data_value) > 2 THEN left(data_value, 1) || repeat('*', length(data_value) - 2) || right(data_value, 1)
        ELSE '***'
      END;
    WHEN 'ssn' THEN
      RETURN '***-**-' || right(data_value, 4);
    WHEN 'ein' THEN
      RETURN '**-***' || right(data_value, 4);
    ELSE '***REDACTED***'
  END;
END;
$$;

-- 2. Enhanced Business Application Access Logging (INSERT/UPDATE/DELETE only)
CREATE OR REPLACE FUNCTION public.log_business_data_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- Log business application data modifications
  INSERT INTO public.security_events (
    event_type,
    severity,
    user_id,
    ip_address,
    event_data,
    source
  ) VALUES (
    CASE TG_OP
      WHEN 'INSERT' THEN 'business_data_created'
      WHEN 'UPDATE' THEN 'business_data_modified'
      WHEN 'DELETE' THEN 'business_data_deleted'
    END,
    CASE TG_OP
      WHEN 'DELETE' THEN 'critical'
      WHEN 'UPDATE' THEN 'high'
      ELSE 'medium'
    END,
    auth.uid(),
    inet_client_addr(),
    jsonb_build_object(
      'application_id', COALESCE(NEW.id, OLD.id),
      'operation', TG_OP,
      'user_role', 'user', -- Will be updated by function
      'contains_financial_data', true,
      'timestamp', now()
    ),
    'business_data_audit'
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- 3. Create trigger for business application access logging (no SELECT)
DROP TRIGGER IF EXISTS audit_business_applications ON public.applications;
CREATE TRIGGER audit_business_applications
  AFTER INSERT OR UPDATE OR DELETE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.log_business_data_access();

-- 4. Enhanced Customer Data Protection with Better Masking
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path TO ''
AS $$
  SELECT COALESCE(
    (SELECT role::text FROM public.user_roles 
     WHERE user_id = auth.uid() AND is_active = true 
     ORDER BY granted_at DESC LIMIT 1),
    'user'
  );
$$;

-- 5. Enhanced Data Retention and Cleanup
CREATE OR REPLACE FUNCTION public.enforce_data_retention()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  consultation_retention_years INTEGER := 7; -- Legal requirement
  application_retention_years INTEGER := 10; -- Business requirement
  security_event_retention_days INTEGER := 365; -- 1 year
  cleaned_count INTEGER := 0;
  temp_count INTEGER;
BEGIN
  -- Archive old consultations (keep for legal compliance)
  UPDATE public.consultations
  SET status = 'archived'
  WHERE created_at < now() - (consultation_retention_years || ' years')::interval
    AND status NOT IN ('archived', 'legal_hold');
  
  GET DIAGNOSTICS temp_count = ROW_COUNT;
  cleaned_count := cleaned_count + temp_count;
  
  -- Archive old applications
  UPDATE public.applications
  SET status = 'archived'
  WHERE created_at < now() - (application_retention_years || ' years')::interval
    AND status NOT IN ('archived', 'legal_hold', 'approved', 'active');
  
  GET DIAGNOSTICS temp_count = ROW_COUNT;
  cleaned_count := cleaned_count + temp_count;
  
  -- Clean old security events (keep critical ones longer)
  DELETE FROM public.security_events
  WHERE created_at < now() - (security_event_retention_days || ' days')::interval
    AND severity NOT IN ('critical', 'high')
    AND resolved_at IS NOT NULL;
  
  GET DIAGNOSTICS temp_count = ROW_COUNT;
  cleaned_count := cleaned_count + temp_count;
  
  -- Log retention enforcement
  INSERT INTO public.security_events (
    event_type, severity, event_data, source
  ) VALUES (
    'data_retention_enforced', 'info',
    jsonb_build_object(
      'cleaned_records', cleaned_count,
      'consultation_retention_years', consultation_retention_years,
      'application_retention_years', application_retention_years,
      'enforcement_date', now()
    ),
    'data_retention_policy'
  );
  
  RETURN cleaned_count;
END;
$$;

-- 6. Secure Financial Data Access Function
CREATE OR REPLACE FUNCTION public.get_secure_application_data(
  application_id uuid,
  access_level text DEFAULT 'summary'
)
RETURNS TABLE(
  id uuid,
  application_number text,
  masked_business_name text,
  masked_business_ein text,
  loan_amount_category text,
  application_type text,
  status text,
  created_at timestamp with time zone,
  user_access_level text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  caller_role text;
  access_granted boolean := false;
BEGIN
  -- Get caller's role
  SELECT public.get_current_user_role() INTO caller_role;
  
  -- Determine access permissions
  access_granted := (
    caller_role = 'admin' OR 
    (caller_role = 'moderator' AND access_level != 'full') OR
    (auth.uid() IS NOT NULL AND EXISTS(
      SELECT 1 FROM public.applications a 
      WHERE a.id = application_id AND a.user_id = auth.uid()
    ))
  );
  
  IF NOT access_granted THEN
    -- Log unauthorized access attempt
    INSERT INTO public.security_events (
      event_type, severity, user_id, event_data, source
    ) VALUES (
      'unauthorized_financial_data_access', 'critical', auth.uid(),
      jsonb_build_object(
        'application_id', application_id,
        'requested_access_level', access_level,
        'caller_role', caller_role
      ),
      'financial_data_protection'
    );
    
    RAISE EXCEPTION 'Unauthorized access to financial application data';
  END IF;
  
  -- Log authorized access
  INSERT INTO public.security_events (
    event_type, severity, user_id, event_data, source
  ) VALUES (
    'authorized_financial_data_access', 'medium', auth.uid(),
    jsonb_build_object(
      'application_id', application_id,
      'access_level', access_level,
      'caller_role', caller_role
    ),
    'financial_data_protection'
  );
  
  -- Return data with appropriate masking
  RETURN QUERY
  SELECT 
    a.id,
    a.application_number,
    CASE 
      WHEN caller_role = 'admin' AND access_level = 'full' THEN a.business_name
      WHEN caller_role = 'admin' THEN public.mask_sensitive_data(a.business_name, 'name')
      ELSE 'BUSINESS ENTITY'
    END as masked_business_name,
    CASE 
      WHEN caller_role = 'admin' AND access_level = 'full' THEN a.business_ein
      WHEN caller_role = 'admin' THEN public.mask_sensitive_data(a.business_ein, 'ein')
      ELSE '**-*******'
    END as masked_business_ein,
    CASE 
      WHEN caller_role = 'admin' THEN 
        CASE 
          WHEN a.loan_amount < 100000 THEN 'Under $100K'
          WHEN a.loan_amount < 500000 THEN '$100K - $500K'
          WHEN a.loan_amount < 1000000 THEN '$500K - $1M'
          ELSE 'Over $1M'
        END
      ELSE 'CONFIDENTIAL'
    END as loan_amount_category,
    a.application_type,
    a.status,
    a.created_at,
    CASE 
      WHEN caller_role = 'admin' THEN 'full_admin_access'
      WHEN caller_role = 'moderator' THEN 'limited_staff_access'
      ELSE 'owner_only_access'
    END as user_access_level
  FROM public.applications a
  WHERE a.id = application_id;
END;
$$;

-- 7. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT EXECUTE ON FUNCTION public.mask_sensitive_data(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_current_user_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_secure_application_data(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.enforce_data_retention() TO service_role;

-- 8. Update security configuration
INSERT INTO public.security_configs (config_key, config_value, is_active) 
VALUES (
  'data_protection_policy',
  jsonb_build_object(
    'financial_data_classification', 'highly_sensitive',
    'pii_data_classification', 'sensitive', 
    'access_logging_enabled', true,
    'data_masking_enabled', true,
    'retention_policy_active', true,
    'last_updated', now()
  ),
  true
) ON CONFLICT (config_key) DO UPDATE SET
  config_value = EXCLUDED.config_value,
  updated_at = now();