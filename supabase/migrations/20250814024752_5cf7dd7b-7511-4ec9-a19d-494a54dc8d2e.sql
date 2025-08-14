-- SIMPLE SECURITY FIX: Remove unencrypted PII columns only
-- This addresses the security finding: Customer Personal Information Could Be Stolen

-- Remove the unencrypted PII columns from consultations table
ALTER TABLE public.consultations DROP COLUMN IF EXISTS name CASCADE;
ALTER TABLE public.consultations DROP COLUMN IF EXISTS email CASCADE;
ALTER TABLE public.consultations DROP COLUMN IF EXISTS phone CASCADE;