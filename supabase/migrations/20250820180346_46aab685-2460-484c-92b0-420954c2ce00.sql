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