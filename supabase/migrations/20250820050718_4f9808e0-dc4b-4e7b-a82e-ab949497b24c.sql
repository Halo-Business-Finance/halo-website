-- Initialize Varda as super admin after fixing database schema
DO $$
DECLARE
  target_user_id uuid;
BEGIN
  -- Find user by email
  SELECT p.user_id INTO target_user_id 
  FROM public.profiles p
  JOIN auth.users u ON p.user_id = u.id
  WHERE u.email = 'Varda@halobusinessfinance.com';
  
  IF target_user_id IS NOT NULL THEN
    -- Assign admin role
    INSERT INTO public.user_roles (user_id, role, granted_by)
    VALUES (target_user_id, 'admin'::public.app_role, target_user_id)
    ON CONFLICT (user_id, role) 
    DO UPDATE SET is_active = true, granted_by = target_user_id;
    
    -- Log the admin assignment
    INSERT INTO public.security_events (
      event_type, severity, user_id, event_data, source
    ) VALUES (
      'super_admin_assigned_post_fix',
      'critical',
      target_user_id,
      jsonb_build_object(
        'admin_email', 'Varda@halobusinessfinance.com',
        'fix_completion', true
      ),
      'admin_initialization'
    );
  END IF;
END;
$$;