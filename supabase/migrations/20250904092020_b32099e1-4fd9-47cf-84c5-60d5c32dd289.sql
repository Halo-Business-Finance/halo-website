-- Fix the simple_admin_signup function to handle case-insensitive email lookup
CREATE OR REPLACE FUNCTION public.simple_admin_signup(
  user_email text,
  display_name text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_user_id uuid;
  admin_count integer;
  profile_exists boolean;
BEGIN
  -- Check if any admins already exist
  SELECT COUNT(*) INTO admin_count 
  FROM public.user_roles 
  WHERE role = 'admin' AND is_active = true;
  
  -- Find user by email (case-insensitive)
  SELECT u.id INTO target_user_id 
  FROM auth.users u
  WHERE LOWER(u.email) = LOWER(user_email);
  
  IF target_user_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'User not found with email: ' || user_email || '. Please ensure the user has signed up first.'
    );
  END IF;
  
  -- Check if profile exists, create if missing
  SELECT EXISTS(SELECT 1 FROM public.profiles WHERE user_id = target_user_id) INTO profile_exists;
  
  IF NOT profile_exists THEN
    INSERT INTO public.profiles (user_id, display_name)
    VALUES (target_user_id, COALESCE(display_name, split_part(user_email, '@', 1)))
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  
  -- Assign admin role
  INSERT INTO public.user_roles (user_id, role, granted_by)
  VALUES (target_user_id, 'admin', target_user_id)
  ON CONFLICT (user_id, role) 
  DO UPDATE SET is_active = true, granted_by = target_user_id;
  
  -- Log the admin assignment
  INSERT INTO public.security_events (
    event_type, severity, user_id, event_data, source
  ) VALUES (
    'admin_role_assigned_via_signup', 'critical', target_user_id,
    jsonb_build_object(
      'target_user_id', target_user_id,
      'email', user_email,
      'is_first_admin', admin_count = 0,
      'method', 'simple_admin_signup'
    ),
    'admin_initialization'
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'user_id', target_user_id,
    'is_first_admin', admin_count = 0
  );
END;
$$;