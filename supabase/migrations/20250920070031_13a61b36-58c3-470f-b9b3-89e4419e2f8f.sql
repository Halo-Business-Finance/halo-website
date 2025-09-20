-- Drop existing function to avoid parameter name conflict
DROP FUNCTION IF EXISTS public.verify_active_session_with_mfa(text, integer);

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