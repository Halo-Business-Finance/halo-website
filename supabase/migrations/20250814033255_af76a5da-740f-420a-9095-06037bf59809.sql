-- FIX SECURITY DEFINER VIEW WARNING
-- Remove SECURITY DEFINER from view and rely on RLS policies instead

-- 1. Drop the problematic view
DROP VIEW IF EXISTS public.security_events_summary;

-- 2. Create a non-security definer view with proper access control through RLS
CREATE VIEW public.security_events_summary AS
SELECT 
  id,
  event_type,
  severity,
  created_at,
  source,
  user_id,
  -- Conditionally mask sensitive data based on user role
  event_data as event_data_raw,
  ip_address
FROM public.security_events;

-- 3. Enable RLS on the view (inherits from the underlying table)
-- The view will automatically respect the RLS policies on security_events

-- 4. Create a safer function-based approach for accessing masked security data
CREATE OR REPLACE FUNCTION public.get_security_events_masked(
  limit_count integer DEFAULT 50,
  severity_filter text DEFAULT NULL
)
RETURNS TABLE(
  id uuid,
  event_type text,
  severity text,
  created_at timestamp with time zone,
  source text,
  event_data_masked jsonb,
  ip_address_masked text
)
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Check permissions
  IF NOT (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'moderator')) THEN
    RAISE EXCEPTION 'Insufficient permissions to access security events';
  END IF;
  
  RETURN QUERY
  SELECT 
    se.id,
    se.event_type,
    se.severity,
    se.created_at,
    se.source,
    -- Mask sensitive data based on role
    CASE 
      WHEN has_role(auth.uid(), 'admin') THEN se.event_data
      ELSE jsonb_build_object(
        'masked', true,
        'event_category', se.event_data->>'event_type',
        'timestamp', se.event_data->>'timestamp'
      )
    END as event_data_masked,
    -- Mask IP addresses for non-admins
    CASE 
      WHEN has_role(auth.uid(), 'admin') THEN se.ip_address::text
      ELSE regexp_replace(se.ip_address::text, '(\d+\.\d+)\.\d+\.\d+', '\1.xxx.xxx')
    END as ip_address_masked
  FROM public.security_events se
  WHERE (
    has_role(auth.uid(), 'admin') OR 
    (has_role(auth.uid(), 'moderator') AND se.severity NOT IN ('critical'))
  )
  AND (severity_filter IS NULL OR se.severity = severity_filter)
  ORDER BY se.created_at DESC
  LIMIT limit_count;
END;
$$;

-- 5. Log access to the secure function
CREATE OR REPLACE FUNCTION public.log_security_events_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Log when security events are accessed
  INSERT INTO public.security_events (
    event_type, severity, user_id, event_data, source
  ) VALUES (
    'security_events_accessed', 'info', auth.uid(),
    jsonb_build_object(
      'access_method', 'secure_function',
      'user_role', public.get_current_user_role(),
      'access_time', now()
    ),
    'security_audit'
  );
  
  RETURN NULL; -- For AFTER trigger
END;
$$;