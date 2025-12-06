-- Restrict CMS content write operations to admins only
CREATE POLICY "Only admins can insert CMS content"
ON public.cms_content
AS RESTRICTIVE
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update CMS content"
ON public.cms_content
AS RESTRICTIVE
FOR UPDATE
USING (auth.uid() IS NOT NULL AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete CMS content"
ON public.cms_content
AS RESTRICTIVE
FOR DELETE
USING (auth.uid() IS NOT NULL AND has_role(auth.uid(), 'admin'::app_role));

-- Public can only read published content, admins can read all
CREATE POLICY "Public reads published content only"
ON public.cms_content
AS RESTRICTIVE
FOR SELECT
USING (
  is_published = true 
  OR (auth.uid() IS NOT NULL AND has_role(auth.uid(), 'admin'::app_role))
);