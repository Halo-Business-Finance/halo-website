-- Fix system policy bypass vulnerability for application_status_history
-- Replace the overly permissive policy with proper authentication checks

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "System can create status history" ON public.application_status_history;

-- Create a more secure policy that only allows service role or authenticated system operations
CREATE POLICY "Secure system status history creation" 
ON public.application_status_history 
FOR INSERT 
WITH CHECK (
  -- Allow service role (for automated systems)
  auth.role() = 'service_role' 
  OR 
  -- Allow authenticated users who have admin role for manual status changes
  (auth.uid() IS NOT NULL AND has_role(auth.uid(), 'admin'::app_role))
  OR
  -- Allow authenticated users to create history for their own applications
  (auth.uid() IS NOT NULL AND EXISTS(
    SELECT 1 FROM public.applications 
    WHERE applications.id = application_status_history.application_id 
    AND applications.user_id = auth.uid()
  ))
);

-- Add a policy for automated system triggers that need to create status history
CREATE POLICY "Database triggers can create status history" 
ON public.application_status_history 
FOR INSERT 
WITH CHECK (
  -- Allow database triggers and functions to create status history
  current_setting('role', true) = 'postgres'
  OR current_setting('app.trigger_context', true) = 'status_change'
);

-- Create a function to safely create status history entries from triggers
CREATE OR REPLACE FUNCTION public.create_status_history_entry(
  p_application_id uuid,
  p_previous_status text,
  p_new_status text,
  p_changed_by uuid DEFAULT NULL,
  p_notes text DEFAULT NULL,
  p_change_reason text DEFAULT NULL
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  history_id uuid;
BEGIN
  -- Set trigger context for security policy
  PERFORM set_config('app.trigger_context', 'status_change', true);
  
  INSERT INTO public.application_status_history (
    application_id,
    previous_status,
    new_status,
    changed_by,
    notes,
    change_reason
  ) VALUES (
    p_application_id,
    p_previous_status,
    p_new_status,
    p_changed_by,
    p_notes,
    p_change_reason
  ) RETURNING id INTO history_id;
  
  -- Reset trigger context
  PERFORM set_config('app.trigger_context', NULL, true);
  
  -- Log the status change for security monitoring
  INSERT INTO public.security_events (
    event_type,
    severity,
    user_id,
    event_data,
    source
  ) VALUES (
    'application_status_changed',
    'info',
    p_changed_by,
    jsonb_build_object(
      'application_id', p_application_id,
      'previous_status', p_previous_status,
      'new_status', p_new_status,
      'change_reason', p_change_reason
    ),
    'status_history_function'
  );
  
  RETURN history_id;
END;
$$;

-- Create a trigger function to automatically create status history
CREATE OR REPLACE FUNCTION public.log_application_status_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only log if status actually changed
  IF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    PERFORM public.create_status_history_entry(
      NEW.id,
      OLD.status,
      NEW.status,
      auth.uid(),
      'Automated status change',
      'Application update'
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for automatic status history logging
DROP TRIGGER IF EXISTS trigger_log_application_status_changes ON public.applications;
CREATE TRIGGER trigger_log_application_status_changes
  AFTER UPDATE ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION public.log_application_status_changes();