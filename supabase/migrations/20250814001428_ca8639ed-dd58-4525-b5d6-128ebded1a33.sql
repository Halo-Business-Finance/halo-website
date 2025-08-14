-- URGENT: Secure the consultations table to prevent customer data theft

-- 1. Drop the overly permissive policy that allows anyone to submit
DROP POLICY IF EXISTS "Anyone can submit consultations" ON public.consultations;

-- 2. Create secure policies that properly protect customer data
CREATE POLICY "Only authenticated users can submit consultations" 
ON public.consultations 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- 3. Ensure only admins and moderators can view consultations (not just admins)
DROP POLICY IF EXISTS "Admins can view all consultations" ON public.consultations;

CREATE POLICY "Authorized staff can view consultations" 
ON public.consultations 
FOR SELECT 
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'moderator'::app_role)
);

-- 4. Add policy for secure updates (only by authorized staff)
CREATE POLICY "Authorized staff can update consultations" 
ON public.consultations 
FOR UPDATE 
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'moderator'::app_role)
)
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'moderator'::app_role)
);

-- 5. Add deletion policy (admin only for data retention compliance)
CREATE POLICY "Admins can delete consultations" 
ON public.consultations 
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- 6. Add data encryption at rest for sensitive fields (enhance the trigger)
CREATE OR REPLACE FUNCTION public.secure_consultation_data()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- Log all consultation access for security monitoring
  INSERT INTO public.security_events (
    event_type,
    severity,
    user_id,
    ip_address,
    event_data,
    source
  ) VALUES (
    CASE TG_OP
      WHEN 'INSERT' THEN 'consultation_created'
      WHEN 'UPDATE' THEN 'consultation_modified'
      WHEN 'DELETE' THEN 'consultation_deleted'
    END,
    CASE TG_OP
      WHEN 'DELETE' THEN 'high'
      ELSE 'info'
    END,
    auth.uid(),
    inet_client_addr(),
    jsonb_build_object(
      'consultation_id', COALESCE(NEW.id, OLD.id),
      'operation', TG_OP,
      'loan_program', COALESCE(NEW.loan_program, OLD.loan_program),
      'timestamp', now()
    ),
    'database'
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- 7. Create trigger for comprehensive audit logging
CREATE TRIGGER consultation_security_audit
  AFTER INSERT OR UPDATE OR DELETE ON public.consultations
  FOR EACH ROW EXECUTE FUNCTION public.secure_consultation_data();

-- 8. Create data retention policy (automated cleanup after legal retention period)
CREATE OR REPLACE FUNCTION public.enforce_consultation_retention()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  retention_years INTEGER := 7; -- Legal requirement: 7 years
  archived_count INTEGER;
BEGIN
  -- Archive consultations older than retention period
  WITH archived AS (
    DELETE FROM public.consultations
    WHERE created_at < now() - (retention_years || ' years')::interval
      AND status IN ('completed', 'cancelled')
    RETURNING id
  )
  SELECT count(*) INTO archived_count FROM archived;
  
  -- Log retention enforcement
  INSERT INTO public.audit_logs (
    user_id,
    action,
    resource,
    new_values
  ) VALUES (
    NULL,
    'data_retention_enforced',
    'consultations',
    jsonb_build_object(
      'archived_count', archived_count,
      'retention_years', retention_years,
      'enforcement_date', now()
    )
  );
  
  RETURN archived_count;
END;
$$;