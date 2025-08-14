-- Fix the consultations INSERT policy to require authentication
-- This prevents spam submissions and unauthorized data pollution

DROP POLICY IF EXISTS "Only authenticated users can submit consultations" ON public.consultations;

-- Create a properly secured INSERT policy that requires authentication
CREATE POLICY "Authenticated users can submit consultations" 
ON public.consultations 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);