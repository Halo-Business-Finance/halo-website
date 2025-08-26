-- Create the app_role enum type
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Ensure user_roles table has the correct structure
ALTER TABLE public.user_roles 
ALTER COLUMN role TYPE app_role USING role::app_role;