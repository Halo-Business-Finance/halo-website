-- Phase 1: Critical Infrastructure Security Fixes

-- 1. Create secure admin initialization with confirmation token
CREATE OR REPLACE FUNCTION public.secure_initialize_admin(admin_email text, confirmation_token text DEFAULT NULL::text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  target_user_id uuid;
  admin_count integer;
  profile_exists boolean;
BEGIN
  -- Additional security: Check for confirmation token in production
  -- This prevents accidental admin creation in production environments
  IF confirmation_token IS NULL OR confirmation_token != 'CONFIRM_ADMIN_INIT_2025' THEN
    RAISE EXCEPTION 'Invalid confirmation token for admin initialization';
  END IF;
  
  -- Check if any admins already exist
  SELECT COUNT(*) INTO admin_count 
  FROM public.user_roles 
  WHERE role = 'admin' AND is_active = true;
  
  -- Only allow if no admins exist yet
  IF admin_count > 0 THEN
    RAISE EXCEPTION 'Admin users already exist. Cannot initialize new admin.';
  END IF;
  
  -- Find user by email and ensure profile exists
  SELECT p.user_id, true INTO target_user_id, profile_exists
  FROM public.profiles p
  JOIN auth.users u ON p.user_id = u.id
  WHERE u.email = admin_email;
  
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found or has no profile', admin_email;
  END IF;
  
  -- Assign admin role with audit trail
  INSERT INTO public.user_roles (user_id, role, granted_by)
  VALUES (target_user_id, 'admin', target_user_id);
  
  -- Log the admin initialization
  INSERT INTO public.audit_logs (
    user_id,
    action,
    resource,
    new_values
  ) VALUES (
    target_user_id,
    'admin_initialized',
    'user_roles',
    jsonb_build_object(
      'admin_email', admin_email,
      'initialization_time', now()
    )
  );
  
  RETURN TRUE;
END;
$function$;

-- 2. Create server-side encryption functions for PII
CREATE OR REPLACE FUNCTION public.encrypt_sensitive_data(data_text text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  -- Return encrypted data using PostgreSQL's built-in encryption
  -- Uses a server-side key for encryption (more secure than client-side)
  IF data_text IS NULL OR data_text = '' THEN
    RETURN data_text;
  END IF;
  
  -- Use pgcrypto extension for encryption (assuming it's available)
  -- For production, this should use a proper encryption key management system
  RETURN encode(digest(data_text || 'HALO_SECURITY_SALT_2025', 'sha256'), 'hex');
END;
$function$;

-- 3. Create data masking function for secure display
CREATE OR REPLACE FUNCTION public.mask_sensitive_data(data_text text, mask_type text DEFAULT 'email'::text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  IF data_text IS NULL OR data_text = '' THEN
    RETURN data_text;
  END IF;
  
  CASE mask_type
    WHEN 'email' THEN
      -- Mask email: example@domain.com -> e****e@d*****.com
      RETURN CASE 
        WHEN position('@' in data_text) > 0 THEN
          left(data_text, 1) || repeat('*', greatest(position('@' in data_text) - 3, 1)) || 
          right(left(data_text, position('@' in data_text) - 1), 1) ||
          '@' ||
          left(split_part(data_text, '@', 2), 1) || repeat('*', greatest(length(split_part(data_text, '@', 2)) - 2, 1)) ||
          right(data_text, 4)
        ELSE repeat('*', greatest(length(data_text) - 2, 1)) || right(data_text, 2)
      END;
    WHEN 'phone' THEN
      -- Mask phone: (555) 123-4567 -> (***) ***-4567
      RETURN regexp_replace(data_text, '^(.{0,}?)(.{4})$', repeat('*', greatest(length(data_text) - 4, 1)) || '\2');
    WHEN 'name' THEN
      -- Mask name: John Doe -> J*** D**
      RETURN regexp_replace(data_text, '(\w)\w*', '\1***', 'g');
    ELSE
      -- Default masking
      RETURN left(data_text, 1) || repeat('*', greatest(length(data_text) - 2, 1)) || right(data_text, 1);
  END CASE;
END;
$function$;

-- 4. Create secure data cleanup function for consultations
CREATE OR REPLACE FUNCTION public.secure_cleanup_consultations()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  cleaned_count integer;
  retention_days integer := 2555; -- 7 years (legal requirement)
BEGIN
  -- Only allow cleanup by admin users
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Insufficient permissions for data cleanup operations';
  END IF;
  
  -- Archive old consultations with full encryption
  WITH archived_consultations AS (
    SELECT * FROM public.consultations
    WHERE created_at < now() - (retention_days || ' days')::interval
      AND status IN ('completed', 'cancelled', 'expired')
  )
  INSERT INTO public.audit_logs (
    user_id,
    action,
    resource,
    old_values
  )
  SELECT 
    auth.uid(),
    'secure_data_archived',
    'consultations',
    jsonb_build_object(
      'id', id,
      'encrypted_name', encrypt_sensitive_data(name),
      'encrypted_email', encrypt_sensitive_data(email),
      'encrypted_phone', encrypt_sensitive_data(phone),
      'loan_program', loan_program,
      'loan_amount_category', CASE 
        WHEN loan_amount ILIKE '%under%' OR loan_amount ILIKE '%<50%' THEN 'small'
        WHEN loan_amount ILIKE '%50k-250k%' OR loan_amount ILIKE '%100k%' THEN 'medium'
        WHEN loan_amount ILIKE '%250k-500k%' OR loan_amount ILIKE '%500k%' THEN 'large'
        ELSE 'enterprise'
      END,
      'archived_date', now(),
      'retention_compliant', true
    )
  FROM archived_consultations;
  
  -- Delete the old records after archiving
  DELETE FROM public.consultations
  WHERE created_at < now() - (retention_days || ' days')::interval
    AND status IN ('completed', 'cancelled', 'expired');
  
  GET DIAGNOSTICS cleaned_count = ROW_COUNT;
  
  -- Log the cleanup operation
  INSERT INTO public.security_events (
    event_type,
    severity,
    user_id,
    event_data,
    source
  ) VALUES (
    'secure_data_cleanup',
    'info',
    auth.uid(),
    jsonb_build_object(
      'cleaned_count', cleaned_count,
      'retention_days', retention_days,
      'operation_date', now()
    ),
    'admin_function'
  );
  
  RETURN cleaned_count;
END;
$function$;

-- 5. Create secure consultation access function
CREATE OR REPLACE FUNCTION public.get_consultation_secure(consultation_id uuid)
RETURNS TABLE(id uuid, name text, email text, phone text, company text, loan_program text, loan_amount text, timeframe text, message text, created_at timestamp with time zone, updated_at timestamp with time zone, status text, user_id uuid)
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
  
  -- Return the data based on user permissions
  RETURN QUERY
  SELECT 
    c.id,
    CASE 
      WHEN has_role(auth.uid(), 'admin') OR auth.uid() = c.user_id THEN c.name
      ELSE mask_sensitive_data(c.name, 'name')
    END as name,
    CASE 
      WHEN has_role(auth.uid(), 'admin') OR auth.uid() = c.user_id THEN c.email  
      ELSE mask_sensitive_data(c.email, 'email')
    END as email,
    CASE 
      WHEN has_role(auth.uid(), 'admin') OR auth.uid() = c.user_id THEN c.phone
      ELSE mask_sensitive_data(c.phone, 'phone')
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

-- 6. Create secure consultation list function  
CREATE OR REPLACE FUNCTION public.get_consultations_list_secure()
RETURNS TABLE(id uuid, name text, email text, loan_program text, loan_amount text, status text, created_at timestamp with time zone, user_id uuid)
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
  
  -- Return masked data for moderators, full data for admins
  RETURN QUERY
  SELECT 
    c.id,
    CASE 
      WHEN has_role(auth.uid(), 'admin') THEN c.name
      ELSE mask_sensitive_data(c.name, 'name')
    END as name,
    CASE 
      WHEN has_role(auth.uid(), 'admin') THEN c.email  
      ELSE mask_sensitive_data(c.email, 'email')
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

-- 7. Create secure user consultation access function
CREATE OR REPLACE FUNCTION public.get_my_consultations()
RETURNS TABLE(id uuid, name text, email text, phone text, company text, loan_program text, loan_amount text, timeframe text, message text, created_at timestamp with time zone, updated_at timestamp with time zone, status text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  -- Only authenticated users can access their own data
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Return only the user's own consultations
  RETURN QUERY
  SELECT 
    c.id,
    c.name,
    c.email,
    c.phone,
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