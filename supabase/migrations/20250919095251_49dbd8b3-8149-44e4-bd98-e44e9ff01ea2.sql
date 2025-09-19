-- Create admin users table
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sessions table for admin authentication
CREATE TABLE public.admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL REFERENCES public.admin_users(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create content management table
CREATE TABLE public.cms_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug TEXT NOT NULL,
  section_name TEXT NOT NULL,
  content_key TEXT NOT NULL,
  content_value JSONB NOT NULL DEFAULT '{}',
  content_type TEXT NOT NULL DEFAULT 'text', -- text, html, image, json
  is_published BOOLEAN NOT NULL DEFAULT true,
  updated_by UUID REFERENCES public.admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(page_slug, section_name, content_key)
);

-- Create lead submissions table
CREATE TABLE public.lead_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_type TEXT NOT NULL, -- consultation, contact, broker, lender
  submitted_data JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'new', -- new, contacted, qualified, closed
  priority TEXT NOT NULL DEFAULT 'medium', -- low, medium, high, urgent
  assigned_to UUID REFERENCES public.admin_users(id),
  notes TEXT,
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create SEO management table
CREATE TABLE public.seo_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug TEXT UNIQUE NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT[],
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  canonical_url TEXT,
  robots_meta TEXT DEFAULT 'index,follow',
  schema_markup JSONB,
  is_active BOOLEAN NOT NULL DEFAULT true,
  updated_by UUID REFERENCES public.admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create security monitoring table
CREATE TABLE public.security_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'info', -- info, warning, error, critical
  message TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  admin_user_id UUID REFERENCES public.admin_users(id),
  resolved BOOLEAN NOT NULL DEFAULT false,
  resolved_by UUID REFERENCES public.admin_users(id),
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create audit trail table
CREATE TABLE public.admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL REFERENCES public.admin_users(id),
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin access only
CREATE POLICY "Admin users can manage their own data" ON public.admin_users
  FOR ALL USING (id = current_setting('app.current_admin_id')::uuid);

CREATE POLICY "Admin sessions access" ON public.admin_sessions
  FOR ALL USING (admin_user_id = current_setting('app.current_admin_id')::uuid);

CREATE POLICY "Admins can manage all CMS content" ON public.cms_content
  FOR ALL USING (current_setting('app.current_admin_id')::uuid IS NOT NULL);

CREATE POLICY "Admins can manage all lead submissions" ON public.lead_submissions
  FOR ALL USING (current_setting('app.current_admin_id')::uuid IS NOT NULL);

CREATE POLICY "Admins can manage SEO settings" ON public.seo_settings
  FOR ALL USING (current_setting('app.current_admin_id')::uuid IS NOT NULL);

CREATE POLICY "Admins can view security logs" ON public.security_logs
  FOR ALL USING (current_setting('app.current_admin_id')::uuid IS NOT NULL);

CREATE POLICY "Admins can view audit logs" ON public.admin_audit_log
  FOR ALL USING (current_setting('app.current_admin_id')::uuid IS NOT NULL);

-- Create indexes for performance
CREATE INDEX idx_admin_sessions_token ON public.admin_sessions(session_token);
CREATE INDEX idx_admin_sessions_expires ON public.admin_sessions(expires_at);
CREATE INDEX idx_cms_content_page ON public.cms_content(page_slug, section_name);
CREATE INDEX idx_lead_submissions_created ON public.lead_submissions(created_at DESC);
CREATE INDEX idx_lead_submissions_status ON public.lead_submissions(status);
CREATE INDEX idx_seo_settings_page ON public.seo_settings(page_slug);
CREATE INDEX idx_security_logs_created ON public.security_logs(created_at DESC);
CREATE INDEX idx_security_logs_severity ON public.security_logs(severity);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON public.admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cms_content_updated_at BEFORE UPDATE ON public.cms_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lead_submissions_updated_at BEFORE UPDATE ON public.lead_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_seo_settings_updated_at BEFORE UPDATE ON public.seo_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to verify admin authentication
CREATE OR REPLACE FUNCTION verify_admin_session(token TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_id UUID;
BEGIN
  SELECT admin_user_id INTO admin_id
  FROM public.admin_sessions
  WHERE session_token = token
    AND expires_at > now();
  
  IF admin_id IS NOT NULL THEN
    -- Update last activity
    UPDATE public.admin_sessions
    SET updated_at = now()
    WHERE session_token = token;
    
    -- Set session variable
    PERFORM set_config('app.current_admin_id', admin_id::text, true);
    
    RETURN admin_id;
  END IF;
  
  RETURN NULL;
END;
$$;

-- Insert default admin user (password will be hashed in the application)
INSERT INTO public.admin_users (email, password_hash, full_name, role) 
VALUES ('admin@halobusinessfinance.com', '$2b$10$placeholder', 'System Administrator', 'super_admin');

-- Insert some default CMS content
INSERT INTO public.cms_content (page_slug, section_name, content_key, content_value, content_type) VALUES
('home', 'hero', 'title', '{"text": "Secure Business Financing Solutions"}', 'text'),
('home', 'hero', 'subtitle', '{"text": "Empowering businesses with comprehensive SBA, commercial, and working capital loans"}', 'text'),
('home', 'features', 'title', '{"text": "Why Choose Halo Business Finance"}', 'text'),
('contact', 'header', 'title', '{"text": "Contact Our Expert Team"}', 'text'),
('contact', 'header', 'description', '{"text": "Get personalized assistance for your business financing needs"}', 'text');

-- Insert default SEO settings
INSERT INTO public.seo_settings (page_slug, meta_title, meta_description, meta_keywords) VALUES
('home', 'Halo Business Finance - SBA & Commercial Loans', 'Leading provider of SBA loans, commercial financing, and business capital solutions. Get pre-qualified today.', ARRAY['SBA loans', 'commercial loans', 'business financing', 'working capital']),
('contact', 'Contact Us - Halo Business Finance', 'Contact our expert team for personalized business financing solutions and loan consultation.', ARRAY['contact', 'business loans', 'loan consultation', 'financing help']),
('about', 'About Halo Business Finance - Expert Business Lenders', 'Learn about our mission to provide accessible business financing solutions across all industries.', ARRAY['about us', 'business lender', 'company information', 'SBA preferred lender']);