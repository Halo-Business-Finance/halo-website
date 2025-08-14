-- Add explicit DENY policies for security_configs table to prevent non-admin access
-- This ensures that only admin users can access sensitive system configuration data

-- Drop the existing broad policy and replace with more specific ones
DROP POLICY IF EXISTS "Admins can manage security configs" ON public.security_configs;

-- Admin-only policies for security_configs
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