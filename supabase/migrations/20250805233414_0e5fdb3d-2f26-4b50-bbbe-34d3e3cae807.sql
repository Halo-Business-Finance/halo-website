-- Fix function search path security warnings with correct type usage
CREATE OR REPLACE FUNCTION public.audit_role_changes()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = ''
AS $$
BEGIN
  -- Log role assignments and revocations
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_logs (
      user_id,
      action,
      resource,
      resource_id,
      new_values,
      ip_address
    ) VALUES (
      NEW.granted_by,
      'role_assigned',
      'user_roles',
      NEW.id,
      to_jsonb(NEW),
      inet_client_addr()
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' AND OLD.is_active = true AND NEW.is_active = false THEN
    INSERT INTO public.audit_logs (
      user_id,
      action,
      resource,
      resource_id,
      old_values,
      new_values,
      ip_address
    ) VALUES (
      auth.uid(),
      'role_revoked',
      'user_roles',
      NEW.id,
      to_jsonb(OLD),
      to_jsonb(NEW),
      inet_client_addr()
    );
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$;

-- Fix the assign_user_role function with correct type reference
CREATE OR REPLACE FUNCTION public.assign_user_role(
  target_user_id UUID,
  new_role public.app_role,
  expiration_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS BOOLEAN 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = ''
AS $$
DECLARE
  assigner_role public.app_role;
BEGIN
  -- Get the role of the user making the assignment
  SELECT public.get_user_role(auth.uid()) INTO assigner_role;
  
  -- Only admins can assign roles
  IF assigner_role != 'admin' THEN
    RAISE EXCEPTION 'Insufficient permissions to assign roles';
  END IF;
  
  -- Prevent self-assignment of admin role
  IF auth.uid() = target_user_id AND new_role = 'admin' THEN
    RAISE EXCEPTION 'Cannot assign admin role to yourself';
  END IF;
  
  -- Insert the new role assignment
  INSERT INTO public.user_roles (
    user_id,
    role,
    granted_by,
    expires_at
  ) VALUES (
    target_user_id,
    new_role,
    auth.uid(),
    expiration_date
  )
  ON CONFLICT (user_id, role) 
  DO UPDATE SET
    is_active = true,
    granted_by = auth.uid(),
    expires_at = expiration_date,
    updated_at = now();
    
  RETURN TRUE;
END;
$$;