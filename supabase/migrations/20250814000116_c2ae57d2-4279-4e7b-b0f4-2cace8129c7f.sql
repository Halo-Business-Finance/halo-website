-- Fix consultations table RLS policies (remove duplicates and enhance security)
DROP POLICY IF EXISTS "Admins can view all consultations" ON public.consultations;
DROP POLICY IF EXISTS "Only admins can view consultations" ON public.consultations;

-- Create single, clear admin-only SELECT policy
CREATE POLICY "Admins can view all consultations"
ON public.consultations
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add audit logging trigger for consultation access
CREATE OR REPLACE FUNCTION public.log_consultation_access()
RETURNS TRIGGER AS $$
BEGIN
  -- Log consultation submissions for security monitoring
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.security_events (
      event_type,
      severity,
      user_id,
      ip_address,
      event_data,
      source
    ) VALUES (
      'consultation_submitted',
      'info',
      auth.uid(),
      inet_client_addr(),
      jsonb_build_object(
        'consultation_id', NEW.id,
        'loan_program', NEW.loan_program,
        'loan_amount', NEW.loan_amount,
        'timestamp', NEW.created_at
      ),
      'database'
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for consultation submissions
CREATE TRIGGER log_consultation_submissions
  AFTER INSERT ON public.consultations
  FOR EACH ROW EXECUTE FUNCTION public.log_consultation_access();

-- Add data retention function for old consultations
CREATE OR REPLACE FUNCTION public.cleanup_old_consultations()
RETURNS INTEGER AS $$
DECLARE
  cleaned_count INTEGER;
  retention_days INTEGER := 365; -- 1 year retention
BEGIN
  -- Archive old consultations (move to audit before deletion in production)
  DELETE FROM public.consultations
  WHERE created_at < now() - (retention_days || ' days')::interval
    AND status = 'completed';
  
  GET DIAGNOSTICS cleaned_count = ROW_COUNT;
  
  -- Log cleanup activity
  INSERT INTO public.audit_logs (
    user_id,
    action,
    resource,
    new_values
  ) VALUES (
    NULL,
    'data_cleanup',
    'consultations',
    jsonb_build_object('cleaned_count', cleaned_count, 'retention_days', retention_days)
  );
  
  RETURN cleaned_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create rate limiting configuration for consultation submissions
INSERT INTO public.rate_limit_configs (endpoint, max_requests, window_seconds, block_duration_seconds)
VALUES ('consultation_submit', 5, 3600, 1800) -- 5 requests per hour, 30min block
ON CONFLICT (endpoint) DO UPDATE SET
  max_requests = EXCLUDED.max_requests,
  window_seconds = EXCLUDED.window_seconds,
  block_duration_seconds = EXCLUDED.block_duration_seconds,
  updated_at = now();

-- Create security alert configuration for unusual consultation patterns
INSERT INTO public.security_configs (config_key, config_value)
VALUES ('consultation_monitoring', jsonb_build_object(
  'max_submissions_per_ip_daily', 10,
  'alert_on_bulk_access', true,
  'monitor_admin_access', true,
  'data_retention_days', 365
))
ON CONFLICT (config_key) DO UPDATE SET
  config_value = EXCLUDED.config_value,
  updated_at = now();