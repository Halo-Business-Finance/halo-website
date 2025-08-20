-- Fix the schema path issue for app_role enum

-- First check if enum exists in public schema
DO $$
BEGIN
    -- Drop and recreate the trigger function with explicit schema reference
    DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
END;
$$;

-- Recreate the trigger function with proper schema references
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Create profile first
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  
  -- Assign default user role with explicit schema reference
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Test the enum type explicitly
DO $$
DECLARE
    test_role public.app_role;
BEGIN
    test_role := 'user'::public.app_role;
END;
$$;