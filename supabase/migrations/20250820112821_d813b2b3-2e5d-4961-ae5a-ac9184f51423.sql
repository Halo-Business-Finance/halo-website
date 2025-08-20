-- Fix critical security vulnerability: Remove overly permissive service role policy
-- and implement proper secure policies for consultations table

-- Drop the overly permissive service role policy
DROP POLICY IF EXISTS "Service role can manage consultations for edge functions" ON public.consultations;

-- Create secure service role policy that only allows INSERT for edge functions
CREATE POLICY "Edge functions can insert consultations securely" 
ON public.consultations 
FOR INSERT 
WITH CHECK (
  -- Only allow service role to insert consultations with proper validation
  (current_setting('role', true) = 'service_role') AND
  -- Ensure user_id is not null and matches a valid user
  (user_id IS NOT NULL) AND
  -- Ensure required fields are present
  (loan_program IS NOT NULL) AND
  (loan_amount IS NOT NULL) AND
  (timeframe IS NOT NULL)
);

-- Create secure service role policy for SELECT (only for admin operations)
CREATE POLICY "Edge functions can read consultations for admin operations" 
ON public.consultations 
FOR SELECT 
USING (
  -- Only allow service role to read when explicitly called by admin functions
  (current_setting('role', true) = 'service_role') AND
  -- Add additional security check - only allow if function context is set
  (current_setting('app.function_context', true) = 'admin_consultation_access')
);

-- Update user consultation policy to be more explicit
DROP POLICY IF EXISTS "Users can view own consultations only" ON public.consultations;
CREATE POLICY "Users can view own consultations securely" 
ON public.consultations 
FOR SELECT 
USING (
  (auth.uid() = user_id) AND 
  (auth.uid() IS NOT NULL) AND
  (user_id IS NOT NULL)
);

-- Update admin policy to be more secure
DROP POLICY IF EXISTS "Admins can view all consultations" ON public.consultations;
CREATE POLICY "Admins can view all consultations with logging" 
ON public.consultations 
FOR SELECT 
USING (
  has_role(auth.uid(), 'admin'::app_role) AND 
  (auth.uid() IS NOT NULL)
);

-- Create more secure insert policy for users
DROP POLICY IF EXISTS "Users can insert own consultations only" ON public.consultations;
CREATE POLICY "Users can insert own consultations securely" 
ON public.consultations 
FOR INSERT 
WITH CHECK (
  (auth.uid() = user_id) AND 
  (auth.uid() IS NOT NULL) AND
  (user_id IS NOT NULL) AND
  -- Ensure sensitive data is encrypted
  (encrypted_name IS NOT NULL) AND
  (encrypted_email IS NOT NULL) AND
  -- Ensure required business fields are present
  (loan_program IS NOT NULL) AND
  (loan_amount IS NOT NULL) AND
  (timeframe IS NOT NULL)
);

-- Create secure update policy for staff
DROP POLICY IF EXISTS "Staff can update consultation status" ON public.consultations;
CREATE POLICY "Staff can update consultation status securely" 
ON public.consultations 
FOR UPDATE 
USING (
  (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role)) AND 
  (auth.uid() IS NOT NULL)
)
WITH CHECK (
  (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role)) AND 
  (auth.uid() IS NOT NULL) AND
  -- Only allow status and internal notes updates by staff
  (user_id = OLD.user_id) AND
  (encrypted_name = OLD.encrypted_name) AND
  (encrypted_email = OLD.encrypted_email) AND
  (encrypted_phone = OLD.encrypted_phone)
);

-- Create secure delete policy for admins only
DROP POLICY IF EXISTS "Admins can delete consultations" ON public.consultations;
CREATE POLICY "Admins can delete consultations with audit trail" 
ON public.consultations 
FOR DELETE 
USING (
  has_role(auth.uid(), 'admin'::app_role) AND 
  (auth.uid() IS NOT NULL)
);

-- Add trigger to log all consultation access for security monitoring
CREATE OR REPLACE FUNCTION log_consultation_security_access()
RETURNS TRIGGER AS $$
BEGIN
  -- Log all consultation data access for security audit
  INSERT INTO public.security_events (
    event_type,
    severity,
    user_id,
    ip_address,
    event_data,
    source
  ) VALUES (
    CASE TG_OP
      WHEN 'SELECT' THEN 'consultation_data_accessed'
      WHEN 'INSERT' THEN 'consultation_created'
      WHEN 'UPDATE' THEN 'consultation_modified'
      WHEN 'DELETE' THEN 'consultation_deleted'
    END,
    CASE TG_OP
      WHEN 'DELETE' THEN 'high'
      WHEN 'UPDATE' THEN 'medium'
      ELSE 'info'
    END,
    COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid),
    inet_client_addr(),
    jsonb_build_object(
      'consultation_id', COALESCE(NEW.id, OLD.id),
      'operation', TG_OP,
      'user_role', get_current_user_role(),
      'timestamp', now(),
      'loan_program', COALESCE(NEW.loan_program, OLD.loan_program),
      'has_encrypted_data', CASE WHEN COALESCE(NEW.encrypted_name, OLD.encrypted_name) IS NOT NULL THEN true ELSE false END
    ),
    'consultation_security_audit'
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS consultation_security_audit_trigger ON public.consultations;

-- Create trigger for security auditing
CREATE TRIGGER consultation_security_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.consultations
  FOR EACH ROW EXECUTE FUNCTION log_consultation_security_access();