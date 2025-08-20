-- Create the missing app_role enum type
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Fix IP address handling in security events table
-- Update the log_client_security_event function to handle IP addresses properly
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
SET search_path TO ''
AS $function$
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
  
  -- Safely handle IP address - extract first valid IP
  BEGIN
    client_ip_text := inet_client_addr()::text;
    -- Handle comma-separated IPs by taking the first one
    IF client_ip_text IS NOT NULL THEN
      -- Remove any whitespace and extract first IP
      client_ip_text := trim(split_part(client_ip_text, ',', 1));
      -- Validate it's a proper IP format
      IF client_ip_text ~ '^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$' THEN
        client_ip := client_ip_text::inet;
      ELSE
        client_ip := NULL;
      END IF;
    ELSE
      client_ip := NULL;
    END IF;
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
$function$;

-- Ensure the handle_new_user function exists and works properly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Create profile first
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  
  -- Assign default user role with proper enum casting
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user'::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$function$;

-- Ensure the trigger exists for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();