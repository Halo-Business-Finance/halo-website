-- Critical Security Fix: Admin Role Management Vulnerability
-- This prevents privilege escalation and ensures system security

-- 1. Create function to prevent admin lockout and validate role changes
CREATE OR REPLACE FUNCTION public.secure_assign_user_role(
  target_user_id uuid, 
  new_role app_role, 
  expiration_date timestamp with time zone DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
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
$$;

-- 2. Create function to securely revoke roles with safety checks
CREATE OR REPLACE FUNCTION public.secure_revoke_user_role(
  target_user_id uuid,
  role_to_revoke app_role,
  reason text DEFAULT 'Administrative action'
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
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
$$;

-- 3. Enhanced consultation security with better data protection
CREATE OR REPLACE FUNCTION public.secure_consultation_access_log()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
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
      WHEN 'SELECT' THEN 'consultation_pii_accessed'
      WHEN 'INSERT' THEN 'consultation_pii_created'
      WHEN 'UPDATE' THEN 'consultation_pii_modified'
      WHEN 'DELETE' THEN 'consultation_pii_deleted'
    END,
    CASE TG_OP
      WHEN 'DELETE' THEN 'critical'
      WHEN 'UPDATE' THEN 'high'
      WHEN 'SELECT' THEN 'high'  -- Increased from medium due to PII access
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
$$;

-- Apply the enhanced trigger to consultations table
DROP TRIGGER IF EXISTS secure_consultation_data ON public.consultations;
CREATE TRIGGER secure_consultation_access_logging
  BEFORE SELECT OR INSERT OR UPDATE OR DELETE ON public.consultations
  FOR EACH ROW EXECUTE FUNCTION public.secure_consultation_access_log();

-- 4. Create session anomaly detection function
CREATE OR REPLACE FUNCTION public.detect_session_anomaly(
  session_id uuid,
  new_ip inet,
  new_user_agent text,
  new_fingerprint text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  session_data public.user_sessions;
  anomaly_score integer := 0;
  anomalies jsonb := '[]'::jsonb;
  risk_level text := 'low';
BEGIN
  -- Get session data
  SELECT * INTO session_data
  FROM public.user_sessions
  WHERE id = session_id AND is_active = true;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'anomaly_detected', true,
      'risk_level', 'critical',
      'anomalies', '["session_not_found"]'::jsonb,
      'score', 100
    );
  END IF;
  
  -- Check IP address anomaly
  IF session_data.ip_address != new_ip THEN
    anomaly_score := anomaly_score + 30;
    anomalies := anomalies || '"ip_address_change"'::jsonb;
  END IF;
  
  -- Check user agent anomaly
  IF session_data.user_agent IS NOT NULL AND session_data.user_agent != new_user_agent THEN
    anomaly_score := anomaly_score + 20;
    anomalies := anomalies || '"user_agent_change"'::jsonb;
  END IF;
  
  -- Check fingerprint anomaly
  IF session_data.client_fingerprint IS NOT NULL AND session_data.client_fingerprint != new_fingerprint THEN
    anomaly_score := anomaly_score + 25;
    anomalies := anomalies || '"client_fingerprint_change"'::jsonb;
  END IF;
  
  -- Determine risk level
  IF anomaly_score >= 50 THEN
    risk_level := 'critical';
  ELSIF anomaly_score >= 30 THEN
    risk_level := 'high';
  ELSIF anomaly_score >= 15 THEN
    risk_level := 'medium';
  END IF;
  
  -- Log anomaly if detected
  IF anomaly_score > 0 THEN
    INSERT INTO public.security_events (
      event_type, severity, user_id, ip_address, event_data, source
    ) VALUES (
      'session_anomaly_detected', 
      CASE risk_level
        WHEN 'critical' THEN 'critical'
        WHEN 'high' THEN 'high'
        WHEN 'medium' THEN 'medium'
        ELSE 'low'
      END,
      session_data.user_id,
      new_ip,
      jsonb_build_object(
        'session_id', session_id,
        'anomaly_score', anomaly_score,
        'detected_anomalies', anomalies,
        'risk_level', risk_level,
        'original_ip', session_data.ip_address,
        'new_ip', new_ip,
        'original_user_agent', session_data.user_agent,
        'new_user_agent', new_user_agent
      ),
      'session_anomaly_detection'
    );
  END IF;
  
  RETURN jsonb_build_object(
    'anomaly_detected', anomaly_score > 0,
    'risk_level', risk_level,
    'anomalies', anomalies,
    'score', anomaly_score
  );
END;
$$;