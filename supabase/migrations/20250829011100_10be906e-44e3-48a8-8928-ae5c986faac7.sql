-- Fix the RLS policy for user_roles to allow the trigger to work properly during user creation
-- The trigger needs to be able to insert the default user role when a new user is created

-- Drop the existing problematic policy
DROP POLICY IF EXISTS "Only system can assign default user role securely" ON public.user_roles;

-- Create a new policy that allows system/trigger context to insert default user roles
CREATE POLICY "System can assign default user role during signup" 
ON public.user_roles 
FOR INSERT 
WITH CHECK (
  -- Allow if role is 'user' and granted_by is NULL (system assignment)
  (role = 'user'::app_role AND granted_by IS NULL) OR
  -- Allow if the authenticated user is assigning to themselves
  (auth.uid() = user_id AND auth.uid() IS NOT NULL)
);

-- Also create a policy to allow the handle_new_user function to work in security definer context
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER -- This is important - allows function to bypass RLS
SET search_path = 'public'
AS $$
BEGIN
  -- Create profile first
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  
  -- Assign default user role with proper enum casting
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user'::public.app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$$;