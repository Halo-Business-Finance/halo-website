-- Block public/anonymous access to profiles table
-- Only authenticated users should be able to read profiles

CREATE POLICY "Block anonymous profile access"
ON public.profiles
AS RESTRICTIVE
FOR SELECT
USING (auth.uid() IS NOT NULL);