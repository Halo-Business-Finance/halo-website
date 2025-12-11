-- IBM Cloud PostgreSQL Schema for HBF Capital
-- Run this SQL in your IBM Cloud Databases for PostgreSQL instance
-- This mirrors your Supabase structure for migration

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- ENUM TYPES
-- ============================================

CREATE TYPE app_role AS ENUM ('user', 'admin', 'super_admin');
CREATE TYPE compliance_control_category AS ENUM ('security', 'availability', 'processing_integrity', 'confidentiality', 'privacy');
CREATE TYPE compliance_risk_level AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE compliance_control_status AS ENUM ('compliant', 'non_compliant', 'in_progress', 'not_applicable');

-- ============================================
-- CORE TABLES
-- ============================================

-- Profiles table
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE,
    display_name TEXT,
    avatar_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_profiles_user_id ON profiles(user_id);

-- User roles table
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    is_active BOOLEAN NOT NULL DEFAULT true,
    granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    granted_by UUID,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role);

-- User sessions table
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    session_token_hash TEXT,
    token_salt TEXT,
    ip_address INET,
    user_agent TEXT,
    client_fingerprint TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    security_level TEXT DEFAULT 'standard',
    last_activity TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_security_check TIMESTAMPTZ,
    access_count INTEGER DEFAULT 0,
    encrypted_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_active ON user_sessions(is_active) WHERE is_active = true;

-- ============================================
-- ADMIN TABLES
-- ============================================

-- Admin users table
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    password_salt TEXT,
    password_algorithm TEXT DEFAULT 'SCRYPT_2025',
    password_iterations INTEGER DEFAULT 32768,
    password_last_changed TIMESTAMPTZ DEFAULT now(),
    role TEXT NOT NULL DEFAULT 'admin',
    is_active BOOLEAN NOT NULL DEFAULT true,
    mfa_enabled BOOLEAN DEFAULT false,
    mfa_secret_encrypted TEXT,
    security_clearance_level TEXT DEFAULT 'STANDARD',
    failed_login_attempts INTEGER DEFAULT 0,
    account_locked_until TIMESTAMPTZ,
    last_login_at TIMESTAMPTZ,
    credential_audit_trail JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_admin_users_email ON admin_users(email);

-- Admin sessions table
CREATE TABLE admin_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
    session_token_hash TEXT,
    token_salt TEXT DEFAULT encode(gen_random_bytes(16), 'hex'),
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_admin_sessions_admin_user_id ON admin_sessions(admin_user_id);

-- Admin audit log table
CREATE TABLE admin_audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_user_id UUID NOT NULL REFERENCES admin_users(id),
    action TEXT NOT NULL,
    table_name TEXT,
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_admin_audit_log_admin_user_id ON admin_audit_log(admin_user_id);
CREATE INDEX idx_admin_audit_log_created_at ON admin_audit_log(created_at);

-- Admin password changes table
CREATE TABLE admin_password_changes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_user_id UUID NOT NULL REFERENCES admin_users(id),
    old_password_hash_verification TEXT NOT NULL,
    new_password_hash TEXT NOT NULL,
    new_password_salt TEXT NOT NULL,
    change_reason TEXT DEFAULT 'user_requested',
    change_authorized_by UUID,
    requires_mfa BOOLEAN DEFAULT true,
    mfa_verified BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'pending',
    ip_address INET DEFAULT inet_client_addr(),
    applied_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- ENCRYPTION & SECURITY TABLES
-- ============================================

-- Encryption keys table
CREATE TABLE encryption_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key_identifier TEXT NOT NULL UNIQUE,
    key_hash TEXT NOT NULL,
    encrypted_key_data TEXT,
    key_encryption_salt TEXT DEFAULT encode(gen_random_bytes(32), 'hex'),
    algorithm TEXT NOT NULL DEFAULT 'AES-256-GCM',
    is_active BOOLEAN NOT NULL DEFAULT true,
    access_log_enabled BOOLEAN DEFAULT true,
    last_used_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    rotation_scheduled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_encryption_keys_identifier ON encryption_keys(key_identifier);
