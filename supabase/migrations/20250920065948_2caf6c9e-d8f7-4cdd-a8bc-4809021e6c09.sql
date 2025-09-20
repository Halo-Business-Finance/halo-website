-- Create missing security functions that are referenced in RLS policies

-- Function to verify active business application sessions
CREATE OR REPLACE FUNCTION public.verify_active_business_application_session()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  session_valid boolean := false;
  current_user_id uuid;
BEGIN
  -- Get current authenticated user
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Check if user has an active session with recent activity
  SELECT EXISTS(
    SELECT 1 FROM public.user_sessions
    WHERE user_id = current_user_id
    AND is_active = true
    AND expires_at > now()
    AND last_activity > (now() - interval '30 minutes')
    AND security_level IN ('normal', 'high', 'enhanced')
  ) INTO session_valid;
  
  -- Log session verification attempt
  INSERT INTO public.security_events (
    event_type, severity, user_id, event_data, source
  ) VALUES (
    'business_application_session_verified', 
    CASE WHEN session_valid THEN 'info' ELSE 'medium' END,
    current_user_id,
    jsonb_build_object(
      'session_valid', session_valid,
      'verification_timestamp', now()
    ),
    'business_application_security'
  );
  
  RETURN session_valid;
END;
$$;

-- Function to verify ultra secure admin audit access
CREATE OR REPLACE FUNCTION public.verify_ultra_secure_admin_audit_access()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  is_valid_admin boolean := false;
  admin_session_count integer := 0;
  recent_security_events integer := 0;
BEGIN
  -- Check if user is authenticated and is admin
  IF auth.uid() IS NULL OR NOT has_role(auth.uid(), 'admin') THEN
    RETURN false;
  END IF;
  
  -- Check for active admin sessions with recent activity
  SELECT COUNT(*) INTO admin_session_count
  FROM public.user_sessions us
  WHERE us.user_id = auth.uid()
  AND us.is_active = true
  AND us.expires_at > now()
  AND us.last_activity > (now() - interval '15 minutes')
  AND us.security_level IN ('high', 'enhanced');
  
  -- Check for any recent suspicious security events
  SELECT COUNT(*) INTO recent_security_events
  FROM public.security_events se
  WHERE se.user_id = auth.uid()
  AND se.severity IN ('high', 'critical')
  AND se.created_at > (now() - interval '1 hour')
  AND se.resolved_at IS NULL;
  
  -- Grant access only if admin has active secure session and no recent security issues
  is_valid_admin := (admin_session_count > 0 AND recent_security_events = 0);
  
  -- Log the ultra secure access attempt
  INSERT INTO public.security_events (
    event_type, severity, user_id, event_data, source
  ) VALUES (
    'ultra_secure_admin_audit_access_attempted',
    CASE WHEN is_valid_admin THEN 'info' ELSE 'high' END,
    auth.uid(),
    jsonb_build_object(
      'access_granted', is_valid_admin,
      'admin_session_count', admin_session_count,
      'recent_security_events', recent_security_events,
      'verification_timestamp', now()
    ),
    'ultra_secure_audit_access'
  );
  
  RETURN is_valid_admin;
END;
$$;

-- Function to verify active session with MFA (referenced in many policies)
CREATE OR REPLACE FUNCTION public.verify_active_session_with_mfa(required_security_level text, max_age_minutes integer DEFAULT 60)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  session_valid boolean := false;
  current_user_id uuid;
  security_level_hierarchy jsonb := '{"normal": 1, "high": 2, "enhanced": 3}';
  required_level_value integer;
  user_session_level integer;
