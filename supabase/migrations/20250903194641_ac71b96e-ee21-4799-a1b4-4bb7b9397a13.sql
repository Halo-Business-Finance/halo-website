-- Fix security_configs table policies to allow proper admin access
DROP POLICY IF EXISTS "Deny anonymous access to security configs" ON public.security_configs;
DROP POLICY IF EXISTS "Deny authenticated access to security configs" ON public.security_configs;

-- Create proper admin access policy for security configs
CREATE POLICY "Secure admin access to security configs" 
ON public.security_configs 
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) AND auth.uid() IS NOT NULL)
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) AND auth.uid() IS NOT NULL);

-- Enhance security event optimization function
CREATE OR REPLACE FUNCTION public.optimize_security_events()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  cleaned_count integer;
BEGIN
  -- Remove excessive client_log events older than 1 hour
  DELETE FROM public.security_events
  WHERE event_type = 'client_log' 
    AND severity IN ('info', 'low')
    AND created_at < now() - interval '1 hour';
  
  GET DIAGNOSTICS cleaned_count = ROW_COUNT;
  
  -- Remove duplicate low-severity events from the same IP within 1 hour
  WITH duplicates AS (
    SELECT id,
           ROW_NUMBER() OVER (
             PARTITION BY event_type, ip_address, severity
             ORDER BY created_at DESC
           ) as rn
    FROM public.security_events
    WHERE severity IN ('info', 'low')
      AND created_at > now() - interval '6 hours'
      AND event_type != 'admin_role_assigned'
  )
  DELETE FROM public.security_events 
  WHERE id IN (SELECT id FROM duplicates WHERE rn > 5);
  
  -- Clean up very old low-priority events (older than 7 days)
  DELETE FROM public.security_events
  WHERE severity = 'info'
    AND event_type NOT IN ('admin_role_assigned', 'admin_role_revoked', 'initial_admin_created')
    AND created_at < now() - interval '7 days';
  
  GET DIAGNOSTICS cleaned_count = cleaned_count + ROW_COUNT;
  
  -- Log optimization activity
  INSERT INTO public.security_events (
    event_type, severity, event_data, source
  ) VALUES (
    'security_optimization_completed', 'info',
    jsonb_build_object('cleaned_events', cleaned_count, 'optimization_time', now()),
    'security_optimizer'
  );
  
  RETURN cleaned_count;
END;
$function$;

-- Create function to initialize first admin safely
CREATE OR REPLACE FUNCTION public.create_initial_admin(admin_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
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
    RAISE EXCEPTION 'Admin users already exist. Current admin count: %', admin_count;
  END IF;
  
  -- Find user by email from auth.users (must be signed up)
  SELECT id INTO target_user_id 
  FROM auth.users 
  WHERE email = admin_email 
  AND email_confirmed_at IS NOT NULL;
  
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found or email not confirmed', admin_email;
  END IF;
  
  -- Create profile if it doesn't exist
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (target_user_id, 'System Administrator')
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Assign admin role
  INSERT INTO public.user_roles (user_id, role, granted_by)
  VALUES (target_user_id, 'admin', target_user_id)
  ON CONFLICT (user_id, role) 
  DO UPDATE SET is_active = true, granted_by = target_user_id, updated_at = now();
  
  -- Log critical security event
  INSERT INTO public.security_events (
    event_type, severity, user_id, event_data, source
  ) VALUES (
    'initial_admin_created', 'critical', target_user_id,
    jsonb_build_object(
      'admin_email', admin_email,
      'created_at', now(),
      'is_first_admin', true
    ),
    'admin_initialization'
  );
  
  RETURN TRUE;
END;
$function$;