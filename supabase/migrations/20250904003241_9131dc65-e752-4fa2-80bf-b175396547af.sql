-- Critical Security Fix: Remove duplicate/conflicting policies and implement strict access control
-- for security_configs table containing sensitive security configuration data

-- Drop all existing potentially conflicting policies
DROP POLICY IF EXISTS "Admin access to security configs" ON public.security_configs;
DROP POLICY IF EXISTS "Secure admin access to security configs" ON public.security_configs;

-- Create new comprehensive security policies with enhanced logging and restrictions
CREATE POLICY "Strict admin-only access to security configs" 
ON public.security_configs 
FOR ALL
USING (
  auth.uid() IS NOT NULL AND 
  has_role(auth.uid(), 'admin'::app_role) AND
  -- Log every access attempt to security configs (critical security data)
  (
    SELECT true FROM (
      INSERT INTO public.security_events (
        event_type, severity, user_id, ip_address, event_data, source
      ) VALUES (
        'security_config_access_attempt', 'critical', auth.uid(), inet_client_addr(),
        jsonb_build_object(
          'config_id', id,
          'config_key', config_key,
          'access_time', now(),
          'admin_user_id', auth.uid(),
          'access_type', 'rls_policy_check'
        ),
        'security_config_rls'
      )
    ) AS logged
  )
)
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  has_role(auth.uid(), 'admin'::app_role) AND
  -- Additional validation for modifications
  config_key IS NOT NULL AND
  config_value IS NOT NULL
);

-- Create separate policy for service role (for automated systems)
CREATE POLICY "Service role access to security configs" 
ON public.security_configs 
FOR ALL
USING (auth.role() = 'service_role'::text)
WITH CHECK (auth.role() = 'service_role'::text);

-- Block all anonymous access explicitly
CREATE POLICY "Block anonymous access to security configs" 
ON public.security_configs 
FOR ALL
USING (false);

-- Enhanced secure function for admin security config access with mandatory audit logging
CREATE OR REPLACE FUNCTION public.get_secure_security_configs(
  config_filter text DEFAULT NULL
)
RETURNS TABLE(
  id uuid,
  config_key text,
  masked_config_value text,
  is_active boolean,
  created_at timestamp with time zone,
  access_level text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Strict admin-only access
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    -- Log unauthorized access attempt
    INSERT INTO public.security_events (
      event_type, severity, user_id, ip_address, event_data, source
    ) VALUES (
      'unauthorized_security_config_access', 'critical', auth.uid(), inet_client_addr(),
      jsonb_build_object(
        'attempted_access', 'security_configs',
        'user_role', get_current_user_role(),
        'denied_reason', 'insufficient_privileges'
      ),
      'security_config_function'
    );
    RAISE EXCEPTION 'Admin access required for security configuration data';
  END IF;
  
  -- Log legitimate admin access
  INSERT INTO public.security_events (
    event_type, severity, user_id, ip_address, event_data, source
  ) VALUES (
    'security_config_admin_access', 'critical', auth.uid(), inet_client_addr(),
    jsonb_build_object(
      'admin_user_id', auth.uid(),
      'access_time', now(),
      'access_method', 'secure_config_function',
      'config_filter', config_filter,
      'data_sensitivity', 'critical_security_config'
    ),
    'secure_security_config_access'
  );
  
  RETURN QUERY
  SELECT 
    sc.id,
    sc.config_key,
    -- Mask sensitive config values for security
    CASE 
      WHEN sc.config_key ILIKE '%key%' OR sc.config_key ILIKE '%secret%' OR sc.config_key ILIKE '%token%' THEN 
        '***MASKED***'
      WHEN sc.config_key ILIKE '%password%' OR sc.config_key ILIKE '%credential%' THEN 
        '***SENSITIVE***'
      ELSE 
        left(sc.config_value::text, 50) || CASE WHEN length(sc.config_value::text) > 50 THEN '...' ELSE '' END
    END as masked_config_value,
    sc.is_active,
    sc.created_at,
    'admin_secure_access' as access_level
  FROM public.security_configs sc
  WHERE (config_filter IS NULL OR sc.config_key ILIKE '%' || config_filter || '%')
  ORDER BY sc.created_at DESC;
END;
$$;