-- Update the existing INSERT policy to require proper authentication
-- This prevents spam submissions and unauthorized data pollution

-- First drop all existing INSERT policies
DROP POLICY IF EXISTS "Anyone can submit consultations" ON public.consultations;
DROP POLICY IF EXISTS "Only authenticated users can submit consultations" ON public.consultations;
DROP POLICY IF EXISTS "Authenticated users can submit consultations" ON public.consultations;

-- Create the properly secured INSERT policy
CREATE POLICY "Authenticated users can submit consultations" 
ON public.consultations 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);