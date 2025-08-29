-- CRITICAL SECURITY FIXES: Phase 1 - Database Functions and Access Control

-- 1. Create missing make_user_admin RPC function (CRITICAL - fixes admin signup)
CREATE OR REPLACE FUNCTION public.make_user_admin(target_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  target_user_id uuid;
  admin_count integer;
  caller_is_admin boolean := false;
BEGIN
  -- Security: Check if caller is already an admin (except for first admin)
  SELECT COUNT(*) INTO admin_count 
  FROM public.user_roles 
  WHERE role = 'admin' AND is_active = true;
  
  -- If admins exist, verify caller is admin
  IF admin_count > 0 THEN
    SELECT has_role(auth.uid(), 'admin') INTO caller_is_admin;
    IF NOT caller_is_admin THEN
      INSERT INTO public.security_events (
        event_type, severity, user_id, event_data, source
      ) VALUES (
        'unauthorized_admin_creation_attempt', 'critical', auth.uid(),
        jsonb_build_object('target_email', target_email, 'admin_count', admin_count),
        'admin_security'
      );
      RAISE EXCEPTION 'Unauthorized: Only existing admins can create new admins';
    END IF;
  END IF;
  
  -- Find user by email
  SELECT u.id INTO target_user_id 
  FROM auth.users u
  WHERE u.email = target_email;
  
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', target_email;
  END IF;
  
  -- Assign admin role
  INSERT INTO public.user_roles (user_id, role, granted_by)
  VALUES (target_user_id, 'admin', COALESCE(auth.uid(), target_user_id))
  ON CONFLICT (user_id, role) 
  DO UPDATE SET is_active = true, granted_by = COALESCE(auth.uid(), target_user_id);
  
  -- Log admin creation
  INSERT INTO public.security_events (
    event_type, severity, user_id, event_data, source
  ) VALUES (
    'admin_user_created', 'critical', COALESCE(auth.uid(), target_user_id),
    jsonb_build_object(
      'target_user_id', target_user_id,
      'target_email', target_email,
      'created_by', COALESCE(auth.uid(), target_user_id),
      'is_first_admin', admin_count = 0
    ),
    'admin_management'
  );
  
  RETURN TRUE;
END;
$$;

-- 2. Strengthen encryption_keys table security (CRITICAL)
DROP POLICY IF EXISTS "Service role only access to encryption keys" ON encryption_keys;

CREATE POLICY "Ultra secure encryption keys access" 
ON encryption_keys 
FOR ALL 
USING (
  -- Only service role can access encryption keys
  current_setting('role') = 'service_role'
) 
WITH CHECK (
  current_setting('role') = 'service_role'
);

-- 3. Restrict security_events access to admins only (HIGH PRIORITY)
DROP POLICY IF EXISTS "Moderators can view non-critical security events" ON security_events;

-- Only admins can view security events now
CREATE POLICY "Admins only can view security events" 
ON security_events 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'));

-- 4. Add encryption key access monitoring
CREATE OR REPLACE FUNCTION log_encryption_key_access()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.security_events (
    event_type,
    severity,
    event_data,
    source,
    ip_address
  ) VALUES (
    'encryption_key_accessed',
    'critical',
    jsonb_build_object(
      'operation', TG_OP,
      'key_identifier', COALESCE(NEW.key_identifier, OLD.key_identifier),
      'access_time', now(),
      'role', current_setting('role')
    ),
    'encryption_key_monitor',
    inet_client_addr()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS encryption_key_access_monitor ON encryption_keys;
CREATE TRIGGER encryption_key_access_monitor
  AFTER INSERT OR UPDATE OR DELETE ON encryption_keys
  FOR EACH ROW EXECUTE FUNCTION log_encryption_key_access();

-- 5. Strengthen consultation data protection
CREATE POLICY "Enhanced consultation data protection" 
ON consultations 
FOR SELECT 
USING (
  (auth.uid() = user_id AND auth.uid() IS NOT NULL) OR
  (has_role(auth.uid(), 'admin') AND auth.uid() IS NOT NULL)
);

-- 6. Add data access audit for sensitive operations
CREATE OR REPLACE FUNCTION audit_sensitive_data_access()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_TABLE_NAME IN ('consultations', 'encryption_keys', 'security_events') THEN
    INSERT INTO public.security_access_audit (
      user_id,
      action,
      table_name,
      record_id,
      ip_address,
      risk_assessment
    ) VALUES (
      auth.uid(),
      TG_OP,
      TG_TABLE_NAME,
      COALESCE(NEW.id, OLD.id),
      inet_client_addr(),
      CASE TG_TABLE_NAME
        WHEN 'encryption_keys' THEN 'critical'
        WHEN 'security_events' THEN 'high'
        ELSE 'normal'
      END
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;