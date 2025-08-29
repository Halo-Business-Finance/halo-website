-- Drop the existing function first
DROP FUNCTION IF EXISTS public.create_initial_admin(text);

-- Create the missing create_initial_admin function that AdminInitializer expects
CREATE OR REPLACE FUNCTION public.create_initial_admin(admin_email text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  admin_count integer;
  result_status boolean;
BEGIN
  -- Check if any admins already exist
  SELECT COUNT(*) INTO admin_count 
  FROM public.user_roles 
  WHERE role = 'admin' AND is_active = true;
  
  -- Only allow if no admins exist yet
  IF admin_count > 0 THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Admin users already exist. Use role assignment functions instead.'
    );
  END IF;
  
  -- Use the existing make_user_admin function
  SELECT public.make_user_admin(admin_email) INTO result_status;
  
  IF result_status THEN
    RETURN jsonb_build_object('success', true);
  ELSE
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Failed to assign admin role'
    );
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;

-- Temporarily increase rate limits for admin signup
UPDATE public.rate_limit_configs 
SET max_requests = 500, window_seconds = 300
WHERE endpoint = 'admin_signup';

-- Add rate limiting config for security events if it doesn't exist
INSERT INTO public.rate_limit_configs (endpoint, max_requests, window_seconds, block_duration_seconds)
VALUES ('security_event_logging', 50, 60, 300)
ON CONFLICT (endpoint) 
DO UPDATE SET 
  max_requests = 50,
  window_seconds = 60;