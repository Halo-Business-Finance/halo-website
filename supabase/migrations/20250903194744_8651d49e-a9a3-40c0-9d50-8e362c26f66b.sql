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