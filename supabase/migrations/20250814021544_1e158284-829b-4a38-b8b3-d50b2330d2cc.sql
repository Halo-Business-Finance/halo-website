-- Phase 3: Input Validation and Security Triggers

-- 1. Consultation spam prevention trigger
CREATE OR REPLACE FUNCTION public.prevent_consultation_spam()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  recent_count integer;
BEGIN
  -- Check for spam submissions (same email/user within 1 hour)
  SELECT COUNT(*) INTO recent_count
  FROM public.consultations
  WHERE (email = NEW.email OR user_id = NEW.user_id)
    AND created_at > now() - interval '1 hour'
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid);
  
  IF recent_count >= 3 THEN
    -- Log potential spam attempt
    INSERT INTO public.security_events (
      event_type,
      severity,
      user_id,
      event_data,
      source
    ) VALUES (
      'potential_spam_consultation',
      'high',
      auth.uid(),
      jsonb_build_object(
        'email', NEW.email,
        'user_id', NEW.user_id,
        'recent_submissions', recent_count
      ),
      'spam_prevention'
    );
    
    RAISE EXCEPTION 'Too many consultation requests. Please wait before submitting another request.';
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Create trigger for spam prevention
DROP TRIGGER IF EXISTS prevent_consultation_spam_trigger ON public.consultations;
CREATE TRIGGER prevent_consultation_spam_trigger
  BEFORE INSERT ON public.consultations
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_consultation_spam();

-- 2. Consultation user validation trigger
CREATE OR REPLACE FUNCTION public.validate_consultation_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  -- Ensure user_id is not null and matches authenticated user
  IF NEW.user_id IS NULL THEN
    RAISE EXCEPTION 'user_id cannot be null for consultation submissions';
  END IF;
  
  -- For security, ensure user_id matches the authenticated user
  IF auth.uid() IS NOT NULL AND NEW.user_id != auth.uid() THEN
    RAISE EXCEPTION 'user_id must match authenticated user';
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Create trigger for consultation user validation
DROP TRIGGER IF EXISTS validate_consultation_user_trigger ON public.consultations;
CREATE TRIGGER validate_consultation_user_trigger
  BEFORE INSERT OR UPDATE ON public.consultations
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_consultation_user();

-- 3. Security events trigger for consultation access logging
CREATE OR REPLACE FUNCTION public.secure_consultation_access_log()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  -- Log all consultation data access with enhanced details
  INSERT INTO public.security_events (
    event_type,
    severity,
    user_id,
    ip_address,
    event_data,
    source
  ) VALUES (
    CASE TG_OP
      WHEN 'INSERT' THEN 'consultation_pii_created'
      WHEN 'UPDATE' THEN 'consultation_pii_modified'
      WHEN 'DELETE' THEN 'consultation_pii_deleted'
    END,
    CASE TG_OP
      WHEN 'DELETE' THEN 'critical'
      WHEN 'UPDATE' THEN 'high'
      ELSE 'medium'
    END,
    auth.uid(),
    inet_client_addr(),
    jsonb_build_object(
      'consultation_id', COALESCE(NEW.id, OLD.id),
      'operation', TG_OP,
      'user_role', public.get_current_user_role(),
      'timestamp', now(),
      'contains_pii', true,
      'data_sensitivity', 'high',
      'access_reason', CASE 
        WHEN public.get_current_user_role() = 'admin' THEN 'administrative_access'
        WHEN auth.uid() = COALESCE(NEW.user_id, OLD.user_id) THEN 'owner_access'
        ELSE 'authorized_access'
      END
    ),
    'pii_protection_trigger'
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Create trigger for consultation access logging
DROP TRIGGER IF EXISTS secure_consultation_access_trigger ON public.consultations;
CREATE TRIGGER secure_consultation_access_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.consultations
  FOR EACH ROW
  EXECUTE FUNCTION public.secure_consultation_access_log();

-- 4. Role management security triggers
CREATE OR REPLACE FUNCTION public.secure_assign_user_role(target_user_id uuid, new_role app_role, expiration_date timestamp with time zone DEFAULT NULL::timestamp with time zone)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  assigner_role public.app_role;
  admin_count integer;
  target_current_role public.app_role;
BEGIN
  -- Get the role of the user making the assignment
  SELECT public.get_user_role(auth.uid()) INTO assigner_role;
  
  -- Only admins can assign roles
  IF assigner_role != 'admin' THEN
    -- Log unauthorized attempt
    INSERT INTO public.security_events (
      event_type, severity, user_id, event_data, source
    ) VALUES (
      'unauthorized_role_assignment_attempt', 'critical', auth.uid(),
      jsonb_build_object(
        'target_user_id', target_user_id,
        'attempted_role', new_role,
        'assigner_role', assigner_role
      ),
      'role_management'
    );
    RAISE EXCEPTION 'Insufficient permissions to assign roles';
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
        'admin_lockout_prevented', 'critical', auth.uid(),
        jsonb_build_object(
          'target_user_id', target_user_id,
          'attempted_role_change', jsonb_build_object('from', 'admin', 'to', new_role),
          'remaining_admin_count', admin_count
        ),
        'role_management'
      );
      RAISE EXCEPTION 'Cannot revoke admin role: This would leave no active administrators';
    END IF;
  END IF;
  
  -- Prevent self-assignment of admin role (security measure)
  IF auth.uid() = target_user_id AND new_role = 'admin' AND target_current_role != 'admin' THEN
    INSERT INTO public.security_events (
      event_type, severity, user_id, event_data, source
    ) VALUES (
      'self_admin_assignment_blocked', 'high', auth.uid(),
      jsonb_build_object(
        'attempted_self_promotion', true,
        'current_role', target_current_role,
        'attempted_role', new_role
      ),
      'role_management'
    );
    RAISE EXCEPTION 'Cannot assign admin role to yourself';
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
      'granted_by', auth.uid()
    ),
    'role_management'
  );
    
  RETURN TRUE;
