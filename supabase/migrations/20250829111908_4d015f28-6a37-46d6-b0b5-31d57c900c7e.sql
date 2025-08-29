-- Create portal-specific tables for comprehensive application management

-- Applications table for tracking all loan applications
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  application_type TEXT NOT NULL,
  application_number TEXT UNIQUE NOT NULL DEFAULT ('APP-' || EXTRACT(YEAR FROM now()) || '-' || LPAD(EXTRACT(DOY FROM now())::text, 3, '0') || '-' || LPAD(EXTRACT(HOUR FROM now())::text, 2, '0') || LPAD(EXTRACT(MINUTE FROM now())::text, 2, '0')),
  status TEXT NOT NULL DEFAULT 'draft',
  loan_amount DECIMAL(15,2),
  business_name TEXT,
  business_ein TEXT,
  business_type TEXT,
  business_address JSONB,
  business_phone TEXT,
  years_in_business INTEGER,
  annual_revenue DECIMAL(15,2),
  application_data JSONB DEFAULT '{}',
  submitted_at TIMESTAMP WITH TIME ZONE,
  last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  assigned_officer_id UUID,
  priority_level TEXT DEFAULT 'normal',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Documents table for file uploads and management
CREATE TABLE IF NOT EXISTS public.application_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  document_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT DEFAULT 'pending_review',
  reviewed_by UUID,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  review_notes TEXT,
  is_required BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Application status history for tracking progress
CREATE TABLE IF NOT EXISTS public.application_status_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  previous_status TEXT,
  new_status TEXT NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  change_reason TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Messages/communications table
CREATE TABLE IF NOT EXISTS public.application_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES auth.users(id),
  message_type TEXT DEFAULT 'note',
  subject TEXT,
  message TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for applications
CREATE POLICY "Users can view their own applications" 
ON public.applications FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own applications" 
ON public.applications FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications" 
ON public.applications FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all applications" 
ON public.applications FOR SELECT 
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all applications" 
ON public.applications FOR UPDATE 
USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for documents
CREATE POLICY "Users can view their own documents" 
ON public.application_documents FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can upload their own documents" 
ON public.application_documents FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all documents" 
ON public.application_documents FOR SELECT 
USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for status history
CREATE POLICY "Users can view their application status history" 
ON public.application_status_history FOR SELECT 
USING (EXISTS(SELECT 1 FROM public.applications WHERE id = application_id AND user_id = auth.uid()));

CREATE POLICY "System can create status history" 
ON public.application_status_history FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all status history" 
ON public.application_status_history FOR SELECT 
USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for messages
CREATE POLICY "Users can view their application messages" 
ON public.application_messages FOR SELECT 
USING (
  auth.uid() = sender_id OR 
  auth.uid() = recipient_id OR 
  EXISTS(SELECT 1 FROM public.applications WHERE id = application_id AND user_id = auth.uid())
);

CREATE POLICY "Users can send messages for their applications" 
ON public.application_messages FOR INSERT 
WITH CHECK (
  auth.uid() = sender_id AND 
  EXISTS(SELECT 1 FROM public.applications WHERE id = application_id AND user_id = auth.uid())
);

CREATE POLICY "Admins can view all messages" 
ON public.application_messages FOR SELECT 
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can send all messages" 
ON public.application_messages FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to automatically track status changes
CREATE OR REPLACE FUNCTION public.track_application_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.application_status_history (
      application_id,
      previous_status,
      new_status,
      changed_by,
      change_reason
    ) VALUES (
      NEW.id,
      OLD.status,
      NEW.status,
      auth.uid(),
      'Status updated via application'
    );
  END IF;
  
  NEW.last_updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER application_status_change_trigger
  BEFORE UPDATE ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION public.track_application_status_change();