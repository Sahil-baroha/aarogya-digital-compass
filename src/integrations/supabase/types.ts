export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      aadhaar_verifications: {
        Row: {
          aadhaar_number: string
          attempts_count: number | null
          created_at: string | null
          id: string
          last_attempt_at: string | null
          otp_expires_at: string
          otp_hash: string
          user_id: string
          verification_status: string
          verified_at: string | null
        }
        Insert: {
          aadhaar_number: string
          attempts_count?: number | null
          created_at?: string | null
          id?: string
          last_attempt_at?: string | null
          otp_expires_at: string
          otp_hash: string
          user_id: string
          verification_status?: string
          verified_at?: string | null
        }
        Update: {
          aadhaar_number?: string
          attempts_count?: number | null
          created_at?: string | null
          id?: string
          last_attempt_at?: string | null
          otp_expires_at?: string
          otp_hash?: string
          user_id?: string
          verification_status?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      abha_verifications: {
        Row: {
          abha_id: string
          created_at: string | null
          id: string
          last_attempt_at: string | null
          updated_at: string | null
          user_id: string
          verification_attempts: number | null
          verification_status: string
          verification_token: string | null
          verified_at: string | null
        }
        Insert: {
          abha_id: string
          created_at?: string | null
          id?: string
          last_attempt_at?: string | null
          updated_at?: string | null
          user_id: string
          verification_attempts?: number | null
          verification_status?: string
          verification_token?: string | null
          verified_at?: string | null
        }
        Update: {
          abha_id?: string
          created_at?: string | null
          id?: string
          last_attempt_at?: string | null
          updated_at?: string | null
          user_id?: string
          verification_attempts?: number | null
          verification_status?: string
          verification_token?: string | null
          verified_at?: string | null
        }
        Relationships: []
      }
      appointments: {
        Row: {
          appointment_datetime: string
          consultation_fee: number | null
          consultation_type: string | null
          created_at: string | null
          doctor_id: string | null
          duration_minutes: number | null
          id: string
          notes: string | null
          patient_id: string | null
          status: Database["public"]["Enums"]["appointment_status"] | null
          symptoms: string | null
          updated_at: string | null
        }
        Insert: {
          appointment_datetime: string
          consultation_fee?: number | null
          consultation_type?: string | null
          created_at?: string | null
          doctor_id?: string | null
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          patient_id?: string | null
          status?: Database["public"]["Enums"]["appointment_status"] | null
          symptoms?: string | null
          updated_at?: string | null
        }
        Update: {
          appointment_datetime?: string
          consultation_fee?: number | null
          consultation_type?: string | null
          created_at?: string | null
          doctor_id?: string | null
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          patient_id?: string | null
          status?: Database["public"]["Enums"]["appointment_status"] | null
          symptoms?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          blockchain_hash: string | null
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown | null
          resource_id: string | null
          resource_type: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          blockchain_hash?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          blockchain_hash?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      doctor_profiles: {
        Row: {
          available_hours: Json | null
          clinic_address: Json | null
          consultation_fee: number | null
          created_at: string | null
          experience_years: number | null
          id: string
          is_verified: boolean | null
          license_number: string
          qualification: string | null
          specialization: string | null
          updated_at: string | null
        }
        Insert: {
          available_hours?: Json | null
          clinic_address?: Json | null
          consultation_fee?: number | null
          created_at?: string | null
          experience_years?: number | null
          id: string
          is_verified?: boolean | null
          license_number: string
          qualification?: string | null
          specialization?: string | null
          updated_at?: string | null
        }
        Update: {
          available_hours?: Json | null
          clinic_address?: Json | null
          consultation_fee?: number | null
          created_at?: string | null
          experience_years?: number | null
          id?: string
          is_verified?: boolean | null
          license_number?: string
          qualification?: string | null
          specialization?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "doctor_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      doctor_verification: {
        Row: {
          created_at: string | null
          doctor_id: string | null
          documents_submitted: Json | null
          id: string
          reviewed_at: string | null
          reviewer_id: string | null
          reviewer_notes: string | null
          submitted_at: string | null
          updated_at: string | null
          verification_status: string
        }
        Insert: {
          created_at?: string | null
          doctor_id?: string | null
          documents_submitted?: Json | null
          id?: string
          reviewed_at?: string | null
          reviewer_id?: string | null
          reviewer_notes?: string | null
          submitted_at?: string | null
          updated_at?: string | null
          verification_status?: string
        }
        Update: {
          created_at?: string | null
          doctor_id?: string | null
          documents_submitted?: Json | null
          id?: string
          reviewed_at?: string | null
          reviewer_id?: string | null
          reviewer_notes?: string | null
          submitted_at?: string | null
          updated_at?: string | null
          verification_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "doctor_verification_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      health_documents: {
        Row: {
          appointment_id: string | null
          created_at: string | null
          description: string | null
          document_type: Database["public"]["Enums"]["document_type"]
          file_size: number | null
          file_url: string | null
          id: string
          is_verified: boolean | null
          mime_type: string | null
          title: string
          uploaded_by: string | null
          user_id: string | null
        }
        Insert: {
          appointment_id?: string | null
          created_at?: string | null
          description?: string | null
          document_type: Database["public"]["Enums"]["document_type"]
          file_size?: number | null
          file_url?: string | null
          id?: string
          is_verified?: boolean | null
          mime_type?: string | null
          title: string
          uploaded_by?: string | null
          user_id?: string | null
        }
        Update: {
          appointment_id?: string | null
          created_at?: string | null
          description?: string | null
          document_type?: Database["public"]["Enums"]["document_type"]
          file_size?: number | null
          file_url?: string | null
          id?: string
          is_verified?: boolean | null
          mime_type?: string | null
          title?: string
          uploaded_by?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "health_documents_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "health_documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "health_documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_data_access_logs: {
        Row: {
          access_reason: string | null
          access_type: string
          accessed_user_id: string
          created_at: string | null
          id: string
          ip_address: unknown | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          access_reason?: string | null
          access_type: string
          accessed_user_id: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          access_reason?: string | null
          access_type?: string
          accessed_user_id?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      patient_medical_history: {
        Row: {
          allergies: string[] | null
          chronic_conditions: string[] | null
          created_at: string | null
          family_history: string[] | null
          id: string
          insurance_details: Json | null
          lifestyle_data: Json | null
          medications: string[] | null
          patient_id: string | null
          surgeries: Json | null
          updated_at: string | null
        }
        Insert: {
          allergies?: string[] | null
          chronic_conditions?: string[] | null
          created_at?: string | null
          family_history?: string[] | null
          id?: string
          insurance_details?: Json | null
          lifestyle_data?: Json | null
          medications?: string[] | null
          patient_id?: string | null
          surgeries?: Json | null
          updated_at?: string | null
        }
        Update: {
          allergies?: string[] | null
          chronic_conditions?: string[] | null
          created_at?: string | null
          family_history?: string[] | null
          id?: string
          insurance_details?: Json | null
          lifestyle_data?: Json | null
          medications?: string[] | null
          patient_id?: string | null
          surgeries?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_medical_history_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_vitals: {
        Row: {
          appointment_id: string | null
          blood_glucose: number | null
          blood_pressure_diastolic: number | null
          blood_pressure_systolic: number | null
          bmi: number | null
          heart_rate: number | null
          height: number | null
          id: string
          other_measurements: Json | null
          oxygen_saturation: number | null
          patient_id: string | null
          recorded_at: string | null
          recorded_by: string | null
          temperature: number | null
          weight: number | null
        }
        Insert: {
          appointment_id?: string | null
          blood_glucose?: number | null
          blood_pressure_diastolic?: number | null
          blood_pressure_systolic?: number | null
          bmi?: number | null
          heart_rate?: number | null
          height?: number | null
          id?: string
          other_measurements?: Json | null
          oxygen_saturation?: number | null
          patient_id?: string | null
          recorded_at?: string | null
          recorded_by?: string | null
          temperature?: number | null
          weight?: number | null
        }
        Update: {
          appointment_id?: string | null
          blood_glucose?: number | null
          blood_pressure_diastolic?: number | null
          blood_pressure_systolic?: number | null
          bmi?: number | null
          heart_rate?: number | null
          height?: number | null
          id?: string
          other_measurements?: Json | null
          oxygen_saturation?: number | null
          patient_id?: string | null
          recorded_at?: string | null
          recorded_by?: string | null
          temperature?: number | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_vitals_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_vitals_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_vitals_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      prescriptions: {
        Row: {
          appointment_id: string | null
          created_at: string | null
          digital_signature: string | null
          doctor_id: string | null
          id: string
          patient_id: string | null
          pharmacy_notes: string | null
          prescription_data: Json
          status: Database["public"]["Enums"]["prescription_status"] | null
          updated_at: string | null
          valid_until: string | null
        }
        Insert: {
          appointment_id?: string | null
          created_at?: string | null
          digital_signature?: string | null
          doctor_id?: string | null
          id?: string
          patient_id?: string | null
          pharmacy_notes?: string | null
          prescription_data: Json
          status?: Database["public"]["Enums"]["prescription_status"] | null
          updated_at?: string | null
          valid_until?: string | null
        }
        Update: {
          appointment_id?: string | null
          created_at?: string | null
          digital_signature?: string | null
          doctor_id?: string | null
          id?: string
          patient_id?: string | null
          pharmacy_notes?: string | null
          prescription_data?: Json
          status?: Database["public"]["Enums"]["prescription_status"] | null
          updated_at?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prescriptions_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prescriptions_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prescriptions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          abha_id: string | null
          address: Json | null
          created_at: string | null
          date_of_birth: string | null
          email: string | null
          emergency_contact: Json | null
          full_name: string
          gender: string | null
          id: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          abha_id?: string | null
          address?: Json | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          emergency_contact?: Json | null
          full_name?: string
          gender?: string | null
          id: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          abha_id?: string | null
          address?: Json | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          emergency_contact?: Json | null
          full_name?: string
          gender?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_security_settings: {
        Row: {
          created_at: string | null
          data_access_notifications: boolean | null
          id: string
          login_notifications: boolean | null
          require_reauth_for_sensitive: boolean | null
          session_timeout_minutes: number | null
          two_factor_enabled: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data_access_notifications?: boolean | null
          id?: string
          login_notifications?: boolean | null
          require_reauth_for_sensitive?: boolean | null
          session_timeout_minutes?: number | null
          two_factor_enabled?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          data_access_notifications?: boolean | null
          id?: string
          login_notifications?: boolean | null
          require_reauth_for_sensitive?: boolean | null
          session_timeout_minutes?: number | null
          two_factor_enabled?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_doctor_profile: {
        Args: { doctor_user_id: string }
        Returns: {
          profile_data: Json
          verification_data: Json
        }[]
      }
      get_patient_profile: {
        Args: { patient_user_id: string }
        Returns: {
          profile_data: Json
          medical_history: Json
          latest_vitals: Json
        }[]
      }
      log_medical_data_access: {
        Args: {
          p_user_id: string
          p_accessed_user_id: string
          p_access_type: string
          p_resource_type: string
          p_resource_id?: string
          p_ip_address?: unknown
          p_user_agent?: string
          p_access_reason?: string
        }
        Returns: undefined
      }
      update_doctor_profile: {
        Args: {
          doctor_user_id: string
          profile_updates: Json
          verification_updates?: Json
        }
        Returns: boolean
      }
      update_patient_profile: {
        Args: {
          patient_user_id: string
          profile_updates: Json
          medical_history_updates?: Json
        }
        Returns: boolean
      }
      validate_aadhaar_number: {
        Args: { aadhaar_number: string }
        Returns: boolean
      }
      validate_abha_id: {
        Args: { abha_id: string }
        Returns: boolean
      }
    }
    Enums: {
      appointment_status:
        | "scheduled"
        | "confirmed"
        | "in_progress"
        | "completed"
        | "cancelled"
        | "no_show"
      document_type:
        | "lab_report"
        | "prescription"
        | "discharge_summary"
        | "scan"
        | "insurance_document"
        | "other"
      prescription_status: "issued" | "dispensed" | "cancelled"
      user_role: "patient" | "doctor" | "admin" | "pharmacist"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      appointment_status: [
        "scheduled",
        "confirmed",
        "in_progress",
        "completed",
        "cancelled",
        "no_show",
      ],
      document_type: [
        "lab_report",
        "prescription",
        "discharge_summary",
        "scan",
        "insurance_document",
        "other",
      ],
      prescription_status: ["issued", "dispensed", "cancelled"],
      user_role: ["patient", "doctor", "admin", "pharmacist"],
    },
  },
} as const
