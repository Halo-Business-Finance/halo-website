-- Create the missing secure_assign_user_role_v2 function with enhanced security
CREATE OR REPLACE FUNCTION public.secure_assign_user_role_v2(
  target_user_id uuid, 
  new_role app_role, 
  expiration_date timestamp with time zone DEFAULT NULL,
  justification text DEFAULT 'Administrative action'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  assigner_role public.app_role;
  admin_count integer;
  target_current_role public.app_role;
  assignment_id uuid;
BEGIN
  -- Enhanced input validation
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'target_user_id cannot be null';
  END IF;
  
  IF new_role IS NULL THEN
    RAISE EXCEPTION 'new_role cannot be null';
  END IF;
  
  IF length(justification) < 10 THEN
    RAISE EXCEPTION 'justification must be at least 10 characters';
  END IF;
  
  -- Get the role of the user making the assignment
  SELECT public.get_user_role(auth.uid()) INTO assigner_role;
  
  -- Only admins can assign roles
  IF assigner_role != 'admin' THEN
    -- Log unauthorized attempt with sanitized data
    INSERT INTO public.security_events (
      event_type, severity, user_id, event_data, source
    ) VALUES (
      'unauthorized_role_assignment_attempt_v2', 'critical', auth.uid(),
      jsonb_build_object(
        'target_user_id', target_user_id,
        'attempted_role', new_role,
        'assigner_role', assigner_role,
        'justification_length', length(justification)
      ),
      'role_management_v2'
    );
    RAISE EXCEPTION 'Insufficient permissions to assign roles';
  END IF;
  
  -- Verify target user exists
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE user_id = target_user_id) THEN
    RAISE EXCEPTION 'Target user does not exist';
  END IF;
  
  -- Get current role of target user
  SELECT public.get_user_role(target_user_id) INTO target_current_role;
  
  -- Prevent admin role revocation if it would leave no admins
  IF target_current_role = 'admin' AND new_role != 'admin' THEN
    SELECT COUNT(*) INTO admin_count 
    FROM public.user_roles 
    WHERE role = 'admin' AND is_active = true AND user_id != target_user_id;
    
    IF admin_count < 1 THEN
      -- Log critical security event
      INSERT INTO public.security_events (
        event_type, severity, user_id, event_data, source
      ) VALUES (
        'admin_lockout_prevented_v2', 'critical', auth.uid(),
        jsonb_build_object(
          'target_user_id', target_user_id,
          'attempted_role_change', jsonb_build_object('from', 'admin', 'to', new_role),
          'remaining_admin_count', admin_count,
          'justification', left(justification, 100)
        ),
        'role_management_v2'
      );
      RAISE EXCEPTION 'Cannot revoke admin role: This would leave no active administrators';
    END IF;
  END IF;
  
  -- Prevent self-assignment of admin role (security measure)
  IF auth.uid() = target_user_id AND new_role = 'admin' AND target_current_role != 'admin' THEN
    INSERT INTO public.security_events (
      event_type, severity, user_id, event_data, source
    ) VALUES (
      'self_admin_assignment_blocked_v2', 'high', auth.uid(),
      jsonb_build_object(
        'attempted_self_promotion', true,
        'current_role', target_current_role,
        'attempted_role', new_role,
        'justification', left(justification, 100)
      ),
      'role_management_v2'
    );
    RAISE EXCEPTION 'Cannot assign admin role to yourself';
  END IF;
  
  -- Validate expiration date
  IF expiration_date IS NOT NULL AND expiration_date <= now() THEN
    RAISE EXCEPTION 'Expiration date must be in the future';
  END IF;
  
  -- Deactivate existing roles for the user
  UPDATE public.user_roles
  SET is_active = false, updated_at = now()
  WHERE user_id = target_user_id AND is_active = true;
  
  -- Insert the new role assignment
  INSERT INTO public.user_roles (
    user_id,
    role,
    granted_by,
    expires_at
  ) VALUES (
    target_user_id,
    new_role,
    auth.uid(),
    expiration_date
  ) RETURNING id INTO assignment_id;
  
  -- Log successful role assignment with audit trail
  INSERT INTO public.security_events (
    event_type, severity, user_id, event_data, source
  ) VALUES (
    'secure_role_assignment_completed_v2', 'info', auth.uid(),
    jsonb_build_object(
      'assignment_id', assignment_id,
      'target_user_id', target_user_id,
      'role_change', jsonb_build_object('from', target_current_role, 'to', new_role),
      'expiration_date', expiration_date,
      'granted_by', auth.uid(),
      'justification', left(justification, 200),
      'ip_address', inet_client_addr()
    ),
    'role_management_v2'
  );
  
  -- Return comprehensive result
  RETURN jsonb_build_object(
    'success', true,
    'assignment_id', assignment_id,
    'previous_role', target_current_role,
    'new_role', new_role,
    'expires_at', expiration_date,
    'message', 'Role assignment completed successfully'
  );
END;
$function$;