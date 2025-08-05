-- Fix critical role escalation vulnerability
-- Drop existing overly permissive policies on user_roles
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users get default role on signup" ON public.user_roles;

-- Create secure policies for user_roles table
CREATE POLICY "Admins can manage all roles" 
ON public.user_roles 
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Users can only view their own roles, cannot modify them
CREATE POLICY "Users can view own roles only" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

-- System can insert default user role on signup (restricted to user role only)
CREATE POLICY "System can assign default user role" 
ON public.user_roles 
FOR INSERT 
WITH CHECK (
  role = 'user'::app_role 
  AND granted_by IS NULL 
  AND auth.uid() = user_id
);

-- Fix consultations table - remove overly permissive system insert policy
DROP POLICY IF EXISTS "System can insert consultations" ON public.consultations;

-- Create proper policy for consultation submissions
CREATE POLICY "Anyone can submit consultations" 
ON public.consultations 
FOR INSERT 
WITH CHECK (true);

-- Only admins can view consultations (contains PII)
CREATE POLICY "Only admins can view consultations" 
ON public.consultations 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix security_events table - tighten system insert policy
DROP POLICY IF EXISTS "System can insert security events" ON public.security_events;

-- Create more restrictive policy for security events
CREATE POLICY "Authenticated users can log security events" 
ON public.security_events 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL OR user_id IS NULL);

-- Add audit logging for role changes
CREATE OR REPLACE FUNCTION public.audit_role_changes()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for role change auditing
CREATE TRIGGER audit_role_changes_trigger
  AFTER INSERT OR UPDATE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.audit_role_changes();

-- Add function to validate role assignments server-side
CREATE OR REPLACE FUNCTION public.assign_user_role(
  target_user_id UUID,
  new_role app_role,
  expiration_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  assigner_role app_role;
BEGIN
  -- Get the role of the user making the assignment
  SELECT get_user_role(auth.uid()) INTO assigner_role;
  
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
$$ LANGUAGE plpgsql SECURITY DEFINER;