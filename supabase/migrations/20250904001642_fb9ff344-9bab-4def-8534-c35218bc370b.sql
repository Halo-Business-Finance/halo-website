-- Comprehensive security fix for public data exposure
-- Block anonymous access to all sensitive data tables

-- Disable RLS temporarily to modify policies
ALTER TABLE public.consultations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Edge functions can insert consultations securely" ON public.consultations;
DROP POLICY IF EXISTS "Enhanced consultation data protection" ON public.consultations;
DROP POLICY IF EXISTS "Users can view own consultations securely" ON public.consultations;

DROP POLICY IF EXISTS "Secure admin application access" ON public.applications;
DROP POLICY IF EXISTS "Secure user application access" ON public.applications;

DROP POLICY IF EXISTS "Admins can view all messages" ON public.application_messages;
DROP POLICY IF EXISTS "Users can view their application messages" ON public.application_messages;

DROP POLICY IF EXISTS "Admins can view all documents" ON public.application_documents;
DROP POLICY IF EXISTS "Users can view their own documents" ON public.application_documents;

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- Re-enable RLS with secure policies
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- CONSULTATIONS: Secure access to encrypted customer data
CREATE POLICY "Secure consultation access" ON public.consultations
FOR ALL USING (
  -- Only authenticated users can access their own consultations
  (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  OR
  -- Only authenticated admins can access all consultations
  (auth.uid() IS NOT NULL AND has_role(auth.uid(), 'admin'::app_role))
)
WITH CHECK (
  -- Only authenticated users can insert their own consultations
  (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  OR
  -- Service role can insert for edge functions (with proper user_id)
  (auth.role() = 'service_role' AND user_id IS NOT NULL)
);

-- APPLICATIONS: Secure access to business financial data
CREATE POLICY "Secure application access" ON public.applications
FOR ALL USING (
  -- Only authenticated users can access their own applications
  (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  OR
  -- Only authenticated admins can access all applications
  (auth.uid() IS NOT NULL AND has_role(auth.uid(), 'admin'::app_role))
)
WITH CHECK (
  -- Only authenticated users can modify their own applications
  (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  OR
  -- Admins can modify any application
  (auth.uid() IS NOT NULL AND has_role(auth.uid(), 'admin'::app_role))
);

-- APPLICATION MESSAGES: Secure access to internal communications
CREATE POLICY "Secure message access" ON public.application_messages
FOR ALL USING (
  -- Only authenticated users can access messages for their applications
  (auth.uid() IS NOT NULL AND (
    auth.uid() = sender_id 
    OR auth.uid() = recipient_id 
    OR EXISTS(
      SELECT 1 FROM public.applications a 
      WHERE a.id = application_id AND a.user_id = auth.uid()
    )
  ))
  OR
  -- Only authenticated admins can access all messages
  (auth.uid() IS NOT NULL AND has_role(auth.uid(), 'admin'::app_role))
)
WITH CHECK (
  -- Only authenticated users can send messages for their applications
  (auth.uid() IS NOT NULL AND auth.uid() = sender_id AND EXISTS(
    SELECT 1 FROM public.applications a 
    WHERE a.id = application_id AND a.user_id = auth.uid()
  ))
  OR
  -- Admins can send any message
  (auth.uid() IS NOT NULL AND has_role(auth.uid(), 'admin'::app_role))
);

-- APPLICATION DOCUMENTS: Secure access to document metadata
CREATE POLICY "Secure document access" ON public.application_documents
FOR ALL USING (
  -- Only authenticated users can access their own documents
  (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  OR
  -- Only authenticated admins can access all documents
  (auth.uid() IS NOT NULL AND has_role(auth.uid(), 'admin'::app_role))
)
WITH CHECK (
  -- Only authenticated users can upload their own documents
  (auth.uid() IS NOT NULL AND auth.uid() = user_id)
);

-- PROFILES: Secure access to user profile data
CREATE POLICY "Secure profile access" ON public.profiles
FOR SELECT USING (
  -- Authenticated users can view their own profile
  (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  OR
  -- Authenticated admins can view all profiles
  (auth.uid() IS NOT NULL AND has_role(auth.uid(), 'admin'::app_role))
);

CREATE POLICY "Secure profile modification" ON public.profiles
FOR ALL USING (
  -- Only authenticated users can modify their own profile
  (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  OR
  -- Admins can modify any profile
  (auth.uid() IS NOT NULL AND has_role(auth.uid(), 'admin'::app_role))
)
WITH CHECK (
  -- Only authenticated users can create/modify their own profile
  (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  OR
  -- Admins can create/modify any profile
  (auth.uid() IS NOT NULL AND has_role(auth.uid(), 'admin'::app_role))
);

-- Log the security enhancement
INSERT INTO public.security_events (
  event_type,
  severity,
  event_data,
  source
) VALUES (
  'comprehensive_security_policies_implemented',
  'critical',
  jsonb_build_object(
    'tables_secured', ARRAY['consultations', 'applications', 'application_messages', 'application_documents', 'profiles'],
    'anonymous_access_blocked', true,
    'authentication_required', true,
    'admin_oversight_enabled', true
  ),
  'security_migration'
);