CREATE INDEX idx_encryption_keys_active ON encryption_keys(is_active) WHERE is_active = true;

-- Security events table
CREATE TABLE security_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    event_type TEXT NOT NULL,
    severity TEXT NOT NULL DEFAULT 'info',
    event_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    ip_address INET,
    user_agent TEXT,
    session_id TEXT,
    source TEXT DEFAULT 'client',
    risk_score INTEGER DEFAULT 0,
    resolved_at TIMESTAMPTZ,
    resolved_by UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_security_events_user_id ON security_events(user_id);
CREATE INDEX idx_security_events_severity ON security_events(severity);
CREATE INDEX idx_security_events_created_at ON security_events(created_at);

-- Security alerts table
CREATE TABLE security_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES security_events(id),
    alert_type TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'medium',
    status TEXT NOT NULL DEFAULT 'open',
    assigned_to UUID,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_security_alerts_status ON security_alerts(status);

-- Security logs table
CREATE TABLE security_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_user_id UUID REFERENCES admin_users(id),
    event_type TEXT NOT NULL,
    severity TEXT NOT NULL DEFAULT 'info',
    message TEXT NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address INET,
    user_agent TEXT,
    resolved BOOLEAN NOT NULL DEFAULT false,
    resolved_at TIMESTAMPTZ,
    resolved_by UUID REFERENCES admin_users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_security_logs_created_at ON security_logs(created_at);

-- Security configs table
CREATE TABLE security_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    config_key TEXT NOT NULL UNIQUE,
    config_value JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Security access audit table
