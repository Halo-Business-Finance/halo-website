-- Create SOC Compliance tables and functions

-- Create compliance control types enum
CREATE TYPE compliance_control_status AS ENUM ('compliant', 'non_compliant', 'in_progress', 'not_applicable');
CREATE TYPE compliance_risk_level AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE compliance_control_category AS ENUM ('Security', 'Availability', 'Processing', 'Confidentiality', 'Privacy');

-- Create SOC controls table
CREATE TABLE public.soc_controls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  control_id TEXT NOT NULL UNIQUE,
  control_name TEXT NOT NULL,
  category compliance_control_category NOT NULL,
  trust_services_criteria TEXT NOT NULL,
  description TEXT,
  status compliance_control_status NOT NULL DEFAULT 'in_progress',
  risk_level compliance_risk_level NOT NULL DEFAULT 'medium',
  last_tested TIMESTAMP WITH TIME ZONE,
  next_test_due TIMESTAMP WITH TIME ZONE,
  evidence_required TEXT[],
  testing_frequency INTEGER DEFAULT 90, -- days
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create SOC audit evidence table
CREATE TABLE public.soc_audit_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  control_id TEXT REFERENCES public.soc_controls(control_id),
  evidence_type TEXT NOT NULL,
  evidence_description TEXT NOT NULL,
  collected_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  review_status TEXT DEFAULT 'pending' CHECK (review_status IN ('pending', 'reviewed', 'approved', 'rejected')),
  reviewer_id UUID,
  file_path TEXT,
  file_name TEXT,
  file_size INTEGER,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create SOC reports table
CREATE TABLE public.soc_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_type TEXT NOT NULL CHECK (report_type IN ('SOC1', 'SOC2', 'SOC3', 'CSOC', 'Bridge')),
  report_title TEXT NOT NULL,
  report_description TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'in_review', 'approved', 'published', 'archived')),
  report_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  report_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  audit_firm TEXT,
  auditor_name TEXT,
  opinion TEXT CHECK (opinion IN ('unqualified', 'qualified', 'adverse', 'disclaimer')),
  total_controls INTEGER DEFAULT 0,
  compliant_controls INTEGER DEFAULT 0,
  deficiencies_count INTEGER DEFAULT 0,
  exceptions_count INTEGER DEFAULT 0,
  material_weaknesses_count INTEGER DEFAULT 0,
  report_file_path TEXT,
  report_file_size INTEGER,
  generated_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  published_date TIMESTAMP WITH TIME ZONE,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create compliance metrics table
CREATE TABLE public.compliance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name TEXT NOT NULL,
  metric_category TEXT NOT NULL,
  metric_value NUMERIC,
  metric_unit TEXT,
  target_value NUMERIC,
  measurement_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  period_start TIMESTAMP WITH TIME ZONE,
  period_end TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.soc_controls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.soc_audit_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.soc_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_metrics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- SOC Controls policies
CREATE POLICY "Admins can manage SOC controls" ON public.soc_controls
  FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Service role can manage SOC controls" ON public.soc_controls
  FOR ALL USING (auth.role() = 'service_role');

-- SOC Audit Evidence policies
CREATE POLICY "Admins can manage audit evidence" ON public.soc_audit_evidence
  FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Service role can manage audit evidence" ON public.soc_audit_evidence
  FOR ALL USING (auth.role() = 'service_role');

-- SOC Reports policies
CREATE POLICY "Admins can manage SOC reports" ON public.soc_reports
  FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Service role can manage SOC reports" ON public.soc_reports
  FOR ALL USING (auth.role() = 'service_role');

-- Compliance Metrics policies
CREATE POLICY "Admins can view compliance metrics" ON public.compliance_metrics
  FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Service role can manage compliance metrics" ON public.compliance_metrics
  FOR ALL USING (auth.role() = 'service_role');

-- Create indexes for performance
CREATE INDEX idx_soc_controls_status ON public.soc_controls(status);
CREATE INDEX idx_soc_controls_category ON public.soc_controls(category);
CREATE INDEX idx_soc_controls_next_test ON public.soc_controls(next_test_due);
CREATE INDEX idx_soc_audit_evidence_control ON public.soc_audit_evidence(control_id);
CREATE INDEX idx_soc_audit_evidence_status ON public.soc_audit_evidence(review_status);
CREATE INDEX idx_soc_reports_type ON public.soc_reports(report_type);
CREATE INDEX idx_soc_reports_status ON public.soc_reports(status);
CREATE INDEX idx_compliance_metrics_name ON public.compliance_metrics(metric_name);
CREATE INDEX idx_compliance_metrics_date ON public.compliance_metrics(measurement_date);

