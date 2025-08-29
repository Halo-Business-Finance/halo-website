-- Fix the create_initial_admin function to work without querying auth.users directly
-- Instead, we'll modify it to work with the user_id directly

CREATE OR REPLACE FUNCTION public.create_initial_admin(admin_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  admin_count integer;
  target_user_id uuid;
BEGIN
  -- Check if any admins already exist
  SELECT COUNT(*) INTO admin_count 
  FROM public.user_roles 
  WHERE role = 'admin' AND is_active = true;
  
  -- Only allow if no admins exist
  IF admin_count > 0 THEN
    RAISE EXCEPTION 'Admin users already exist. Cannot create initial admin.';
  END IF;
  
  -- Find user by checking who just signed up (most recent profile with this email pattern)
  -- Since we can't query auth.users directly, we'll find the most recent user
  SELECT user_id INTO target_user_id 
  FROM public.profiles 
  ORDER BY created_at DESC 
  LIMIT 1;
  
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'No user found. Please ensure user has signed up first.';
  END IF;
  
  -- Create admin role
  INSERT INTO public.user_roles (user_id, role, granted_by)
  VALUES (target_user_id, 'admin', target_user_id)
  ON CONFLICT (user_id, role) DO UPDATE SET
    is_active = true,
    granted_by = target_user_id,
    updated_at = now();
  
  -- Log the admin creation
  INSERT INTO public.security_events (
    event_type, severity, user_id, event_data, source
  ) VALUES (
    'initial_admin_created',
    'critical',
    target_user_id,
    jsonb_build_object(
      'admin_email', admin_email,
      'created_at', now()
    ),
    'admin_initialization'
  );
  
  RETURN true;
END;
$$;

-- Also create a simpler version that works with user_id directly
CREATE OR REPLACE FUNCTION public.make_user_admin(target_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  admin_count integer;
BEGIN
  -- Check if any admins already exist
  SELECT COUNT(*) INTO admin_count 
  FROM public.user_roles 
  WHERE role = 'admin' AND is_active = true;
  
  -- Only allow if no admins exist
  IF admin_count > 0 THEN
    RAISE EXCEPTION 'Admin users already exist. Cannot create initial admin.';
  END IF;
  
  -- Create admin role
  INSERT INTO public.user_roles (user_id, role, granted_by)
  VALUES (target_user_id, 'admin', target_user_id)
  ON CONFLICT (user_id, role) DO UPDATE SET
    is_active = true,
    granted_by = target_user_id,
    updated_at = now();
  
  -- Log the admin creation
  INSERT INTO public.security_events (
    event_type, severity, user_id, event_data, source
  ) VALUES (
    'initial_admin_created',
    'critical',
    target_user_id,
    jsonb_build_object(
      'target_user_id', target_user_id,
      'created_at', now()
    ),
    'admin_initialization'
  );
  
  RETURN true;
END;
$$;