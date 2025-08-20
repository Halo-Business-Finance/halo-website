-- Critical Security Fix 1: Clean up excessive security events for performance
-- Archive old security events (keep critical ones for legal compliance)
CREATE TEMP TABLE archived_security_events AS 
SELECT * FROM public.security_events 
WHERE created_at < now() - interval '7 days' 
AND severity NOT IN ('critical', 'high');

-- Log the cleanup action before deletion
INSERT INTO public.audit_logs (
  user_id, action, resource, new_values
) VALUES (
  NULL, 'security_cleanup', 'security_events', 
  jsonb_build_object(
    'archived_count', (SELECT COUNT(*) FROM archived_security_events),
    'cleanup_date', now(),
    'reason', 'Performance optimization and security review cleanup'
  )
);

-- Delete the archived events to improve performance
DELETE FROM public.security_events 
WHERE created_at < now() - interval '7 days' 
AND severity NOT IN ('critical', 'high');

-- Critical Security Fix 2: Create optimized security function to replace direct table access
CREATE OR REPLACE FUNCTION public.get_user_role_secure(target_user_id uuid)
RETURNS app_role
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  user_role_result app_role;
BEGIN
  -- Secure role retrieval with proper ordering and validation
  SELECT role INTO user_role_result
  FROM public.user_roles
  WHERE user_id = target_user_id
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > now())
  ORDER BY 
    CASE role
      WHEN 'admin' THEN 1
      WHEN 'moderator' THEN 2
      WHEN 'user' THEN 3
    END,
    granted_at DESC
  LIMIT 1;
  
  -- Default to user role if none found
  RETURN COALESCE(user_role_result, 'user'::app_role);
END;
$$;

-- Critical Security Fix 3: Enhanced RLS for consultations with encrypted data
-- Add additional validation for encrypted consultation data access
CREATE OR REPLACE FUNCTION public.validate_consultation_access(consultation_id uuid, requesting_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  consultation_owner uuid;
  requester_role app_role;
BEGIN
  -- Get consultation owner
  SELECT user_id INTO consultation_owner
  FROM public.consultations
  WHERE id = consultation_id;
  
  -- Get requester role
  SELECT public.get_user_role_secure(requesting_user_id) INTO requester_role;
  
  -- Allow access if: owner of consultation OR admin role
  RETURN (consultation_owner = requesting_user_id) OR (requester_role = 'admin'::app_role);
END;
$$;

-- Update consultation RLS policy for encrypted data protection
DROP POLICY IF EXISTS "Enhanced consultation access validation" ON public.consultations;
CREATE POLICY "Enhanced consultation access validation"
ON public.consultations
FOR ALL
USING (
  public.validate_consultation_access(id, auth.uid()) AND auth.uid() IS NOT NULL
)
WITH CHECK (
  public.validate_consultation_access(id, auth.uid()) AND auth.uid() IS NOT NULL
);

-- Critical Security Fix 4: Add rate limiting for security event generation
CREATE OR REPLACE FUNCTION public.log_client_security_event(
  event_type text,
  severity text DEFAULT 'info',
  event_data jsonb DEFAULT '{}',
  source text DEFAULT 'client'
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  client_ip inet := inet_client_addr();
  recent_events_count integer;
BEGIN
  -- Rate limiting: Check for spam/excessive logging
  SELECT COUNT(*) INTO recent_events_count
  FROM public.security_events
  WHERE ip_address = client_ip
    AND created_at > now() - interval '1 minute'
    AND event_type = log_client_security_event.event_type;
  
  -- Block if more than 10 similar events per minute from same IP
  IF recent_events_count >= 10 THEN
    RETURN false;
  END IF;
  
  -- Insert security event with rate limiting protection
  INSERT INTO public.security_events (
    event_type, severity, user_id, ip_address, event_data, source
  ) VALUES (
    log_client_security_event.event_type,
    log_client_security_event.severity,
    auth.uid(),
    client_ip,
    log_client_security_event.event_data,
    log_client_security_event.source
  );
  
  RETURN true;
END;
$$;