-- Create update triggers
CREATE TRIGGER update_soc_controls_updated_at
  BEFORE UPDATE ON public.soc_controls
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_soc_audit_evidence_updated_at
  BEFORE UPDATE ON public.soc_audit_evidence
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_soc_reports_updated_at
  BEFORE UPDATE ON public.soc_reports
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to calculate compliance score
CREATE OR REPLACE FUNCTION public.calculate_compliance_score()
RETURNS TABLE(
  overall_score NUMERIC,
  total_controls INTEGER,
  compliant_controls INTEGER,
  non_compliant_controls INTEGER,
  in_progress_controls INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ROUND((COUNT(*) FILTER (WHERE status = 'compliant')::NUMERIC / NULLIF(COUNT(*), 0)) * 100, 2) as overall_score,
    COUNT(*)::INTEGER as total_controls,
    COUNT(*) FILTER (WHERE status = 'compliant')::INTEGER as compliant_controls,
    COUNT(*) FILTER (WHERE status = 'non_compliant')::INTEGER as non_compliant_controls,
    COUNT(*) FILTER (WHERE status = 'in_progress')::INTEGER as in_progress_controls
  FROM public.soc_controls
  WHERE is_active = true;
END;
$$;

-- Create function to get controls due for testing
CREATE OR REPLACE FUNCTION public.get_controls_due_for_testing(days_ahead INTEGER DEFAULT 30)
RETURNS TABLE(
  control_id TEXT,
  control_name TEXT,
  category compliance_control_category,
  next_test_due TIMESTAMP WITH TIME ZONE,
  days_until_due INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sc.control_id,
    sc.control_name,
    sc.category,
    sc.next_test_due,
    EXTRACT(days FROM (sc.next_test_due - now()))::INTEGER as days_until_due
  FROM public.soc_controls sc
  WHERE sc.is_active = true
    AND sc.next_test_due IS NOT NULL
    AND sc.next_test_due <= now() + (days_ahead || ' days')::INTERVAL
  ORDER BY sc.next_test_due ASC;
END;
$$;

-- Create function to generate compliance report summary
CREATE OR REPLACE FUNCTION public.generate_compliance_summary(report_period_days INTEGER DEFAULT 90)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  result JSONB;
  period_start TIMESTAMP WITH TIME ZONE;
BEGIN
  period_start := now() - (report_period_days || ' days')::INTERVAL;
  
  SELECT jsonb_build_object(
    'period_start', period_start,
    'period_end', now(),
    'compliance_score', (
      SELECT overall_score 
      FROM public.calculate_compliance_score()
    ),
    'total_controls', (
      SELECT total_controls 
      FROM public.calculate_compliance_score()
    ),
    'controls_by_category', (
      SELECT jsonb_object_agg(
        category,
        jsonb_build_object(
          'total', count(*),
          'compliant', count(*) FILTER (WHERE status = 'compliant'),
          'compliance_percentage', ROUND((count(*) FILTER (WHERE status = 'compliant')::NUMERIC / NULLIF(count(*), 0)) * 100, 2)
        )
      )
      FROM public.soc_controls
      WHERE is_active = true
      GROUP BY category
    ),
    'recent_evidence_collected', (
      SELECT count(*)
      FROM public.soc_audit_evidence
      WHERE collected_date >= period_start
    ),
    'pending_reviews', (
      SELECT count(*)
      FROM public.soc_audit_evidence
      WHERE review_status = 'pending'
    ),
    'active_reports', (
      SELECT count(*)
      FROM public.soc_reports
      WHERE status IN ('in_review', 'approved', 'published')
    )
  ) INTO result;
  
  RETURN result;
END;
$$;

-- Insert initial SOC 2 controls based on Trust Services Criteria
INSERT INTO public.soc_controls (control_id, control_name, category, trust_services_criteria, description, status, risk_level, testing_frequency) VALUES
('CC1.1', 'Control Environment - Integrity and Ethical Values', 'Security', 'CC1.1', 'The entity demonstrates a commitment to integrity and ethical values', 'compliant', 'low', 365),
('CC2.1', 'Communication and Information - Internal Communication', 'Security', 'CC2.1', 'The entity obtains or generates relevant, quality information to support the functioning of internal control', 'compliant', 'low', 180),
('CC3.1', 'Risk Assessment - Risk Identification', 'Security', 'CC3.1', 'The entity specifies objectives with sufficient clarity to enable the identification and assessment of risks', 'in_progress', 'medium', 180),
('CC6.1', 'Logical and Physical Access Controls', 'Security', 'CC6.1', 'The entity implements logical access security software, infrastructure, and architectures over protected information assets', 'compliant', 'medium', 90),
('CC6.2', 'Access Control Management', 'Security', 'CC6.2', 'Prior to issuing system credentials and granting access, the entity registers and authorizes new internal and external users', 'compliant', 'medium', 90),
('CC6.3', 'Network Security', 'Security', 'CC6.3', 'The entity authorizes, designs, develops or acquires, configures, documents, tests, approves, and implements changes to infrastructure', 'compliant', 'high', 90),
('CC7.1', 'System Operations - Data Backup and Recovery', 'Availability', 'CC7.1', 'To meet its objectives, the entity uses detection and monitoring procedures to identify system events', 'compliant', 'high', 90),
('CC7.2', 'Change Management', 'Security', 'CC7.2', 'The entity authorizes, designs, develops or acquires, configures, documents, tests, approves, and implements changes to system components', 'compliant', 'medium', 90),
('CC8.1', 'Data Classification and Handling', 'Confidentiality', 'CC8.1', 'The entity authorizes, designs, develops or acquires, documents, tests, approves, and implements changes to system components', 'compliant', 'high', 90),
('A1.1', 'Availability Monitoring and Alerting', 'Availability', 'A1.1', 'The entity maintains, monitors, and evaluates current processing capacity and use of system components', 'compliant', 'medium', 30),
('A1.2', 'Recovery and Business Continuity', 'Availability', 'A1.2', 'The entity implements measures to protect against security events to meet its objectives', 'compliant', 'high', 180),
('P1.1', 'Privacy Notice and Choice', 'Privacy', 'P1.1', 'The entity provides notice about its privacy practices to inform data subjects about personal information', 'compliant', 'medium', 180),
('P2.1', 'Collection of Personal Information', 'Privacy', 'P2.1', 'Personal information is collected consistent with the entitys objectives related to privacy', 'compliant', 'medium', 180),
('P3.1', 'Use of Personal Information', 'Privacy', 'P3.1', 'Personal information is used for the purposes identified in the entitys privacy practices', 'compliant', 'medium', 180),
('P4.1', 'Retention and Disposal', 'Privacy', 'P4.1', 'Personal information is retained and disposed of in accordance with the entitys objectives related to privacy', 'compliant', 'medium', 365);

-- Update next test due dates based on testing frequency
UPDATE public.soc_controls 
SET 
  last_tested = now() - INTERVAL '30 days',
  next_test_due = CASE 
    WHEN testing_frequency <= 90 THEN now() + INTERVAL '60 days'
    WHEN testing_frequency <= 180 THEN now() + INTERVAL '120 days'
    ELSE now() + INTERVAL '300 days'
  END
WHERE control_id IN ('CC1.1', 'CC2.1', 'CC6.1', 'CC6.2', 'CC6.3', 'CC7.1', 'CC7.2', 'CC8.1', 'A1.1', 'A1.2', 'P1.1', 'P2.1', 'P3.1', 'P4.1');

-- Insert sample audit evidence
INSERT INTO public.soc_audit_evidence (control_id, evidence_type, evidence_description, review_status) VALUES
('CC6.1', 'Policy Document', 'Access Control Policy v2.1 - Comprehensive access control procedures and guidelines', 'approved'),
('CC6.2', 'Process Documentation', 'User Access Management Procedures - Step-by-step user provisioning and deprovisioning process', 'reviewed'),
('CC7.1', 'Testing Results', 'Backup and Recovery Test Results Q4 2024 - Successful recovery time testing documentation', 'pending'),
('A1.1', 'Monitoring Reports', 'System Uptime and Performance Reports November 2024 - 99.9% availability achieved', 'approved');

-- Insert sample compliance metrics
INSERT INTO public.compliance_metrics (metric_name, metric_category, metric_value, metric_unit, target_value, period_start, period_end) VALUES
('System Uptime', 'Availability', 99.95, 'percentage', 99.9, now() - INTERVAL '30 days', now()),
('Security Incident Count', 'Security', 0, 'count', 0, now() - INTERVAL '30 days', now()),
('Backup Success Rate', 'Availability', 100.0, 'percentage', 99.5, now() - INTERVAL '30 days', now()),
('User Access Review Completion', 'Security', 98.5, 'percentage', 95.0, now() - INTERVAL '90 days', now()),
('Privacy Training Completion', 'Privacy', 100.0, 'percentage', 95.0, now() - INTERVAL '365 days', now());