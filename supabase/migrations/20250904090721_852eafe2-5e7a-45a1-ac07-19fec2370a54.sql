-- Create the app_role enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Create trigger to automatically create profile when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create simple admin signup function
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
  profile_exists boolean := false;
BEGIN
  -- Get user ID from email
  SELECT id INTO target_user_id 
  FROM auth.users 
  WHERE email = user_email;
  
  IF target_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'User not found');
  END IF;
  
  -- Check if profile exists, create if missing
  SELECT EXISTS(SELECT 1 FROM profiles WHERE user_id = target_user_id) INTO profile_exists;
  
  IF NOT profile_exists THEN
    INSERT INTO profiles (user_id, display_name)
    VALUES (target_user_id, COALESCE(display_name, split_part(user_email, '@', 1)))
    ON CONFLICT (user_id) DO UPDATE SET display_name = COALESCE(EXCLUDED.display_name, profiles.display_name);
  END IF;
  
  -- Assign admin role
  INSERT INTO user_roles (user_id, role, granted_by)
  VALUES (target_user_id, 'admin'::app_role, target_user_id)
  ON CONFLICT (user_id, role) DO UPDATE SET is_active = true;
  
  RETURN jsonb_build_object('success', true, 'user_id', target_user_id);
END;
$$;

-- Fix the existing user's missing profile
INSERT INTO public.profiles (user_id, display_name)
SELECT 
  u.id,
  COALESCE(u.raw_user_meta_data->>'display_name', u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1))
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.user_id
WHERE p.user_id IS NULL
ON CONFLICT (user_id) DO NOTHING;