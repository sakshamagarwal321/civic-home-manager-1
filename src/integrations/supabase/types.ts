export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      flats: {
        Row: {
          block: string | null
          created_at: string | null
          flat_number: string
          flat_type: string
          id: string
          is_active: boolean | null
          resident_id: string | null
          resident_name: string | null
          updated_at: string | null
        }
        Insert: {
          block?: string | null
          created_at?: string | null
          flat_number: string
          flat_type: string
          id?: string
          is_active?: boolean | null
          resident_id?: string | null
          resident_name?: string | null
          updated_at?: string | null
        }
        Update: {
          block?: string | null
          created_at?: string | null
          flat_number?: string
          flat_type?: string
          id?: string
          is_active?: boolean | null
          resident_id?: string | null
          resident_name?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "flats_resident_id_fkey"
            columns: ["resident_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_payments: {
        Row: {
          bank_name: string | null
          base_amount: number
          cheque_date: string | null
          cheque_number: string | null
          created_at: string | null
          flat_number: string
          id: string
          payment_date: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_month: string
          penalty_amount: number | null
          receipt_number: string
          received_by: string | null
          resident_id: string | null
          status: Database["public"]["Enums"]["payment_status"]
          total_amount: number
          transaction_reference: string | null
          updated_at: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          bank_name?: string | null
          base_amount?: number
          cheque_date?: string | null
          cheque_number?: string | null
          created_at?: string | null
          flat_number: string
          id?: string
          payment_date: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_month: string
          penalty_amount?: number | null
          receipt_number: string
          received_by?: string | null
          resident_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          total_amount: number
          transaction_reference?: string | null
          updated_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          bank_name?: string | null
          base_amount?: number
          cheque_date?: string | null
          cheque_number?: string | null
          created_at?: string | null
          flat_number?: string
          id?: string
          payment_date?: string
          payment_method?: Database["public"]["Enums"]["payment_method"]
          payment_month?: string
          penalty_amount?: number | null
          receipt_number?: string
          received_by?: string | null
          resident_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          total_amount?: number
          transaction_reference?: string | null
          updated_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_payments_received_by_fkey"
            columns: ["received_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_payments_resident_id_fkey"
            columns: ["resident_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_payments_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_settings: {
        Row: {
          base_maintenance_fee: number | null
          created_at: string | null
          current_receipt_sequence: number | null
          email_template: string | null
          id: string
          late_payment_penalty: number | null
          penalty_due_date: number | null
          receipt_prefix: string | null
          society_address: string | null
          society_name: string | null
          updated_at: string | null
        }
        Insert: {
          base_maintenance_fee?: number | null
          created_at?: string | null
          current_receipt_sequence?: number | null
          email_template?: string | null
          id?: string
          late_payment_penalty?: number | null
          penalty_due_date?: number | null
          receipt_prefix?: string | null
          society_address?: string | null
          society_name?: string | null
          updated_at?: string | null
        }
        Update: {
          base_maintenance_fee?: number | null
          created_at?: string | null
          current_receipt_sequence?: number | null
          email_template?: string | null
          id?: string
          late_payment_penalty?: number | null
          penalty_due_date?: number | null
          receipt_prefix?: string | null
          society_address?: string | null
          society_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      payment_reminders: {
        Row: {
          flat_number: string
          id: string
          payment_month: string
          reminder_type: string
          sent_at: string | null
          sent_by: string | null
          status: string | null
        }
        Insert: {
          flat_number: string
          id?: string
          payment_month: string
          reminder_type: string
          sent_at?: string | null
          sent_by?: string | null
          status?: string | null
        }
        Update: {
          flat_number?: string
          id?: string
          payment_month?: string
          reminder_type?: string
          sent_at?: string | null
          sent_by?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_reminders_sent_by_fkey"
            columns: ["sent_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_status: Database["public"]["Enums"]["account_status"]
          block: string | null
          created_at: string | null
          emergency_contact: string | null
          first_name: string
          flat_number: string | null
          id: string
          is_owner: boolean | null
          last_name: string
          phone: string | null
          profile_photo_url: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          account_status?: Database["public"]["Enums"]["account_status"]
          block?: string | null
          created_at?: string | null
          emergency_contact?: string | null
          first_name: string
          flat_number?: string | null
          id: string
          is_owner?: boolean | null
          last_name: string
          phone?: string | null
          profile_photo_url?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          account_status?: Database["public"]["Enums"]["account_status"]
          block?: string | null
          created_at?: string | null
          emergency_contact?: string | null
          first_name?: string
          flat_number?: string | null
          id?: string
          is_owner?: boolean | null
          last_name?: string
          phone?: string | null
          profile_photo_url?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          approval_limit: number | null
          can_approve: boolean | null
          can_delete: boolean | null
          can_read: boolean | null
          can_write: boolean | null
          created_at: string | null
          id: string
          module: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          approval_limit?: number | null
          can_approve?: boolean | null
          can_delete?: boolean | null
          can_read?: boolean | null
          can_write?: boolean | null
          created_at?: string | null
          id?: string
          module: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          approval_limit?: number | null
          can_approve?: boolean | null
          can_delete?: boolean | null
          can_read?: boolean | null
          can_write?: boolean | null
          created_at?: string | null
          id?: string
          module?: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      user_activity_log: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown | null
          module: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          module?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          module?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string | null
          device_info: string | null
          id: string
          ip_address: unknown | null
          last_active: string | null
          session_token: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          device_info?: string | null
          id?: string
          ip_address?: unknown | null
          last_active?: string | null
          session_token: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          device_info?: string | null
          id?: string
          ip_address?: unknown | null
          last_active?: string | null
          session_token?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_penalty: {
        Args: { payment_date: string; payment_month: string }
        Returns: number
      }
      generate_receipt_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      log_user_activity: {
        Args: {
          p_user_id: string
          p_action: string
          p_module?: string
          p_details?: Json
          p_ip_address?: unknown
        }
        Returns: undefined
      }
    }
    Enums: {
      account_status: "active" | "inactive" | "suspended" | "pending_approval"
      payment_method: "cash" | "cheque" | "upi_imps" | "bank_transfer"
      payment_status: "pending" | "paid" | "overdue" | "verified"
      user_role:
        | "super_admin"
        | "committee_member"
        | "treasurer"
        | "resident_owner"
        | "resident_tenant"
        | "staff_member"
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
      account_status: ["active", "inactive", "suspended", "pending_approval"],
      payment_method: ["cash", "cheque", "upi_imps", "bank_transfer"],
      payment_status: ["pending", "paid", "overdue", "verified"],
      user_role: [
        "super_admin",
        "committee_member",
        "treasurer",
        "resident_owner",
        "resident_tenant",
        "staff_member",
      ],
    },
  },
} as const
