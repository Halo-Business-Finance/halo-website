-- Fix user_sessions RLS policies to prevent session hijacking
-- Drop existing permissive policies that expose session data
DROP POLICY IF EXISTS "Users can view limited session metadata only" ON public.user_sessions;
DROP POLICY IF EXISTS "Admin full access with logging" ON public.user_sessions;

-- Create highly restrictive policies that block all direct access
CREATE POLICY "Block all direct session access" 
ON public.user_sessions 
FOR ALL 
USING (false) 
WITH CHECK (false);

-- Allow only service role and system functions to access session data
CREATE POLICY "System functions only can access sessions" 
ON public.user_sessions 
FOR ALL 
USING (auth.role() = 'service_role') 
WITH CHECK (auth.role() = 'service_role');

-- Update the existing audit trigger to log session access attempts
CREATE OR REPLACE FUNCTION public.log_session_access_attempt()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  -- Log any attempt to access session data directly
  INSERT INTO public.security_events (
    event_type, severity, user_id, ip_address, event_data, source
  ) VALUES (
    'unauthorized_session_access_attempt', 'critical', auth.uid(), inet_client_addr(),
    jsonb_build_object(
      'operation', TG_OP,
      'table_name', TG_TABLE_NAME,
      'user_role', public.get_current_user_role(),
      'session_id', COALESCE(NEW.id, OLD.id)
    ),
    'session_protection_trigger'
  );
  
  -- Block the operation completely
  RAISE EXCEPTION 'Direct access to session data is not permitted for security reasons';
END;
$function$;

-- Create trigger to block and log unauthorized session access
DROP TRIGGER IF EXISTS prevent_direct_session_access ON public.user_sessions;
CREATE TRIGGER prevent_direct_session_access
  BEFORE SELECT OR INSERT OR UPDATE OR DELETE ON public.user_sessions
  FOR EACH ROW
  WHEN (auth.role() != 'service_role')
  EXECUTE FUNCTION public.log_session_access_attempt();

-- Create secure function for users to check their own active session count
CREATE OR REPLACE FUNCTION public.get_user_active_sessions_count()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  session_count integer;
BEGIN
  -- Only authenticated users can check their session count
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Count only basic session info, no sensitive data
  SELECT COUNT(*) INTO session_count
  FROM public.user_sessions
  WHERE user_id = auth.uid() 
    AND is_active = true 
    AND expires_at > now();
  
  -- Log the secure access
  INSERT INTO public.security_events (
    event_type, severity, user_id, event_data, source
  ) VALUES (
    'secure_session_count_accessed', 'info', auth.uid(),
    jsonb_build_object('session_count', session_count),
    'secure_function'
  );
  
  RETURN session_count;
END;
$function$;

-- Create secure function for admins to view session metadata without sensitive data
CREATE OR REPLACE FUNCTION public.get_session_overview_admin()
RETURNS TABLE(
  session_id uuid,
  user_id uuid,
  created_at timestamp with time zone,
  last_activity timestamp with time zone,
  is_active boolean,
  security_level text,
  masked_ip text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  -- Only admins can access session overview
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Admin role required for session overview';
  END IF;
  
  -- Log admin access
  INSERT INTO public.security_events (
    event_type, severity, user_id, event_data, source
  ) VALUES (
    'admin_session_overview_accessed', 'high', auth.uid(),
    jsonb_build_object('access_reason', 'security_monitoring'),
    'admin_function'
  );
  
  -- Return only non-sensitive session metadata
  RETURN QUERY
  SELECT 
    us.id as session_id,
    us.user_id,
    us.created_at,
    us.last_activity,
    us.is_active,
    us.security_level,
    -- Mask IP address for privacy
    CASE 
      WHEN us.ip_address IS NOT NULL THEN 
        split_part(us.ip_address::text, '.', 1) || '.xxx.xxx.' || split_part(us.ip_address::text, '.', 4)
      ELSE 'unknown'
    END as masked_ip
  FROM public.user_sessions us
  WHERE us.created_at > now() - interval '30 days'
  ORDER BY us.last_activity DESC;
END;
$function$;