END;
$function$;

-- 5. Role revocation function with security checks
CREATE OR REPLACE FUNCTION public.secure_revoke_user_role(target_user_id uuid, role_to_revoke app_role, reason text DEFAULT 'Administrative action'::text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  revoker_role public.app_role;
  admin_count integer;
BEGIN
  -- Get the role of the user making the revocation
  SELECT public.get_user_role(auth.uid()) INTO revoker_role;
  
  -- Only admins can revoke roles
  IF revoker_role != 'admin' THEN
    INSERT INTO public.security_events (
      event_type, severity, user_id, event_data, source
    ) VALUES (
      'unauthorized_role_revocation_attempt', 'critical', auth.uid(),
      jsonb_build_object(
        'target_user_id', target_user_id,
        'attempted_revoke_role', role_to_revoke,
        'revoker_role', revoker_role,
        'reason', reason
      ),
      'role_management'
    );
    RAISE EXCEPTION 'Insufficient permissions to revoke roles';
  END IF;
  
  -- Prevent revoking admin role if it would leave no admins
  IF role_to_revoke = 'admin' THEN
    SELECT COUNT(*) INTO admin_count 
    FROM public.user_roles 
    WHERE role = 'admin' AND is_active = true AND user_id != target_user_id;
    
    IF admin_count < 1 THEN
      INSERT INTO public.security_events (
        event_type, severity, user_id, event_data, source
      ) VALUES (
        'admin_role_revocation_blocked', 'critical', auth.uid(),
        jsonb_build_object(
          'target_user_id', target_user_id,
          'remaining_admin_count', admin_count,
          'reason', reason
        ),
        'role_management'
      );
      RAISE EXCEPTION 'Cannot revoke admin role: This would leave no active administrators';
    END IF;
  END IF;
  
  -- Revoke the specific role
  UPDATE public.user_roles
  SET 
    is_active = false, 
    updated_at = now()
  WHERE user_id = target_user_id 
    AND role = role_to_revoke 
    AND is_active = true;
  
  -- Log the revocation
  INSERT INTO public.security_events (
    event_type, severity, user_id, event_data, source
  ) VALUES (
    'secure_role_revocation_completed', 'medium', auth.uid(),
    jsonb_build_object(
      'target_user_id', target_user_id,
      'revoked_role', role_to_revoke,
      'reason', reason,
      'revoked_by', auth.uid()
    ),
    'role_management'
  );
    
  RETURN TRUE;
END;
$function$;

-- 6. Session table audit trigger
CREATE OR REPLACE FUNCTION public.audit_session_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  -- Log any direct table access (should only happen through functions)
  INSERT INTO public.security_events (
    event_type, severity, user_id, event_data, source
  ) VALUES (
    'direct_session_table_access', 'critical', auth.uid(),
    jsonb_build_object(
      'operation', TG_OP,
      'table_name', TG_TABLE_NAME,
      'user_role', public.get_current_user_role(),
      'session_id', COALESCE(NEW.id, OLD.id)
    ),
    'audit_trigger'
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Create trigger for session table auditing
DROP TRIGGER IF EXISTS audit_session_access_trigger ON public.user_sessions;
CREATE TRIGGER audit_session_access_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.user_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_session_access();