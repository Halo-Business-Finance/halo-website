-- Add RLS policy to require authentication for accessing profiles
CREATE POLICY "authenticated_users_can_read_profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() IS NOT NULL);

-- Also add policy for users to update their own profile
CREATE POLICY "users_can_update_own_profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add policy for users to insert their own profile
CREATE POLICY "users_can_insert_own_profile" 
ON public.profiles 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);