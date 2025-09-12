-- Critical Security Fixes Migration (Final)
-- Drop existing function and recreate with proper security fixes

-- 1. Drop existing function and recreate
DROP FUNCTION IF EXISTS public.mask_sensitive_data(text, text);

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

-- 2. Enhanced Business Application Access Logging
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
      'contains_financial_data', true,
      'timestamp', now()
    ),
    'business_data_audit'
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- 3. Create trigger for business application access logging
DROP TRIGGER IF EXISTS audit_business_applications ON public.applications;
CREATE TRIGGER audit_business_applications
  AFTER INSERT OR UPDATE OR DELETE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.log_business_data_access();

-- 4. Enhanced Data Retention and Cleanup
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

-- 5. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT EXECUTE ON FUNCTION public.mask_sensitive_data(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_current_user_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.enforce_data_retention() TO service_role;

-- 6. Update security configuration
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