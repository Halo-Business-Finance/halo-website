-- Fix security linter warnings: Add search_path to functions

-- Fix mask_financial_data function
CREATE OR REPLACE FUNCTION public.mask_financial_data(data_value numeric, user_role text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF user_role = 'admin' THEN
    RETURN data_value::text;
  ELSE
    -- Mask amounts for non-admin users
    RETURN CASE 
      WHEN data_value < 100000 THEN 'Under $100K'
      WHEN data_value < 500000 THEN '$100K - $500K' 
      WHEN data_value < 1000000 THEN '$500K - $1M'
      ELSE 'Over $1M'
    END;
  END IF;
END;
$$;

-- Fix should_log_security_event function  
CREATE OR REPLACE FUNCTION public.should_log_security_event(
  event_type text,
  severity text,
  source_ip inet,
  event_data jsonb DEFAULT '{}'::jsonb
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  recent_count integer;
  is_critical boolean;
  should_log boolean := true;
BEGIN
  -- Always log critical and high severity events
  IF severity IN ('critical', 'high') THEN
    RETURN true;
  END IF;
  
  -- Filter excessive client_log events
  IF event_type = 'client_log' THEN
    -- Count recent events from same IP
    SELECT COUNT(*) INTO recent_count
    FROM public.security_events
    WHERE event_type = 'client_log'
      AND ip_address = source_ip
      AND created_at > now() - interval '5 minutes';
    
    -- Rate limit: max 5 client_log events per 5 minutes per IP
    IF recent_count >= 5 THEN
      should_log := false;
    END IF;
  END IF;
  
  -- Filter low-priority repetitive events
  IF severity = 'info' AND event_type NOT IN ('admin_login', 'data_access', 'session_created') THEN
    SELECT COUNT(*) INTO recent_count
    FROM public.security_events
    WHERE event_type = should_log_security_event.event_type
      AND severity = 'info'
      AND created_at > now() - interval '1 hour';
    
    -- Limit info events to 10 per hour of same type
    IF recent_count >= 10 THEN
      should_log := false;
    END IF;
  END IF;
  
  RETURN should_log;
END;
$$;

-- Fix intelligent_security_event_cleanup function
CREATE OR REPLACE FUNCTION public.intelligent_security_event_cleanup()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  cleaned_count integer := 0;
  batch_size integer := 1000;
  total_cleaned integer := 0;
BEGIN
  -- Clean up excessive client_log events (keep only last 24 hours)
  LOOP
    DELETE FROM public.security_events
    WHERE id IN (
      SELECT id FROM public.security_events
      WHERE event_type = 'client_log'
        AND severity IN ('info', 'low', 'medium')
        AND created_at < now() - interval '24 hours'
      LIMIT batch_size
    );
    
    GET DIAGNOSTICS cleaned_count = ROW_COUNT;
    total_cleaned := total_cleaned + cleaned_count;
    
    EXIT WHEN cleaned_count = 0;
  END LOOP;
  
  -- Remove duplicate low-severity events from same IP within 1 hour
  WITH duplicates AS (
    SELECT id,
           ROW_NUMBER() OVER (
             PARTITION BY event_type, ip_address, severity, DATE_TRUNC('hour', created_at)
             ORDER BY created_at DESC
           ) as rn
    FROM public.security_events
    WHERE severity IN ('info', 'low')
      AND event_type != 'admin_login'
      AND created_at > now() - interval '7 days'
  )
  DELETE FROM public.security_events 
  WHERE id IN (SELECT id FROM duplicates WHERE rn > 3);
  
  GET DIAGNOSTICS cleaned_count = ROW_COUNT;
  total_cleaned := total_cleaned + cleaned_count;
  
  -- Log cleanup activity
  INSERT INTO public.security_events (
    event_type, severity, event_data, source
  ) VALUES (
    'security_event_cleanup_completed', 'info',
    jsonb_build_object('total_cleaned', total_cleaned),
    'automated_cleanup'
  );
  
  RETURN total_cleaned;
END;
$$;

-- Fix schedule_security_maintenance function
CREATE OR REPLACE FUNCTION public.schedule_security_maintenance()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- This would typically be called by a cron job
  PERFORM public.intelligent_security_event_cleanup();
  PERFORM public.cleanup_expired_sessions();
  
  -- Log maintenance completion
  INSERT INTO public.security_events (
    event_type, severity, event_data, source
  ) VALUES (
    'scheduled_security_maintenance_completed', 'info',
    jsonb_build_object('maintenance_time', now()),
    'automated_maintenance'
  );
END;
$$;