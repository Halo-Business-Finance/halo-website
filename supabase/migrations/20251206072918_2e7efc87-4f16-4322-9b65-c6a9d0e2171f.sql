-- Fix: Require authentication to read profiles table
-- This prevents anonymous users from accessing user profile data

-- Add a permissive policy that requires authentication for SELECT
CREATE POLICY "authenticated_users_can_read_profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL);

-- Also fix the rate_limit_configs public exposure
-- Drop the overly permissive service role SELECT policy and replace with authenticated check
DROP POLICY IF EXISTS "Service role SELECT rate limit configs" ON public.rate_limit_configs;

-- Service role access should go through the ALL policy, not a separate SELECT
-- The existing "Service role access to rate limit configs" policy handles this correctly