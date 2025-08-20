-- Fix security linter warning: Function Search Path Mutable
-- Update function to have immutable search_path

CREATE OR REPLACE FUNCTION public.validate_secure_role_changes()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path TO 'public'  -- Fix: Set explicit search_path
AS $$
DECLARE
  current_user_role public.app_role;
  admin_count integer;
BEGIN
  -- Only allow role changes through secure functions or by service role
  IF current_setting('app.secure_role_operation', true) IS NULL 
     AND current_setting('role') != 'service_role' THEN
    RAISE EXCEPTION 'Role changes must be performed through secure functions only';
  END IF;
  
  -- Get current user's role
  SELECT public.get_user_role(auth.uid()) INTO current_user_role;
  
  -- Only admins can modify roles (except for initial user role assignment)
  IF TG_OP != 'INSERT' OR (NEW.role != 'user' OR NEW.granted_by IS NOT NULL) THEN
    IF current_user_role != 'admin' AND current_setting('role') != 'service_role' THEN
      RAISE EXCEPTION 'Only administrators can modify user roles';
    END IF;
  END IF;
  
  -- Prevent admin from modifying their own role
  IF auth.uid() = NEW.user_id AND current_user_role = 'admin' THEN
    RAISE EXCEPTION 'Administrators cannot modify their own role for security reasons';
  END IF;
  
  -- Prevent removal of last admin
  IF TG_OP = 'UPDATE' AND OLD.role = 'admin' AND NEW.role != 'admin' THEN
    SELECT COUNT(*) INTO admin_count 
    FROM public.user_roles 
    WHERE role = 'admin' AND is_active = true AND user_id != NEW.user_id;
    
    IF admin_count < 1 THEN
      RAISE EXCEPTION 'Cannot remove the last administrator';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Update other functions to have explicit search_path
