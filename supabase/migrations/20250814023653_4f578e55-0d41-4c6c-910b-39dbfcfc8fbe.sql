-- CRITICAL SECURITY FIX: Remove unencrypted PII data and session tokens
-- This migration addresses the critical security vulnerabilities identified in the security review

-- Step 1: Ensure all consultations have encrypted data before removing unencrypted columns
-- First, let's populate any missing encrypted data
UPDATE public.consultations 
SET 
  encrypted_name = COALESCE(encrypted_name, encrypt_sensitive_data(name)),
  encrypted_email = COALESCE(encrypted_email, encrypt_sensitive_data(email)),
  encrypted_phone = COALESCE(encrypted_phone, encrypt_sensitive_data(phone))
WHERE encrypted_name IS NULL OR encrypted_email IS NULL OR encrypted_phone IS NULL;

-- Step 2: Remove unencrypted PII columns from consultations table
ALTER TABLE public.consultations 
DROP COLUMN IF EXISTS name,
DROP COLUMN IF EXISTS email, 
DROP COLUMN IF EXISTS phone;

-- Step 3: Remove plaintext session token from user_sessions table for security
ALTER TABLE public.user_sessions 
DROP COLUMN IF EXISTS session_token;

-- Step 4: Update get_secure_consultation_data function to work with encrypted data only
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
  
  -- Return masked data using encrypted columns only
  RETURN QUERY
  SELECT 
    c.id,
    mask_sensitive_data(
      CASE 
        WHEN has_role(auth.uid(), 'admin') THEN 
          -- Decrypt for admin (simplified - in production use proper key management)
          c.encrypted_name
        ELSE 
          'ENCRYPTED_DATA'
      END, 
      'name'
    ) as masked_name,
    mask_sensitive_data(
      CASE 
        WHEN has_role(auth.uid(), 'admin') THEN 
          c.encrypted_email
        ELSE 
          'user@encrypted.com'
      END, 
      'email'
    ) as masked_email,
    mask_sensitive_data(
      CASE 
        WHEN has_role(auth.uid(), 'admin') THEN 
          c.encrypted_phone
        ELSE 
          '+1-***-***-****'
      END, 
      'phone'
    ) as masked_phone,
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
$function$;

-- Step 5: Update get_consultation_secure function to work without plaintext PII
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
BEGIN
  -- Check if user has permission to access this consultation
  IF NOT (
    EXISTS(SELECT 1 FROM public.consultations c WHERE c.id = consultation_id AND c.user_id = auth.uid()) OR
    has_role(auth.uid(), 'admin') OR
    has_role(auth.uid(), 'moderator')
  ) THEN
    RAISE EXCEPTION 'Insufficient permissions to access consultation data';
  END IF;
  
  -- Log the secure access
  INSERT INTO public.security_events (
    event_type,
    severity,
    user_id,
    event_data,
    source
  ) VALUES (
    'secure_consultation_access',
    'medium',
    auth.uid(),
    jsonb_build_object(
      'consultation_id', consultation_id,
      'access_method', 'secure_function',
      'user_role', public.get_current_user_role()
    ),
    'secure_function'
  );
  
  -- Return the data based on user permissions (using encrypted data only)
  RETURN QUERY
  SELECT 
    c.id,
    CASE 
      WHEN has_role(auth.uid(), 'admin') OR auth.uid() = c.user_id THEN 
        COALESCE(c.encrypted_name, 'ENCRYPTED')
      ELSE 
        mask_sensitive_data('ENCRYPTED_NAME', 'name')
    END as name,
    CASE 
      WHEN has_role(auth.uid(), 'admin') OR auth.uid() = c.user_id THEN 
        COALESCE(c.encrypted_email, 'encrypted@data.com')
      ELSE 
        mask_sensitive_data('encrypted@data.com', 'email')
    END as email,
    CASE 
      WHEN has_role(auth.uid(), 'admin') OR auth.uid() = c.user_id THEN 
        COALESCE(c.encrypted_phone, '+1-000-000-0000')
      ELSE 
        mask_sensitive_data('+1-000-000-0000', 'phone')
    END as phone,
    CASE 
      WHEN has_role(auth.uid(), 'admin') OR auth.uid() = c.user_id THEN c.company
      ELSE '***REDACTED***'
    END as company,
    c.loan_program,
    CASE 
      WHEN has_role(auth.uid(), 'admin') OR auth.uid() = c.user_id THEN c.loan_amount
      ELSE 'CONFIDENTIAL'
    END as loan_amount,
    c.timeframe,
    CASE 
      WHEN has_role(auth.uid(), 'admin') OR auth.uid() = c.user_id THEN c.message
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

