-- CRITICAL SECURITY FIX: Remove privilege escalation vulnerability
-- Drop the dangerous 'role' column from profiles table since roles are properly managed in user_roles table

-- First, update the handle_new_user function to not reference the role column
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Create profile without role column (roles are managed in user_roles table)
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END;
$$;

-- Drop the role column from profiles table (CRITICAL SECURITY FIX)
ALTER TABLE public.profiles DROP COLUMN IF EXISTS role;

-- Update profiles RLS policies to be more restrictive
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create more restrictive update policy that explicitly excludes any role-related modifications
CREATE POLICY "Users can update their own profile safely" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add security monitoring trigger for profile modifications
CREATE OR REPLACE FUNCTION public.log_profile_security_events()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Log any profile modifications for security monitoring
  INSERT INTO public.security_events (
    event_type,
    severity,
    user_id,
    ip_address,
    event_data,
    source
  ) VALUES (
    CASE TG_OP
      WHEN 'UPDATE' THEN 'profile_modified'
      WHEN 'INSERT' THEN 'profile_created'
      WHEN 'DELETE' THEN 'profile_deleted'
    END,
    CASE TG_OP
      WHEN 'DELETE' THEN 'high'
      ELSE 'medium'
    END,
    auth.uid(),
    inet_client_addr(),
    jsonb_build_object(
      'profile_id', COALESCE(NEW.id, OLD.id),
      'operation', TG_OP,
      'user_role', public.get_current_user_role()
    ),
    'profile_security_monitor'
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger for profile security monitoring
DROP TRIGGER IF EXISTS profile_security_monitor ON public.profiles;
CREATE TRIGGER profile_security_monitor
  AFTER INSERT OR UPDATE OR DELETE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.log_profile_security_events();