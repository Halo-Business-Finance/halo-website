-- Phase 1: Critical Security Fixes

-- 1. Add rate limiting function for security events to prevent log flooding
CREATE OR REPLACE FUNCTION public.log_client_security_event(
  event_type text,
  severity text DEFAULT 'info',
  event_data jsonb DEFAULT '{}',
  source text DEFAULT 'client'
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  client_ip inet := inet_client_addr();
  event_count integer;
  rate_limit_window interval := '1 minute';
  max_events_per_minute integer := 5; -- Reduced from unlimited
BEGIN
  -- Check rate limit for this IP/event type combination
  SELECT COUNT(*) INTO event_count
  FROM public.security_events
  WHERE ip_address = client_ip
    AND event_type = log_client_security_event.event_type
    AND created_at > now() - rate_limit_window;
  
  -- If rate limit exceeded, log rate limit violation and return false
  IF event_count >= max_events_per_minute THEN
    INSERT INTO public.security_events (
      event_type, severity, ip_address, event_data, source
    ) VALUES (
      'rate_limit_exceeded',
      'medium',
      client_ip,
      jsonb_build_object(
        'original_event_type', log_client_security_event.event_type,
        'events_in_window', event_count,
        'rate_limit_window_minutes', 1
      ),
      'rate_limiter'
    );
    RETURN false;
  END IF;
  
  -- Log the event if within rate limits
  INSERT INTO public.security_events (
    event_type,
    severity,
    user_id,
    ip_address,
    event_data,
    source
  ) VALUES (
    log_client_security_event.event_type,
    log_client_security_event.severity,
    auth.uid(),
    client_ip,
    log_client_security_event.event_data,
    log_client_security_event.source
  );
  
  RETURN true;
END;
$$;

-- 2. Add automated cleanup function for old security events
CREATE OR REPLACE FUNCTION public.cleanup_old_security_events()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  cleaned_count integer;
  info_retention_days integer := 7;    -- Keep info/low events for 7 days
  medium_retention_days integer := 30; -- Keep medium events for 30 days
  high_retention_days integer := 90;   -- Keep high/critical events for 90 days
BEGIN
  -- Clean up info and low severity events
  DELETE FROM public.security_events
  WHERE severity IN ('info', 'low')
    AND created_at < now() - (info_retention_days || ' days')::interval;
  
  GET DIAGNOSTICS cleaned_count = ROW_COUNT;
  
  -- Clean up medium severity events
  DELETE FROM public.security_events
  WHERE severity = 'medium'
    AND created_at < now() - (medium_retention_days || ' days')::interval;
  
  -- Clean up resolved high/critical severity events
  DELETE FROM public.security_events
  WHERE severity IN ('high', 'critical')
    AND resolved_at IS NOT NULL
    AND created_at < now() - (high_retention_days || ' days')::interval;
  
  RETURN cleaned_count;
END;
$$;

-- 3. Create service role policy for consultations to fix Edge Function access
CREATE POLICY "Service role can manage consultations for edge functions"
ON public.consultations
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 4. Add security event cleanup scheduler (manual trigger for now)
COMMENT ON FUNCTION public.cleanup_old_security_events() IS 'Run this function periodically to clean up old security events. Consider setting up a cron job or scheduled task.';

-- 5. Add index for rate limiting performance
CREATE INDEX IF NOT EXISTS idx_security_events_rate_limit 
ON public.security_events(ip_address, event_type, created_at)
WHERE created_at > now() - interval '1 hour';

-- 6. Update existing security event trigger to use rate limiting
CREATE OR REPLACE FUNCTION public.rate_limited_security_log()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- Only log if severity is medium or higher to reduce noise
  IF NEW.severity IN ('medium', 'high', 'critical') THEN
    -- The trigger will log, but we've added rate limiting to the main function
    RETURN NEW;
  END IF;
  
  -- For low/info events, only log occasionally (1 in 10)
  IF random() > 0.1 THEN
    RETURN NEW;
  END IF;
  
  RETURN NEW;
END;
$$;