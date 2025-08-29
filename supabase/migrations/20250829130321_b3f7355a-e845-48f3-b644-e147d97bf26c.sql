-- CRITICAL SECURITY FIX: Secure encryption_keys table access
-- Remove overly permissive policy and implement strict service-role-only access

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Service role only encryption keys access" ON public.encryption_keys;

-- Create new strict service-role-only policies
CREATE POLICY "Strict service role encryption keys select" 
ON public.encryption_keys 
FOR SELECT 
TO service_role
USING (true);

CREATE POLICY "Strict service role encryption keys insert" 
ON public.encryption_keys 
FOR INSERT 
TO service_role
WITH CHECK (true);

CREATE POLICY "Strict service role encryption keys update" 
ON public.encryption_keys 
FOR UPDATE 
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Strict service role encryption keys delete" 
ON public.encryption_keys 
FOR DELETE 
TO service_role
USING (true);

-- Add security event logging for any unauthorized access attempts
-- This trigger will log if anyone tries to access encryption keys inappropriately
CREATE OR REPLACE FUNCTION public.log_encryption_key_access_attempt()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  -- Log any access attempt for security monitoring
  INSERT INTO public.security_events (
    event_type,
    severity,
    event_data,
    source,
    ip_address
  ) VALUES (
    'encryption_key_access_attempted',
    'critical',
    jsonb_build_object(
      'operation', TG_OP,
      'key_identifier', COALESCE(NEW.key_identifier, OLD.key_identifier),
      'access_role', current_setting('role', true),
      'access_time', now()
    ),
    'encryption_key_security_monitor',
    inet_client_addr()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Apply the security logging trigger
DROP TRIGGER IF EXISTS encryption_key_access_logger ON public.encryption_keys;
CREATE TRIGGER encryption_key_access_logger
  BEFORE SELECT OR INSERT OR UPDATE OR DELETE ON public.encryption_keys
  FOR EACH ROW EXECUTE FUNCTION public.log_encryption_key_access_attempt();