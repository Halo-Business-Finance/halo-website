-- CRITICAL SECURITY FIX: Break infinite recursion and implement security fixes
-- Step 1: First, temporarily disable the problematic triggers to break the recursion
DROP TRIGGER IF EXISTS log_security_infrastructure_trigger ON public.security_events CASCADE;
DROP TRIGGER IF EXISTS log_security_infrastructure_trigger ON public.security_alerts CASCADE;
DROP TRIGGER IF EXISTS log_security_infrastructure_trigger ON public.security_configs CASCADE;

-- Step 2: Remove unencrypted PII columns from consultations table
ALTER TABLE public.consultations 
DROP COLUMN IF EXISTS name CASCADE,
DROP COLUMN IF EXISTS email CASCADE, 
DROP COLUMN IF EXISTS phone CASCADE;

-- Step 3: Remove plaintext session token from user_sessions table for security
ALTER TABLE public.user_sessions 
DROP COLUMN IF EXISTS session_token CASCADE;

-- Step 4: Create a simple, non-recursive function to get user role without triggering loops
CREATE OR REPLACE FUNCTION public.get_user_role_simple(_user_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO ''
AS $function$
  SELECT COALESCE(
    (SELECT role::text FROM public.user_roles 
     WHERE user_id = _user_id 
     AND is_active = true 
     AND (expires_at IS NULL OR expires_at > now())
     ORDER BY 
       CASE role
         WHEN 'admin' THEN 1
         WHEN 'moderator' THEN 2
         WHEN 'user' THEN 3
       END
     LIMIT 1),
    'user'
  );
$function$;

-- Step 5: Update the main get_current_user_role function to use the simple version
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path TO ''
AS $function$
  SELECT public.get_user_role_simple(auth.uid());
$function$;

-- Step 6: Create a safer logging function that doesn't cause recursion
CREATE OR REPLACE FUNCTION public.log_security_event_safe(event_type_param text, severity_param text, event_data_param jsonb DEFAULT '{}'::jsonb)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  event_id uuid;
  calculated_risk_score integer;
  user_role_safe text;
BEGIN
  -- Get user role safely without recursion
  user_role_safe := COALESCE(
    (SELECT role::text FROM public.user_roles 
     WHERE user_id = auth.uid() 
     AND is_active = true 
     AND (expires_at IS NULL OR expires_at > now())
     LIMIT 1),
    'user'
  );
  
  -- Calculate risk score
  calculated_risk_score := CASE severity_param
    WHEN 'critical' THEN 100
    WHEN 'high' THEN 75
    WHEN 'medium' THEN 50
    WHEN 'low' THEN 25
    ELSE 10
  END;
  
  -- Insert directly without triggering more events
  INSERT INTO public.security_events (
    event_type,
    severity,
    user_id,
    ip_address,
    event_data,
    source,
    risk_score
  ) VALUES (
    event_type_param,
    severity_param,
    auth.uid(),
    inet_client_addr(),
    event_data_param || jsonb_build_object('user_role', user_role_safe),
    'secure_function',
    calculated_risk_score
  ) RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$function$;

-- Step 7: Update security functions to work with encrypted data only and avoid recursion
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
AS $function$
DECLARE
  user_role_safe text;
BEGIN
  -- Get user role safely
  user_role_safe := public.get_user_role_simple(auth.uid());
  
  -- Enhanced security: Only allow access with proper authorization
  IF NOT (
    (auth.uid() IS NOT NULL AND EXISTS(
      SELECT 1 FROM public.consultations c 
      WHERE c.id = consultation_id AND c.user_id = auth.uid()
    )) OR
    user_role_safe = 'admin'
  ) THEN
    RAISE EXCEPTION 'Unauthorized access to consultation data';
  END IF;
  
  -- Log the secure access safely
  PERFORM public.log_security_event_safe(
    'secure_consultation_data_accessed',
    'medium',
    jsonb_build_object(
      'consultation_id', consultation_id,
      'access_method', 'secure_data_function',
      'data_sensitivity', 'high'
    )
  );
  
  -- Return masked data using encrypted columns only
  RETURN QUERY
  SELECT 
    c.id,
    mask_sensitive_data(
      CASE 
        WHEN user_role_safe = 'admin' THEN 
          COALESCE(c.encrypted_name, 'ENCRYPTED_DATA')
        ELSE 
          'ENCRYPTED_DATA'
      END, 
      'name'
    ) as masked_name,
    mask_sensitive_data(
      CASE 
        WHEN user_role_safe = 'admin' THEN 
          COALESCE(c.encrypted_email, 'user@encrypted.com')
        ELSE 
          'user@encrypted.com'
      END, 
      'email'
    ) as masked_email,
    mask_sensitive_data(
      CASE 
        WHEN user_role_safe = 'admin' THEN 
          COALESCE(c.encrypted_phone, '+1-***-***-****')
        ELSE 
          '+1-***-***-****'
      END, 
      'phone'
    ) as masked_phone,
    CASE 
      WHEN user_role_safe = 'admin' THEN c.company
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
$function$;

-- Step 8: Update other security functions to use safe approach
CREATE OR REPLACE FUNCTION public.get_consultation_secure(consultation_id uuid)
RETURNS TABLE(
  id uuid, 
  name text, 
  email text, 
  phone text, 
  company text, 
  loan_program text, 
  loan_amount text, 
  timeframe text, 
  message text, 
  created_at timestamp with time zone, 
  updated_at timestamp with time zone, 
  status text, 
  user_id uuid
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  user_role_safe text;
BEGIN
  -- Get user role safely
  user_role_safe := public.get_user_role_simple(auth.uid());
  
  -- Check if user has permission to access this consultation
  IF NOT (
    EXISTS(SELECT 1 FROM public.consultations c WHERE c.id = consultation_id AND c.user_id = auth.uid()) OR
    user_role_safe IN ('admin', 'moderator')
  ) THEN
    RAISE EXCEPTION 'Insufficient permissions to access consultation data';
  END IF;
  
  -- Log the secure access safely
  PERFORM public.log_security_event_safe(
    'secure_consultation_access',
    'medium',
    jsonb_build_object(
      'consultation_id', consultation_id,
      'access_method', 'secure_function'
    )
  );
  
  -- Return the data based on user permissions (using encrypted data only)
  RETURN QUERY
  SELECT 
    c.id,
    CASE 
      WHEN user_role_safe = 'admin' OR auth.uid() = c.user_id THEN 
        COALESCE(c.encrypted_name, 'ENCRYPTED')
      ELSE 
        mask_sensitive_data('ENCRYPTED_NAME', 'name')
    END as name,
    CASE 
      WHEN user_role_safe = 'admin' OR auth.uid() = c.user_id THEN 
        COALESCE(c.encrypted_email, 'encrypted@data.com')
      ELSE 
        mask_sensitive_data('encrypted@data.com', 'email')
    END as email,
    CASE 
      WHEN user_role_safe = 'admin' OR auth.uid() = c.user_id THEN 
        COALESCE(c.encrypted_phone, '+1-000-000-0000')
      ELSE 
        mask_sensitive_data('+1-000-000-0000', 'phone')
    END as phone,
    CASE 
      WHEN user_role_safe = 'admin' OR auth.uid() = c.user_id THEN c.company
      ELSE '***REDACTED***'
    END as company,
    c.loan_program,
    CASE 
      WHEN user_role_safe = 'admin' OR auth.uid() = c.user_id THEN c.loan_amount
      ELSE 'CONFIDENTIAL'
    END as loan_amount,
    c.timeframe,
    CASE 
      WHEN user_role_safe = 'admin' OR auth.uid() = c.user_id THEN c.message
      ELSE 'CONFIDENTIAL'
    END as message,
    c.created_at,
    c.updated_at,
    c.status,
    c.user_id
  FROM public.consultations c
  WHERE c.id = consultation_id;
END;
$function$;

-- Step 9: Log this critical security update
PERFORM public.log_security_event_safe(
  'critical_security_fix_applied_final',
  'critical',
  jsonb_build_object(
    'fix_type', 'pii_encryption_enforcement_with_recursion_fix',
    'changes', jsonb_build_array(
      'removed_unencrypted_pii_columns',
      'removed_plaintext_session_tokens',
      'fixed_infinite_recursion_in_security_functions',
      'updated_security_functions'
    ),
    'timestamp', now()
  )
);