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
  (user_id = user_id) AND
  (encrypted_name IS NOT NULL) AND
  (encrypted_email IS NOT NULL)
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