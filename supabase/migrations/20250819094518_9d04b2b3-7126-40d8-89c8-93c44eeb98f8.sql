-- Fix security linter warnings by setting search_path for all functions

-- 1. Fix verify_service_role_request function
CREATE OR REPLACE FUNCTION public.verify_service_role_request(operation_type text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  client_ip inet := inet_client_addr();
  allowed_operations text[] := ARRAY['security_event_log', 'session_management', 'rate_limit_check'];
BEGIN
  -- Verify operation type is allowed
  IF operation_type != ANY(allowed_operations) THEN
    INSERT INTO public.security_events (
      event_type, severity, event_data, source, ip_address
    ) VALUES (
      'unauthorized_service_operation', 'critical',
      jsonb_build_object('operation_type', operation_type, 'client_ip', client_ip),
      'service_role_verification', client_ip
    );
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$;

-- 2. Fix prevent_role_self_assignment function
CREATE OR REPLACE FUNCTION public.prevent_role_self_assignment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Prevent self-assignment of admin roles
  IF NEW.role = 'admin' AND NEW.user_id = auth.uid() AND NEW.granted_by = auth.uid() THEN
    INSERT INTO public.security_events (
      event_type, severity, user_id, event_data, source
    ) VALUES (
      'blocked_admin_self_assignment', 'critical', auth.uid(),
      jsonb_build_object('attempted_role', 'admin', 'user_id', NEW.user_id),
      'role_security_trigger'
    );
    RAISE EXCEPTION 'Self-assignment of admin role is not permitted';
  END IF;
  
  -- Log all role assignments for audit
  INSERT INTO public.security_events (
    event_type, severity, user_id, event_data, source
  ) VALUES (
    'role_assignment_attempt', 
    CASE NEW.role WHEN 'admin' THEN 'high' ELSE 'medium' END,
    NEW.granted_by,
    jsonb_build_object(
      'target_user', NEW.user_id,
      'assigned_role', NEW.role,
      'granted_by', NEW.granted_by
    ),
    'role_assignment_audit'
  );
  
  RETURN NEW;
END;
$$;

-- 3. Fix mask_consultation_data function
CREATE OR REPLACE FUNCTION public.mask_consultation_data(data_record jsonb, user_role text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  masked_record jsonb := data_record;
BEGIN
  -- Apply masking based on user role
  IF user_role != 'admin' THEN
    masked_record := jsonb_set(masked_record, '{name}', 
      to_jsonb(mask_sensitive_data(data_record->>'name', 'name')));
    masked_record := jsonb_set(masked_record, '{email}', 
      to_jsonb(mask_sensitive_data(data_record->>'email', 'email')));
    masked_record := jsonb_set(masked_record, '{phone}', 
      to_jsonb(mask_sensitive_data(data_record->>'phone', 'phone')));
    masked_record := jsonb_set(masked_record, '{company}', '"***REDACTED***"');
    masked_record := jsonb_set(masked_record, '{message}', '"***CONFIDENTIAL***"');
  END IF;
  
  RETURN masked_record;
END;
$$;

-- 4. Fix advanced_rate_limit_check function
CREATE OR REPLACE FUNCTION public.advanced_rate_limit_check(
  p_identifier text, 
  p_action text, 
  p_limit integer DEFAULT 100,
  p_window_seconds integer DEFAULT 3600,
  p_behavioral_score integer DEFAULT 50
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  attempts_count integer;
  window_start timestamp with time zone;
  adaptive_limit integer;
  is_blocked boolean := false;
  current_ip inet := inet_client_addr();
  suspicious_patterns integer := 0;
BEGIN
  window_start := now() - (p_window_seconds || ' seconds')::interval;
  
  -- Calculate adaptive limit based on behavioral score
  adaptive_limit := CASE 
    WHEN p_behavioral_score >= 80 THEN p_limit * 2
    WHEN p_behavioral_score <= 30 THEN GREATEST(p_limit / 3, 5)
    ELSE p_limit
  END;
  
  -- Count recent attempts
  SELECT COUNT(*) INTO attempts_count
  FROM public.security_events
  WHERE event_data->>'identifier' = p_identifier
    AND event_data->>'action' = p_action
    AND created_at > window_start;
  
  -- Check for suspicious patterns
  SELECT COUNT(*) INTO suspicious_patterns
  FROM public.security_events
  WHERE ip_address = current_ip
    AND severity IN ('high', 'critical')
    AND created_at > now() - interval '1 hour';
  
  -- Apply additional restrictions for suspicious behavior
  IF suspicious_patterns >= 3 THEN
    adaptive_limit := adaptive_limit / 2;
  END IF;
  
  is_blocked := attempts_count >= adaptive_limit;
  
  -- Log rate limit check with enhanced context
  INSERT INTO public.security_events (
    event_type, severity, ip_address, event_data, source
  ) VALUES (
    'advanced_rate_limit_check',
    CASE 
      WHEN is_blocked THEN 'high'
      WHEN attempts_count > (adaptive_limit * 0.8) THEN 'medium'
      ELSE 'info'
    END,
    current_ip,
    jsonb_build_object(
      'identifier', p_identifier,
      'action', p_action,
      'attempts_count', attempts_count,
      'adaptive_limit', adaptive_limit,
      'behavioral_score', p_behavioral_score,
      'suspicious_patterns', suspicious_patterns,
      'is_blocked', is_blocked,
      'window_seconds', p_window_seconds
    ),
    'advanced_rate_limiting'
  );
  
  RETURN jsonb_build_object(
    'allowed', NOT is_blocked,
    'attempts_count', attempts_count,
    'limit', adaptive_limit,
    'reset_time', extract(epoch from (window_start + (p_window_seconds || ' seconds')::interval)),
    'behavioral_score', p_behavioral_score,
    'suspicious_patterns', suspicious_patterns
  );
END;
$$;

-- 5. Fix get_consultation_secure_enhanced function
CREATE OR REPLACE FUNCTION public.get_consultation_secure_enhanced(consultation_id uuid)
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
  status text, 
  user_id uuid
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role text;
  access_granted boolean := false;
BEGIN
  -- Get current user role
  SELECT public.get_current_user_role() INTO user_role;
  
  -- Enhanced access control
  SELECT EXISTS(
    SELECT 1 FROM public.consultations c 
    WHERE c.id = consultation_id 
    AND (
      c.user_id = auth.uid() OR 
      user_role IN ('admin', 'moderator')
    )
  ) INTO access_granted;
  
  IF NOT access_granted THEN
    -- Log unauthorized access attempt
    INSERT INTO public.security_events (
      event_type, severity, user_id, event_data, source
    ) VALUES (
      'unauthorized_consultation_access_attempt', 'high', auth.uid(),
      jsonb_build_object(
        'consultation_id', consultation_id,
        'user_role', user_role,
        'access_method', 'secure_enhanced_function'
      ),
      'data_access_control'
    );
    RAISE EXCEPTION 'Unauthorized access to consultation data';
  END IF;
  
  -- Log successful access
  INSERT INTO public.security_events (
    event_type, severity, user_id, event_data, source
  ) VALUES (
    'consultation_data_accessed', 'medium', auth.uid(),
    jsonb_build_object(
      'consultation_id', consultation_id,
      'user_role', user_role,
      'access_granted', true
    ),
    'secure_data_access'
  );
  
  -- Return appropriately masked data
  RETURN QUERY
  SELECT 
    c.id,
    CASE 
      WHEN user_role = 'admin' OR auth.uid() = c.user_id THEN c.encrypted_name
      ELSE mask_sensitive_data(c.encrypted_name, 'name')
    END as name,
    CASE 
      WHEN user_role = 'admin' OR auth.uid() = c.user_id THEN c.encrypted_email
      ELSE mask_sensitive_data(c.encrypted_email, 'email')
    END as email,
    CASE 
      WHEN user_role = 'admin' OR auth.uid() = c.user_id THEN c.encrypted_phone
      ELSE mask_sensitive_data(c.encrypted_phone, 'phone')
    END as phone,
    CASE 
      WHEN user_role = 'admin' OR auth.uid() = c.user_id THEN c.company
      ELSE '***REDACTED***'
    END as company,
    c.loan_program,
    CASE 
      WHEN user_role = 'admin' OR auth.uid() = c.user_id THEN c.loan_amount
      ELSE 'CONFIDENTIAL'
    END as loan_amount,
    c.timeframe,
    CASE 
      WHEN user_role = 'admin' OR auth.uid() = c.user_id THEN c.message
      ELSE '***CONFIDENTIAL***'
    END as message,
    c.created_at,
    c.status,
    c.user_id
  FROM public.consultations c
  WHERE c.id = consultation_id;
END;
$$;