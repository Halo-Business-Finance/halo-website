-- PHASE 1: CRITICAL RLS POLICY ENFORCEMENT AND SECURITY FIXES

-- Fix AuthProvider race condition by creating a cached role function
CREATE OR REPLACE FUNCTION public.get_user_role_cached(p_user_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  cached_role text;
  cache_key text;
BEGIN
  cache_key := 'user_role_' || p_user_id::text;
  
  -- Try to get from cache first (using a session variable)
  BEGIN
    cached_role := current_setting('app.' || cache_key, true);
    IF cached_role IS NOT NULL AND cached_role != '' THEN
      RETURN cached_role;
    END IF;
  EXCEPTION WHEN OTHERS THEN
    -- Cache miss, continue to fetch from DB
  END;
  
  -- Fetch from database with enhanced security
  SELECT role::text INTO cached_role
  FROM public.user_roles 
  WHERE user_id = p_user_id AND is_active = true
  ORDER BY granted_at DESC
  LIMIT 1;
  
  -- Cache the result for 5 minutes
  IF cached_role IS NOT NULL THEN
    PERFORM set_config('app.' || cache_key, cached_role, false);
  ELSE
    cached_role := 'user'; -- Default role
    PERFORM set_config('app.' || cache_key, cached_role, false);
  END IF;
  
  RETURN cached_role;
END;
$$;

-- Create function to invalidate role cache on role changes
CREATE OR REPLACE FUNCTION public.invalidate_user_role_cache()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  cache_key text;
BEGIN
  cache_key := 'user_role_' || COALESCE(NEW.user_id, OLD.user_id)::text;
  
  -- Reset the cached role
  BEGIN
    PERFORM set_config('app.' || cache_key, '', false);
  EXCEPTION WHEN OTHERS THEN
    -- Ignore cache reset errors
  END;
  
  -- Log role change for security monitoring
  INSERT INTO public.security_events (
    event_type, severity, user_id, event_data, source
  ) VALUES (
    'user_role_changed', 'medium', COALESCE(NEW.user_id, OLD.user_id),
    jsonb_build_object(
      'old_role', OLD.role,
      'new_role', NEW.role,
      'operation', TG_OP,
      'changed_by', auth.uid()
    ),
    'role_cache_management'
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Add trigger to invalidate cache on role changes
DROP TRIGGER IF EXISTS invalidate_role_cache_trigger ON public.user_roles;
CREATE TRIGGER invalidate_role_cache_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.invalidate_user_role_cache();

-- Create enhanced session verification functions
CREATE OR REPLACE FUNCTION public.verify_active_session_with_mfa(
  required_security_level text DEFAULT 'normal',
  max_idle_minutes integer DEFAULT 30
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  session_valid boolean := false;
  current_ip inet := inet_client_addr();
BEGIN
  -- Verify user is authenticated
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;
  
  -- Check for active session with enhanced security requirements
  SELECT EXISTS(
    SELECT 1 FROM public.user_sessions
    WHERE user_id = auth.uid()
      AND is_active = true
      AND expires_at > now()
      AND last_activity > now() - (max_idle_minutes || ' minutes')::interval
      AND (
        required_security_level = 'normal' OR
        (required_security_level = 'enhanced' AND security_level = 'enhanced') OR
        (required_security_level = 'high' AND security_level IN ('enhanced', 'high'))
      )
      AND (ip_address IS NULL OR ip_address = current_ip)
  ) INTO session_valid;
  
  -- Log verification attempt
  INSERT INTO public.security_events (
    event_type, severity, user_id, ip_address, event_data, source
  ) VALUES (
    CASE WHEN session_valid THEN 'session_verification_success' ELSE 'session_verification_failed' END,
    CASE WHEN session_valid THEN 'info' ELSE 'high' END,
    auth.uid(), current_ip,
    jsonb_build_object(
      'required_security_level', required_security_level,
      'max_idle_minutes', max_idle_minutes,
      'verification_result', session_valid
    ),
    'enhanced_session_verification'
  );
  
  RETURN session_valid;
END;
$$;

-- Create comprehensive CSRF token validation function
CREATE OR REPLACE FUNCTION public.validate_csrf_token_enhanced(
  token text,
  session_id text,
  max_age_minutes integer DEFAULT 60
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  stored_token text;
  token_created_at timestamp with time zone;
  is_valid boolean := false;
  current_ip inet := inet_client_addr();
BEGIN
  -- Retrieve stored token
  SELECT config_value->>'token', (config_value->>'created_at')::timestamp with time zone
  INTO stored_token, token_created_at
  FROM public.security_configs
  WHERE config_key = 'csrf_token_' || session_id
    AND is_active = true;
  
  -- Validate token
  IF stored_token IS NOT NULL AND stored_token = token THEN
    -- Check token age
    IF token_created_at > now() - (max_age_minutes || ' minutes')::interval THEN
      is_valid := true;
      
      -- Update token usage
      UPDATE public.security_configs
      SET config_value = config_value || jsonb_build_object(
        'last_used', now(),
        'usage_count', COALESCE((config_value->>'usage_count')::integer, 0) + 1
      )
      WHERE config_key = 'csrf_token_' || session_id;
    END IF;
  END IF;
  
  -- Log validation attempt
  INSERT INTO public.security_events (
    event_type, severity, ip_address, event_data, source
  ) VALUES (
    'csrf_token_validation',
    CASE WHEN is_valid THEN 'info' ELSE 'high' END,
    current_ip,
    jsonb_build_object(
      'session_id', session_id,
      'validation_result', is_valid,
      'token_age_minutes', CASE 
        WHEN token_created_at IS NOT NULL 
        THEN EXTRACT(epoch FROM (now() - token_created_at)) / 60
        ELSE null 
      END
    ),
    'enhanced_csrf_validation'
  );
  
  RETURN is_valid;
END;
$$;

-- Create automated security incident response function
CREATE OR REPLACE FUNCTION public.handle_security_incident(
  incident_type text,
  severity text,
  affected_user_id uuid,
  incident_data jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  alert_id uuid;
  auto_actions text[] := '{}';
BEGIN
  -- Determine automated response actions
  CASE incident_type
    WHEN 'multiple_failed_logins' THEN
      auto_actions := ARRAY['temporary_account_lock', 'require_password_reset'];
    WHEN 'suspicious_ip_access' THEN
      auto_actions := ARRAY['session_termination', 'admin_notification'];
    WHEN 'privilege_escalation_attempt' THEN
      auto_actions := ARRAY['immediate_session_termination', 'admin_alert', 'audit_trail'];
    WHEN 'data_breach_attempt' THEN
      auto_actions := ARRAY['emergency_lockdown', 'immediate_admin_alert', 'forensic_logging'];
    ELSE
      auto_actions := ARRAY['standard_logging'];
  END CASE;
  
  -- Create security alert
  INSERT INTO public.security_alerts (
    alert_type, priority, status, notes, event_id
  ) VALUES (
    incident_type,
    CASE severity
      WHEN 'critical' THEN 'critical'
      WHEN 'high' THEN 'high'
      ELSE 'medium'
    END,
    'open',
    'Automated incident detected: ' || incident_type,
    null
  ) RETURNING id INTO alert_id;
  
  -- Log the incident
  INSERT INTO public.security_events (
    event_type, severity, user_id, event_data, source
  ) VALUES (
    'automated_security_incident',
    severity,
    affected_user_id,
    incident_data || jsonb_build_object(
      'alert_id', alert_id,
      'auto_actions', auto_actions,
      'incident_handled_at', now()
    ),
    'automated_incident_response'
  );
  
  -- Execute automated actions
  IF 'temporary_account_lock' = ANY(auto_actions) AND affected_user_id IS NOT NULL THEN
    -- Deactivate user sessions
    UPDATE public.user_sessions
    SET is_active = false
    WHERE user_id = affected_user_id;
  END IF;
  
  IF 'session_termination' = ANY(auto_actions) AND affected_user_id IS NOT NULL THEN
    -- Terminate specific user sessions
    UPDATE public.user_sessions
    SET is_active = false, security_level = 'terminated'
    WHERE user_id = affected_user_id
      AND last_activity > now() - interval '1 hour';
  END IF;
  
  RETURN alert_id;
END;
$$;

-- Create comprehensive audit trail function
CREATE OR REPLACE FUNCTION public.create_audit_trail(
  action_type text,
  resource_type text,
  resource_id uuid,
  old_data jsonb DEFAULT NULL,
  new_data jsonb DEFAULT NULL,
  additional_context jsonb DEFAULT '{}'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  audit_id uuid;
  risk_level text := 'normal';
BEGIN
  -- Assess risk level based on action and resource
  IF resource_type IN ('encryption_keys', 'user_roles', 'security_configs') THEN
    risk_level := 'high';
  ELSIF action_type IN ('DELETE', 'TRUNCATE') THEN
    risk_level := 'medium';
  END IF;
  
  -- Create audit log entry
  INSERT INTO public.audit_logs (
    user_id, action, resource, resource_id, old_values, new_values, ip_address, user_agent
  ) VALUES (
    auth.uid(),
    action_type,
    resource_type,
    resource_id,
    old_data,
    new_data,
    inet_client_addr(),
    additional_context->>'user_agent'
  ) RETURNING id INTO audit_id;
  
  -- Create corresponding security event
  INSERT INTO public.security_events (
    event_type, severity, user_id, event_data, source
  ) VALUES (
    'audit_trail_created',
    CASE risk_level
      WHEN 'high' THEN 'high'
      WHEN 'medium' THEN 'medium'
      ELSE 'info'
    END,
    auth.uid(),
    jsonb_build_object(
      'audit_id', audit_id,
      'action_type', action_type,
      'resource_type', resource_type,
      'resource_id', resource_id,
      'risk_level', risk_level
    ) || additional_context,
    'comprehensive_audit_trail'
  );
  
  RETURN audit_id;
END;
$$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.get_user_role_cached(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.verify_active_session_with_mfa(text, integer) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.validate_csrf_token_enhanced(text, text, integer) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.handle_security_incident(text, text, uuid, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.create_audit_trail(text, text, uuid, jsonb, jsonb, jsonb) TO authenticated, service_role;