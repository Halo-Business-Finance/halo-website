export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      application_documents: {
        Row: {
          application_id: string
          created_at: string
          document_name: string
          document_type: string
          file_path: string
          file_size: number | null
          id: string
          is_required: boolean | null
          mime_type: string | null
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          upload_date: string | null
          user_id: string
        }
        Insert: {
          application_id: string
          created_at?: string
          document_name: string
          document_type: string
          file_path: string
          file_size?: number | null
          id?: string
          is_required?: boolean | null
          mime_type?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          upload_date?: string | null
          user_id: string
        }
        Update: {
          application_id?: string
          created_at?: string
          document_name?: string
          document_type?: string
          file_path?: string
          file_size?: number | null
          id?: string
          is_required?: boolean | null
          mime_type?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          upload_date?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "application_documents_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      application_messages: {
        Row: {
          application_id: string
          created_at: string
          id: string
          is_internal: boolean | null
          message: string
          message_type: string | null
          read_at: string | null
          recipient_id: string | null
          sender_id: string
          subject: string | null
        }
        Insert: {
          application_id: string
          created_at?: string
          id?: string
          is_internal?: boolean | null
          message: string
          message_type?: string | null
          read_at?: string | null
          recipient_id?: string | null
          sender_id: string
          subject?: string | null
        }
        Update: {
          application_id?: string
          created_at?: string
          id?: string
          is_internal?: boolean | null
          message?: string
          message_type?: string | null
          read_at?: string | null
          recipient_id?: string | null
          sender_id?: string
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "application_messages_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      application_status_history: {
        Row: {
          application_id: string
          change_reason: string | null
          changed_by: string | null
          created_at: string
          id: string
          new_status: string
          notes: string | null
          previous_status: string | null
        }
        Insert: {
          application_id: string
          change_reason?: string | null
          changed_by?: string | null
          created_at?: string
          id?: string
          new_status: string
          notes?: string | null
          previous_status?: string | null
        }
        Update: {
          application_id?: string
          change_reason?: string | null
          changed_by?: string | null
          created_at?: string
          id?: string
          new_status?: string
          notes?: string | null
          previous_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "application_status_history_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          annual_revenue: number | null
          application_data: Json | null
          application_number: string
          application_type: string
          assigned_officer_id: string | null
          business_address: Json | null
          business_ein: string | null
          business_name: string | null
          business_phone: string | null
          business_type: string | null
          created_at: string
          id: string
          last_updated_at: string | null
          loan_amount: number | null
          notes: string | null
          priority_level: string | null
          status: string
          submitted_at: string | null
          updated_at: string
          user_id: string
          years_in_business: number | null
        }
        Insert: {
          annual_revenue?: number | null
          application_data?: Json | null
          application_number?: string
          application_type: string
          assigned_officer_id?: string | null
          business_address?: Json | null
          business_ein?: string | null
          business_name?: string | null
          business_phone?: string | null
          business_type?: string | null
          created_at?: string
          id?: string
          last_updated_at?: string | null
          loan_amount?: number | null
          notes?: string | null
          priority_level?: string | null
          status?: string
          submitted_at?: string | null
          updated_at?: string
          user_id: string
          years_in_business?: number | null
        }
        Update: {
          annual_revenue?: number | null
          application_data?: Json | null
          application_number?: string
          application_type?: string
          assigned_officer_id?: string | null
          business_address?: Json | null
          business_ein?: string | null
          business_name?: string | null
          business_phone?: string | null
          business_type?: string | null
          created_at?: string
          id?: string
          last_updated_at?: string | null
          loan_amount?: number | null
          notes?: string | null
          priority_level?: string | null
          status?: string
          submitted_at?: string | null
          updated_at?: string
          user_id?: string
          years_in_business?: number | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          resource: string
          resource_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          resource: string
          resource_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          resource?: string
          resource_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      compliance_metrics: {
        Row: {
          created_at: string | null
          id: string
          measurement_date: string | null
          metadata: Json | null
          metric_category: string
          metric_name: string
          metric_unit: string | null
          metric_value: number | null
          period_end: string | null
          period_start: string | null
          target_value: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          measurement_date?: string | null
          metadata?: Json | null
          metric_category: string
          metric_name: string
          metric_unit?: string | null
          metric_value?: number | null
          period_end?: string | null
          period_start?: string | null
          target_value?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          measurement_date?: string | null
          metadata?: Json | null
          metric_category?: string
          metric_name?: string
          metric_unit?: string | null
          metric_value?: number | null
          period_end?: string | null
          period_start?: string | null
          target_value?: number | null
        }
        Relationships: []
      }
      consultation_analytics: {
        Row: {
          consultation_id: string | null
          created_at: string | null
          created_date: string
          created_hour: number
          id: string
          industry_category: string | null
          loan_program: string
          loan_size_category: string
          region_code: string | null
          status: string
          timeframe_category: string
          updated_at: string | null
        }
        Insert: {
          consultation_id?: string | null
          created_at?: string | null
          created_date: string
          created_hour: number
          id?: string
          industry_category?: string | null
          loan_program: string
          loan_size_category: string
          region_code?: string | null
          status: string
          timeframe_category: string
          updated_at?: string | null
        }
        Update: {
          consultation_id?: string | null
          created_at?: string | null
          created_date?: string
          created_hour?: number
          id?: string
          industry_category?: string | null
          loan_program?: string
          loan_size_category?: string
          region_code?: string | null
          status?: string
          timeframe_category?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consultation_analytics_consultation_id_fkey"
            columns: ["consultation_id"]
            isOneToOne: false
            referencedRelation: "consultations"
            referencedColumns: ["id"]
          },
        ]
      }
      consultations: {
        Row: {
          company: string | null
          created_at: string
          encrypted_email: string
          encrypted_name: string
          encrypted_phone: string
          id: string
          loan_amount: string
          loan_program: string
          message: string | null
          status: string
          timeframe: string
          updated_at: string
          user_id: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          encrypted_email: string
          encrypted_name: string
          encrypted_phone: string
          id?: string
          loan_amount: string
          loan_program: string
          message?: string | null
          status?: string
          timeframe: string
          updated_at?: string
          user_id: string
        }
        Update: {
          company?: string | null
          created_at?: string
          encrypted_email?: string
          encrypted_name?: string
          encrypted_phone?: string
          id?: string
          loan_amount?: string
          loan_program?: string
          message?: string | null
          status?: string
          timeframe?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      encryption_keys: {
        Row: {
          access_log_enabled: boolean | null
          algorithm: string
          created_at: string
          encrypted_key_data: string | null
          expires_at: string | null
          id: string
          is_active: boolean
          key_encryption_salt: string | null
          key_hash: string
          key_identifier: string
          last_used_at: string | null
          rotation_scheduled_at: string | null
        }
        Insert: {
          access_log_enabled?: boolean | null
          algorithm?: string
          created_at?: string
          encrypted_key_data?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          key_encryption_salt?: string | null
          key_hash: string
          key_identifier: string
          last_used_at?: string | null
          rotation_scheduled_at?: string | null
        }
        Update: {
          access_log_enabled?: boolean | null
          algorithm?: string
          created_at?: string
          encrypted_key_data?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          key_encryption_salt?: string | null
          key_hash?: string
          key_identifier?: string
          last_used_at?: string | null
          rotation_scheduled_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          is_active: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          is_active?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          is_active?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      rate_limit_configs: {
        Row: {
          block_duration_seconds: number
          created_at: string
          endpoint: string
          id: string
          is_active: boolean
          max_requests: number
          updated_at: string
          window_seconds: number
        }
        Insert: {
          block_duration_seconds?: number
          created_at?: string
          endpoint: string
          id?: string
          is_active?: boolean
          max_requests?: number
          updated_at?: string
          window_seconds?: number
        }
        Update: {
          block_duration_seconds?: number
          created_at?: string
          endpoint?: string
          id?: string
          is_active?: boolean
          max_requests?: number
          updated_at?: string
          window_seconds?: number
        }
        Relationships: []
      }
      security_access_audit: {
        Row: {
          access_time: string | null
          action: string
          id: string
          ip_address: unknown | null
          record_id: string | null
          risk_assessment: string | null
          table_name: string
          user_id: string | null
        }
        Insert: {
          access_time?: string | null
          action: string
          id?: string
          ip_address?: unknown | null
          record_id?: string | null
          risk_assessment?: string | null
          table_name: string
          user_id?: string | null
        }
        Update: {
          access_time?: string | null
          action?: string
          id?: string
          ip_address?: unknown | null
          record_id?: string | null
          risk_assessment?: string | null
          table_name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      security_alerts: {
        Row: {
          alert_type: string
          assigned_to: string | null
          created_at: string
          event_id: string | null
          id: string
          notes: string | null
          priority: string
          status: string
          updated_at: string
        }
        Insert: {
          alert_type: string
          assigned_to?: string | null
          created_at?: string
          event_id?: string | null
          id?: string
          notes?: string | null
          priority?: string
          status?: string
          updated_at?: string
        }
        Update: {
          alert_type?: string
          assigned_to?: string | null
          created_at?: string
          event_id?: string | null
          id?: string
          notes?: string | null
          priority?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "security_alerts_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "security_events"
            referencedColumns: ["id"]
          },
        ]
      }
      security_configs: {
        Row: {
          config_key: string
          config_value: Json
          created_at: string
          id: string
          is_active: boolean
          updated_at: string
        }
        Insert: {
          config_key: string
          config_value?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          updated_at?: string
        }
        Update: {
          config_key?: string
          config_value?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      security_events: {
        Row: {
          created_at: string
          event_data: Json
          event_type: string
          id: string
          ip_address: unknown | null
          resolved_at: string | null
          resolved_by: string | null
          risk_score: number | null
          session_id: string | null
          severity: string
          source: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_data?: Json
          event_type: string
          id?: string
          ip_address?: unknown | null
          resolved_at?: string | null
          resolved_by?: string | null
          risk_score?: number | null
          session_id?: string | null
          severity?: string
          source?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_data?: Json
          event_type?: string
          id?: string
          ip_address?: unknown | null
          resolved_at?: string | null
          resolved_by?: string | null
          risk_score?: number | null
          session_id?: string | null
          severity?: string
          source?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      soc_audit_evidence: {
        Row: {
          collected_date: string | null
          control_id: string | null
          created_at: string | null
          evidence_description: string
          evidence_type: string
          file_name: string | null
          file_path: string | null
          file_size: number | null
          id: string
          metadata: Json | null
          review_status: string | null
          reviewer_id: string | null
          updated_at: string | null
        }
        Insert: {
          collected_date?: string | null
          control_id?: string | null
          created_at?: string | null
          evidence_description: string
          evidence_type: string
          file_name?: string | null
          file_path?: string | null
          file_size?: number | null
          id?: string
          metadata?: Json | null
          review_status?: string | null
          reviewer_id?: string | null
          updated_at?: string | null
        }
        Update: {
          collected_date?: string | null
          control_id?: string | null
          created_at?: string | null
          evidence_description?: string
          evidence_type?: string
          file_name?: string | null
          file_path?: string | null
          file_size?: number | null
          id?: string
          metadata?: Json | null
          review_status?: string | null
          reviewer_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "soc_audit_evidence_control_id_fkey"
            columns: ["control_id"]
            isOneToOne: false
            referencedRelation: "soc_controls"
            referencedColumns: ["control_id"]
          },
        ]
      }
      soc_controls: {
        Row: {
          category: Database["public"]["Enums"]["compliance_control_category"]
          control_id: string
          control_name: string
          created_at: string | null
          description: string | null
          evidence_required: string[] | null
          id: string
          is_active: boolean | null
          last_tested: string | null
          next_test_due: string | null
          risk_level: Database["public"]["Enums"]["compliance_risk_level"]
          status: Database["public"]["Enums"]["compliance_control_status"]
          testing_frequency: number | null
          trust_services_criteria: string
          updated_at: string | null
        }
        Insert: {
          category: Database["public"]["Enums"]["compliance_control_category"]
          control_id: string
          control_name: string
          created_at?: string | null
          description?: string | null
          evidence_required?: string[] | null
          id?: string
          is_active?: boolean | null
          last_tested?: string | null
          next_test_due?: string | null
          risk_level?: Database["public"]["Enums"]["compliance_risk_level"]
          status?: Database["public"]["Enums"]["compliance_control_status"]
          testing_frequency?: number | null
          trust_services_criteria: string
          updated_at?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["compliance_control_category"]
          control_id?: string
          control_name?: string
          created_at?: string | null
          description?: string | null
          evidence_required?: string[] | null
          id?: string
          is_active?: boolean | null
          last_tested?: string | null
          next_test_due?: string | null
          risk_level?: Database["public"]["Enums"]["compliance_risk_level"]
          status?: Database["public"]["Enums"]["compliance_control_status"]
          testing_frequency?: number | null
          trust_services_criteria?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      soc_reports: {
        Row: {
          audit_firm: string | null
          auditor_name: string | null
          compliant_controls: number | null
          created_at: string | null
          created_by: string | null
          deficiencies_count: number | null
          exceptions_count: number | null
          generated_date: string | null
          id: string
          material_weaknesses_count: number | null
          opinion: string | null
          published_date: string | null
          report_description: string | null
          report_file_path: string | null
          report_file_size: number | null
          report_period_end: string
          report_period_start: string
          report_title: string
          report_type: string
          status: string | null
          total_controls: number | null
          updated_at: string | null
        }
        Insert: {
          audit_firm?: string | null
          auditor_name?: string | null
          compliant_controls?: number | null
          created_at?: string | null
          created_by?: string | null
          deficiencies_count?: number | null
          exceptions_count?: number | null
          generated_date?: string | null
          id?: string
          material_weaknesses_count?: number | null
          opinion?: string | null
          published_date?: string | null
          report_description?: string | null
          report_file_path?: string | null
          report_file_size?: number | null
          report_period_end: string
          report_period_start: string
          report_title: string
          report_type: string
          status?: string | null
          total_controls?: number | null
          updated_at?: string | null
        }
        Update: {
          audit_firm?: string | null
          auditor_name?: string | null
          compliant_controls?: number | null
          created_at?: string | null
          created_by?: string | null
          deficiencies_count?: number | null
          exceptions_count?: number | null
          generated_date?: string | null
          id?: string
          material_weaknesses_count?: number | null
          opinion?: string | null
          published_date?: string | null
          report_description?: string | null
          report_file_path?: string | null
          report_file_size?: number | null
          report_period_end?: string
          report_period_start?: string
          report_title?: string
          report_type?: string
          status?: string | null
          total_controls?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          expires_at: string | null
          granted_at: string
          granted_by: string | null
          id: string
          is_active: boolean
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          granted_at?: string
          granted_by?: string | null
          id?: string
          is_active?: boolean
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          granted_at?: string
          granted_by?: string | null
          id?: string
          is_active?: boolean
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          access_count: number | null
          client_fingerprint: string | null
          created_at: string
          encrypted_at: string | null
          expires_at: string
          id: string
          ip_address: unknown | null
          is_active: boolean
          last_activity: string
          last_security_check: string | null
          security_level: string | null
          session_token_hash: string | null
          token_salt: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          access_count?: number | null
          client_fingerprint?: string | null
          created_at?: string
          encrypted_at?: string | null
          expires_at: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean
          last_activity?: string
          last_security_check?: string | null
          security_level?: string | null
          session_token_hash?: string | null
          token_salt?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          access_count?: number | null
          client_fingerprint?: string | null
          created_at?: string
          encrypted_at?: string | null
          expires_at?: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean
          last_activity?: string
          last_security_check?: string | null
          security_level?: string | null
          session_token_hash?: string | null
          token_salt?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      advanced_rate_limit_check: {
        Args: {
          p_action: string
          p_behavioral_score?: number
          p_identifier: string
          p_limit?: number
          p_window_seconds?: number
        }
        Returns: Json
      }
      analyze_behavioral_patterns: {
        Args: { p_behavioral_data: Json; p_user_id: string }
        Returns: Json
      }
      analyze_security_events: {
        Args: Record<PropertyKey, never>
        Returns: {
          affected_users: number
          event_count: number
          pattern_type: string
          recommended_action: string
          severity: string
          time_window: string
        }[]
      }
      assign_user_role: {
        Args: {
          expiration_date?: string
          new_role: Database["public"]["Enums"]["app_role"]
          target_user_id: string
        }
        Returns: boolean
      }
      calculate_compliance_score: {
        Args: Record<PropertyKey, never>
        Returns: {
          compliant_controls: number
          in_progress_controls: number
          non_compliant_controls: number
          overall_score: number
          total_controls: number
        }[]
      }
      check_auth_rate_limit: {
        Args: {
          p_action: string
          p_identifier: string
          p_limit?: number
          p_window_minutes?: number
        }
        Returns: Json
      }
      cleanup_expired_sessions: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      cleanup_old_consultations: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      cleanup_security_events: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      create_audit_trail: {
        Args: {
          action_type: string
          additional_context?: Json
          new_data?: Json
          old_data?: Json
          resource_id: string
          resource_type: string
        }
        Returns: string
      }
      create_enhanced_security_session: {
        Args: {
          p_client_fingerprint: string
          p_ip_address: unknown
          p_security_level?: string
          p_user_agent: string
          p_user_id: string
        }
        Returns: {
          requires_mfa: boolean
          risk_score: number
          session_id: string
        }[]
      }
      create_first_admin: {
        Args: { admin_password?: string; target_email: string }
        Returns: Json
      }
      create_initial_admin: {
        Args: { admin_email: string }
        Returns: boolean
      }
      create_secure_encryption_key: {
        Args: { p_algorithm?: string; p_key_identifier: string }
        Returns: string
      }
      create_secure_session: {
        Args: {
          p_client_fingerprint: string
          p_expires_hours?: number
          p_ip_address: unknown
          p_user_agent: string
          p_user_id: string
        }
        Returns: {
          session_id: string
          session_token: string
        }[]
      }
      create_status_history_entry: {
        Args: {
          p_application_id: string
          p_change_reason?: string
          p_changed_by?: string
          p_new_status: string
          p_notes?: string
          p_previous_status: string
        }
        Returns: string
      }
      detect_advanced_session_anomaly: {
        Args: {
          behavioral_data?: Json
          new_fingerprint: string
          new_ip: unknown
          new_user_agent: string
          session_id: string
        }
        Returns: Json
      }
      detect_security_anomalies: {
        Args: Record<PropertyKey, never>
        Returns: {
          anomaly_type: string
          count: number
          recommendation: string
          severity: string
        }[]
      }
      detect_session_anomaly: {
        Args: {
          new_fingerprint: string
          new_ip: unknown
          new_user_agent: string
          session_id: string
        }
        Returns: Json
      }
      detect_unauthorized_access_patterns: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      emergency_cleanup_security_events: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      encrypt_sensitive_data: {
        Args: { data_text: string }
        Returns: string
      }
      enforce_consultation_retention: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      enhanced_rate_limit_check: {
        Args: {
          p_action: string
          p_behavioral_score?: number
          p_identifier: string
          p_limit?: number
          p_window_seconds?: number
        }
        Returns: Json
      }
      enhanced_secure_assign_user_role: {
        Args: {
          expiration_date?: string
          justification?: string
          new_role: Database["public"]["Enums"]["app_role"]
          target_user_id: string
        }
        Returns: boolean
      }
      force_session_rotation: {
        Args: { p_user_id: string }
        Returns: number
      }
      generate_compliance_summary: {
        Args: { report_period_days?: number }
        Returns: Json
      }
      generate_secure_session_token: {
        Args: Record<PropertyKey, never>
        Returns: {
          hash: string
          salt: string
          token: string
        }[]
      }
      get_admin_user_profiles: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          display_name: string
          email: string
          is_active: boolean
          profile_id: string
          role: Database["public"]["Enums"]["app_role"]
          role_granted_at: string
          updated_at: string
          user_id: string
        }[]
      }
      get_consultation_secure: {
        Args: { consultation_id: string }
        Returns: {
          company: string
          created_at: string
          email: string
          id: string
          loan_amount: string
          loan_program: string
          message: string
          name: string
          phone: string
          status: string
          timeframe: string
          updated_at: string
          user_id: string
        }[]
      }
      get_controls_due_for_testing: {
        Args: { days_ahead?: number }
        Returns: {
          category: Database["public"]["Enums"]["compliance_control_category"]
          control_id: string
          control_name: string
          days_until_due: number
          next_test_due: string
        }[]
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_secure_admin_business_application_data: {
        Args: Record<PropertyKey, never>
        Returns: {
          application_number: string
          application_type: string
          business_type: string
          created_at: string
          id: string
          last_updated_at: string
          loan_amount_category: string
          masked_business_ein: string
          masked_business_name: string
          priority_level: string
          revenue_category: string
          status: string
          user_id: string
          years_in_business: number
        }[]
      }
      get_secure_admin_consultation_data: {
        Args: Record<PropertyKey, never>
        Returns: {
          company: string
          created_at: string
          id: string
          loan_amount_category: string
          loan_program: string
          masked_email: string
          masked_name: string
          masked_phone: string
          status: string
          timeframe: string
        }[]
      }
      get_secure_application_data: {
        Args: { application_id?: string; include_sensitive?: boolean }
        Returns: {
          application_number: string
          application_type: string
          business_name: string
          created_at: string
          id: string
          masked_business_data: Json
          status: string
        }[]
      }
      get_secure_consultation_data: {
        Args: { consultation_id: string }
        Returns: {
          company: string
          created_at: string
          id: string
          loan_amount_category: string
          loan_program: string
          masked_email: string
          masked_name: string
          masked_phone: string
          status: string
          timeframe: string
        }[]
      }
      get_secure_consultation_data_enhanced: {
        Args:
          | { consultation_id: string }
          | { consultation_id?: string; user_filter?: string }
        Returns: {
          company: string
          created_at: string
          id: string
          loan_amount_category: string
          loan_program: string
          masked_email: string
          masked_name: string
          masked_phone: string
          status: string
          timeframe: string
        }[]
      }
      get_secure_customer_data: {
        Args: { customer_id: string; data_type?: string }
        Returns: {
          access_level: string
          company: string
          created_at: string
          id: string
          loan_program: string
          masked_email: string
          masked_name: string
          masked_phone: string
          status: string
        }[]
      }
      get_secure_security_configs: {
        Args: { config_filter?: string }
        Returns: {
          config_key: string
          created_at: string
          id: string
          is_active: boolean
          masked_config_value: string
        }[]
      }
      get_security_config: {
        Args: { config_key: string }
        Returns: Json
      }
      get_security_events_masked: {
        Args: { limit_count?: number; severity_filter?: string }
        Returns: {
          created_at: string
          event_data_masked: Json
          event_type: string
          id: string
          ip_address_masked: string
          severity: string
          source: string
        }[]
      }
      get_user_active_sessions_count: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      get_user_role_cached: {
        Args: { p_user_id: string }
        Returns: string
      }
      handle_security_incident: {
        Args: {
          affected_user_id: string
          incident_data: Json
          incident_type: string
          severity: string
        }
        Returns: string
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      hash_session_token: {
        Args: { salt?: string; token: string }
        Returns: Json
      }
      initialize_admin_user: {
        Args: { target_email: string }
        Returns: boolean
      }
      intelligent_security_event_cleanup: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      intelligent_security_event_filter: {
        Args: {
          p_event_type: string
          p_ip_address?: unknown
          p_severity: string
          p_source: string
        }
        Returns: boolean
      }
      invalidate_suspicious_sessions: {
        Args: { reason: string; target_user_id: string }
        Returns: number
      }
      log_client_security_event: {
        Args: {
          event_data?: Json
          event_type: string
          severity: string
          source?: string
          user_agent?: string
        }
        Returns: string
      }
      make_user_admin: {
        Args: { target_email: string } | { target_user_id: string }
        Returns: boolean
      }
      mask_consultation_data: {
        Args: { data_record: Json; user_role: string }
        Returns: Json
      }
      mask_financial_data: {
        Args: { data_value: number; user_role: string }
        Returns: string
      }
      mask_pii_data: {
        Args: { data_text: string; data_type: string; user_role?: string }
        Returns: string
      }
      mask_sensitive_data: {
        Args: { data_text: string; data_type: string }
        Returns: string
      }
      optimize_security_events: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      optimize_security_events_v2: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      schedule_key_rotation: {
        Args: { p_key_identifier: string; p_rotation_date?: string }
        Returns: boolean
      }
      schedule_security_maintenance: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      secure_assign_user_role: {
        Args: {
          expiration_date?: string
          new_role: Database["public"]["Enums"]["app_role"]
          target_user_id: string
        }
        Returns: boolean
      }
      secure_assign_user_role_v2: {
        Args: {
          expiration_date?: string
          justification?: string
          new_role: Database["public"]["Enums"]["app_role"]
          target_user_id: string
        }
        Returns: Json
      }
      secure_initialize_admin: {
        Args: { admin_email: string; confirmation_token?: string }
        Returns: boolean
      }
      secure_revoke_user_role: {
        Args: {
          reason?: string
          role_to_revoke: Database["public"]["Enums"]["app_role"]
          target_user_id: string
        }
        Returns: boolean
      }
      should_log_security_event: {
        Args:
          | {
              event_data?: Json
              event_type: string
              severity: string
              source_ip: unknown
            }
          | { p_event_type: string; p_severity: string; p_source?: string }
        Returns: boolean
      }
      simple_admin_signup: {
        Args: { display_name?: string; user_email: string }
        Returns: Json
      }
      validate_csrf_token_enhanced: {
        Args: { max_age_minutes?: number; session_id: string; token: string }
        Returns: boolean
      }
      validate_encryption_key_access: {
        Args: { p_key_identifier: string; p_operation?: string }
        Returns: boolean
      }
      validate_function_security: {
        Args: Record<PropertyKey, never>
        Returns: {
          function_name: string
          recommendations: string[]
          security_level: string
        }[]
      }
      validate_redirect_url: {
        Args: { redirect_url: string }
        Returns: boolean
      }
      validate_session_security: {
        Args: {
          client_fingerprint: string
          client_ip: unknown
          session_token: string
        }
        Returns: boolean
      }
      validate_session_security_v2: {
        Args: {
          client_fingerprint: string
          client_ip: unknown
          session_token: string
        }
        Returns: boolean
      }
      verify_access_elevation: {
        Args: {
          p_current_trust_score: number
          p_required_level: string
          p_user_id: string
        }
        Returns: Json
      }
      verify_active_admin_business_session: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      verify_active_admin_session: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      verify_active_business_application_session: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      verify_active_session_with_mfa: {
        Args: { max_idle_minutes?: number; required_security_level?: string }
        Returns: boolean
      }
      verify_encryption_key_access: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      verify_service_role_request: {
        Args: { operation_type: string }
        Returns: boolean
      }
      verify_session_token: {
        Args: {
          provided_token: string
          stored_hash: string
          stored_salt: string
        }
        Returns: boolean
      }
      verify_ultra_secure_admin_audit_access: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      verify_zero_trust_session: {
        Args: {
          p_device_fingerprint: string
          p_trust_score?: number
          p_user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      compliance_control_category:
        | "Security"
        | "Availability"
        | "Processing"
        | "Confidentiality"
        | "Privacy"
      compliance_control_status:
        | "compliant"
        | "non_compliant"
        | "in_progress"
        | "not_applicable"
      compliance_risk_level: "low" | "medium" | "high" | "critical"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      compliance_control_category: [
        "Security",
        "Availability",
        "Processing",
        "Confidentiality",
        "Privacy",
      ],
      compliance_control_status: [
        "compliant",
        "non_compliant",
        "in_progress",
        "not_applicable",
      ],
      compliance_risk_level: ["low", "medium", "high", "critical"],
    },
  },
} as const
