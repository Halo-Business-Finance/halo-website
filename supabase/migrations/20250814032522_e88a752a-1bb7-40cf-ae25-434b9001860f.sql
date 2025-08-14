-- FIX SECURITY TABLE ACCESS ISSUES
-- These changes address the security warnings by implementing proper RLS policies
-- while maintaining strict access controls for sensitive security data

-- 1. Fix security_events table access - Allow admins and moderators to view events
DROP POLICY IF EXISTS "Service role only access to security events" ON public.security_events;

-- Create graduated access policies for security events
CREATE POLICY "Admins can view all security events"
ON public.security_events
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Moderators can view non-critical security events"
ON public.security_events
FOR SELECT
USING (
  has_role(auth.uid(), 'moderator') 
  AND severity NOT IN ('critical')
);

CREATE POLICY "Service role can manage all security events"
ON public.security_events
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- 2. Fix security_alerts table access - Allow security personnel to view and manage alerts
DROP POLICY IF EXISTS "Service role only access to security alerts" ON public.security_alerts;

CREATE POLICY "Admins can manage all security alerts"
ON public.security_alerts
FOR ALL
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Moderators can view and update security alerts"
ON public.security_alerts
FOR SELECT, UPDATE
USING (has_role(auth.uid(), 'moderator'))
WITH CHECK (has_role(auth.uid(), 'moderator'));

CREATE POLICY "Service role can manage all security alerts"
ON public.security_alerts
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- 3. Fix security_configs table access - Restrict to admins only with read access for moderators
DROP POLICY IF EXISTS "Service role only access to security configs" ON public.security_configs;

CREATE POLICY "Admins can manage security configs"
ON public.security_configs
FOR ALL
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Moderators can view security configs"
ON public.security_configs
FOR SELECT
USING (has_role(auth.uid(), 'moderator'));

CREATE POLICY "Service role can manage all security configs"
ON public.security_configs
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- 4. Fix rate_limit_configs table access - Allow admins to manage, moderators to view
DROP POLICY IF EXISTS "Service role only access to rate limit configs" ON public.rate_limit_configs;

CREATE POLICY "Admins can manage rate limit configs"
ON public.rate_limit_configs
FOR ALL
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Moderators can view rate limit configs"
ON public.rate_limit_configs
FOR SELECT
USING (has_role(auth.uid(), 'moderator'));

CREATE POLICY "Service role can manage all rate limit configs"
ON public.rate_limit_configs
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- 5. Fix severity check constraint issue by ensuring proper severity values
-- Check if the constraint exists and what values it allows
DO $$
BEGIN
  -- Drop existing constraint if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'security_events_severity_check'
  ) THEN
    ALTER TABLE public.security_events DROP CONSTRAINT security_events_severity_check;
  END IF;
  
  -- Add proper severity constraint with all valid values
  ALTER TABLE public.security_events 
  ADD CONSTRAINT security_events_severity_check 
  CHECK (severity IN ('info', 'low', 'medium', 'high', 'critical'));
END $$;

