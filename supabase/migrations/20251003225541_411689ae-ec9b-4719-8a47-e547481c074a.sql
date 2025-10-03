-- Enable pgcrypto and add public wrappers to fix missing function errors during inserts
-- Ensure the extensions schema exists (Supabase typically has it, but this is safe)
CREATE SCHEMA IF NOT EXISTS extensions;

-- Install pgcrypto in the extensions schema (idempotent)
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- Provide public wrappers so unqualified calls succeed even with restricted search_path
CREATE OR REPLACE FUNCTION public.gen_random_bytes(n integer)
RETURNS bytea
LANGUAGE sql
AS $$
  SELECT extensions.gen_random_bytes(n);
$$;

CREATE OR REPLACE FUNCTION public.gen_random_uuid()
RETURNS uuid
LANGUAGE sql
AS $$
  SELECT extensions.gen_random_uuid();
$$;