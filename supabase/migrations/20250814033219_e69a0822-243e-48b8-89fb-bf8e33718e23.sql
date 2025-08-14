-- COMPLETE SECURITY FIXES - Part 2
-- Fix severity constraint and add remaining security features

-- 1. Fix severity check constraint issue by ensuring proper severity values
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

-- 2. Create secure views for sensitive data exposure
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

-- 3. Create function to safely access security configurations
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

-- 4. Create function to safely manage rate limit configurations
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

-- 5. Create secure alert management functions
CREATE OR REPLACE FUNCTION public.resolve_security_alert(
  alert_id uuid,
  resolution_notes text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Only admins and moderators can resolve alerts
  IF NOT (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'moderator')) THEN
    RAISE EXCEPTION 'Insufficient permissions to resolve security alerts';
  END IF;
  
  -- Update the alert status
  UPDATE public.security_alerts
  SET 
    status = 'resolved',
    assigned_to = auth.uid(),
    notes = COALESCE(resolution_notes, notes),
    updated_at = now()
  WHERE id = alert_id;
  
  -- Log the resolution
  INSERT INTO public.security_events (
    event_type, severity, user_id, event_data, source
  ) VALUES (
    'security_alert_resolved', 'info', auth.uid(),
    jsonb_build_object(
      'alert_id', alert_id,
      'resolved_by', auth.uid(),
      'resolution_notes', resolution_notes
    ),
    'alert_management'
  );
  
  RETURN true;
END;
$$;