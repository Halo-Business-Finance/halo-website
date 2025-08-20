-- Create the app_role enum type that's missing
CREATE TYPE app_role AS ENUM ('user', 'moderator', 'admin');

-- Verify the user_roles table references this enum correctly
-- (This should already exist but let's make sure the column is properly typed)
DO $$ 
BEGIN
  -- Check if user_roles table exists and update column type if needed
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_roles') THEN
    -- The table exists, make sure the role column uses the correct enum
    ALTER TABLE public.user_roles ALTER COLUMN role TYPE app_role USING role::text::app_role;
  END IF;
END $$;