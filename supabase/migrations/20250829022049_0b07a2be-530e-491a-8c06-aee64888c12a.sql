-- Create the app_role enum type if it doesn't exist
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Also create the other missing enum types
DO $$ BEGIN
    CREATE TYPE public.compliance_control_category AS ENUM (
        'security_management',
        'communications',
        'risk_management',
        'monitoring_controls',
        'logical_physical_access',
        'system_operations',
        'change_management',
        'risk_mitigation'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.compliance_control_status AS ENUM (
        'compliant',
        'non_compliant', 
        'in_progress',
        'not_tested'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.compliance_risk_level AS ENUM (
        'low',
        'medium',
        'high',
        'critical'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;