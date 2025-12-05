-- Fix security_configs table protection
-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Admin security config management" ON public.security_configs;
DROP POLICY IF EXISTS "Service role access to security configs" ON public.security_configs;

-- Create restrictive SELECT policy for authenticated admins
CREATE POLICY "Admins can view security configs" 
ON public.security_configs 
FOR SELECT 
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Create restrictive INSERT policy with session verification
CREATE POLICY "Admins with verified session can insert security configs" 
ON public.security_configs 
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND has_role(auth.uid(), 'admin'::app_role)
  AND verify_active_session_with_mfa('enhanced', 15)
  AND config_key IS NOT NULL 
  AND config_value IS NOT NULL
);

-- Create restrictive UPDATE policy with session verification
CREATE POLICY "Admins with verified session can update security configs" 
ON public.security_configs 
FOR UPDATE 
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND has_role(auth.uid(), 'admin'::app_role)
  AND verify_active_session_with_mfa('enhanced', 15)
)
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND has_role(auth.uid(), 'admin'::app_role)
  AND config_key IS NOT NULL 
  AND config_value IS NOT NULL
);

-- Create restrictive DELETE policy - only super admins can delete
CREATE POLICY "Super admins with verified session can delete security configs" 
ON public.security_configs 
FOR DELETE 
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND has_role(auth.uid(), 'admin'::app_role)
  AND verify_active_session_with_mfa('enhanced', 10)
);

-- Service role policy for system operations (CSRF tokens, etc.) - SELECT and INSERT only
CREATE POLICY "Service role can read security configs" 
ON public.security_configs 
FOR SELECT 
TO service_role
USING (true);

CREATE POLICY "Service role can insert security configs" 
ON public.security_configs 
FOR INSERT 
TO service_role
WITH CHECK (
  -- Only allow CSRF token operations by service role
  config_key LIKE 'csrf_token_%'
);

CREATE POLICY "Service role can update CSRF tokens only" 
ON public.security_configs 
FOR UPDATE 
TO service_role
USING (config_key LIKE 'csrf_token_%')
WITH CHECK (config_key LIKE 'csrf_token_%');

-- Create audit trigger for security config changes
CREATE OR REPLACE FUNCTION public.audit_security_config_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Log all modifications to security_configs
  INSERT INTO public.security_events (
    event_type, 
    severity, 
    user_id, 
    ip_address, 
    event_data, 
    source
  ) VALUES (
    'security_config_' || lower(TG_OP),
    CASE TG_OP
      WHEN 'DELETE' THEN 'critical'
      WHEN 'UPDATE' THEN 'high'
      ELSE 'medium'
    END,
    auth.uid(),
    inet_client_addr(),
    jsonb_build_object(
      'operation', TG_OP,
      'config_key', COALESCE(NEW.config_key, OLD.config_key),
      'old_value', CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN OLD.config_value ELSE NULL END,
      'new_value', CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN NEW.config_value ELSE NULL END,
      'timestamp', now(),
      'requires_review', TG_OP = 'DELETE'
    ),
    'security_config_audit_trigger'
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger if not exists
DROP TRIGGER IF EXISTS security_config_audit_trigger ON public.security_configs;
CREATE TRIGGER security_config_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.security_configs
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_security_config_changes();