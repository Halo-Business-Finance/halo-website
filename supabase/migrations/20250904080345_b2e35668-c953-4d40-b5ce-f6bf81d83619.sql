-- CRITICAL SECURITY FIXES - Phase 2 (Fixed)

-- 1. Fix Admin Bootstrap Security Issue (Already created, skip to new functions)

-- 2. Strengthen Application Data RLS Policies (Fix conflicts)
-- Drop ALL existing admin application policies first
DROP POLICY IF EXISTS "Enhanced admin application access" ON public.applications;
DROP POLICY IF EXISTS "Admins can view all applications" ON public.applications;
DROP POLICY IF EXISTS "Admins can update all applications" ON public.applications;

-- Create single comprehensive admin policy
CREATE POLICY "Secure admin full application access" 
ON public.applications 
FOR ALL 
TO authenticated
USING (
  has_role(auth.uid(), 'admin') AND 
  auth.uid() IS NOT NULL AND
  -- Additional verification: admin must have recent session activity
  EXISTS(
    SELECT 1 FROM public.user_sessions 
    WHERE user_id = auth.uid() 
    AND is_active = true 
    AND last_activity > now() - interval '30 minutes'
  )
)
WITH CHECK (
  has_role(auth.uid(), 'admin') AND 
  auth.uid() IS NOT NULL
);

-- 3. Create Security Event Cleanup and Optimization
CREATE OR REPLACE FUNCTION public.optimize_security_events_v2()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  cleaned_count integer;
  retention_hours integer := 6; -- 6 hours for client_log
BEGIN
  -- Remove excessive client_log events older than 6 hours
  DELETE FROM public.security_events
  WHERE event_type = 'client_log' 
    AND severity IN ('info', 'medium')
    AND created_at < now() - (retention_hours || ' hours')::interval;
  
  GET DIAGNOSTICS cleaned_count = ROW_COUNT;
  
  -- Remove duplicate low-severity events from the same IP within 30 minutes
  WITH duplicates AS (
    SELECT id,
           ROW_NUMBER() OVER (
             PARTITION BY event_type, ip_address, severity, DATE_TRUNC('minute', created_at)
             ORDER BY created_at DESC
           ) as rn
    FROM public.security_events
    WHERE severity IN ('info', 'low')
      AND created_at > now() - interval '30 minutes'
      AND event_type != 'client_log'
  )
  DELETE FROM public.security_events 
  WHERE id IN (SELECT id FROM duplicates WHERE rn > 2);
  
  -- Log optimization activity
  INSERT INTO public.security_events (
    event_type, severity, event_data, source
  ) VALUES (
    'security_optimization_completed_v2', 'info',
    jsonb_build_object(
      'cleaned_events', cleaned_count,
      'retention_hours', retention_hours,
      'optimization_timestamp', now()
    ),
    'security_optimizer_v2'
  );
  
  RETURN cleaned_count;
END;
$function$;

-- 4. Enhanced Session Security Monitoring
CREATE OR REPLACE FUNCTION public.create_enhanced_security_session(
  p_user_id uuid, 
  p_ip_address inet, 
  p_user_agent text, 
  p_client_fingerprint text,
  p_security_level text DEFAULT 'normal'
)
RETURNS TABLE(session_id uuid, requires_mfa boolean, risk_score integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  new_session_id UUID;
  calculated_risk_score integer := 0;
  requires_additional_auth boolean := false;
  recent_failed_attempts integer;
  anomaly_detected boolean := false;
BEGIN
  -- Calculate risk score based on multiple factors
  
  -- Check for recent failed login attempts
  SELECT COUNT(*) INTO recent_failed_attempts
  FROM public.security_events
  WHERE event_type IN ('invalid_session_token', 'authentication_failed')
    AND ip_address = p_ip_address
    AND created_at > now() - interval '1 hour';
  
  calculated_risk_score := calculated_risk_score + (recent_failed_attempts * 15);
  
  -- Check for IP-based anomalies
  IF NOT EXISTS(
    SELECT 1 FROM public.user_sessions 
    WHERE user_id = p_user_id 
    AND ip_address = p_ip_address 
    AND created_at > now() - interval '7 days'
  ) THEN
    calculated_risk_score := calculated_risk_score + 25;
  END IF;
  
  -- Determine security requirements
  requires_additional_auth := calculated_risk_score > 40;
  
  -- Create session with enhanced security data
  INSERT INTO public.user_sessions (
    user_id,
    ip_address,
    user_agent,
    client_fingerprint,
    expires_at,
    is_active,
    security_level,
    last_security_check
  ) VALUES (
    p_user_id,
    p_ip_address,
    p_user_agent,
    p_client_fingerprint,
    now() + interval '24 hours',
    true,
    CASE 
      WHEN calculated_risk_score > 60 THEN 'high_risk'
      WHEN calculated_risk_score > 30 THEN 'enhanced'
      ELSE p_security_level
    END,
    now()
  ) RETURNING id INTO new_session_id;
  
  -- Log enhanced session creation
  INSERT INTO public.security_events (
    event_type, severity, user_id, ip_address, event_data, source
  ) VALUES (
    'enhanced_security_session_created',
    CASE 
      WHEN calculated_risk_score > 60 THEN 'high'
      WHEN calculated_risk_score > 30 THEN 'medium'
      ELSE 'info'
    END,
    p_user_id,
    p_ip_address,
    jsonb_build_object(
      'session_id', new_session_id,
      'risk_score', calculated_risk_score,
      'requires_mfa', requires_additional_auth,
      'security_level', CASE 
        WHEN calculated_risk_score > 60 THEN 'high_risk'
        WHEN calculated_risk_score > 30 THEN 'enhanced'
        ELSE p_security_level
      END,
      'recent_failed_attempts', recent_failed_attempts
    ),
    'enhanced_session_security'
  );
  
  RETURN QUERY SELECT new_session_id, requires_additional_auth, calculated_risk_score;
END;
$function$;