-- Ensure pgcrypto is available for gen_random_* functions
CREATE SCHEMA IF NOT EXISTS extensions;
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- Recreate wrappers defensively to bind to the extensions schema and stable search_path
CREATE OR REPLACE FUNCTION public.gen_random_bytes(n integer)
RETURNS bytea
LANGUAGE sql
SET search_path TO 'extensions', 'public'
AS $$
  SELECT extensions.gen_random_bytes(n);
$$;

CREATE OR REPLACE FUNCTION public.gen_random_uuid()
RETURNS uuid
LANGUAGE sql
SET search_path TO 'extensions', 'public'
AS $$
  SELECT extensions.gen_random_uuid();
$$;