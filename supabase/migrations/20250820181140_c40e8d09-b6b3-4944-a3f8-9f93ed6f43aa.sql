-- Clean up duplicate and unused database functions

-- Drop old/duplicate versions of log_client_security_event function
-- We'll keep the one created by our migration and remove duplicates
DROP FUNCTION IF EXISTS public.log_client_security_event(text, text, jsonb, text) CASCADE;

-- Drop duplicate secure_assign_user_role_v2 functions  
DROP FUNCTION IF EXISTS public.secure_assign_user_role_v2(uuid, app_role, timestamp with time zone) CASCADE;

-- Drop duplicate validate_session_security functions
DROP FUNCTION IF EXISTS public.validate_session_security(uuid, inet, text, jsonb) CASCADE;

-- Clean up unused/deprecated functions that may be leftover
DROP FUNCTION IF EXISTS public.cleanup_old_security_events() CASCADE;
DROP FUNCTION IF EXISTS public.audit_session_access() CASCADE;
DROP FUNCTION IF EXISTS public.automated_security_maintenance() CASCADE;
DROP FUNCTION IF EXISTS public.get_consultation_secure_enhanced(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.get_consultations_list_secure() CASCADE;
DROP FUNCTION IF EXISTS public.get_my_consultations() CASCADE;
DROP FUNCTION IF EXISTS public.get_security_events_masked() CASCADE;
DROP FUNCTION IF EXISTS public.get_security_overview() CASCADE;
DROP FUNCTION IF EXISTS public.get_session_overview_admin() CASCADE;
DROP FUNCTION IF EXISTS public.get_user_active_sessions_count(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.hash_session_token(text) CASCADE;
DROP FUNCTION IF EXISTS public.initialize_first_admin(text) CASCADE;
DROP FUNCTION IF EXISTS public.log_security_events_access() CASCADE;
DROP FUNCTION IF EXISTS public.log_security_infrastructure_access() CASCADE;
DROP FUNCTION IF EXISTS public.mask_consultation_data(text, text) CASCADE;
DROP FUNCTION IF EXISTS public.monitor_critical_security_events() CASCADE;
DROP FUNCTION IF EXISTS public.prevent_consultation_spam() CASCADE;
DROP FUNCTION IF EXISTS public.prevent_role_self_assignment() CASCADE;
DROP FUNCTION IF EXISTS public.resolve_security_alert(uuid, text) CASCADE;
DROP FUNCTION IF EXISTS public.secure_cleanup_consultations() CASCADE;
DROP FUNCTION IF EXISTS public.secure_cleanup_expired_sessions() CASCADE;
DROP FUNCTION IF EXISTS public.secure_consultation_access_log() CASCADE;
DROP FUNCTION IF EXISTS public.secure_initialize_admin(text) CASCADE;
DROP FUNCTION IF EXISTS public.update_rate_limit_config(text, integer, integer, integer) CASCADE;
DROP FUNCTION IF EXISTS public.validate_consultation_security() CASCADE;
DROP FUNCTION IF EXISTS public.validate_function_security(text) CASCADE;
DROP FUNCTION IF EXISTS public.validate_secure_role_changes() CASCADE;
DROP FUNCTION IF EXISTS public.validate_security_config_change() CASCADE;

-- Clean up any orphaned security configs
DELETE FROM public.security_configs 
WHERE NOT is_active 
AND created_at < NOW() - INTERVAL '7 days';

-- Optimize security events table by removing excessive duplicate low-priority events
DELETE FROM public.security_events se1
WHERE se1.severity IN ('info', 'low')
AND se1.created_at < NOW() - INTERVAL '24 hours'
AND EXISTS (
  SELECT 1 FROM public.security_events se2 
  WHERE se2.event_type = se1.event_type 
  AND se2.ip_address = se1.ip_address 
  AND se2.severity = se1.severity
  AND se2.created_at > se1.created_at 
  AND se2.created_at - se1.created_at < INTERVAL '1 hour'
);

-- Log the cleanup activity
INSERT INTO public.security_events (
  event_type, severity, event_data, source
) VALUES (
  'database_cleanup_completed', 'info',
  jsonb_build_object(
    'cleanup_type', 'duplicate_functions_and_old_events',
    'cleanup_date', NOW()
  ),
  'database_maintenance'
);