-- 6. Create audit logging for security table access
CREATE OR REPLACE FUNCTION public.log_security_table_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Log access to sensitive security tables
  IF TG_TABLE_NAME IN ('security_configs', 'rate_limit_configs') THEN
    INSERT INTO public.security_events (
      event_type,
      severity,
      user_id,
      ip_address,
      event_data,
      source
    ) VALUES (
      'security_table_accessed',
      'medium',
      auth.uid(),
      inet_client_addr(),
      jsonb_build_object(
        'table_name', TG_TABLE_NAME,
        'operation', TG_OP,
        'user_role', public.get_current_user_role(),
        'access_time', now()
      ),
      'security_audit'
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create triggers for security table access logging
DROP TRIGGER IF EXISTS security_configs_access_log ON public.security_configs;
CREATE TRIGGER security_configs_access_log
  AFTER SELECT OR INSERT OR UPDATE OR DELETE ON public.security_configs
  FOR EACH ROW EXECUTE FUNCTION public.log_security_table_access();

DROP TRIGGER IF EXISTS rate_limit_configs_access_log ON public.rate_limit_configs;
CREATE TRIGGER rate_limit_configs_access_log
  AFTER SELECT OR INSERT OR UPDATE OR DELETE ON public.rate_limit_configs
  FOR EACH ROW EXECUTE FUNCTION public.log_security_table_access();

-- 7. Create secure views for sensitive data exposure
CREATE OR REPLACE VIEW public.security_events_summary AS
SELECT 
  id,
  event_type,
  severity,
  created_at,
  source,
  -- Mask sensitive data in event_data
  CASE 
    WHEN has_role(auth.uid(), 'admin') THEN event_data
    ELSE jsonb_build_object(
      'masked', true,
      'event_category', event_data->>'event_type',
      'timestamp', event_data->>'timestamp'
    )
  END as event_data_masked,
  -- Mask IP addresses for non-admins
  CASE 
    WHEN has_role(auth.uid(), 'admin') THEN ip_address::text
    ELSE regexp_replace(ip_address::text, '(\d+\.\d+)\.\d+\.\d+', '\1.xxx.xxx')
  END as ip_address_masked
FROM public.security_events
WHERE (
  has_role(auth.uid(), 'admin') OR 
  (has_role(auth.uid(), 'moderator') AND severity NOT IN ('critical'))
);

-- Grant access to the view
GRANT SELECT ON public.security_events_summary TO authenticated;

-- 8. Create function to safely access security configurations
CREATE OR REPLACE FUNCTION public.get_security_config(config_key text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  config_data jsonb;
BEGIN
  -- Only admins and moderators can access security configs
  IF NOT (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'moderator')) THEN
    RAISE EXCEPTION 'Insufficient permissions to access security configuration';
  END IF;
  
  -- Log the access attempt
  INSERT INTO public.security_events (
    event_type, severity, user_id, event_data, source
  ) VALUES (
    'security_config_accessed', 'info', auth.uid(),
    jsonb_build_object(
      'config_key', config_key,
      'user_role', public.get_current_user_role()
    ),
    'secure_config_access'
  );
  
  -- Return the configuration
  SELECT config_value INTO config_data
  FROM public.security_configs
  WHERE config_key = get_security_config.config_key AND is_active = true;
  
  RETURN COALESCE(config_data, '{}');
END;
$$;

-- 9. Create function to safely manage rate limit configurations
CREATE OR REPLACE FUNCTION public.update_rate_limit_config(
  endpoint_name text,
  new_max_requests integer,
  new_window_seconds integer,
  new_block_duration_seconds integer DEFAULT 3600
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Only admins can modify rate limit configs
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Admin role required to modify rate limit configurations';
  END IF;
  
  -- Validate input parameters
  IF new_max_requests <= 0 OR new_window_seconds <= 0 OR new_block_duration_seconds <= 0 THEN
    RAISE EXCEPTION 'Rate limit parameters must be positive integers';
  END IF;
  
  -- Update or insert the configuration
  INSERT INTO public.rate_limit_configs (
    endpoint, max_requests, window_seconds, block_duration_seconds
  ) VALUES (
    endpoint_name, new_max_requests, new_window_seconds, new_block_duration_seconds
  ) ON CONFLICT (endpoint) DO UPDATE SET
    max_requests = new_max_requests,
    window_seconds = new_window_seconds,
    block_duration_seconds = new_block_duration_seconds,
    updated_at = now();
  
  -- Log the configuration change
  INSERT INTO public.security_events (
    event_type, severity, user_id, event_data, source
  ) VALUES (
    'rate_limit_config_updated', 'medium', auth.uid(),
    jsonb_build_object(
      'endpoint', endpoint_name,
      'new_max_requests', new_max_requests,
      'new_window_seconds', new_window_seconds,
      'new_block_duration_seconds', new_block_duration_seconds
    ),
    'rate_limit_management'
  );
  
  RETURN true;
END;
$$;