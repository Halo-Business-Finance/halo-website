-- Add explicit DENY policies for security_configs table to prevent non-admin access
-- This ensures that only admin users can access sensitive system configuration data

-- Drop the existing broad policy and replace with more specific ones
DROP POLICY IF EXISTS "Admins can manage security configs" ON public.security_configs;

-- Explicit DENY policies for non-admin users
CREATE POLICY "Deny non-admin SELECT on security configs"
  ON public.security_configs
  FOR SELECT
  TO authenticated
  USING (false)
  WITH CHECK (get_current_user_role() = 'admin');

CREATE POLICY "Deny non-admin INSERT on security configs"
  ON public.security_configs
  FOR INSERT
  TO authenticated
  WITH CHECK (get_current_user_role() = 'admin');

CREATE POLICY "Deny non-admin UPDATE on security configs"
  ON public.security_configs
  FOR UPDATE
  TO authenticated
  USING (get_current_user_role() = 'admin')
  WITH CHECK (get_current_user_role() = 'admin');

CREATE POLICY "Deny non-admin DELETE on security configs"
  ON public.security_configs
  FOR DELETE
  TO authenticated
  USING (get_current_user_role() = 'admin');

-- Admin-only policies
CREATE POLICY "Admins can SELECT security configs"
  ON public.security_configs
  FOR SELECT
  TO authenticated
  USING (get_current_user_role() = 'admin');

CREATE POLICY "Admins can INSERT security configs"
  ON public.security_configs
  FOR INSERT
  TO authenticated
  WITH CHECK (get_current_user_role() = 'admin');

CREATE POLICY "Admins can UPDATE security configs"
  ON public.security_configs
  FOR UPDATE
  TO authenticated
  USING (get_current_user_role() = 'admin')
  WITH CHECK (get_current_user_role() = 'admin');

CREATE POLICY "Admins can DELETE security configs"
  ON public.security_configs
  FOR DELETE
  TO authenticated
  USING (get_current_user_role() = 'admin');

-- Also add similar protections for rate_limit_configs table
DROP POLICY IF EXISTS "Admins can manage rate limit configs" ON public.rate_limit_configs;

-- Explicit DENY policies for non-admin users on rate_limit_configs
CREATE POLICY "Deny non-admin SELECT on rate limit configs"
  ON public.rate_limit_configs
  FOR SELECT
  TO authenticated
  USING (false)
  WITH CHECK (get_current_user_role() = 'admin');

CREATE POLICY "Deny non-admin INSERT on rate limit configs"
  ON public.rate_limit_configs
  FOR INSERT
  TO authenticated
  WITH CHECK (get_current_user_role() = 'admin');

CREATE POLICY "Deny non-admin UPDATE on rate limit configs"
  ON public.rate_limit_configs
  FOR UPDATE
  TO authenticated
  USING (get_current_user_role() = 'admin')
  WITH CHECK (get_current_user_role() = 'admin');

CREATE POLICY "Deny non-admin DELETE on rate limit configs"
  ON public.rate_limit_configs
  FOR DELETE
  TO authenticated
  USING (get_current_user_role() = 'admin');

-- Admin-only policies for rate_limit_configs
CREATE POLICY "Admins can SELECT rate limit configs"
  ON public.rate_limit_configs
  FOR SELECT
  TO authenticated
  USING (get_current_user_role() = 'admin');

CREATE POLICY "Admins can INSERT rate limit configs"
  ON public.rate_limit_configs
  FOR INSERT
  TO authenticated
  WITH CHECK (get_current_user_role() = 'admin');

CREATE POLICY "Admins can UPDATE rate limit configs"
  ON public.rate_limit_configs
  FOR UPDATE
  TO authenticated
  USING (get_current_user_role() = 'admin')
  WITH CHECK (get_current_user_role() = 'admin');

CREATE POLICY "Admins can DELETE rate limit configs"
  ON public.rate_limit_configs
  FOR DELETE
  TO authenticated
  USING (get_current_user_role() = 'admin');