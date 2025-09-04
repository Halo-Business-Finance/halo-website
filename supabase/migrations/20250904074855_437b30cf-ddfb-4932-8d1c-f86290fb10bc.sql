-- CRITICAL SECURITY FIXES - Phase 1

-- 1. Fix Admin Bootstrap Security Issue
-- Create secure first admin function with proper validation
CREATE OR REPLACE FUNCTION public.create_first_admin(target_email text, admin_password text DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  target_user_id uuid;
  admin_count integer;
  result jsonb;
BEGIN
  -- Security: Check if ANY admins exist
  SELECT COUNT(*) INTO admin_count 
  FROM public.user_roles 
  WHERE role = 'admin' AND is_active = true;
  
  -- Only allow if absolutely no admins exist
  IF admin_count > 0 THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Admin users already exist. Use standard role assignment instead.',
      'admin_count', admin_count
    );
  END IF;
  
  -- Enhanced validation: Check if user exists in auth.users
  SELECT id INTO target_user_id 
  FROM auth.users 
  WHERE email = target_email AND email_confirmed_at IS NOT NULL;
  
  IF target_user_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'User not found or email not confirmed',
      'required_action', 'User must sign up and confirm email first'
    );
  END IF;
  
  -- Create profile if it doesn't exist
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (target_user_id, 'System Administrator')
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Assign admin role with enhanced security logging
  INSERT INTO public.user_roles (user_id, role, granted_by)
  VALUES (target_user_id, 'admin', target_user_id);
  
  -- Critical security event logging
  INSERT INTO public.security_events (
    event_type, severity, user_id, event_data, source
  ) VALUES (
    'first_admin_account_created', 'critical', target_user_id,
    jsonb_build_object(
      'target_user_id', target_user_id,
      'target_email', target_email,
      'bootstrap_completed', true,
      'security_review_required', true,
      'timestamp', now()
    ),
    'admin_bootstrap_security'
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'message', 'First admin account created successfully',
    'user_id', target_user_id,
    'next_steps', 'Complete security review and create additional admin accounts'
  );
END;
$function$;

