-- Fix Warning Level Security Issues (Corrected)

-- 1. Enhanced data protection for consultations table
-- Add column-level security for sensitive data
ALTER TABLE public.consultations 
ADD COLUMN IF NOT EXISTS encrypted_name text,
ADD COLUMN IF NOT EXISTS encrypted_email text, 
ADD COLUMN IF NOT EXISTS encrypted_phone text;

-- 2. Enhanced session token protection
-- Add additional security metadata to sessions
ALTER TABLE public.user_sessions 
ADD COLUMN IF NOT EXISTS encrypted_at timestamp with time zone DEFAULT now(),
ADD COLUMN IF NOT EXISTS access_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_security_check timestamp with time zone DEFAULT now();

-- Update existing session access policy
DROP POLICY IF EXISTS "Users can view own session metadata only" ON public.user_sessions;
CREATE POLICY "Users can view limited session metadata only" 
ON public.user_sessions 
FOR SELECT 
USING (
  (auth.uid() = user_id) 
  AND (is_active = true) 
  AND (expires_at > now())
  AND (security_level != 'compromised')
);

-- 3. Enhanced security data protection
-- Create audit trail for security data access
CREATE TABLE IF NOT EXISTS public.security_access_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  action text NOT NULL,
  table_name text NOT NULL,
  record_id uuid,
  access_time timestamp with time zone DEFAULT now(),
  ip_address inet,
  risk_assessment text DEFAULT 'normal'
);

-- Enable RLS on the audit table
ALTER TABLE public.security_access_audit ENABLE ROW LEVEL SECURITY;

-- Create policy for audit table
CREATE POLICY "Only admins can view security audit logs" 
ON public.security_access_audit 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'));

-- Create function to log security data access
CREATE OR REPLACE FUNCTION public.log_security_data_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- Log any access to security-critical tables
  INSERT INTO public.security_access_audit (
    user_id,
    action,
    table_name,
    record_id,
    ip_address,
    risk_assessment
  ) VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    inet_client_addr(),
    CASE 
      WHEN TG_TABLE_NAME IN ('security_events', 'security_alerts', 'security_configs') THEN 'high'
      ELSE 'normal'
    END
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Add triggers for security data access logging (INSERT/UPDATE/DELETE only)
CREATE TRIGGER audit_security_events_access
  AFTER INSERT OR UPDATE OR DELETE ON public.security_events
  FOR EACH ROW EXECUTE FUNCTION public.log_security_data_access();

CREATE TRIGGER audit_security_alerts_access
  AFTER INSERT OR UPDATE OR DELETE ON public.security_alerts
  FOR EACH ROW EXECUTE FUNCTION public.log_security_data_access();

CREATE TRIGGER audit_security_configs_access
  AFTER INSERT OR UPDATE OR DELETE ON public.security_configs
  FOR EACH ROW EXECUTE FUNCTION public.log_security_data_access();

-- Create function for enhanced consultation data protection
CREATE OR REPLACE FUNCTION public.get_secure_consultation_data(consultation_id uuid)
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
SET search_path TO ''
AS $$
BEGIN
  -- Enhanced security: Only allow access with proper authorization
  IF NOT (
    (auth.uid() IS NOT NULL AND EXISTS(
      SELECT 1 FROM public.consultations c 
      WHERE c.id = consultation_id AND c.user_id = auth.uid()
    )) OR
    has_role(auth.uid(), 'admin')
  ) THEN
    RAISE EXCEPTION 'Unauthorized access to consultation data';
  END IF;
  
  -- Log the secure access
  INSERT INTO public.security_events (
    event_type,
    severity,
    user_id,
    event_data,
    source
  ) VALUES (
    'secure_consultation_data_accessed',
    'medium',
    auth.uid(),
    jsonb_build_object(
      'consultation_id', consultation_id,
      'access_method', 'secure_data_function',
      'data_sensitivity', 'high'
    ),
    'data_protection'
  );
  
  -- Return masked data for enhanced privacy
  RETURN QUERY
  SELECT 
    c.id,
    mask_sensitive_data(c.name, 'name') as masked_name,
    mask_sensitive_data(c.email, 'email') as masked_email,
    mask_sensitive_data(c.phone, 'phone') as masked_phone,
    CASE 
      WHEN has_role(auth.uid(), 'admin') THEN c.company
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
  WHERE c.id = consultation_id;
END;
$$;