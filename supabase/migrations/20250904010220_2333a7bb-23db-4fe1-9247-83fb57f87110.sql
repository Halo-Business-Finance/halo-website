-- Critical Security Fix: Implement strict access control for security_configs table
-- Remove duplicate/conflicting policies and add comprehensive protection

-- Drop all existing potentially conflicting policies
DROP POLICY IF EXISTS "Admin access to security configs" ON public.security_configs;
DROP POLICY IF EXISTS "Secure admin access to security configs" ON public.security_configs;

-- Create strict admin-only access policy
CREATE POLICY "Strict admin-only security config access" 
ON public.security_configs 
FOR ALL
USING (
  auth.uid() IS NOT NULL AND 
  has_role(auth.uid(), 'admin'::app_role)
)
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  has_role(auth.uid(), 'admin'::app_role) AND
  config_key IS NOT NULL AND
  config_value IS NOT NULL
);

-- Explicit block for anonymous access
CREATE POLICY "Block anonymous security config access" 
ON public.security_configs 
FOR ALL
USING (false);

-- Enhanced secure function for admin security config access
CREATE OR REPLACE FUNCTION public.get_secure_security_configs(
  config_filter text DEFAULT NULL
)
RETURNS TABLE(
  id uuid,
  config_key text,
  masked_config_value text,
  is_active boolean,
  created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Strict admin-only access
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Admin access required for security configuration data';
  END IF;
  
  -- Log admin access
  INSERT INTO public.security_events (
    event_type, severity, user_id, ip_address, event_data, source
  ) VALUES (
    'security_config_admin_access', 'critical', auth.uid(), inet_client_addr(),
    jsonb_build_object(
      'admin_user_id', auth.uid(),
      'access_time', now(),
      'access_method', 'secure_config_function',
      'config_filter', config_filter
    ),
    'secure_security_config_access'
  );
  
  RETURN QUERY
  SELECT 
    sc.id,
    sc.config_key,
    -- Mask sensitive config values
    CASE 
      WHEN sc.config_key ILIKE '%key%' OR sc.config_key ILIKE '%secret%' OR sc.config_key ILIKE '%token%' THEN 
        '***MASKED***'
      WHEN sc.config_key ILIKE '%password%' OR sc.config_key ILIKE '%credential%' THEN 
        '***SENSITIVE***'
      ELSE 
        left(sc.config_value::text, 50) || CASE WHEN length(sc.config_value::text) > 50 THEN '...' ELSE '' END
    END as masked_config_value,
    sc.is_active,
    sc.created_at
  FROM public.security_configs sc
  WHERE (config_filter IS NULL OR sc.config_key ILIKE '%' || config_filter || '%')
  ORDER BY sc.created_at DESC;
END;
$$;