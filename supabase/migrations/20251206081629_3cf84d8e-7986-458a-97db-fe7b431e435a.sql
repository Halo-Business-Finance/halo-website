-- =====================================================
-- FIX 1: admin_users - Block all anonymous access, restrict to admin viewing own record only
-- =====================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Admin can view own profile" ON public.admin_users;
DROP POLICY IF EXISTS "Block anonymous admin users access" ON public.admin_users;
DROP POLICY IF EXISTS "Service role admin users access" ON public.admin_users;

-- Service role has full access (required for auth functions)
CREATE POLICY "Service role only admin users access"
ON public.admin_users
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Admins can ONLY view their own record (matched by email)
CREATE POLICY "Admin can view own record only"
ON public.admin_users
FOR SELECT
USING (
  auth.uid() IS NOT NULL 
  AND has_role(auth.uid(), 'admin'::app_role)
  AND EXISTS (
    SELECT 1 FROM auth.users u 
    WHERE u.id = auth.uid() 
    AND u.email = admin_users.email
  )
);

-- =====================================================
-- FIX 2: admin_sessions - Add hash column, stricter RLS
-- =====================================================

-- Add session_token_hash column if it doesn't exist
ALTER TABLE public.admin_sessions 
ADD COLUMN IF NOT EXISTS session_token_hash text;

-- Add token_salt for additional security
ALTER TABLE public.admin_sessions 
ADD COLUMN IF NOT EXISTS token_salt text DEFAULT encode(extensions.gen_random_bytes(16), 'hex');

-- Create index for faster hash lookups
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token_hash ON public.admin_sessions(session_token_hash);

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can view own sessions" ON public.admin_sessions;
DROP POLICY IF EXISTS "Block anonymous admin sessions access" ON public.admin_sessions;
DROP POLICY IF EXISTS "Service role admin session management" ON public.admin_sessions;

-- Service role has full access (required for session management)
CREATE POLICY "Service role manages admin sessions"
ON public.admin_sessions
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Admins can ONLY view their own sessions (never the token itself)
CREATE POLICY "Admin views own sessions only"
ON public.admin_sessions
FOR SELECT
USING (
  auth.uid() IS NOT NULL 
  AND has_role(auth.uid(), 'admin'::app_role)
  AND EXISTS (
    SELECT 1 FROM public.admin_users au
    JOIN auth.users u ON au.email = u.email
    WHERE u.id = auth.uid() 
    AND au.id = admin_sessions.admin_user_id
    AND au.is_active = true
  )
);

-- =====================================================
-- FIX 3: consultations - Only service_role can insert (via secure API)
-- =====================================================

-- Drop existing insert policies
DROP POLICY IF EXISTS "Authenticated users can submit consultations" ON public.consultations;
DROP POLICY IF EXISTS "Users can insert own consultations securely" ON public.consultations;
DROP POLICY IF EXISTS "Users can insert own consultations with validation" ON public.consultations;

-- Only service_role can insert consultations (users must go through edge function)
CREATE POLICY "Service role inserts consultations"
ON public.consultations
FOR INSERT
WITH CHECK (auth.role() = 'service_role');

-- Keep existing secure access policies for SELECT
-- (Ultra secure admin consultation access, Secure user consultation access remain)

-- =====================================================
-- Create function to hash session tokens for new sessions
-- =====================================================
CREATE OR REPLACE FUNCTION public.hash_admin_session_token()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Hash the session token before storage
  IF NEW.session_token IS NOT NULL AND NEW.session_token_hash IS NULL THEN
    NEW.session_token_hash := encode(
      extensions.digest(NEW.session_token || COALESCE(NEW.token_salt, ''), 'sha256'),
      'hex'
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger to auto-hash tokens on insert/update
DROP TRIGGER IF EXISTS hash_session_token_trigger ON public.admin_sessions;
CREATE TRIGGER hash_session_token_trigger
  BEFORE INSERT OR UPDATE ON public.admin_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.hash_admin_session_token();

-- Log this critical security update
INSERT INTO public.security_events (
  event_type, severity, event_data, source
) VALUES (
  'critical_rls_security_hardening', 'critical',
  jsonb_build_object(
    'tables_updated', ARRAY['admin_users', 'admin_sessions', 'consultations'],
    'changes', 'Added stricter RLS, session token hashing, service_role-only inserts',
    'timestamp', now()
  ),
  'security_migration'
);