-- 2. Enhanced PII Access Controls
-- Create secure customer data access function with role-based masking
CREATE OR REPLACE FUNCTION public.get_secure_customer_data(customer_id uuid, data_type text DEFAULT 'summary')
RETURNS TABLE(
  id uuid, 
  masked_name text, 
  masked_email text, 
  masked_phone text, 
  company text, 
  loan_program text, 
  status text,
  created_at timestamp with time zone,
  access_level text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  caller_role text;
  access_granted boolean := false;
BEGIN
  -- Get caller's role
  SELECT public.get_current_user_role() INTO caller_role;
  
  -- Determine access level based on role
  access_granted := (
    caller_role = 'admin' OR 
    (caller_role = 'moderator' AND data_type != 'full') OR
    (auth.uid() IS NOT NULL AND EXISTS(
      SELECT 1 FROM public.consultations c 
      WHERE c.id = customer_id AND c.user_id = auth.uid()
    ))
  );
  
  IF NOT access_granted THEN
    -- Log unauthorized access attempt
    INSERT INTO public.security_events (
      event_type, severity, user_id, event_data, source
    ) VALUES (
      'unauthorized_pii_access_attempt', 'high', auth.uid(),
      jsonb_build_object(
        'customer_id', customer_id,
        'requested_data_type', data_type,
        'caller_role', caller_role
      ),
      'pii_access_control'
    );
    
    RAISE EXCEPTION 'Unauthorized access to customer data';
  END IF;
  
  -- Log authorized access
  INSERT INTO public.security_events (
    event_type, severity, user_id, event_data, source
  ) VALUES (
    'authorized_pii_access', 'medium', auth.uid(),
    jsonb_build_object(
      'customer_id', customer_id,
      'data_type', data_type,
      'caller_role', caller_role,
      'access_method', 'secure_function'
    ),
    'pii_access_control'
  );
  
  -- Return data with appropriate masking based on role and data_type
  RETURN QUERY
  SELECT 
    c.id,
    CASE 
      WHEN caller_role = 'admin' AND data_type = 'full' THEN 
        public.mask_sensitive_data(c.encrypted_name, 'name')
      ELSE '***RESTRICTED***'
    END as masked_name,
    CASE 
      WHEN caller_role = 'admin' THEN 
        public.mask_sensitive_data(c.encrypted_email, 'email')
      ELSE '***@***.***'
    END as masked_email,
    CASE 
      WHEN caller_role = 'admin' THEN 
        public.mask_sensitive_data(c.encrypted_phone, 'phone')
      ELSE '***-***-****'
    END as masked_phone,
    CASE 
      WHEN caller_role = 'admin' THEN c.company
      ELSE 'BUSINESS ENTITY'
    END as company,
    c.loan_program,
    c.status,
    c.created_at,
    CASE 
      WHEN caller_role = 'admin' THEN 'full_admin'
      WHEN caller_role = 'moderator' THEN 'limited_staff'
      ELSE 'owner_only'
    END as access_level
  FROM public.consultations c
  WHERE c.id = customer_id;
END;
$function$;

-- 3. Strengthen Application Data RLS Policies
-- Drop overly broad policies and create more restrictive ones
DROP POLICY IF EXISTS "Secure admin application access" ON public.applications;
DROP POLICY IF EXISTS "Strict user application access" ON public.applications;

-- Create enhanced application access policies
CREATE POLICY "Enhanced admin application access" 
ON public.applications 
FOR ALL 
TO authenticated
USING (
  has_role(auth.uid(), 'admin') AND 
  auth.uid() IS NOT NULL AND
  -- Additional verification: admin must have recent session activity
  EXISTS(
    SELECT 1 FROM public.user_sessions 
    WHERE user_id = auth.uid() 
    AND is_active = true 
    AND last_activity > now() - interval '30 minutes'
  )
)
WITH CHECK (
  has_role(auth.uid(), 'admin') AND 
  auth.uid() IS NOT NULL
);

CREATE POLICY "Restricted user application access" 
ON public.applications 
FOR ALL 
TO authenticated
USING (
  auth.uid() IS NOT NULL AND 
  auth.uid() = user_id AND
  -- User can only access their own data with valid session
  EXISTS(
    SELECT 1 FROM public.user_sessions 
    WHERE user_id = auth.uid() 
    AND is_active = true 
    AND last_activity > now() - interval '2 hours'
  )
)
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  auth.uid() = user_id AND
  -- Additional validation for data integrity
  application_type IS NOT NULL AND
  business_name IS NOT NULL
);

-- 4. Implement Audit Log Protection
-- Make audit logs write-only for non-service roles
DROP POLICY IF EXISTS "Admin-only audit logs access" ON public.audit_logs;

CREATE POLICY "Audit logs - admin read only with verification" 
ON public.audit_logs 
FOR SELECT 
TO authenticated
USING (
  has_role(auth.uid(), 'admin') AND 
  auth.uid() IS NOT NULL AND
  -- Admin must have active session and recent security check
  EXISTS(
    SELECT 1 FROM public.user_sessions 
    WHERE user_id = auth.uid() 
    AND is_active = true 
    AND last_security_check > now() - interval '1 hour'
  )
);

-- Create audit protection function
CREATE OR REPLACE FUNCTION public.secure_audit_log_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  -- Prevent modification of audit logs by non-service roles
  IF auth.role() != 'service_role' AND TG_OP IN ('UPDATE', 'DELETE') THEN
    INSERT INTO public.security_events (
      event_type, severity, user_id, event_data, source
    ) VALUES (
      'audit_log_tampering_attempt', 'critical', auth.uid(),
      jsonb_build_object(
        'operation', TG_OP,
        'attempted_record_id', COALESCE(NEW.id, OLD.id),
        'ip_address', inet_client_addr()
      ),
      'audit_protection'
    );
    
    RAISE EXCEPTION 'Audit log modification not permitted';
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Apply audit protection trigger
DROP TRIGGER IF EXISTS protect_audit_logs ON public.audit_logs;
CREATE TRIGGER protect_audit_logs
  BEFORE UPDATE OR DELETE ON public.audit_logs
  FOR EACH ROW EXECUTE FUNCTION public.secure_audit_log_access();

