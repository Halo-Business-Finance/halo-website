-- Security Enhancement Migration
-- Phase 1: Tighten Profile Access Control

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create more restrictive profile policies
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (get_current_user_role() = 'admin');

-- Phase 2: Initialize Admin User System
-- Create a function to safely initialize the first admin
CREATE OR REPLACE FUNCTION public.initialize_admin_user(target_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  target_user_id uuid;
  admin_count integer;
BEGIN
  -- Check if any admins already exist
  SELECT COUNT(*) INTO admin_count 
  FROM public.user_roles 
  WHERE role = 'admin' AND is_active = true;
  
  -- Only allow if no admins exist yet
  IF admin_count > 0 THEN
    RAISE EXCEPTION 'Admin users already exist. Use assign_user_role function instead.';
  END IF;
  
  -- Find user by email (must be in profiles table)
  SELECT user_id INTO target_user_id 
  FROM public.profiles p
  JOIN auth.users u ON p.user_id = u.id
  WHERE u.email = target_email;
  
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', target_email;
  END IF;
  
  -- Assign admin role
  INSERT INTO public.user_roles (user_id, role, granted_by)
  VALUES (target_user_id, 'admin', target_user_id)
  ON CONFLICT (user_id, role) 
  DO UPDATE SET is_active = true, granted_by = target_user_id;
  
  RETURN TRUE;
END;
$$;

-- Phase 3: Enhanced Security Event Cleanup
-- Improve the cleanup function with better categorization
CREATE OR REPLACE FUNCTION public.cleanup_security_events()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  cleaned_count INTEGER;
  retention_days INTEGER := 90; -- 3 months retention
  critical_retention_days INTEGER := 365; -- 1 year for critical events
BEGIN
  -- Clean up non-critical events older than retention period
  DELETE FROM public.security_events
  WHERE created_at < now() - (retention_days || ' days')::interval
    AND severity NOT IN ('critical', 'high');
  
  GET DIAGNOSTICS cleaned_count = ROW_COUNT;
  
  -- Clean up critical events older than extended retention period
  DELETE FROM public.security_events
  WHERE created_at < now() - (critical_retention_days || ' days')::interval
    AND severity IN ('critical', 'high')
    AND resolved_at IS NOT NULL;
  
  RETURN cleaned_count;
END;
$$;

-- Phase 4: Server-Side Rate Limiting Support
-- Create rate limiting configuration table
CREATE TABLE IF NOT EXISTS public.rate_limit_configs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  endpoint text NOT NULL UNIQUE,
  max_requests integer NOT NULL DEFAULT 100,
  window_seconds integer NOT NULL DEFAULT 3600,
  block_duration_seconds integer NOT NULL DEFAULT 3600,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on rate limit configs
ALTER TABLE public.rate_limit_configs ENABLE ROW LEVEL SECURITY;

-- Only admins can manage rate limit configs
CREATE POLICY "Admins can manage rate limit configs" 
ON public.rate_limit_configs 
FOR ALL 
USING (get_current_user_role() = 'admin');

-- Insert default rate limiting configurations
INSERT INTO public.rate_limit_configs (endpoint, max_requests, window_seconds, block_duration_seconds) VALUES
('/api/consultation', 5, 3600, 7200),
('/api/auth/signup', 3, 3600, 3600),
('/api/auth/signin', 5, 900, 1800),
('/api/contact', 10, 3600, 3600)
ON CONFLICT (endpoint) DO NOTHING;

-- Create trigger for rate limit config updates
CREATE TRIGGER update_rate_limit_configs_updated_at
BEFORE UPDATE ON public.rate_limit_configs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Phase 5: Enhanced Session Security
-- Add session fingerprinting support
ALTER TABLE public.user_sessions 
ADD COLUMN IF NOT EXISTS client_fingerprint text,
ADD COLUMN IF NOT EXISTS security_level text DEFAULT 'normal' CHECK (security_level IN ('normal', 'elevated', 'maximum'));

-- Create function to validate session security
CREATE OR REPLACE FUNCTION public.validate_session_security(
  session_token text,
  client_ip inet,
  client_fingerprint text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  session_record public.user_sessions;
  is_valid boolean := false;
BEGIN
  -- Get session record
  SELECT * INTO session_record
  FROM public.user_sessions
  WHERE session_token = validate_session_security.session_token
    AND is_active = true
    AND expires_at > now();
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Basic validations
  IF session_record.ip_address != client_ip THEN
    -- Log suspicious IP change
    INSERT INTO public.security_events (
      event_type, severity, user_id, ip_address, event_data
    ) VALUES (
      'session_ip_change', 'high', session_record.user_id, client_ip,
      jsonb_build_object(
        'original_ip', session_record.ip_address,
        'new_ip', client_ip,
        'session_token', session_token
      )
    );
    RETURN false;
  END IF;
  
  -- Fingerprint validation (if available)
  IF session_record.client_fingerprint IS NOT NULL 
     AND session_record.client_fingerprint != client_fingerprint THEN
    -- Log suspicious fingerprint change
    INSERT INTO public.security_events (
      event_type, severity, user_id, ip_address, event_data
    ) VALUES (
      'session_fingerprint_change', 'medium', session_record.user_id, client_ip,
      jsonb_build_object(
        'original_fingerprint', session_record.client_fingerprint,
        'new_fingerprint', client_fingerprint,
        'session_token', session_token
      )
    );
    RETURN false;
  END IF;
  
  -- Update last activity
  UPDATE public.user_sessions
  SET last_activity = now()
  WHERE session_token = validate_session_security.session_token;
  
  RETURN true;
END;
$$;