CREATE OR REPLACE FUNCTION public.initialize_first_admin(admin_email text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'  -- Fix: Set explicit search_path
AS $$
DECLARE
  admin_count integer;
  target_user_id uuid;
  result jsonb;
BEGIN
  -- Check if any admins already exist
  SELECT COUNT(*) INTO admin_count 
  FROM public.user_roles 
  WHERE role = 'admin' AND is_active = true;
  
  -- Only allow if no admins exist
  IF admin_count > 0 THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Admin users already exist. System is already initialized.'
    );
  END IF;
  
  -- Find user by email
  SELECT p.user_id INTO target_user_id 
  FROM public.profiles p
  JOIN auth.users u ON p.user_id = u.id
  WHERE u.email = admin_email;
  
  IF target_user_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'User with email ' || admin_email || ' not found. Please ensure user has signed up first.'
    );
  END IF;
  
  -- Set secure operation flag
  PERFORM set_config('app.secure_role_operation', 'admin_initialization', true);
  
  -- Create admin role
  INSERT INTO public.user_roles (user_id, role, granted_by)
  VALUES (target_user_id, 'admin', target_user_id);
  
  -- Log the critical security event
  INSERT INTO public.security_events (
    event_type, severity, user_id, event_data, source
  ) VALUES (
    'first_admin_initialized',
    'critical',
    target_user_id,
    jsonb_build_object(
      'admin_email', admin_email,
      'initialized_at', now(),
      'security_level', 'maximum'
    ),
    'secure_admin_initialization'
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'message', 'First administrator successfully initialized',
    'admin_user_id', target_user_id
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.secure_assign_user_role_v2(
  target_user_id uuid, 
  new_role app_role, 
  expiration_date timestamp with time zone DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'  -- Fix: Set explicit search_path
AS $$
DECLARE
  assigner_role public.app_role;
  admin_count integer;
  target_current_role public.app_role;
  result jsonb;
BEGIN
  -- Get the role of the user making the assignment
  SELECT public.get_user_role(auth.uid()) INTO assigner_role;
  
  -- Security check: Only admins can assign roles
  IF assigner_role != 'admin' THEN
    INSERT INTO public.security_events (
      event_type, severity, user_id, event_data, source
    ) VALUES (
      'unauthorized_role_assignment_attempt', 'critical', auth.uid(),
      jsonb_build_object(
        'target_user_id', target_user_id,
        'attempted_role', new_role,
        'assigner_role', assigner_role
      ),
      'secure_role_management'
    );
    
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Insufficient permissions to assign roles'
    );
  END IF;
  
  -- Prevent self-assignment for security
  IF auth.uid() = target_user_id THEN
    INSERT INTO public.security_events (
      event_type, severity, user_id, event_data, source
    ) VALUES (
      'self_role_assignment_blocked', 'high', auth.uid(),
      jsonb_build_object(
        'attempted_role', new_role,
        'reason', 'self_assignment_prevention'
      ),
      'secure_role_management'
    );
    
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Cannot assign roles to yourself for security reasons'
    );
  END IF;
  
  -- Get current role of target user
  SELECT public.get_user_role(target_user_id) INTO target_current_role;
  
  -- Prevent admin role revocation if it would leave no admins
  IF target_current_role = 'admin' AND new_role != 'admin' THEN
    SELECT COUNT(*) INTO admin_count 
    FROM public.user_roles 
    WHERE role = 'admin' AND is_active = true AND user_id != target_user_id;
    
    IF admin_count < 1 THEN
      RETURN jsonb_build_object(
        'success', false,
        'error', 'Cannot revoke admin role: This would leave no active administrators'
      );
    END IF;
  END IF;
  
  -- Set secure operation flag
  PERFORM set_config('app.secure_role_operation', 'admin_role_assignment', true);
  
  -- Deactivate existing roles for the user
  UPDATE public.user_roles
  SET is_active = false, updated_at = now()
  WHERE user_id = target_user_id AND is_active = true;
  
  -- Insert the new role assignment
  INSERT INTO public.user_roles (
    user_id, role, granted_by, expires_at
  ) VALUES (
    target_user_id, new_role, auth.uid(), expiration_date
  );
  
  -- Log successful role assignment
  INSERT INTO public.security_events (
    event_type, severity, user_id, event_data, source
  ) VALUES (
    'secure_role_assignment_completed', 'info', auth.uid(),
    jsonb_build_object(
      'target_user_id', target_user_id,
      'role_change', jsonb_build_object('from', target_current_role, 'to', new_role),
      'expiration_date', expiration_date,
      'granted_by', auth.uid(),
      'security_level', 'enhanced'
    ),
    'secure_role_management'
  );
    
  RETURN jsonb_build_object(
    'success', true,
    'message', 'Role assignment completed successfully',
    'role_change', jsonb_build_object('from', target_current_role, 'to', new_role)
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.validate_session_security(
  session_id uuid,
  client_ip inet,
  user_agent text,
  security_context jsonb DEFAULT '{}'::jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'  -- Fix: Set explicit search_path
AS $$
DECLARE
  session_data public.user_sessions;
  security_score integer := 0;
  alerts jsonb := '[]'::jsonb;
  action_required text := 'none';
BEGIN
  -- Get session data
  SELECT * INTO session_data
  FROM public.user_sessions
  WHERE id = session_id AND is_active = true;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'valid', false,
      'action', 'terminate_session',
      'reason', 'session_not_found'
    );
  END IF;
  
  -- Check session expiration
  IF session_data.expires_at < now() THEN
    UPDATE public.user_sessions SET is_active = false WHERE id = session_id;
    RETURN jsonb_build_object(
      'valid', false,
      'action', 'terminate_session',
      'reason', 'session_expired'
    );
  END IF;
  
  -- Advanced security checks
  IF session_data.ip_address != client_ip THEN
    security_score := security_score + 40;
    alerts := alerts || '"ip_address_mismatch"'::jsonb;
  END IF;
  
  IF session_data.user_agent != user_agent THEN
    security_score := security_score + 30;
    alerts := alerts || '"user_agent_mismatch"'::jsonb;
  END IF;
  
  -- Check for concurrent sessions (potential hijacking)
  IF (SELECT COUNT(*) FROM public.user_sessions 
      WHERE user_id = session_data.user_id 
      AND is_active = true 
      AND id != session_id
      AND created_at > now() - interval '5 minutes') >= 3 THEN
    security_score := security_score + 50;
    alerts := alerts || '"suspicious_concurrent_sessions"'::jsonb;
  END IF;
  
  -- Determine action based on security score
  IF security_score >= 70 THEN
    action_required := 'terminate_all_sessions';
  ELSIF security_score >= 40 THEN
    action_required := 'require_reauth';
  ELSIF security_score >= 20 THEN
    action_required := 'additional_verification';
  END IF;
  
  -- Log security validation
  INSERT INTO public.security_events (
    event_type, severity, user_id, ip_address, event_data, source
  ) VALUES (
    'session_security_validation',
    CASE 
      WHEN security_score >= 70 THEN 'critical'
      WHEN security_score >= 40 THEN 'high'
      WHEN security_score >= 20 THEN 'medium'
      ELSE 'info'
    END,
    session_data.user_id,
    client_ip,
    jsonb_build_object(
      'session_id', session_id,
      'security_score', security_score,
      'alerts', alerts,
      'action_required', action_required,
      'security_context', security_context
    ),
    'enhanced_session_security'
  );
  
  RETURN jsonb_build_object(
    'valid', security_score < 70,
    'security_score', security_score,
    'alerts', alerts,
    'action', action_required,
    'session_id', session_id
  );
END;
$$;