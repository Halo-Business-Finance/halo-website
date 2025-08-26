-- Initialize admin user creation function (if no admins exist)
CREATE OR REPLACE FUNCTION public.create_initial_admin(admin_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
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
  
  -- Find user by email in auth.users via profiles
  SELECT p.user_id INTO target_user_id 
  FROM public.profiles p
  JOIN auth.users u ON p.user_id = u.id
  WHERE u.email = admin_email;
  
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found. Please ensure user has signed up first.', admin_email;
  END IF;
  
  -- Create admin role
  INSERT INTO public.user_roles (user_id, role, granted_by)
  VALUES (target_user_id, 'admin', target_user_id);
  
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
$function$;

-- Clean up excessive security events to improve performance
CREATE OR REPLACE FUNCTION public.optimize_security_events()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  cleaned_count integer;
BEGIN
  -- Remove duplicate low-severity events from the same IP within 1 hour
  WITH duplicates AS (
    SELECT id,
           ROW_NUMBER() OVER (
             PARTITION BY event_type, ip_address, severity
             ORDER BY created_at DESC
           ) as rn
    FROM public.security_events
    WHERE severity IN ('info', 'low')
      AND created_at > now() - interval '1 hour'
  )
  DELETE FROM public.security_events 
  WHERE id IN (SELECT id FROM duplicates WHERE rn > 3);
  
  GET DIAGNOSTICS cleaned_count = ROW_COUNT;
  
  -- Log optimization activity
  INSERT INTO public.security_events (
    event_type, severity, event_data, source
  ) VALUES (
    'security_optimization_completed', 'info',
    jsonb_build_object('cleaned_events', cleaned_count),
    'security_optimizer'
  );
  
  RETURN cleaned_count;
END;
$function$;