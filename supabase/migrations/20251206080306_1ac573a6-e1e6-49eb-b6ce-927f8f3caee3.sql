-- Add public SELECT policy for published CMS content
-- This allows the website to display published content while keeping unpublished content protected

CREATE POLICY "Public can view published CMS content"
ON public.cms_content
FOR SELECT
USING (is_published = true);