-- Fix IP address handling in security functions to prevent inet errors
CREATE OR REPLACE FUNCTION public.log_client_security_event(
  event_type text, 
  severity text, 
  event_data jsonb DEFAULT '{}'::jsonb, 
  user_agent text DEFAULT NULL::text, 
  source text DEFAULT 'client'::text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  event_id uuid;
  calculated_risk_score integer;
  client_ip_text text;
  client_ip inet;
BEGIN
  -- Calculate risk score based on event type and severity
  calculated_risk_score := CASE severity
    WHEN 'critical' THEN 100
    WHEN 'high' THEN 75
    WHEN 'medium' THEN 50
    WHEN 'low' THEN 25
    ELSE 10
  END;
  
  -- Increase risk for specific suspicious events
  calculated_risk_score := calculated_risk_score + CASE event_type
    WHEN 'console_access_attempt' THEN 20
    WHEN 'dom_manipulation_detected' THEN 30
    WHEN 'developer_tools_detected' THEN 15
    WHEN 'external_api_call' THEN 10
    ELSE 0
  END;
  
  -- Safely handle IP address
  BEGIN
    client_ip_text := inet_client_addr()::text;
    -- Extract first IP if multiple IPs are present (common with proxies)
    IF client_ip_text IS NOT NULL AND position(',' in client_ip_text) > 0 THEN
      client_ip_text := split_part(client_ip_text, ',', 1);
    END IF;
    client_ip := client_ip_text::inet;
  EXCEPTION WHEN OTHERS THEN
    client_ip := NULL;
  END;
  
  -- Insert security event
  INSERT INTO public.security_events (
    event_type,
    severity,
    user_id,
    ip_address,
    user_agent,
    event_data,
    source,
    risk_score
  ) VALUES (
    event_type,
    severity,
    auth.uid(),
    client_ip,
    user_agent,
    event_data,
    source,
    calculated_risk_score
  ) RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$;