-- Fix the hash_admin_session_token function to not require session_token column
-- Since the edge function already hashes the token, we just need to make this trigger a no-op
CREATE OR REPLACE FUNCTION hash_admin_session_token()
RETURNS TRIGGER AS $$
BEGIN
  -- The edge function already provides session_token_hash
  -- This trigger is now a pass-through to avoid breaking existing code
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;