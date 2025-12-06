-- Add restrictive policy to ensure applications are only accessible by owners or admins
-- This provides an additional security layer on top of existing policies

CREATE POLICY "Restrict application access to owner or admin"
ON public.applications
AS RESTRICTIVE
FOR SELECT
USING (
  auth.uid() IS NOT NULL 
  AND (
    auth.uid() = user_id 
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);