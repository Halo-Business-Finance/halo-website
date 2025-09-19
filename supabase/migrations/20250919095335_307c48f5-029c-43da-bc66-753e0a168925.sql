-- Fix function search path security issues
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Fix the verify_admin_session function 
CREATE OR REPLACE FUNCTION verify_admin_session(token TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_id UUID;
BEGIN
  SELECT admin_user_id INTO admin_id
  FROM public.admin_sessions
  WHERE session_token = token
    AND expires_at > now();
  
  IF admin_id IS NOT NULL THEN
    -- Update last activity
    UPDATE public.admin_sessions
    SET updated_at = now()
    WHERE session_token = token;
    
    -- Set session variable
    PERFORM set_config('app.current_admin_id', admin_id::text, true);
    
    RETURN admin_id;
  END IF;
  
  RETURN NULL;
END;
$$;