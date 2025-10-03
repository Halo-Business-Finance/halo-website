-- Harden function search_path per linter recommendations
CREATE OR REPLACE FUNCTION public.gen_random_bytes(n integer)
RETURNS bytea
LANGUAGE sql
SET search_path = extensions, public
AS $$
  SELECT extensions.gen_random_bytes(n);
$$;

CREATE OR REPLACE FUNCTION public.gen_random_uuid()
RETURNS uuid
LANGUAGE sql
SET search_path = extensions, public
AS $$
  SELECT extensions.gen_random_uuid();
$$;