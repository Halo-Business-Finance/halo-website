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
      consultations: {
        Row: {
          company: string | null
          created_at: string
          encrypted_email: string | null
          encrypted_name: string | null
          encrypted_phone: string | null
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
          encrypted_email?: string | null
          encrypted_name?: string | null
          encrypted_phone?: string | null
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
          encrypted_email?: string | null
          encrypted_name?: string | null
          encrypted_phone?: string | null
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
      detect_session_anomaly: {
        Args: {
          new_fingerprint: string
          new_ip: unknown
          new_user_agent: string
          session_id: string
        }
        Returns: Json
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
      force_session_rotation: {
        Args: { p_user_id: string }
        Returns: number
      }
      generate_secure_session_token: {
        Args: Record<PropertyKey, never>
        Returns: {
          hash: string
          salt: string
          token: string
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
      get_consultations_list_secure: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          email: string
          id: string
          loan_amount: string
          loan_program: string
          name: string
          status: string
          user_id: string
        }[]
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_my_consultations: {
        Args: Record<PropertyKey, never>
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
      get_security_overview: {
        Args: Record<PropertyKey, never>
        Returns: {
          active_sessions: number
          critical_alerts: number
          encryption_keys_active: number
          security_events_24h: number
        }[]
      }
      get_session_overview_admin: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          is_active: boolean
          last_activity: string
          masked_ip: string
          security_level: string
          session_id: string
          user_id: string
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
      mask_sensitive_data: {
        Args: { data_text: string; data_type: string }
        Returns: string
      }
      resolve_security_alert: {
        Args: { alert_id: string; resolution_notes?: string }
        Returns: boolean
      }
      schedule_key_rotation: {
        Args: { p_key_identifier: string; p_rotation_date?: string }
        Returns: boolean
      }
      secure_assign_user_role: {
        Args: {
          expiration_date?: string
          new_role: Database["public"]["Enums"]["app_role"]
          target_user_id: string
        }
        Returns: boolean
      }
      secure_cleanup_consultations: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      secure_cleanup_expired_sessions: {
        Args: Record<PropertyKey, never>
        Returns: number
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
      update_rate_limit_config: {
        Args: {
          endpoint_name: string
          new_block_duration_seconds?: number
          new_max_requests: number
          new_window_seconds: number
        }
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
      verify_session_token: {
        Args: {
          provided_token: string
          stored_hash: string
          stored_salt: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
    },
  },
} as const
