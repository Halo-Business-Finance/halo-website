-- Optimize security event logging with intelligent rate limiting
CREATE OR REPLACE FUNCTION public.log_client_security_event(
  event_type text,
  severity text DEFAULT 'info',
  event_data jsonb DEFAULT '{}',
  source text DEFAULT 'client'
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  current_ip inet := inet_client_addr();
  similar_events_count integer;
  should_log boolean := true;
BEGIN
  -- Enhanced rate limiting: Check for similar events in the last 5 minutes
  SELECT COUNT(*) INTO similar_events_count
  FROM public.security_events
  WHERE event_type = log_client_security_event.event_type
    AND ip_address = current_ip
    AND created_at > now() - interval '5 minutes';
  
  -- Only log if we haven't exceeded the intelligent threshold
  IF similar_events_count >= CASE 
    WHEN severity IN ('critical', 'high') THEN 3  -- Allow 3 critical/high events per 5 min
    WHEN severity = 'medium' THEN 2               -- Allow 2 medium events per 5 min
    ELSE 1                                        -- Allow 1 low/info event per 5 min
  END THEN
    should_log := false;
  END IF;
  
  -- Always log critical events from new IPs
  IF severity = 'critical' AND similar_events_count = 0 THEN
    should_log := true;
  END IF;
  
  -- Log the event if allowed
  IF should_log THEN
    INSERT INTO public.security_events (
      event_type,
      severity,
      ip_address,
      user_agent,
      event_data,
      source,
      user_id
    ) VALUES (
      log_client_security_event.event_type,
      log_client_security_event.severity::event_severity,
      current_ip,
      current_setting('request.headers', true)::json->>'user-agent',
      log_client_security_event.event_data,
      log_client_security_event.source,
      auth.uid()
    );
  END IF;
  
  RETURN should_log;
END;
$$;

-- Create optimized security cleanup function
CREATE OR REPLACE FUNCTION public.optimize_security_events()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  cleaned_count integer;
BEGIN
  -- Remove duplicate low-severity events from the same IP within 1 hour
  WITH duplicates AS (
    SELECT id,
           ROW_NUMBER() OVER (
             PARTITION BY event_type, ip_address, severity
             ORDER BY created_at DESC
           ) as rn
    FROM public.security_events
    WHERE severity IN ('info', 'low')
      AND created_at > now() - interval '1 hour'
  )
  DELETE FROM public.security_events 
  WHERE id IN (SELECT id FROM duplicates WHERE rn > 3);
  
  GET DIAGNOSTICS cleaned_count = ROW_COUNT;
  
  -- Log optimization activity
  INSERT INTO public.security_events (
    event_type, severity, event_data, source
  ) VALUES (
    'security_optimization_completed', 'info',
    jsonb_build_object('cleaned_events', cleaned_count),
    'security_optimizer'
  );
  
  RETURN cleaned_count;
END;
$$;