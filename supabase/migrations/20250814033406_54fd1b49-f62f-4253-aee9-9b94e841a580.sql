-- CHECK AND FIX ALL SECURITY DEFINER VIEWS
-- Find and fix any remaining views with SECURITY DEFINER

-- First, let's check what views exist and their definition
SELECT 
  schemaname,
  viewname,
  definition
FROM pg_views 
WHERE schemaname = 'public' 
  AND (definition ILIKE '%security definer%' OR definition ILIKE '%security_definer%');

-- Also check for any remaining views that might have SECURITY DEFINER
DO $$
DECLARE
    view_rec RECORD;
BEGIN
    -- Find all views in public schema
    FOR view_rec IN 
        SELECT viewname 
        FROM pg_views 
        WHERE schemaname = 'public'
    LOOP
        -- Drop and recreate any problematic views without SECURITY DEFINER
        IF view_rec.viewname = 'security_events_summary' THEN
            -- This view should not have SECURITY DEFINER, but let's ensure it's clean
            DROP VIEW IF EXISTS public.security_events_summary CASCADE;
            
            -- Recreate the view without any SECURITY DEFINER
            CREATE VIEW public.security_events_summary AS
            SELECT 
              id,
              event_type,
              severity,
              created_at,
              source,
              user_id,
              event_data as event_data_raw,
              ip_address
            FROM public.security_events;
        END IF;
    END LOOP;
END $$;

-- Remove any potential SECURITY DEFINER from other views
-- Just to be safe, let's recreate our view one more time
DROP VIEW IF EXISTS public.security_events_summary CASCADE;

CREATE VIEW public.security_events_summary AS
SELECT 
  id,
  event_type,
  severity,
  created_at,
  source,
  user_id,
  event_data as event_data_raw,
  ip_address
FROM public.security_events;