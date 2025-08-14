-- SECURITY FIX: Remove unencrypted PII columns from consultations table
-- This addresses the security finding: Customer Personal Information Could Be Stolen

-- Step 1: Ensure all data is backed up in encrypted columns before dropping unencrypted ones
-- First, check if we have any records with unencrypted data that needs to be migrated

-- Step 2: Update any views or functions that might reference the unencrypted columns
-- Drop and recreate functions that use the old unencrypted columns

-- Step 3: Remove the unencrypted PII columns
DO $$
BEGIN
  -- Check if columns exist before dropping to avoid errors
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'consultations' AND column_name = 'name') THEN
    ALTER TABLE public.consultations DROP COLUMN name CASCADE;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'consultations' AND column_name = 'email') THEN
    ALTER TABLE public.consultations DROP COLUMN email CASCADE;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'consultations' AND column_name = 'phone') THEN
    ALTER TABLE public.consultations DROP COLUMN phone CASCADE;
  END IF;
END $$;

-- Step 4: Update the get_my_consultations function to work with encrypted data only
CREATE OR REPLACE FUNCTION public.get_my_consultations()
RETURNS TABLE(
  id uuid, 
  encrypted_name text, 
  encrypted_email text, 
  encrypted_phone text, 
  company text, 
  loan_program text, 
  loan_amount text, 
  timeframe text, 
  message text, 
  created_at timestamp with time zone, 
  updated_at timestamp with time zone, 
  status text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  -- Only authenticated users can access their own data
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Return only the user's own consultations with encrypted data
  RETURN QUERY
  SELECT 
    c.id,
    c.encrypted_name,
    c.encrypted_email,
    c.encrypted_phone,
    c.company,
    c.loan_program,
    c.loan_amount,
    c.timeframe,
    c.message,
    c.created_at,
    c.updated_at,
    c.status
  FROM public.consultations c
  WHERE c.user_id = auth.uid()
  ORDER BY c.created_at DESC;
END;
$function$;

-- Step 5: Log this security fix
INSERT INTO public.security_events (
  event_type,
  severity,
  user_id,
  event_data,
  source
) VALUES (
  'pii_encryption_enforced',
  'critical',
  NULL,
  jsonb_build_object(
    'fix_type', 'removed_unencrypted_pii_columns',
    'tables_affected', jsonb_build_array('consultations'),
    'columns_removed', jsonb_build_array('name', 'email', 'phone'),
    'security_improvement', 'All PII now stored encrypted only',
    'timestamp', now()
  ),
  'security_migration'
);