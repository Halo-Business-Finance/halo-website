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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admin_audit_log: {
        Row: {
          action: string
          admin_user_id: string
          created_at: string
          id: string
          ip_address: unknown
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          admin_user_id: string
          created_at?: string
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          admin_user_id?: string
          created_at?: string
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_audit_log_admin_user_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_password_changes: {
        Row: {
          admin_user_id: string
          applied_at: string | null
          change_authorized_by: string | null
          change_reason: string | null
          created_at: string | null
          id: string
          ip_address: unknown
          mfa_verified: boolean | null
          new_password_hash: string
          new_password_salt: string
          old_password_hash_verification: string
          requires_mfa: boolean | null
          revoked_at: string | null
          status: string | null
        }
        Insert: {
          admin_user_id: string
          applied_at?: string | null
          change_authorized_by?: string | null
          change_reason?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown
          mfa_verified?: boolean | null
          new_password_hash: string
          new_password_salt: string
          old_password_hash_verification: string
          requires_mfa?: boolean | null
          revoked_at?: string | null
          status?: string | null
        }
        Update: {
          admin_user_id?: string
          applied_at?: string | null
          change_authorized_by?: string | null
          change_reason?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown
          mfa_verified?: boolean | null
          new_password_hash?: string
          new_password_salt?: string
          old_password_hash_verification?: string
          requires_mfa?: boolean | null
          revoked_at?: string | null
          status?: string | null
        }
        Relationships: []
      }
      admin_sessions: {
        Row: {
          admin_user_id: string
          created_at: string
          expires_at: string
          id: string
          ip_address: unknown
          session_token: string
          user_agent: string | null
        }
        Insert: {
          admin_user_id: string
          created_at?: string
          expires_at: string
          id?: string
          ip_address?: unknown
          session_token: string
          user_agent?: string | null
        }
        Update: {
          admin_user_id?: string
          created_at?: string
          expires_at?: string
          id?: string
          ip_address?: unknown
          session_token?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_sessions_admin_user_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_users: {
        Row: {
          account_locked_until: string | null
          created_at: string
          credential_audit_trail: Json | null
          email: string
          failed_login_attempts: number | null
          full_name: string
          id: string
          is_active: boolean
          last_login_at: string | null
          mfa_enabled: boolean | null
          mfa_secret_encrypted: string | null
          password_algorithm: string | null
          password_hash: string
          password_iterations: number | null
          password_last_changed: string | null
          password_salt: string | null
          role: string
          security_clearance_level: string | null
          updated_at: string
        }
        Insert: {
          account_locked_until?: string | null
          created_at?: string
          credential_audit_trail?: Json | null
          email: string
          failed_login_attempts?: number | null
          full_name: string
          id?: string
          is_active?: boolean
          last_login_at?: string | null
          mfa_enabled?: boolean | null
          mfa_secret_encrypted?: string | null
          password_algorithm?: string | null
          password_hash: string
          password_iterations?: number | null
          password_last_changed?: string | null
          password_salt?: string | null
          role?: string
          security_clearance_level?: string | null
          updated_at?: string
        }
        Update: {
          account_locked_until?: string | null
          created_at?: string
          credential_audit_trail?: Json | null
          email?: string
          failed_login_attempts?: number | null
          full_name?: string
          id?: string
          is_active?: boolean
          last_login_at?: string | null
          mfa_enabled?: boolean | null
          mfa_secret_encrypted?: string | null
          password_algorithm?: string | null
          password_hash?: string
          password_iterations?: number | null
          password_last_changed?: string | null
          password_salt?: string | null
          role?: string
          security_clearance_level?: string | null
          updated_at?: string
        }
        Relationships: []
      }
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
          compliance_classification: string | null
          created_at: string
          encrypted_financial_data: Json | null
          encryption_compliance_version: string | null
          financial_audit_trail: Json | null
          financial_data_hash: string | null
          financial_encryption_key_id: string | null
          id: string
          last_updated_at: string | null
          loan_amount: number | null
          notes: string | null
          priority_level: string | null
          status: string
          submitted_at: string | null
          tamper_detection_hash: string | null
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
          compliance_classification?: string | null
          created_at?: string
          encrypted_financial_data?: Json | null
          encryption_compliance_version?: string | null
          financial_audit_trail?: Json | null
          financial_data_hash?: string | null
          financial_encryption_key_id?: string | null
          id?: string
          last_updated_at?: string | null
          loan_amount?: number | null
          notes?: string | null
          priority_level?: string | null
          status?: string
          submitted_at?: string | null
          tamper_detection_hash?: string | null
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
          compliance_classification?: string | null
          created_at?: string
          encrypted_financial_data?: Json | null
          encryption_compliance_version?: string | null
          financial_audit_trail?: Json | null
          financial_data_hash?: string | null
          financial_encryption_key_id?: string | null
          id?: string
          last_updated_at?: string | null
          loan_amount?: number | null
          notes?: string | null
          priority_level?: string | null
          status?: string
          submitted_at?: string | null
          tamper_detection_hash?: string | null
          updated_at?: string
          user_id?: string
          years_in_business?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_financial_encryption_key_id_fkey"
            columns: ["financial_encryption_key_id"]
            isOneToOne: false
            referencedRelation: "encryption_keys"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: unknown
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
          ip_address?: unknown
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
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          resource?: string
          resource_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      cms_content: {
        Row: {
          content_key: string
          content_type: string
          content_value: Json
          created_at: string
          id: string
          is_published: boolean
          page_slug: string
          section_name: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          content_key: string
          content_type?: string
          content_value?: Json
          created_at?: string
          id?: string
          is_published?: boolean
          page_slug: string
          section_name: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          content_key?: string
          content_type?: string
          content_value?: Json
          created_at?: string
          id?: string
          is_published?: boolean
          page_slug?: string
          section_name?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_content_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
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
      lead_submissions: {
        Row: {
          assigned_to: string | null
          created_at: string
          data_classification: string | null
          data_encryption_key_id: string | null
          encrypted_submitted_data: Json | null
          encryption_version: string | null
          form_type: string
          id: string
          ip_address: unknown
          last_encryption_audit: string | null
          notes: string | null
          priority: string
          referrer: string | null
          retention_policy: string | null
          status: string
          submitted_data: Json
          updated_at: string
          user_agent: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          data_classification?: string | null
          data_encryption_key_id?: string | null
          encrypted_submitted_data?: Json | null
          encryption_version?: string | null
          form_type: string
          id?: string
          ip_address?: unknown
          last_encryption_audit?: string | null
          notes?: string | null
          priority?: string
          referrer?: string | null
          retention_policy?: string | null
          status?: string
          submitted_data?: Json
          updated_at?: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          data_classification?: string | null
          data_encryption_key_id?: string | null
          encrypted_submitted_data?: Json | null
          encryption_version?: string | null
          form_type?: string
          id?: string
          ip_address?: unknown
          last_encryption_audit?: string | null
          notes?: string | null
          priority?: string
          referrer?: string | null
          retention_policy?: string | null
          status?: string
          submitted_data?: Json
          updated_at?: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_submissions_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_submissions_data_encryption_key_id_fkey"
            columns: ["data_encryption_key_id"]
            isOneToOne: false
            referencedRelation: "encryption_keys"
            referencedColumns: ["id"]
          },
        ]
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
          ip_address: unknown
          record_id: string | null
          risk_assessment: string | null
          table_name: string
          user_id: string | null
        }
        Insert: {
          access_time?: string | null
          action: string
          id?: string
          ip_address?: unknown
          record_id?: string | null
          risk_assessment?: string | null
          table_name: string
          user_id?: string | null
        }
        Update: {
          access_time?: string | null
          action?: string
          id?: string
          ip_address?: unknown
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
          ip_address: unknown
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
          ip_address?: unknown
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
          ip_address?: unknown
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
      security_logs: {
        Row: {
          admin_user_id: string | null
          created_at: string
          details: Json | null
          event_type: string
          id: string
          ip_address: unknown
          message: string
          resolved: boolean
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          user_agent: string | null
        }
        Insert: {
          admin_user_id?: string | null
          created_at?: string
          details?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown
          message: string
          resolved?: boolean
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          user_agent?: string | null
        }
        Update: {
          admin_user_id?: string | null
          created_at?: string
          details?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown
          message?: string
          resolved?: boolean
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "security_logs_admin_user_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "security_logs_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_settings: {
        Row: {
          canonical_url: string | null
          created_at: string
          id: string
          is_active: boolean
          meta_description: string | null
          meta_keywords: string[] | null
          meta_title: string | null
          og_description: string | null
          og_image: string | null
          og_title: string | null
          page_slug: string
          robots_meta: string | null
          schema_markup: Json | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          canonical_url?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          meta_description?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          page_slug: string
          robots_meta?: string | null
          schema_markup?: Json | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          canonical_url?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          meta_description?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          page_slug?: string
          robots_meta?: string | null
          schema_markup?: Json | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seo_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
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
          ip_address: unknown
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
          ip_address?: unknown
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
          ip_address?: unknown
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
        Args: never
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
        Args: never
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
      cleanup_expired_admin_sessions: { Args: never; Returns: number }
      cleanup_expired_sessions: { Args: never; Returns: number }
      cleanup_old_consultations: { Args: never; Returns: number }
      cleanup_security_events: { Args: never; Returns: number }
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
      create_initial_admin: { Args: { admin_email: string }; Returns: boolean }
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
      decrypt_field_data: {
        Args: { encrypted_package: Json; master_key_id: string }
        Returns: string
      }
      derive_field_encryption_key: {
        Args: { field_identifier: string; master_key_id: string; salt: string }
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
      detect_potential_data_breaches: {
        Args: never
        Returns: {
          affected_tables: string[]
          incident_count: number
          recommendation: string
          threat_level: string
          threat_type: string
        }[]
      }
      detect_security_anomalies: {
        Args: never
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
      detect_unauthorized_access_patterns: { Args: never; Returns: Json }
      emergency_cleanup_security_events: { Args: never; Returns: number }
      encrypt_field_data: {
        Args: {
          field_type: string
          master_key_id: string
          plaintext_value: string
          use_deterministic?: boolean
        }
        Returns: Json
      }
      encrypt_sensitive_data: { Args: { data_text: string }; Returns: string }
      enforce_consultation_retention: { Args: never; Returns: number }
      enforce_data_retention: { Args: never; Returns: number }
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
      force_session_rotation: { Args: { p_user_id: string }; Returns: number }
      gen_random_bytes: { Args: { n: number }; Returns: string }
      gen_random_uuid: { Args: never; Returns: string }
      generate_compliance_summary: {
        Args: { report_period_days?: number }
        Returns: Json
      }
      generate_secure_session_token: {
        Args: never
        Returns: {
          hash: string
          salt: string
          token: string
        }[]
      }
      get_admin_profile_secure: {
        Args: never
        Returns: {
          created_at: string
          email: string
          full_name: string
          id: string
          is_active: boolean
          last_login_at: string
          mfa_enabled: boolean
          role: string
          security_clearance_level: string
        }[]
      }
      get_admin_user_profiles: {
        Args: never
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
      get_current_user_role: { Args: never; Returns: string }
      get_secure_admin_business_application_data: {
        Args: never
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
        Args: never
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
      get_secure_consultation_data_enhanced:
        | {
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
        | {
            Args: { consultation_id?: string; user_filter?: string }
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
      get_security_config: { Args: { config_key: string }; Returns: Json }
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
      get_user_active_sessions_count: { Args: never; Returns: number }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      get_user_role_cached: { Args: { p_user_id: string }; Returns: string }
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
      hash_admin_password: {
        Args: { admin_email: string; plain_password: string }
        Returns: Json
      }
      hash_session_token: {
        Args: { salt?: string; token: string }
        Returns: Json
      }
      initialize_admin_user: {
        Args: { target_email: string }
        Returns: boolean
      }
      intelligent_security_event_cleanup: { Args: never; Returns: number }
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
      make_user_admin:
        | { Args: { target_email: string }; Returns: boolean }
        | { Args: { target_user_id: string }; Returns: boolean }
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
        Args: { data_type: string; data_value: string }
        Returns: string
      }
      mask_sensitive_financial_data: {
        Args: { data_type: string; data_value: string; user_role?: string }
        Returns: string
      }
      optimize_security_events: { Args: never; Returns: number }
      optimize_security_events_v2: { Args: never; Returns: number }
      schedule_key_rotation: {
        Args: { p_key_identifier: string; p_rotation_date?: string }
        Returns: boolean
      }
      schedule_security_maintenance: { Args: never; Returns: undefined }
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
      secure_session_validation: {
        Args: {
          p_admin_email: string
          p_ip_address: unknown
          p_session_token: string
        }
        Returns: boolean
      }
      secure_verify_admin_password: {
        Args: { p_admin_email: string; p_password_hash: string }
        Returns: {
          admin_id: string
          failed_attempts: number
          is_locked: boolean
          is_valid: boolean
        }[]
      }
      should_log_security_event:
        | {
            Args: {
              event_data?: Json
              event_type: string
              severity: string
              source_ip: unknown
            }
            Returns: boolean
          }
        | {
            Args: {
              p_event_type: string
              p_severity: string
              p_source?: string
            }
            Returns: boolean
          }
      simple_admin_signup: {
        Args: { display_name?: string; user_email: string }
        Returns: Json
      }
      update_admin_profile_secure: {
        Args: { p_full_name?: string; p_security_clearance_level?: string }
        Returns: boolean
      }
      validate_admin_session: {
        Args: {
          p_admin_email: string
          p_ip_address?: unknown
          p_session_token: string
        }
        Returns: boolean
      }
      validate_csrf_token_enhanced: {
        Args: { max_age_minutes?: number; session_id: string; token: string }
        Returns: boolean
      }
      validate_encryption_compliance: {
        Args: never
        Returns: {
          compliance_status: string
          encryption_coverage_percent: number
          recommendations: string[]
          table_name: string
        }[]
      }
      validate_encryption_key_access: {
        Args: { p_key_identifier: string; p_operation?: string }
        Returns: boolean
      }
      validate_function_security: {
        Args: never
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
      verify_active_admin_business_session: { Args: never; Returns: boolean }
      verify_active_admin_session: { Args: never; Returns: boolean }
      verify_active_business_application_session: {
        Args: never
        Returns: boolean
      }
      verify_active_session_with_mfa: {
        Args: { max_idle_minutes?: number; required_security_level?: string }
        Returns: boolean
      }
      verify_admin_access_with_session_check: { Args: never; Returns: boolean }
      verify_admin_password: {
        Args: {
          admin_email: string
          iterations?: number
          plain_password: string
          stored_hash: string
          stored_salt: string
        }
        Returns: boolean
      }
      verify_admin_self_access: { Args: never; Returns: boolean }
      verify_admin_session: { Args: { token: string }; Returns: string }
      verify_encryption_key_access: { Args: never; Returns: boolean }
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
      verify_ultra_secure_admin_audit_access: { Args: never; Returns: boolean }
      verify_ultra_secure_application_access: {
        Args: { target_application_id: string }
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
