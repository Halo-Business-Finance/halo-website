-- First drop the trigger, then the function
DROP TRIGGER IF EXISTS hash_session_token_trigger ON admin_sessions;
DROP FUNCTION IF EXISTS hash_admin_session_token();

-- Recreate clean function
CREATE FUNCTION hash_admin_session_token()
RETURNS TRIGGER AS $$
BEGIN
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
CREATE TRIGGER hash_session_token_trigger
  BEFORE INSERT OR UPDATE ON public.admin_sessions
  FOR EACH ROW
  EXECUTE FUNCTION hash_admin_session_token();