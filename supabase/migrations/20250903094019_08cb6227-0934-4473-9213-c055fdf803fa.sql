-- Fix missing RLS policy for security_access_audit table
CREATE POLICY "Service role can insert security access audit logs" 
ON public.security_access_audit 
FOR INSERT 
WITH CHECK (auth.role() = 'service_role');

-- Create function to initialize first admin user safely
CREATE OR REPLACE FUNCTION public.create_initial_admin(admin_email text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  target_user_id uuid;
  admin_count integer;
  result jsonb;
BEGIN
  -- Check if any admins already exist
  SELECT COUNT(*) INTO admin_count 
  FROM public.user_roles 
  WHERE role = 'admin' AND is_active = true;
  
  -- Only allow if no admins exist yet
  IF admin_count > 0 THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Admin users already exist. Contact existing administrator.'
    );
  END IF;
  
  -- Find user by email from auth.users
  SELECT id INTO target_user_id 
  FROM auth.users
  WHERE email = admin_email AND email_confirmed_at IS NOT NULL;
  
  IF target_user_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'User with email not found or email not confirmed'
    );
  END IF;
  
  -- Create profile if it doesn't exist
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (target_user_id, split_part(admin_email, '@', 1))
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Assign admin role
  INSERT INTO public.user_roles (user_id, role, granted_by)
  VALUES (target_user_id, 'admin', target_user_id)
  ON CONFLICT (user_id, role) 
  DO UPDATE SET is_active = true, granted_by = target_user_id;
  
  -- Log admin creation
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
  
  RETURN jsonb_build_object(
    'success', true,
    'message', 'First administrator created successfully'
  );
END;
$$;