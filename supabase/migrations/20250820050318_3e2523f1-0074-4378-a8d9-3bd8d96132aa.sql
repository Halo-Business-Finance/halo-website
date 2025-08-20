-- Initialize Varda Dinkha as the first super administrator
-- This is a critical security operation that will establish the first admin user

DO $$
DECLARE
  admin_count integer;
  target_user_id uuid;
BEGIN
  -- Check if any admins already exist
  SELECT COUNT(*) INTO admin_count 
  FROM public.user_roles 
  WHERE role = 'admin' AND is_active = true;
  
  -- Only proceed if no admins exist (security measure)
  IF admin_count = 0 THEN
    -- Find user by email in auth.users via profiles
    SELECT p.user_id INTO target_user_id 
    FROM public.profiles p
    JOIN auth.users u ON p.user_id = u.id
    WHERE u.email = 'Varda@halobusinessfinance.com';
    
    IF target_user_id IS NOT NULL THEN
      -- Create super admin role
      INSERT INTO public.user_roles (user_id, role, granted_by)
      VALUES (target_user_id, 'admin', target_user_id);
      
      -- Log the critical security event
      INSERT INTO public.security_events (
        event_type, severity, user_id, event_data, source
      ) VALUES (
        'super_admin_initialized',
        'critical',
        target_user_id,
        jsonb_build_object(
          'admin_email', 'Varda@halobusinessfinance.com',
          'initialization_method', 'direct_database_assignment',
          'created_at', now(),
          'security_clearance', 'super_admin'
        ),
        'admin_initialization'
      );
      
      -- Create audit log entry
      INSERT INTO public.audit_logs (
        user_id, action, resource, new_values
      ) VALUES (
        target_user_id,
        'super_admin_initialized',
        'user_roles',
        jsonb_build_object(
          'user_id', target_user_id,
          'role', 'admin',
          'email', 'Varda@halobusinessfinance.com',
          'timestamp', now()
        )
      );
      
      RAISE NOTICE 'SUCCESS: Varda Dinkha has been initialized as super administrator';
    ELSE
      RAISE NOTICE 'ERROR: User with email Varda@halobusinessfinance.com not found. Please ensure user has signed up first.';
    END IF;
  ELSE
    RAISE NOTICE 'SECURITY: Admin users already exist (%). Cannot initialize new super admin.', admin_count;
  END IF;
END;
$$;