-- 5. Implement Security Event Optimization
-- Enhanced function to reduce log flooding while preserving security
CREATE OR REPLACE FUNCTION public.intelligent_security_event_filter(
  p_event_type text,
  p_severity text,
  p_source text,
  p_ip_address inet DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  should_log boolean := true;
  recent_count integer;
  time_window interval;
BEGIN
  -- Determine filtering rules based on event type and severity
  CASE p_event_type
    WHEN 'client_log' THEN
      -- Aggressive filtering for client_log events
      time_window := interval '5 minutes';
      SELECT COUNT(*) INTO recent_count
      FROM public.security_events
      WHERE event_type = 'client_log'
        AND ip_address = p_ip_address
        AND created_at > now() - time_window;
      
      -- Allow max 2 client_log events per IP per 5 minutes
      should_log := recent_count < 2;
      
    WHEN 'session_anomaly_detected', 'unauthorized_access_attempt' THEN
      -- Critical events always logged but rate-limited per IP
      time_window := interval '1 minute';
      SELECT COUNT(*) INTO recent_count
      FROM public.security_events
      WHERE event_type = p_event_type
        AND ip_address = p_ip_address
        AND created_at > now() - time_window;
      
      -- Allow max 5 critical events per IP per minute
      should_log := recent_count < 5;
      
    ELSE
      -- Default: allow all other events with basic rate limiting
      time_window := interval '10 seconds';
      SELECT COUNT(*) INTO recent_count
      FROM public.security_events
      WHERE event_type = p_event_type
        AND ip_address = p_ip_address
        AND created_at > now() - time_window;
      
      should_log := recent_count < 10;
  END CASE;
  
  -- Always log critical severity events regardless of type
  IF p_severity = 'critical' THEN
    should_log := true;
  END IF;
  
  -- Log filtering activity for monitoring
  IF NOT should_log THEN
    INSERT INTO public.security_events (
      event_type, severity, event_data, source, ip_address
    ) VALUES (
      'security_event_filtered', 'info',
      jsonb_build_object(
        'filtered_event_type', p_event_type,
        'filtered_severity', p_severity,
        'recent_count', recent_count,
        'time_window_seconds', EXTRACT(epoch FROM time_window)
      ),
      'intelligent_filter', p_ip_address
    );
  END IF;
  
  RETURN should_log;
END;
$function$;

-- 6. Enhanced Encryption Key Security
-- Add additional security layer for encryption key access
CREATE OR REPLACE FUNCTION public.validate_encryption_key_access(
  p_key_identifier text,
  p_operation text DEFAULT 'read'
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  caller_role text;
  is_valid_session boolean;
  key_access_level text;
BEGIN
  -- Only service role and verified admins can access encryption keys
  IF auth.role() = 'service_role' THEN
    RETURN true;
  END IF;
  
  -- For user sessions, require admin role and active session
  SELECT public.get_current_user_role() INTO caller_role;
  
  IF caller_role != 'admin' THEN
    INSERT INTO public.security_events (
      event_type, severity, user_id, event_data, source
    ) VALUES (
      'unauthorized_encryption_key_access', 'critical', auth.uid(),
      jsonb_build_object(
        'key_identifier', p_key_identifier,
        'operation', p_operation,
        'caller_role', caller_role
      ),
      'encryption_key_security'
    );
    RETURN false;
  END IF;
  
  -- Verify admin has recent, active session with security check
  SELECT EXISTS(
    SELECT 1 FROM public.user_sessions 
    WHERE user_id = auth.uid() 
    AND is_active = true 
    AND last_security_check > now() - interval '15 minutes'
    AND security_level = 'enhanced'
  ) INTO is_valid_session;
  
  IF NOT is_valid_session THEN
    INSERT INTO public.security_events (
      event_type, severity, user_id, event_data, source
    ) VALUES (
      'encryption_key_access_invalid_session', 'high', auth.uid(),
      jsonb_build_object(
        'key_identifier', p_key_identifier,
        'operation', p_operation,
        'session_validation_failed', true
      ),
      'encryption_key_security'
    );
    RETURN false;
  END IF;
  
  -- Log successful key access
  INSERT INTO public.security_events (
    event_type, severity, user_id, event_data, source
  ) VALUES (
    'encryption_key_access_granted', 'high', auth.uid(),
    jsonb_build_object(
      'key_identifier', p_key_identifier,
      'operation', p_operation,
      'access_validation_passed', true
    ),
    'encryption_key_security'
  );
  
  RETURN true;
END;
$function$;