-- Add user_id column to consultations table to track ownership
-- This enables proper access control and prevents unauthorized data access

ALTER TABLE public.consultations 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Make user_id not null for future records (existing records will have null)
-- We'll handle the existing records separately if needed

-- Update the INSERT policy to automatically set user_id
DROP POLICY IF EXISTS "Authenticated users can submit consultations" ON public.consultations;

CREATE POLICY "Users can submit their own consultations" 
ON public.consultations 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Add SELECT policy allowing users to view their own consultations
CREATE POLICY "Users can view their own consultations" 
ON public.consultations 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Update existing consultations to have a default user_id (optional - for data integrity)
-- You may want to remove this if you prefer to keep existing consultations without user association
UPDATE public.consultations 
SET user_id = (SELECT id FROM auth.users LIMIT 1)
WHERE user_id IS NULL 
AND EXISTS (SELECT 1 FROM auth.users);

-- Add index for better performance on user_id queries
CREATE INDEX IF NOT EXISTS idx_consultations_user_id ON public.consultations(user_id);