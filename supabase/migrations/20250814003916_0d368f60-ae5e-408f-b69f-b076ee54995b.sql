-- PHASE 1: CRITICAL DATA SECURITY FIX
-- Secure historical consultation records and prevent future exposure

-- Step 1: Archive orphaned consultation records to audit logs for compliance
-- This preserves the data for legal/audit purposes while removing PII exposure
INSERT INTO public.audit_logs (
  user_id,
  action,
  resource,
  resource_id,
  old_values,
  created_at
)
SELECT 
  NULL as user_id,
  'historical_data_archived' as action,
  'consultations' as resource,
  id as resource_id,
  jsonb_build_object(
    'id', id,
    'name', name,
    'email', email,
    'phone', phone,
    'company', company,
    'loan_program', loan_program,
    'loan_amount', loan_amount,
    'message', message,
    'status', status,
    'created_at', created_at,
    'archived_reason', 'orphaned_user_id_security_fix'
  ) as old_values,
  now() as created_at
FROM public.consultations 
WHERE user_id IS NULL;

-- Step 2: Delete orphaned records after archiving (they lack proper ownership)
DELETE FROM public.consultations WHERE user_id IS NULL;

-- Step 3: Make user_id NOT NULL to prevent future orphaned records
ALTER TABLE public.consultations ALTER COLUMN user_id SET NOT NULL;

-- Step 4: Add constraint to ensure user_id references valid users
-- Note: We can't add foreign key to auth.users, so we add a validation function
CREATE OR REPLACE FUNCTION validate_consultation_user()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to validate consultation user on insert/update
CREATE TRIGGER validate_consultation_user_trigger
  BEFORE INSERT OR UPDATE ON public.consultations
  FOR EACH ROW
  EXECUTE FUNCTION validate_consultation_user();

-- PHASE 2: ENHANCED SECURITY MONITORING

-- Create function to properly log client-side security events to database
CREATE OR REPLACE FUNCTION log_client_security_event(
  event_type text,
  severity text,
  event_data jsonb DEFAULT '{}',
  user_agent text DEFAULT NULL,
  source text DEFAULT 'client'
)
RETURNS uuid AS $$
DECLARE
  event_id uuid;
  calculated_risk_score integer;
BEGIN
  -- Calculate risk score based on event type and severity
  calculated_risk_score := CASE severity
    WHEN 'critical' THEN 100
    WHEN 'high' THEN 75
    WHEN 'medium' THEN 50
    WHEN 'low' THEN 25
    ELSE 10
  END;
  
  -- Increase risk for specific suspicious events
  calculated_risk_score := calculated_risk_score + CASE event_type
    WHEN 'console_access_attempt' THEN 20
    WHEN 'dom_manipulation_detected' THEN 30
    WHEN 'developer_tools_detected' THEN 15
    WHEN 'external_api_call' THEN 10
    ELSE 0
  END;
  
  -- Insert security event
  INSERT INTO public.security_events (
    event_type,
    severity,
    user_id,
    ip_address,
    user_agent,
    event_data,
    source,
    risk_score
  ) VALUES (
    event_type,
    severity,
    auth.uid(),
    inet_client_addr(),
    user_agent,
    event_data,
    source,
    calculated_risk_score
  ) RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create RLS policy for the new function
CREATE POLICY "Authenticated users can log security events via function" 
ON public.security_events 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

-- PHASE 3: ADMIN USER INITIALIZATION SECURITY

-- Create secure admin initialization with additional safeguards
CREATE OR REPLACE FUNCTION secure_initialize_admin(
  admin_email text,
  confirmation_token text DEFAULT NULL
)
RETURNS boolean AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PHASE 4: SESSION SECURITY ENHANCEMENT

-- Add function to invalidate suspicious sessions
CREATE OR REPLACE FUNCTION invalidate_suspicious_sessions(
  target_user_id uuid,
  reason text
)
RETURNS integer AS $$
DECLARE
  invalidated_count integer;
BEGIN
  -- Only admins or the user themselves can invalidate sessions
  IF NOT (has_role(auth.uid(), 'admin') OR auth.uid() = target_user_id) THEN
    RAISE EXCEPTION 'Insufficient permissions to invalidate sessions';
  END IF;
  
  -- Mark sessions as inactive
  UPDATE public.user_sessions 
  SET 
    is_active = false,
    last_activity = now()
  WHERE user_id = target_user_id 
    AND is_active = true;
  
  GET DIAGNOSTICS invalidated_count = ROW_COUNT;
  
  -- Log session invalidation
  INSERT INTO public.security_events (
    event_type,
    severity,
    user_id,
    event_data,
    source
  ) VALUES (
    'sessions_invalidated',
    'high',
    target_user_id,
    jsonb_build_object(
      'invalidated_count', invalidated_count,
      'reason', reason,
      'invalidated_by', auth.uid()
    ),
    'system'
  );
  
  RETURN invalidated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;