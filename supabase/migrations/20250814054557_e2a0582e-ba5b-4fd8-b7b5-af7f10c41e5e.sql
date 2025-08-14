-- Create data masking utility function
CREATE OR REPLACE FUNCTION public.mask_sensitive_data(
  data_value text,
  field_type text,
  masking_level text DEFAULT 'partial'
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  IF data_value IS NULL OR data_value = '' THEN
    RETURN data_value;
  END IF;
  
  CASE field_type
    WHEN 'email' THEN
      IF masking_level = 'full' THEN
        RETURN '[MASKED_EMAIL]';
      ELSE
        -- Partial masking: show first char and domain
        RETURN CASE 
          WHEN position('@' in data_value) > 0 THEN
            left(data_value, 1) || '***@' || split_part(data_value, '@', 2)
          ELSE '[INVALID_EMAIL]'
        END;
      END IF;
    
    WHEN 'phone' THEN
      IF masking_level = 'full' THEN
        RETURN '[MASKED_PHONE]';
      ELSE
        -- Show last 4 digits
        RETURN regexp_replace(data_value, '.', '*', 'g') || right(data_value, 4);
      END IF;
    
    WHEN 'name' THEN
      IF masking_level = 'full' THEN
        RETURN '[MASKED_NAME]';
      ELSE
        -- Show first letter of each word
        RETURN regexp_replace(data_value, '\w', '*', 'g');
      END IF;
    
    WHEN 'ssn' THEN
      RETURN 'XXX-XX-' || right(data_value, 4);
    
    ELSE
      -- Generic masking
      IF masking_level = 'full' THEN
        RETURN '[MASKED]';
      ELSE
        RETURN left(data_value, 1) || repeat('*', greatest(1, length(data_value) - 2)) || right(data_value, 1);
      END IF;
  END CASE;
END;
$function$;

-- Create security incidents table for incident response tracking
CREATE TABLE IF NOT EXISTS public.security_incidents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  incident_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'investigating', 'resolved', 'closed')),
  affected_resources TEXT[] DEFAULT '{}',
  response_actions JSONB DEFAULT '[]',
  initiated_by UUID REFERENCES auth.users(id),
  resolved_by UUID REFERENCES auth.users(id),
  incident_data JSONB DEFAULT '{}',
  resolution_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS for security incidents
ALTER TABLE public.security_incidents ENABLE ROW LEVEL SECURITY;

-- RLS policies for security incidents
CREATE POLICY "Security incidents viewable by admins and moderators" 
ON public.security_incidents 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role IN ('admin', 'moderator')
    AND ur.is_active = true
  )
);

CREATE POLICY "Security incidents manageable by admins" 
ON public.security_incidents 
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role = 'admin'
    AND ur.is_active = true
  )
);

-- Create trigger for updated_at
CREATE TRIGGER update_security_incidents_updated_at
BEFORE UPDATE ON public.security_incidents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add index for better performance
CREATE INDEX idx_security_incidents_status ON public.security_incidents(status);
CREATE INDEX idx_security_incidents_severity ON public.security_incidents(severity);
CREATE INDEX idx_security_incidents_created_at ON public.security_incidents(created_at);

-- Create function to get session overview for admins
CREATE OR REPLACE FUNCTION public.get_session_overview_admin()
RETURNS TABLE(
  id UUID,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE,
  last_activity TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN,
  security_level TEXT,
  masked_ip TEXT,
  session_duration_minutes INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  -- Only allow admin access
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role = 'admin'
    AND ur.is_active = true
  ) THEN
    RAISE EXCEPTION 'Admin access required';
  END IF;
  
  RETURN QUERY
  SELECT 
    us.id,
    us.user_id,
    us.created_at,
    us.last_activity,
    us.is_active,
    COALESCE(us.security_level, 'normal') as security_level,
    -- Mask IP addresses for privacy
    CASE 
      WHEN us.ip_address IS NOT NULL THEN
        split_part(us.ip_address::text, '.', 1) || '.***.***.***'
      ELSE 'unknown'
    END as masked_ip,
    EXTRACT(epoch FROM (us.last_activity - us.created_at))/60 as session_duration_minutes
  FROM public.user_sessions us
  ORDER BY us.last_activity DESC
  LIMIT 100;
END;
$function$;

-- Enhanced rate limiting configuration
INSERT INTO public.rate_limit_configs (endpoint, max_requests, window_seconds, block_duration_seconds)
VALUES 
  ('chat-with-ai', 10, 300, 600),  -- 10 requests per 5 minutes, block for 10 minutes
  ('data-masking', 50, 3600, 1800), -- 50 requests per hour, block for 30 minutes
  ('security-monitoring', 100, 3600, 3600), -- 100 requests per hour, block for 1 hour
  ('automated-incident-response', 5, 3600, 7200) -- 5 requests per hour, block for 2 hours
ON CONFLICT (endpoint) DO UPDATE SET
  max_requests = EXCLUDED.max_requests,
  window_seconds = EXCLUDED.window_seconds,
  block_duration_seconds = EXCLUDED.block_duration_seconds;

-- Create security alert escalation function
CREATE OR REPLACE FUNCTION public.escalate_critical_alerts()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  -- Auto-escalate critical security events
  IF NEW.severity = 'critical' THEN
    -- Create immediate alert
    INSERT INTO public.security_alerts (
      event_id,
      alert_type,
      priority,
      status,
      notes
    ) VALUES (
      NEW.id,
      NEW.event_type,
      'critical',
      'open',
      'CRITICAL: Immediate investigation required - ' || NEW.event_type
    );
    
    -- Log escalation
    INSERT INTO public.security_events (
      event_type,
      severity,
      event_data,
      source
    ) VALUES (
      'critical_alert_escalated',
      'high',
      jsonb_build_object(
        'original_event_id', NEW.id,
        'escalation_reason', 'critical_severity_detected',
        'auto_escalated', true
      ),
      'alert_escalation_system'
    );
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Create trigger for critical alert escalation
CREATE TRIGGER escalate_critical_security_events
AFTER INSERT ON public.security_events
FOR EACH ROW
EXECUTE FUNCTION public.escalate_critical_alerts();