CREATE TABLE security_access_audit (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    table_name TEXT NOT NULL,
    action TEXT NOT NULL,
    record_id UUID,
    ip_address INET,
    risk_assessment TEXT DEFAULT 'normal',
    access_time TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_security_access_audit_user_id ON security_access_audit(user_id);

-- Rate limit configs table
CREATE TABLE rate_limit_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    endpoint TEXT NOT NULL UNIQUE,
    max_requests INTEGER NOT NULL DEFAULT 100,
    window_seconds INTEGER NOT NULL DEFAULT 3600,
    block_duration_seconds INTEGER NOT NULL DEFAULT 3600,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- APPLICATION & LOAN TABLES
-- ============================================

-- Applications table
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    application_number TEXT NOT NULL UNIQUE DEFAULT (
        'APP-' || EXTRACT(YEAR FROM now())::text || '-' ||
        LPAD(EXTRACT(DOY FROM now())::text, 3, '0') || '-' ||
        LPAD(EXTRACT(HOUR FROM now())::text, 2, '0') ||
        LPAD(EXTRACT(MINUTE FROM now())::text, 2, '0')
    ),
    application_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft',
    business_name TEXT,
    business_type TEXT,
    business_ein TEXT,
    business_phone TEXT,
    business_address JSONB,
    loan_amount NUMERIC,
    years_in_business INTEGER,
    annual_revenue NUMERIC,
    application_data JSONB DEFAULT '{}'::jsonb,
    encrypted_financial_data JSONB,
    financial_encryption_key_id UUID REFERENCES encryption_keys(id),
    financial_data_hash TEXT,
    financial_audit_trail JSONB DEFAULT '[]'::jsonb,
    tamper_detection_hash TEXT,
    compliance_classification TEXT DEFAULT 'BUSINESS_CONFIDENTIAL',
    encryption_compliance_version TEXT DEFAULT '2.0',
    notes TEXT,
    priority_level TEXT DEFAULT 'normal',
    assigned_officer_id UUID,
    submitted_at TIMESTAMPTZ,
    last_updated_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_type ON applications(application_type);

-- Application documents table
CREATE TABLE application_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    document_type TEXT NOT NULL,
    document_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    mime_type TEXT,
    is_required BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'pending_review',
    upload_date TIMESTAMPTZ DEFAULT now(),
    reviewed_by UUID,
    reviewed_at TIMESTAMPTZ,
    review_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_application_documents_application_id ON application_documents(application_id);

-- Application messages table
CREATE TABLE application_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL,
    recipient_id UUID,
    subject TEXT,
    message TEXT NOT NULL,
    message_type TEXT DEFAULT 'note',
    is_internal BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_application_messages_application_id ON application_messages(application_id);

-- Application status history table
CREATE TABLE application_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    previous_status TEXT,
    new_status TEXT NOT NULL,
    changed_by UUID,
    change_reason TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_application_status_history_application_id ON application_status_history(application_id);

-- ============================================
-- CONSULTATION & LEAD TABLES
-- ============================================

-- Consultations table
CREATE TABLE consultations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    encrypted_name TEXT NOT NULL,
    encrypted_email TEXT NOT NULL,
    encrypted_phone TEXT NOT NULL,
    company TEXT,
    loan_program TEXT NOT NULL,
    loan_amount TEXT NOT NULL,
    timeframe TEXT NOT NULL,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_consultations_user_id ON consultations(user_id);
CREATE INDEX idx_consultations_status ON consultations(status);

-- Consultation analytics table
CREATE TABLE consultation_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    consultation_id UUID REFERENCES consultations(id),
    created_date DATE NOT NULL,
    created_hour INTEGER NOT NULL,
    loan_program TEXT NOT NULL,
    loan_size_category TEXT NOT NULL,
    timeframe_category TEXT NOT NULL,
    status TEXT NOT NULL,
    region_code TEXT,
    industry_category TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_consultation_analytics_date ON consultation_analytics(created_date);

-- Lead submissions table
CREATE TABLE lead_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    form_type TEXT NOT NULL,
    submitted_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    encrypted_submitted_data JSONB,
    data_encryption_key_id UUID REFERENCES encryption_keys(id),
    encryption_version TEXT DEFAULT '2.0',
    data_classification TEXT DEFAULT 'PII_SENSITIVE',
    retention_policy TEXT DEFAULT 'FINANCIAL_7_YEARS',
    last_encryption_audit TIMESTAMPTZ DEFAULT now(),
    status TEXT NOT NULL DEFAULT 'new',
    priority TEXT NOT NULL DEFAULT 'medium',
    assigned_to UUID REFERENCES admin_users(id),
    notes TEXT,
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_lead_submissions_status ON lead_submissions(status);
CREATE INDEX idx_lead_submissions_created_at ON lead_submissions(created_at);

-- ============================================
-- CMS & SEO TABLES
-- ============================================

-- CMS content table
CREATE TABLE cms_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_slug TEXT NOT NULL,
    section_name TEXT NOT NULL,
    content_key TEXT NOT NULL,
    content_type TEXT NOT NULL DEFAULT 'text',
    content_value JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_published BOOLEAN NOT NULL DEFAULT true,
    is_sensitive BOOLEAN DEFAULT false,
    updated_by UUID REFERENCES admin_users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(page_slug, section_name, content_key)
);

CREATE INDEX idx_cms_content_page_slug ON cms_content(page_slug);

-- SEO settings table
CREATE TABLE seo_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_slug TEXT NOT NULL UNIQUE,
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
    updated_by UUID REFERENCES admin_users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_seo_settings_page_slug ON seo_settings(page_slug);

-- ============================================
-- AUDIT & COMPLIANCE TABLES
-- ============================================

-- Audit logs table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    resource TEXT NOT NULL,
    action TEXT NOT NULL,
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Compliance metrics table
CREATE TABLE compliance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_name TEXT NOT NULL,
    metric_category TEXT NOT NULL,
    metric_value NUMERIC,
    metric_unit TEXT,
    target_value NUMERIC,
    period_start TIMESTAMPTZ,
    period_end TIMESTAMPTZ,
    measurement_date TIMESTAMPTZ DEFAULT now(),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_compliance_metrics_category ON compliance_metrics(metric_category);

