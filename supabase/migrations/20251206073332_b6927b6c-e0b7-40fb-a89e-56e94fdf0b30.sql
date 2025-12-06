-- Fix: Remove overly permissive profile access policy
-- The policy "authenticated_users_can_read_profiles" allows ANY logged-in user to read ALL profiles
-- This should be dropped - the existing "Secure profile access" policy correctly restricts to own profile or admin

DROP POLICY IF EXISTS "authenticated_users_can_read_profiles" ON public.profiles;

-- Also drop the duplicate insert/update policies that are redundant with "Secure profile modification"
DROP POLICY IF EXISTS "users_can_insert_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "users_can_update_own_profile" ON public.profiles;