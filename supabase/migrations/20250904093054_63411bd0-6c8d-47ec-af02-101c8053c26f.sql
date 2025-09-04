-- Create a secure function to get user profile data with emails for admin use
CREATE OR REPLACE FUNCTION public.get_admin_user_profiles()
RETURNS TABLE (
  profile_id uuid,
  user_id uuid,
  display_name text,
  email text,
  is_active boolean,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  role app_role,
  role_granted_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow admins to call this function
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only administrators can view user profiles with email data';
  END IF;
  
  RETURN QUERY
  SELECT 
    p.id as profile_id,
    p.user_id,
    p.display_name,
    au.email,
    p.is_active,
    p.created_at,
    p.updated_at,
    COALESCE(ur.role, 'user'::app_role) as role,
    ur.granted_at as role_granted_at
  FROM public.profiles p
  JOIN auth.users au ON p.user_id = au.id
  LEFT JOIN public.user_roles ur ON p.user_id = ur.user_id AND ur.is_active = true
  ORDER BY p.created_at DESC;
END;
$$;