-- Create the missing make_user_admin function
CREATE OR REPLACE FUNCTION public.make_user_admin(target_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Insert admin role for the target user
  INSERT INTO public.user_roles (user_id, role, granted_by)
  VALUES (target_user_id, 'admin'::public.app_role, target_user_id)
  ON CONFLICT (user_id, role) 
  DO UPDATE SET is_active = true, granted_by = target_user_id, updated_at = now();
  
  RETURN true;
EXCEPTION
  WHEN others THEN
    RAISE EXCEPTION 'Failed to assign admin role: %', SQLERRM;
END;
$$;