BEGIN
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Get security level values for comparison
  required_level_value := (security_level_hierarchy->>required_security_level)::integer;
  
  -- Check if user has valid session meeting security requirements
  SELECT 
    CASE 
      WHEN us.security_level = 'enhanced' THEN 3
      WHEN us.security_level = 'high' THEN 2
      WHEN us.security_level = 'normal' THEN 1
      ELSE 0
    END INTO user_session_level
  FROM public.user_sessions us
  WHERE us.user_id = current_user_id
  AND us.is_active = true
  AND us.expires_at > now()
  AND us.last_activity > (now() - (max_age_minutes || ' minutes')::interval)
  AND us.last_security_check > (now() - (max_age_minutes || ' minutes')::interval)
  ORDER BY us.last_activity DESC
  LIMIT 1;
  
  session_valid := (user_session_level >= required_level_value);
  
  -- Log MFA session verification
  INSERT INTO public.security_events (
    event_type, severity, user_id, event_data, source
  ) VALUES (
    'mfa_session_verification',
    CASE WHEN session_valid THEN 'info' ELSE 'medium' END,
    current_user_id,
    jsonb_build_object(
      'required_security_level', required_security_level,
      'user_session_level', COALESCE(user_session_level, 0),
      'max_age_minutes', max_age_minutes,
      'verification_result', session_valid,
      'verification_timestamp', now()
    ),
    'mfa_session_verification'
  );
  
  RETURN session_valid;
END;
$$;

-- Function to get current user role (referenced in some policies)
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  user_role text := 'user';
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN 'anonymous';
  END IF;
  
  -- Get the highest role for the user
  SELECT 
    CASE 
      WHEN EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin' AND is_active = true) THEN 'admin'
      WHEN EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'moderator' AND is_active = true) THEN 'moderator'
      ELSE 'user'
    END INTO user_role;
  
  RETURN user_role;
END;
$$;

-- Enhanced secure admin login function to replace hardcoded password
CREATE OR REPLACE FUNCTION public.secure_admin_login(p_email text, p_password_hash text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  admin_record public.admin_users%ROWTYPE;
  session_token text;
  session_expires timestamp with time zone;
  login_successful boolean := false;
  computed_hash text;
  current_ip inet := inet_client_addr();
BEGIN
  -- Get admin user record
  SELECT * INTO admin_record
  FROM public.admin_users
  WHERE email = p_email AND is_active = true;
  
  IF admin_record.id IS NULL THEN
    -- Log failed login attempt
    INSERT INTO public.security_events (
      event_type, severity, event_data, source, ip_address
    ) VALUES (
      'admin_login_failed', 'high',
      jsonb_build_object(
        'reason', 'user_not_found',
        'attempted_email', p_email,
        'timestamp', now()
      ),
      'admin_authentication', current_ip
    );
    
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Invalid credentials'
    );
  END IF;
  
  -- Check if account is locked
  IF admin_record.account_locked_until IS NOT NULL AND admin_record.account_locked_until > now() THEN
    INSERT INTO public.security_events (
      event_type, severity, event_data, source, ip_address
    ) VALUES (
      'admin_login_blocked', 'critical',
      jsonb_build_object(
        'reason', 'account_locked',
        'admin_id', admin_record.id,
        'locked_until', admin_record.account_locked_until,
        'timestamp', now()
      ),
      'admin_authentication', current_ip
    );
    
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Account temporarily locked due to security concerns'
    );
  END IF;
  
  -- Verify password using stored salt and algorithm
  computed_hash := encode(
    digest(
      p_password_hash || COALESCE(admin_record.password_salt, 'HALO_ADMIN_SALT_2025'),
      'sha512'
    ),
    'hex'
  );
  
  login_successful := (computed_hash = admin_record.password_hash);
  
  IF login_successful THEN
    -- Reset failed login attempts
    UPDATE public.admin_users
    SET failed_login_attempts = 0,
        last_login_at = now()
    WHERE id = admin_record.id;
    
    -- Generate secure session token
    session_token := encode(gen_random_bytes(64), 'hex');
    session_expires := now() + interval '30 minutes'; -- Short session for security
    
    -- Create admin session
    INSERT INTO public.admin_sessions (
      admin_user_id, session_token, expires_at, ip_address
    ) VALUES (
      admin_record.id, session_token, session_expires, current_ip
    );
    
    -- Log successful login
    INSERT INTO public.security_events (
      event_type, severity, event_data, source, ip_address
    ) VALUES (
      'admin_login_successful', 'info',
      jsonb_build_object(
        'admin_id', admin_record.id,
        'admin_email', admin_record.email,
        'session_expires', session_expires,
        'timestamp', now()
      ),
      'admin_authentication', current_ip
    );
    
    RETURN jsonb_build_object(
      'success', true,
      'session_token', session_token,
      'expires_at', extract(epoch from session_expires),
      'user', jsonb_build_object(
        'id', admin_record.id,
        'email', admin_record.email,
        'full_name', admin_record.full_name,
        'role', admin_record.role,
        'security_clearance_level', admin_record.security_clearance_level
      )
    );
  ELSE
    -- Increment failed login attempts
    UPDATE public.admin_users
    SET failed_login_attempts = failed_login_attempts + 1,
        account_locked_until = CASE 
          WHEN failed_login_attempts >= 4 THEN now() + interval '1 hour'
          ELSE account_locked_until
        END
    WHERE id = admin_record.id;
    
    -- Log failed login
    INSERT INTO public.security_events (
      event_type, severity, event_data, source, ip_address
    ) VALUES (
      'admin_login_failed', 'high',
      jsonb_build_object(
        'reason', 'invalid_password',
        'admin_id', admin_record.id,
        'failed_attempts', admin_record.failed_login_attempts + 1,
        'timestamp', now()
      ),
      'admin_authentication', current_ip
    );
    
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Invalid credentials'
    );
  END IF;
