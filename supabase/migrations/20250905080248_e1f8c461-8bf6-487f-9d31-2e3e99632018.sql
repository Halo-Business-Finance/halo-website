-- Fix the remaining function with mutable search path
ALTER FUNCTION public.populate_consultation_analytics() SET search_path = '';

-- Log this final security fix
INSERT INTO public.security_events (
  event_type, severity, event_data, source
) VALUES (
  'final_function_search_path_vulnerability_fixed', 'medium',
  jsonb_build_object(
    'function_fixed', 'populate_consultation_analytics',
    'vulnerability_type', 'function_search_path_mutable',
    'security_status', 'all_functions_now_secure'
  ),
  'security_hardening_completion'
);