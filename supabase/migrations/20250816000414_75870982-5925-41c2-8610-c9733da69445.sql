-- Create function to validate redirect URLs for enhanced security
CREATE OR REPLACE FUNCTION public.validate_redirect_url(redirect_url text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  allowed_domains text[] := ARRAY[
    'localhost',
    '127.0.0.1',
    'halobusinessfinance.com',
    'lovable.dev',
    'supabase.co'
  ];
  url_domain text;
BEGIN
  -- Extract domain from URL
  url_domain := substring(redirect_url from 'https?://([^/]+)');
  
  -- Check if domain is in allowed list or is a subdomain of allowed domains
  IF url_domain = ANY(allowed_domains) OR 
     url_domain LIKE '%.lovable.dev' OR 
     url_domain LIKE '%.halobusinessfinance.com' OR
     url_domain LIKE '%.supabase.co' THEN
    RETURN true;
  END IF;
  
  -- Log suspicious redirect attempt
  INSERT INTO public.security_events (
    event_type, severity, event_data, source
  ) VALUES (
    'suspicious_redirect_url_detected',
    'high',
    jsonb_build_object(
      'attempted_url', redirect_url,
      'extracted_domain', url_domain,
      'user_agent', current_setting('request.headers', true)::json->>'user-agent'
    ),
    'redirect_validation'
  );
  
  RETURN false;
END;
$$;

-- Create function to initialize first admin user (one-time use)
CREATE OR REPLACE FUNCTION public.create_initial_admin(admin_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  admin_count integer;
  target_user_id uuid;
BEGIN
  -- Check if any admins already exist
  SELECT COUNT(*) INTO admin_count 
  FROM public.user_roles 
  WHERE role = 'admin' AND is_active = true;
  
  -- Only allow if no admins exist
  IF admin_count > 0 THEN
    RAISE EXCEPTION 'Admin users already exist. Cannot create initial admin.';
  END IF;
  
  -- Find user by email in auth.users via profiles
  SELECT p.user_id INTO target_user_id 
  FROM public.profiles p
  JOIN auth.users u ON p.user_id = u.id
  WHERE u.email = admin_email;
  
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found. Please ensure user has signed up first.', admin_email;
  END IF;
  
  -- Create admin role
  INSERT INTO public.user_roles (user_id, role, granted_by)
  VALUES (target_user_id, 'admin', target_user_id);
  
  -- Log the admin creation
  INSERT INTO public.security_events (
    event_type, severity, user_id, event_data, source
  ) VALUES (
    'initial_admin_created',
    'critical',
    target_user_id,
    jsonb_build_object(
      'admin_email', admin_email,
      'created_at', now()
    ),
    'admin_initialization'
  );
  
  RETURN true;
END;
$$;