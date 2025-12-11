-- Consolidate and secure CMS content access policies
-- Remove redundant public SELECT policies and create a single, audited policy

-- Drop overlapping/redundant SELECT policies
DROP POLICY IF EXISTS "Public can view published CMS content" ON cms_content;
DROP POLICY IF EXISTS "Public reads published content only" ON cms_content;

-- Create a single, controlled public read policy with content type restrictions
-- Only allows reading 'text' type content that is published (no internal notes, drafts, etc.)
CREATE POLICY "Authenticated users and public can view published text content"
ON cms_content
FOR SELECT
USING (
  (is_published = true AND content_type = 'text')
  OR 
  (auth.uid() IS NOT NULL AND has_role(auth.uid(), 'admin'::app_role))
);

-- Add a content classification column if it doesn't exist for future sensitive content marking
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'cms_content' AND column_name = 'is_sensitive'
  ) THEN
    ALTER TABLE cms_content ADD COLUMN is_sensitive boolean DEFAULT false;
  END IF;
END $$;

-- Update policy to exclude sensitive content from public view
DROP POLICY IF EXISTS "Authenticated users and public can view published text content" ON cms_content;

CREATE POLICY "Public can view non-sensitive published content"
ON cms_content
FOR SELECT
USING (
  -- Public access: only published, text-type, non-sensitive content
  (is_published = true AND content_type = 'text' AND COALESCE(is_sensitive, false) = false)
  OR 
  -- Admins can see everything
  (auth.uid() IS NOT NULL AND has_role(auth.uid(), 'admin'::app_role))
);

-- Log the security improvement
INSERT INTO security_events (
  event_type,
  severity,
  event_data,
  source
) VALUES (
  'cms_content_policy_hardened',
  'medium',
  jsonb_build_object(
    'changes', 'Consolidated SELECT policies, added is_sensitive column, restricted public access to non-sensitive text content only',
    'previous_policies_removed', ARRAY['Public can view published CMS content', 'Public reads published content only'],
    'new_policy', 'Public can view non-sensitive published content',
    'applied_at', now()
  ),
  'security_policy_management'
);