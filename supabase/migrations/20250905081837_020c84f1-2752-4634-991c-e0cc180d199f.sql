-- PHASE 1: CRITICAL RLS POLICY ENFORCEMENT AND SECURITY FIXES

-- Fix critical PII exposure in consultations table
DROP POLICY IF EXISTS "Admin consultation SELECT with mandatory session verification" ON public.consultations;
DROP POLICY IF EXISTS "Admin consultation UPDATE with mandatory session verification" ON public.consultations;
DROP POLICY IF EXISTS "Admin consultation DELETE with mandatory session verification" ON public.consultations;

CREATE POLICY "Ultra secure admin consultation access with strict verification"
ON public.consultations FOR ALL
USING (
  (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
  (auth.uid() IS NOT NULL AND 
   has_role(auth.uid(), 'admin'::app_role) AND
   verify_active_session_with_mfa('enhanced', 15))
)
WITH CHECK (
  (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
  (auth.uid() IS NOT NULL AND 
   has_role(auth.uid(), 'admin'::app_role) AND
   verify_active_session_with_mfa('enhanced', 15) AND
   user_id IS NOT NULL AND 
   encrypted_name IS NOT NULL AND 
   encrypted_email IS NOT NULL)
);

-- Fix business data exposure in applications table
DROP POLICY IF EXISTS "Ultra secure admin application SELECT with ultra strict session" ON public.applications;
DROP POLICY IF EXISTS "Ultra secure admin application UPDATE with ultra strict session" ON public.applications;
DROP POLICY IF EXISTS "Ultra secure admin application DELETE with ultra strict session" ON public.applications;

CREATE POLICY "Hardened application access with business data protection"
ON public.applications FOR ALL
USING (
  (auth.uid() IS NOT NULL AND auth.uid() = user_id AND 
   verify_active_session_with_mfa('normal', 30)) OR
  (auth.uid() IS NOT NULL AND 
   has_role(auth.uid(), 'admin'::app_role) AND
   verify_active_session_with_mfa('high', 10))
)
WITH CHECK (
  (auth.uid() IS NOT NULL AND auth.uid() = user_id AND 
   verify_active_session_with_mfa('normal', 30)) OR
  (auth.uid() IS NOT NULL AND 
   has_role(auth.uid(), 'admin'::app_role) AND
   verify_active_session_with_mfa('high', 10) AND
   user_id IS NOT NULL AND 
   application_type IS NOT NULL)
);

-- Lock down security infrastructure tables with ultra-strict access
DROP POLICY IF EXISTS "Ultra secure admin security events access with multi-factor ver" ON public.security_events;
CREATE POLICY "Fort Knox security events access"
ON public.security_events FOR SELECT
USING (
  auth.role() = 'service_role' OR
  (auth.uid() IS NOT NULL AND 
   has_role(auth.uid(), 'admin'::app_role) AND
   verify_active_session_with_mfa('high', 5) AND
   EXISTS(
     SELECT 1 FROM public.user_sessions 
     WHERE user_id = auth.uid() 
     AND is_active = true 
     AND security_level = 'enhanced'
     AND last_security_check > now() - interval '5 minutes'
   ))
);

DROP POLICY IF EXISTS "Ultra secure admin security alerts access with verification" ON public.security_alerts;
CREATE POLICY "Fort Knox security alerts access"
ON public.security_alerts FOR ALL
USING (
  auth.role() = 'service_role' OR
  (auth.uid() IS NOT NULL AND 
   has_role(auth.uid(), 'admin'::app_role) AND
   verify_active_session_with_mfa('high', 5))
)
WITH CHECK (
  auth.role() = 'service_role' OR
  (auth.uid() IS NOT NULL AND 
   has_role(auth.uid(), 'admin'::app_role) AND
   verify_active_session_with_mfa('high', 5))
);

-- Ultra-secure encryption key protection
DROP POLICY IF EXISTS "Ultra secure service role encryption key access with verificati" ON public.encryption_keys;
CREATE POLICY "Maximum security encryption key fortress"
ON public.encryption_keys FOR ALL
USING (
  auth.role() = 'service_role' AND
  verify_encryption_key_access() AND
  current_setting('request.jwt.claims', true)::jsonb->>'iss' = 'supabase'
)
WITH CHECK (
  auth.role() = 'service_role' AND
  verify_encryption_key_access() AND
  current_setting('request.jwt.claims', true)::jsonb->>'iss' = 'supabase'
);

-- Intelligent security event filtering to prevent log flooding
CREATE OR REPLACE FUNCTION public.intelligent_security_event_cleanup()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  cleaned_count INTEGER := 0;
  flood_threshold INTEGER := 1000;
  time_window INTERVAL := '1 hour';
BEGIN
  -- Check for potential log flooding attacks
  WITH event_counts AS (
    SELECT 
      event_type, 
      ip_address,
      COUNT(*) as event_count,
      MIN(created_at) as first_event,
      MAX(created_at) as last_event
    FROM public.security_events 
    WHERE created_at > now() - time_window
      AND event_type = 'client_log'
      AND severity IN ('info', 'low')
    GROUP BY event_type, ip_address
    HAVING COUNT(*) > flood_threshold
  ),
  flood_events AS (
    DELETE FROM public.security_events se
    WHERE se.event_type = 'client_log'
      AND se.severity IN ('info', 'low')
      AND se.created_at > now() - time_window
      AND EXISTS (
        SELECT 1 FROM event_counts ec
        WHERE ec.event_type = se.event_type
        AND ec.ip_address = se.ip_address
      )
      AND se.id NOT IN (
        -- Keep the 10 most recent events from each flooding source
        SELECT id FROM (
          SELECT id, ROW_NUMBER() OVER (
            PARTITION BY event_type, ip_address 
            ORDER BY created_at DESC
          ) as rn
          FROM public.security_events
          WHERE event_type = 'client_log'
            AND created_at > now() - time_window
        ) ranked WHERE rn <= 10
      )
    RETURNING id
  )
  SELECT COUNT(*) INTO cleaned_count FROM flood_events;
  
  -- Log cleanup activity
  IF cleaned_count > 0 THEN
    INSERT INTO public.security_events (
      event_type, severity, event_data, source
    ) VALUES (
      'security_log_flood_mitigated', 'high',
      jsonb_build_object(
        'cleaned_events', cleaned_count,
        'flood_threshold', flood_threshold,
        'time_window_hours', EXTRACT(epoch FROM time_window) / 3600,
        'mitigation_timestamp', now()
      ),
      'intelligent_security_cleanup'
    );
  END IF;
  
  RETURN cleaned_count;
END;
$$;