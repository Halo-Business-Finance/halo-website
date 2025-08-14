-- First check if policies exist and drop them
DO $$
BEGIN
    -- Drop existing policies for security_configs if they exist
    DROP POLICY IF EXISTS "Admins can manage security configs" ON public.security_configs;
    DROP POLICY IF EXISTS "Admins can SELECT security configs" ON public.security_configs;
    DROP POLICY IF EXISTS "Admins can INSERT security configs" ON public.security_configs;
    DROP POLICY IF EXISTS "Admins can UPDATE security configs" ON public.security_configs;
    DROP POLICY IF EXISTS "Admins can DELETE security configs" ON public.security_configs;
    
    -- Drop existing policies for rate_limit_configs if they exist
    DROP POLICY IF EXISTS "Admins can manage rate limit configs" ON public.rate_limit_configs;
    DROP POLICY IF EXISTS "Admins can SELECT rate limit configs" ON public.rate_limit_configs;
    DROP POLICY IF EXISTS "Admins can INSERT rate limit configs" ON public.rate_limit_configs;
    DROP POLICY IF EXISTS "Admins can UPDATE rate limit configs" ON public.rate_limit_configs;
    DROP POLICY IF EXISTS "Admins can DELETE rate limit configs" ON public.rate_limit_configs;
END $$;

-- Create restrictive admin-only policies for security_configs
CREATE POLICY "Admin only SELECT security configs"
  ON public.security_configs
  FOR SELECT
  TO authenticated
  USING (get_current_user_role() = 'admin');

CREATE POLICY "Admin only INSERT security configs"
  ON public.security_configs
  FOR INSERT
  TO authenticated
  WITH CHECK (get_current_user_role() = 'admin');

CREATE POLICY "Admin only UPDATE security configs"
  ON public.security_configs
  FOR UPDATE
  TO authenticated
  USING (get_current_user_role() = 'admin')
  WITH CHECK (get_current_user_role() = 'admin');

CREATE POLICY "Admin only DELETE security configs"
  ON public.security_configs
  FOR DELETE
  TO authenticated
  USING (get_current_user_role() = 'admin');

-- Create restrictive admin-only policies for rate_limit_configs
CREATE POLICY "Admin only SELECT rate limit configs"
  ON public.rate_limit_configs
  FOR SELECT
  TO authenticated
  USING (get_current_user_role() = 'admin');

CREATE POLICY "Admin only INSERT rate limit configs"
  ON public.rate_limit_configs
  FOR INSERT
  TO authenticated
  WITH CHECK (get_current_user_role() = 'admin');

CREATE POLICY "Admin only UPDATE rate limit configs"
  ON public.rate_limit_configs
  FOR UPDATE
  TO authenticated
  USING (get_current_user_role() = 'admin')
  WITH CHECK (get_current_user_role() = 'admin');

CREATE POLICY "Admin only DELETE rate limit configs"
  ON public.rate_limit_configs
  FOR DELETE
  TO authenticated
  USING (get_current_user_role() = 'admin');