-- Step 6: Update get_consultations_list_secure function
CREATE OR REPLACE FUNCTION public.get_consultations_list_secure()
RETURNS TABLE(
  id uuid, 
  name text, 
  email text, 
  loan_program text, 
  loan_amount text, 
  status text, 
  created_at timestamp with time zone, 
  user_id uuid
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  -- Only admins and moderators can list consultations
  IF NOT (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'moderator')) THEN
    RAISE EXCEPTION 'Insufficient permissions to list consultation data';
  END IF;
  
  -- Log the access
  INSERT INTO public.security_events (
    event_type,
    severity,
    user_id,
    event_data,
    source
  ) VALUES (
    'consultation_list_accessed',
    'high',
    auth.uid(),
    jsonb_build_object(
      'access_method', 'secure_list_function',
      'user_role', public.get_current_user_role()
    ),
    'secure_function'
  );
  
  -- Return masked data for moderators, encrypted data for admins
  RETURN QUERY
  SELECT 
    c.id,
    CASE 
      WHEN has_role(auth.uid(), 'admin') THEN 
        COALESCE(c.encrypted_name, 'ENCRYPTED')
      ELSE 
        mask_sensitive_data('ENCRYPTED_NAME', 'name')
    END as name,
    CASE 
      WHEN has_role(auth.uid(), 'admin') THEN 
        COALESCE(c.encrypted_email, 'encrypted@data.com')
      ELSE 
        mask_sensitive_data('encrypted@data.com', 'email')
    END as email,
    c.loan_program,
    CASE 
      WHEN has_role(auth.uid(), 'admin') THEN c.loan_amount
      ELSE 'CONFIDENTIAL'
    END as loan_amount,
    c.status,
    c.created_at,
    c.user_id
  FROM public.consultations c
  ORDER BY c.created_at DESC;
END;
$function$;

-- Step 7: Update get_my_consultations function to work with encrypted data
CREATE OR REPLACE FUNCTION public.get_my_consultations()
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
  status text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  -- Only authenticated users can access their own data
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Return only the user's own consultations (with encrypted data)
  RETURN QUERY
  SELECT 
    c.id,
    COALESCE(c.encrypted_name, 'ENCRYPTED') as name,
    COALESCE(c.encrypted_email, 'encrypted@data.com') as email,
    COALESCE(c.encrypted_phone, '+1-000-000-0000') as phone,
    c.company,
    c.loan_program,
    c.loan_amount,
    c.timeframe,
    c.message,
    c.created_at,
    c.updated_at,
    c.status
  FROM public.consultations c
  WHERE c.user_id = auth.uid()
  ORDER BY c.created_at DESC;
END;
$function$;

-- Step 8: Log this critical security update
INSERT INTO public.security_events (
  event_type,
  severity,
  event_data,
  source
) VALUES (
  'critical_security_fix_applied',
  'critical',
  jsonb_build_object(
    'fix_type', 'pii_encryption_enforcement',
    'changes', jsonb_build_array(
      'removed_unencrypted_pii_columns',
      'removed_plaintext_session_tokens',
      'updated_security_functions'
    ),
    'timestamp', now()
  ),
  'security_hardening'
);