-- Block anonymous access to admin_password_changes table (contains password hashes, salts)
CREATE POLICY "Block anonymous password changes access"
ON public.admin_password_changes
AS RESTRICTIVE
FOR SELECT
USING (auth.uid() IS NOT NULL OR auth.role() = 'service_role');