-- SOC controls table
CREATE TABLE soc_controls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    control_id TEXT NOT NULL UNIQUE,
    control_name TEXT NOT NULL,
    description TEXT,
    category compliance_control_category NOT NULL,
    trust_services_criteria TEXT NOT NULL,
    status compliance_control_status NOT NULL DEFAULT 'in_progress',
    risk_level compliance_risk_level NOT NULL DEFAULT 'medium',
    evidence_required TEXT[],
    testing_frequency INTEGER,
    last_tested TIMESTAMPTZ,
    next_test_due TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- SOC audit evidence table
CREATE TABLE soc_audit_evidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    control_id TEXT REFERENCES soc_controls(control_id),
    evidence_type TEXT NOT NULL,
    evidence_description TEXT NOT NULL,
    file_name TEXT,
    file_path TEXT,
    file_size INTEGER,
    collected_date TIMESTAMPTZ DEFAULT now(),
    review_status TEXT DEFAULT 'pending',
    reviewer_id UUID,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- SOC reports table
CREATE TABLE soc_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_type TEXT NOT NULL,
    report_title TEXT NOT NULL,
    report_description TEXT,
    report_period_start DATE NOT NULL,
    report_period_end DATE NOT NULL,
    status TEXT DEFAULT 'draft',
    audit_firm TEXT,
    auditor_name TEXT,
    opinion TEXT,
    total_controls INTEGER,
    compliant_controls INTEGER,
    exceptions_count INTEGER,
    deficiencies_count INTEGER,
    material_weaknesses_count INTEGER,
    report_file_path TEXT,
    report_file_size INTEGER,
    generated_date TIMESTAMPTZ,
    published_date TIMESTAMPTZ,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- TRIGGERS FOR updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at column
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_roles_updated_at BEFORE UPDATE ON user_roles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_security_alerts_updated_at BEFORE UPDATE ON security_alerts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_security_configs_updated_at BEFORE UPDATE ON security_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rate_limit_configs_updated_at BEFORE UPDATE ON rate_limit_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_consultations_updated_at BEFORE UPDATE ON consultations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_consultation_analytics_updated_at BEFORE UPDATE ON consultation_analytics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lead_submissions_updated_at BEFORE UPDATE ON lead_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cms_content_updated_at BEFORE UPDATE ON cms_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_seo_settings_updated_at BEFORE UPDATE ON seo_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_soc_controls_updated_at BEFORE UPDATE ON soc_controls FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_soc_audit_evidence_updated_at BEFORE UPDATE ON soc_audit_evidence FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_soc_reports_updated_at BEFORE UPDATE ON soc_reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to check user role
CREATE OR REPLACE FUNCTION has_role(check_user_id UUID, check_role app_role)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_id = check_user_id 
        AND role = check_role 
        AND is_active = true
        AND (expires_at IS NULL OR expires_at > now())
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log security events
CREATE OR REPLACE FUNCTION log_security_event(
    p_user_id UUID,
    p_event_type TEXT,
    p_severity TEXT,
    p_event_data JSONB,
    p_ip_address INET DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    event_id UUID;
BEGIN
    INSERT INTO security_events (user_id, event_type, severity, event_data, ip_address)
    VALUES (p_user_id, p_event_type, p_severity, p_event_data, p_ip_address)
    RETURNING id INTO event_id;
    
    RETURN event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- GRANT PERMISSIONS (adjust as needed)
-- ============================================

-- Create application user role if not exists
-- DO $$
-- BEGIN
--     IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'hbf_app') THEN
--         CREATE ROLE hbf_app WITH LOGIN PASSWORD 'your_secure_password';
--     END IF;
-- END
-- $$;

-- GRANT USAGE ON SCHEMA public TO hbf_app;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO hbf_app;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO hbf_app;
