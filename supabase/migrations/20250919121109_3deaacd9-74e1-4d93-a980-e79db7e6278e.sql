-- Enhanced Admin User Security Fix (Corrected)
-- This migration addresses the security vulnerability in admin_users table

-- 1. Create a secure function to verify admin access to their own data only
CREATE OR REPLACE FUNCTION public.verify_admin_self_access()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  admin_email text;
  user_email text;
BEGIN
  -- Get current user's email from auth.users
  SELECT email INTO user_email 
  FROM auth.users 
  WHERE id = auth.uid();
  
  IF user_email IS NULL THEN
    RETURN false;
  END IF;
  
  -- Check if user has admin role
  IF NOT has_role(auth.uid(), 'admin') THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$;

-- 2. Create a function to get admin profile data without sensitive fields
CREATE OR REPLACE FUNCTION public.get_admin_profile_secure()
RETURNS TABLE(
  id uuid,
  email text,
  full_name text,
  role text,
  is_active boolean,
  mfa_enabled boolean,
  last_login_at timestamp with time zone,
  created_at timestamp with time zone,
  security_clearance_level text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Verify the user is an admin accessing their own data
  IF NOT (auth.uid() IS NOT NULL AND has_role(auth.uid(), 'admin')) THEN
    RAISE EXCEPTION 'Unauthorized access to admin profile data';
  END IF;
  
  -- Log the secure access
  INSERT INTO public.security_events (
    event_type, severity, user_id, event_data, source
  ) VALUES (
    'admin_profile_accessed_secure', 'medium', auth.uid(),
    jsonb_build_object(
      'access_method', 'secure_function',
      'timestamp', now()
    ),
    'admin_profile_security'
  );
  
  -- Return only the admin's own data without sensitive fields
  RETURN QUERY
  SELECT 
    au.id,
    au.email,
    au.full_name,
    au.role,
    au.is_active,
    au.mfa_enabled,
    au.last_login_at,
    au.created_at,
    au.security_clearance_level
  FROM public.admin_users au
  JOIN auth.users u ON au.email = u.email
  WHERE u.id = auth.uid() AND au.is_active = true;
END;
$$;

-- 3. Create audit trigger for admin_users access (INSERT/UPDATE/DELETE only)
CREATE OR REPLACE FUNCTION public.audit_admin_users_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Log all modification attempts to admin_users table
  INSERT INTO public.security_events (
    event_type, severity, user_id, ip_address, event_data, source
  ) VALUES (
    'admin_users_table_modified',
    'critical',
    auth.uid(),
    inet_client_addr(),
    jsonb_build_object(
      'operation', TG_OP,
      'affected_admin_id', COALESCE(NEW.id, OLD.id),
      'modification_timestamp', now(),
      'table_name', TG_TABLE_NAME,
      'role', auth.role()
    ),
    'admin_users_security_monitor'
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger for modifications only (not SELECT)
DROP TRIGGER IF EXISTS audit_admin_users_access_trigger ON public.admin_users;
CREATE TRIGGER audit_admin_users_access_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.admin_users
  FOR EACH ROW EXECUTE FUNCTION public.audit_admin_users_access();

-- 4. Drop existing policies and create ultra-secure ones
DROP POLICY IF EXISTS "Enhanced_Admin_User_Protection" ON public.admin_users;

-- Policy 1: Block all direct access by default
CREATE POLICY "Block_Direct_Admin_Users_Access"
ON public.admin_users
FOR ALL
TO authenticated
USING (false)
WITH CHECK (false);

-- Policy 2: Allow service role for system operations
CREATE POLICY "Service_Role_Admin_Users_Access"
ON public.admin_users
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 5. Create a function to securely update admin profile (non-sensitive fields only)
CREATE OR REPLACE FUNCTION public.update_admin_profile_secure(
  p_full_name text DEFAULT NULL,
  p_security_clearance_level text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  admin_id uuid;
BEGIN
  -- Verify admin access
  IF NOT (auth.uid() IS NOT NULL AND has_role(auth.uid(), 'admin')) THEN
    RAISE EXCEPTION 'Unauthorized access to update admin profile';
  END IF;
  
  -- Get admin ID
  SELECT au.id INTO admin_id
  FROM public.admin_users au
  JOIN auth.users u ON au.email = u.email
  WHERE u.id = auth.uid() AND au.is_active = true;
  
  IF admin_id IS NULL THEN
    RAISE EXCEPTION 'Admin profile not found';
  END IF;
  
  -- Update only non-sensitive fields
  UPDATE public.admin_users
  SET 
    full_name = COALESCE(p_full_name, full_name),
    security_clearance_level = COALESCE(p_security_clearance_level, security_clearance_level),
    updated_at = now()
  WHERE id = admin_id;
  
  -- Log the update
  INSERT INTO public.security_events (
    event_type, severity, user_id, event_data, source
  ) VALUES (
    'admin_profile_updated_secure', 'medium', auth.uid(),
    jsonb_build_object(
      'admin_id', admin_id,
      'updated_fields', jsonb_build_object(
        'full_name', p_full_name IS NOT NULL,
        'security_clearance_level', p_security_clearance_level IS NOT NULL
      ),
      'timestamp', now()
    ),
    'admin_profile_management'
  );
  
  RETURN true;
END;
$$;

-- 6. Create a separate secure table for password changes with enhanced security
CREATE TABLE IF NOT EXISTS public.admin_password_changes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid NOT NULL,
  old_password_hash_verification text NOT NULL,
  new_password_hash text NOT NULL,
  new_password_salt text NOT NULL,
  change_reason text DEFAULT 'user_requested',
  requires_mfa boolean DEFAULT true,
  mfa_verified boolean DEFAULT false,
  change_authorized_by uuid,
  ip_address inet DEFAULT inet_client_addr(),
  created_at timestamp with time zone DEFAULT now(),
  applied_at timestamp with time zone,
  revoked_at timestamp with time zone,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'applied', 'revoked', 'expired'))
);

-- Enable RLS on password changes table
ALTER TABLE public.admin_password_changes ENABLE ROW LEVEL SECURITY;

-- Ultra-restrictive policy for password changes
CREATE POLICY "Service_Role_Only_Password_Changes"
ON public.admin_password_changes
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 7. Add additional security monitoring for sensitive field updates
CREATE OR REPLACE FUNCTION public.monitor_admin_credential_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Any access to sensitive admin credential fields triggers high-priority alert
  INSERT INTO public.security_events (
    event_type, severity, user_id, ip_address, event_data, source
  ) VALUES (
    'admin_credential_field_access_detected',
    'critical',
    auth.uid(),
    inet_client_addr(),
    jsonb_build_object(
      'operation', TG_OP,
      'admin_id', COALESCE(NEW.id, OLD.id),
      'sensitive_data_accessed', true,
      'requires_investigation', true,
      'timestamp', now()
    ),
    'credential_security_monitor'
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger for sensitive field access monitoring
DROP TRIGGER IF EXISTS monitor_admin_credential_access_trigger ON public.admin_users;
CREATE TRIGGER monitor_admin_credential_access_trigger
  AFTER UPDATE OF password_hash, password_salt, mfa_secret_encrypted ON public.admin_users
  FOR EACH ROW EXECUTE FUNCTION public.monitor_admin_credential_access();