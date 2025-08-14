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
WITH CHECK (
  auth.uid() = user_id 
  AND user_id = OLD.user_id  -- Prevent user_id changes
);

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
      'user_role', public.get_current_user_role(),
      'changes', CASE 
        WHEN TG_OP = 'UPDATE' THEN jsonb_build_object(
          'old_display_name', OLD.display_name,
          'new_display_name', NEW.display_name,
          'old_avatar_url', OLD.avatar_url,
          'new_avatar_url', NEW.avatar_url
        )
        ELSE '{}'::jsonb
      END
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

-- Add enhanced role change monitoring
CREATE OR REPLACE FUNCTION public.enhanced_audit_role_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Enhanced logging for role assignments and revocations with security context
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
      'secure_role_assigned',
      'user_roles',
      NEW.id,
      jsonb_build_object(
        'target_user_id', NEW.user_id,
        'role', NEW.role,
        'granted_by', NEW.granted_by,
        'expires_at', NEW.expires_at,
        'security_context', jsonb_build_object(
          'granter_role', public.get_user_role(NEW.granted_by),
          'assignment_time', now(),
          'is_privileged_role', NEW.role IN ('admin', 'moderator')
        )
      ),
      inet_client_addr()
    );
    
    -- Log critical security event for admin role assignments
    IF NEW.role = 'admin' THEN
      INSERT INTO public.security_events (
        event_type, severity, user_id, event_data, source
      ) VALUES (
        'admin_role_granted', 'critical', NEW.granted_by,
        jsonb_build_object(
          'target_user_id', NEW.user_id,
          'granted_by', NEW.granted_by
        ),
        'role_security_monitor'
      );
    END IF;
    
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
      'secure_role_revoked',
      'user_roles',
      NEW.id,
      to_jsonb(OLD),
      to_jsonb(NEW),
      inet_client_addr()
    );
    
    -- Log critical security event for admin role revocations
    IF OLD.role = 'admin' THEN
      INSERT INTO public.security_events (
        event_type, severity, user_id, event_data, source
      ) VALUES (
        'admin_role_revoked', 'critical', auth.uid(),
        jsonb_build_object(
          'target_user_id', NEW.user_id,
          'revoked_by', auth.uid()
        ),
        'role_security_monitor'
      );
    END IF;
    
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$;

-- Replace the existing audit trigger with enhanced version
DROP TRIGGER IF EXISTS audit_role_changes ON public.user_roles;
CREATE TRIGGER enhanced_audit_role_changes
  AFTER INSERT OR UPDATE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.enhanced_audit_role_changes();