END;
$$;

-- Function to get admin profile securely
CREATE OR REPLACE FUNCTION public.get_admin_profile_secure()
RETURNS TABLE(id uuid, email text, full_name text, role text, security_clearance_level text, last_login_at timestamp with time zone, mfa_enabled boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  current_admin_id uuid;
BEGIN
  -- Verify current user is admin
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized access to admin profile';
  END IF;
  
  -- Get admin ID from auth.users email
  SELECT au.id INTO current_admin_id
  FROM public.admin_users au
  JOIN auth.users u ON au.email = u.email::text
  WHERE u.id = auth.uid() AND au.is_active = true;
  
  IF current_admin_id IS NULL THEN
    RAISE EXCEPTION 'Admin profile not found';
  END IF;
  
  -- Log profile access
  INSERT INTO public.security_events (
    event_type, severity, event_data, source
  ) VALUES (
    'admin_profile_accessed', 'info',
    jsonb_build_object(
      'admin_id', current_admin_id,
      'timestamp', now()
    ),
    'admin_profile_access'
  );
  
  RETURN QUERY
  SELECT 
    au.id,
    au.email,
    au.full_name,
    au.role,
    au.security_clearance_level,
    au.last_login_at,
    au.mfa_enabled
  FROM public.admin_users au
  WHERE au.id = current_admin_id;
END;
$$;

-- Function to update admin profile securely  
CREATE OR REPLACE FUNCTION public.update_admin_profile_secure(p_full_name text DEFAULT NULL, p_security_clearance_level text DEFAULT NULL)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  current_admin_id uuid;
BEGIN
  -- Verify current user is admin
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized access to admin profile update';
  END IF;
  
  -- Get admin ID from auth.users email
  SELECT au.id INTO current_admin_id
  FROM public.admin_users au
  JOIN auth.users u ON au.email = u.email::text
  WHERE u.id = auth.uid() AND au.is_active = true;
  
  IF current_admin_id IS NULL THEN
    RAISE EXCEPTION 'Admin profile not found';
  END IF;
  
  -- Update admin profile
  UPDATE public.admin_users
  SET 
    full_name = COALESCE(p_full_name, full_name),
    security_clearance_level = COALESCE(p_security_clearance_level, security_clearance_level),
    updated_at = now()
  WHERE id = current_admin_id;
  
  -- Log profile update
  INSERT INTO public.security_events (
    event_type, severity, event_data, source
  ) VALUES (
    'admin_profile_updated', 'medium',
    jsonb_build_object(
      'admin_id', current_admin_id,
      'updated_fields', jsonb_build_object(
        'full_name_updated', p_full_name IS NOT NULL,
        'security_clearance_updated', p_security_clearance_level IS NOT NULL
      ),
      'timestamp', now()
    ),
    'admin_profile_management'
  );
  
  RETURN true;
END;
$$;