-- Enhanced Role-Based Access Control Security Fixes

-- 1. Enhanced RLS Policies for user_roles table
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own roles only" ON public.user_roles;
DROP POLICY IF EXISTS "System can assign default user role" ON public.user_roles;

-- Enhanced RLS policies with better security
CREATE POLICY "Users can view their own roles securely" 
ON public.user_roles 
FOR SELECT 
USING (
  auth.uid() = user_id AND 
  auth.uid() IS NOT NULL
);

CREATE POLICY "Only system can assign default user role securely" 
ON public.user_roles 
FOR INSERT 
WITH CHECK (
  role = 'user'::app_role AND 
  granted_by IS NULL AND 
  auth.uid() = user_id AND
  auth.uid() IS NOT NULL
);

CREATE POLICY "Only admins can manage roles with validation"
ON public.user_roles
FOR ALL
USING (
  has_role(auth.uid(), 'admin') AND
  auth.uid() IS NOT NULL
)
WITH CHECK (
  has_role(auth.uid(), 'admin') AND
  auth.uid() IS NOT NULL AND
  -- Prevent self-role assignment/elevation unless already admin
  (auth.uid() != user_id OR has_role(auth.uid(), 'admin'))
);

-- 2. Enhanced admin lockout prevention function
CREATE OR REPLACE FUNCTION public.enhanced_secure_assign_user_role(
  target_user_id uuid, 
  new_role app_role, 
  expiration_date timestamp with time zone DEFAULT NULL,
  justification text DEFAULT 'Administrative action'
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  assigner_role public.app_role;
  admin_count integer;
  target_current_role public.app_role;
  requires_approval boolean := false;
BEGIN
  -- Enhanced permission check
  SELECT public.get_user_role(auth.uid()) INTO assigner_role;
  
  IF assigner_role != 'admin' THEN
    INSERT INTO public.security_events (
      event_type, severity, user_id, event_data, source
    ) VALUES (
      'unauthorized_role_assignment_attempt', 'critical', auth.uid(),
      jsonb_build_object(
        'target_user_id', target_user_id,
        'attempted_role', new_role,
        'assigner_role', assigner_role,
        'justification', justification
      ),
      'enhanced_role_management'
    );
    RAISE EXCEPTION 'Insufficient permissions to assign roles';
  END IF;

  -- Get current role
  SELECT public.get_user_role(target_user_id) INTO target_current_role;
  
  -- Enhanced admin protection
  IF target_current_role = 'admin' AND new_role != 'admin' THEN
    SELECT COUNT(*) INTO admin_count 
    FROM public.user_roles 
    WHERE role = 'admin' AND is_active = true AND user_id != target_user_id;
    
    IF admin_count < 2 THEN
      INSERT INTO public.security_events (
        event_type, severity, user_id, event_data, source
      ) VALUES (
        'admin_lockout_prevention_triggered', 'critical', auth.uid(),
        jsonb_build_object(
          'target_user_id', target_user_id,
          'attempted_role_change', jsonb_build_object('from', 'admin', 'to', new_role),
          'remaining_admin_count', admin_count,
          'justification', justification
        ),
        'enhanced_role_management'
      );
      RAISE EXCEPTION 'Cannot revoke admin role: Must maintain at least 2 active administrators';
    END IF;
  END IF;
  
  -- Enhanced self-assignment prevention
  IF auth.uid() = target_user_id AND new_role = 'admin' AND target_current_role != 'admin' THEN
    requires_approval := true;
    INSERT INTO public.security_events (
      event_type, severity, user_id, event_data, source
    ) VALUES (
      'self_admin_assignment_flagged', 'high', auth.uid(),
      jsonb_build_object(
        'requires_approval', true,
        'current_role', target_current_role,
        'attempted_role', new_role,
        'justification', justification
      ),
      'enhanced_role_management'
    );
    RAISE EXCEPTION 'Self-admin assignment requires additional approval process';
  END IF;
  
  -- Deactivate existing roles
  UPDATE public.user_roles
  SET is_active = false, updated_at = now()
  WHERE user_id = target_user_id AND is_active = true;
  
  -- Insert new role with enhanced logging
  INSERT INTO public.user_roles (
    user_id, role, granted_by, expires_at
  ) VALUES (
    target_user_id, new_role, auth.uid(), expiration_date
  );
  
  -- Enhanced audit logging
  INSERT INTO public.security_events (
    event_type, severity, user_id, event_data, source
  ) VALUES (
    'enhanced_role_assignment_completed', 'info', auth.uid(),
    jsonb_build_object(
      'target_user_id', target_user_id,
      'role_change', jsonb_build_object('from', target_current_role, 'to', new_role),
      'expiration_date', expiration_date,
      'granted_by', auth.uid(),
      'justification', justification,
      'admin_count_after', (
        SELECT COUNT(*) FROM public.user_roles 
        WHERE role = 'admin' AND is_active = true
      )
    ),
    'enhanced_role_management'
  );
    
  RETURN TRUE;
END;
$function$;

-- 3. Enhanced security monitoring function
CREATE OR REPLACE FUNCTION public.monitor_critical_security_events()
RETURNS TABLE(
  event_type text,
  severity text,
  event_count integer,
  last_occurrence timestamp with time zone,
  risk_assessment text,
  recommended_action text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  RETURN QUERY
  WITH critical_events AS (
    -- Monitor role-related security events
    SELECT 
      'role_security_violations' as event_type,
      'critical' as severity,
      COUNT(*)::integer as event_count,
      MAX(created_at) as last_occurrence,
      CASE 
        WHEN COUNT(*) >= 5 THEN 'CRITICAL - Potential privilege escalation attack'
        WHEN COUNT(*) >= 3 THEN 'HIGH - Suspicious role assignment activity'
        ELSE 'MEDIUM - Monitor closely'
      END as risk_assessment,
      CASE 
        WHEN COUNT(*) >= 5 THEN 'IMMEDIATE: Lock affected accounts and initiate security response'
        WHEN COUNT(*) >= 3 THEN 'URGENT: Review all recent role changes and verify legitimacy'
        ELSE 'Monitor and investigate if pattern continues'
      END as recommended_action
    FROM public.security_events
    WHERE event_type ILIKE '%role%' 
      AND severity IN ('high', 'critical')
      AND created_at > now() - interval '24 hours'
    HAVING COUNT(*) > 0
    
    UNION ALL
    
    -- Monitor authentication anomalies
    SELECT 
      'authentication_anomalies' as event_type,
      'high' as severity,
      COUNT(*)::integer as event_count,
      MAX(created_at) as last_occurrence,
      CASE 
        WHEN COUNT(*) >= 10 THEN 'CRITICAL - Potential account takeover attempts'
        WHEN COUNT(*) >= 5 THEN 'HIGH - Suspicious authentication activity'
        ELSE 'MEDIUM - Normal security monitoring'
      END as risk_assessment,
      CASE 
        WHEN COUNT(*) >= 10 THEN 'IMMEDIATE: Review affected sessions and implement additional verification'
        WHEN COUNT(*) >= 5 THEN 'URGENT: Investigate authentication patterns'
        ELSE 'Continue monitoring authentication events'
      END as recommended_action
    FROM public.security_events
    WHERE event_type ILIKE '%session%' OR event_type ILIKE '%auth%'
      AND severity IN ('medium', 'high', 'critical')
      AND created_at > now() - interval '6 hours'
    HAVING COUNT(*) > 0
  )
  SELECT * FROM critical_events WHERE event_count > 0;
END;
$function$;

-- 4. Automated security cleanup and maintenance
CREATE OR REPLACE FUNCTION public.automated_security_maintenance()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  cleanup_results jsonb := '{}';
  expired_roles_count integer;
  old_events_count integer;
  stale_sessions_count integer;
BEGIN
  -- Clean up expired roles
  UPDATE public.user_roles
  SET is_active = false, updated_at = now()
  WHERE expires_at < now() AND is_active = true;
  
  GET DIAGNOSTICS expired_roles_count = ROW_COUNT;
  
  -- Clean up old security events (keep critical events longer)
  DELETE FROM public.security_events
  WHERE created_at < now() - interval '90 days'
    AND severity NOT IN ('critical', 'high');
  
  GET DIAGNOSTICS old_events_count = ROW_COUNT;
  
  -- Clean up stale sessions
  UPDATE public.user_sessions
  SET is_active = false, last_activity = now()
  WHERE last_activity < now() - interval '30 days'
    AND is_active = true;
  
  GET DIAGNOSTICS stale_sessions_count = ROW_COUNT;
  
  -- Build results
  cleanup_results := jsonb_build_object(
    'expired_roles_cleaned', expired_roles_count,
    'old_events_cleaned', old_events_count,
    'stale_sessions_cleaned', stale_sessions_count,
    'maintenance_completed_at', now()
  );
  
  -- Log maintenance activity
  INSERT INTO public.security_events (
    event_type, severity, event_data, source
  ) VALUES (
    'automated_security_maintenance_completed', 'info',
    cleanup_results,
    'automated_maintenance'
  );
  
  RETURN cleanup_results;
END;
$function$;