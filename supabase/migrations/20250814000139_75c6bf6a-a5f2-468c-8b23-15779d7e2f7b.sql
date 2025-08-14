-- Fix search path security issues for newly created functions
ALTER FUNCTION public.log_consultation_access() SET search_path TO '';
ALTER FUNCTION public.cleanup_old_consultations() SET search_path TO '';

-- Also update existing functions that might have search path issues
ALTER FUNCTION public.update_updated_at_column() SET search_path TO '';
ALTER FUNCTION public.process_security_event() SET search_path TO '';
ALTER FUNCTION public.cleanup_expired_sessions() SET search_path TO '';
ALTER FUNCTION public.cleanup_security_events() SET search_path TO '';
ALTER FUNCTION public.validate_session_security(text, inet, text) SET search_path TO '';
ALTER FUNCTION public.audit_role_changes() SET search_path TO '';