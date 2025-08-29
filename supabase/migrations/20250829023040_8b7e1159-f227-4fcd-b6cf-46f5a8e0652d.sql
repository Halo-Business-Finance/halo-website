-- Create the missing create_initial_admin function that AdminInitializer is calling
CREATE OR REPLACE FUNCTION public.create_initial_admin(admin_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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
  
  -- Find user by email from auth.users via profiles table
  SELECT user_id INTO target_user_id 
  FROM public.profiles p
  WHERE p.user_id IN (
    SELECT id FROM auth.users WHERE email = admin_email
  );
  
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', admin_email;
  END IF;
  
  -- Assign admin role
  INSERT INTO public.user_roles (user_id, role, granted_by)
  VALUES (target_user_id, 'admin'::public.app_role, target_user_id)
  ON CONFLICT (user_id, role) 
  DO UPDATE SET is_active = true, granted_by = target_user_id;
  
  RETURN TRUE;
END;
$$;