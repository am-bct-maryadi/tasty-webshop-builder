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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      branches: {
        Row: {
          address: string
          created_at: string | null
          id: string
          is_open: boolean | null
          name: string
          whatsapp_number: string | null
        }
        Insert: {
          address: string
          created_at?: string | null
          id?: string
          is_open?: boolean | null
          name: string
          whatsapp_number?: string | null
        }
        Update: {
          address?: string
          created_at?: string | null
          id?: string
          is_open?: boolean | null
          name?: string
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      brand_settings: {
        Row: {
          address: string | null
          company_name: string
          copyright_text: string | null
          description: string | null
          email: string | null
          footer_text: string | null
          id: string
          logo: string | null
          phone: string | null
          social_media: Json | null
          tagline: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          company_name: string
          copyright_text?: string | null
          description?: string | null
          email?: string | null
          footer_text?: string | null
          id?: string
          logo?: string | null
          phone?: string | null
          social_media?: Json | null
          tagline?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          company_name?: string
          copyright_text?: string | null
          description?: string | null
          email?: string | null
          footer_text?: string | null
          id?: string
          logo?: string | null
          phone?: string | null
          social_media?: Json | null
          tagline?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          branch_id: string
          count: number | null
          created_at: string | null
          id: string
          name: string
          sort_order: number | null
        }
        Insert: {
          branch_id: string
          count?: number | null
          created_at?: string | null
          id?: string
          name: string
          sort_order?: number | null
        }
        Update: {
          branch_id?: string
          count?: number | null
          created_at?: string | null
          id?: string
          name?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_addresses: {
        Row: {
          address_line1: string
          address_line2: string | null
          city: string
          country: string
          created_at: string
          customer_id: string
          id: string
          is_default: boolean
          label: string
          postal_code: string | null
          state: string | null
          updated_at: string
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          city: string
          country?: string
          created_at?: string
          customer_id: string
          id?: string
          is_default?: boolean
          label: string
          postal_code?: string | null
          state?: string | null
          updated_at?: string
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          city?: string
          country?: string
          created_at?: string
          customer_id?: string
          id?: string
          is_default?: boolean
          label?: string
          postal_code?: string | null
          state?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_addresses_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_sessions: {
        Row: {
          created_at: string
          customer_id: string
          expires_at: string
          id: string
          ip_address: unknown | null
          session_token: string
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          customer_id: string
          expires_at: string
          id?: string
          ip_address?: unknown | null
          session_token: string
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          customer_id?: string
          expires_at?: string
          id?: string
          ip_address?: unknown | null
          session_token?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_sessions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          created_at: string
          email: string
          email_verified: boolean
          full_name: string
          id: string
          is_active: boolean
          last_login: string | null
          marketing_consent: boolean
          password_hash: string
          phone: string
          privacy_accepted: boolean
          privacy_accepted_at: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          email_verified?: boolean
          full_name: string
          id?: string
          is_active?: boolean
          last_login?: string | null
          marketing_consent?: boolean
          password_hash: string
          phone: string
          privacy_accepted?: boolean
          privacy_accepted_at?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          email_verified?: boolean
          full_name?: string
          id?: string
          is_active?: boolean
          last_login?: string | null
          marketing_consent?: boolean
          password_hash?: string
          phone?: string
          privacy_accepted?: boolean
          privacy_accepted_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          branch_id: string
          created_at: string
          customer_address: string
          customer_id: string | null
          customer_name: string
          customer_phone: string
          delivery_type: string | null
          discount: number | null
          id: string
          items: Json
          notes: string | null
          pickup_branch: string | null
          pickup_time: string | null
          promo_code: string | null
          status: string
          subtotal: number
          total: number
          updated_at: string
        }
        Insert: {
          branch_id: string
          created_at?: string
          customer_address: string
          customer_id?: string | null
          customer_name: string
          customer_phone: string
          delivery_type?: string | null
          discount?: number | null
          id?: string
          items: Json
          notes?: string | null
          pickup_branch?: string | null
          pickup_time?: string | null
          promo_code?: string | null
          status?: string
          subtotal: number
          total: number
          updated_at?: string
        }
        Update: {
          branch_id?: string
          created_at?: string
          customer_address?: string
          customer_id?: string | null
          customer_name?: string
          customer_phone?: string
          delivery_type?: string | null
          discount?: number | null
          id?: string
          items?: Json
          notes?: string | null
          pickup_branch?: string | null
          pickup_time?: string | null
          promo_code?: string | null
          status?: string
          subtotal?: number
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_pickup_branch_fkey"
            columns: ["pickup_branch"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
      password_reset_tokens: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          token: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          token: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          token?: string
          used_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "password_reset_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          branch_id: string
          category: string
          created_at: string | null
          description: string
          id: string
          image: string
          is_available: boolean | null
          is_popular: boolean | null
          name: string
          prep_time: number | null
          price: number
          rating: number | null
        }
        Insert: {
          branch_id: string
          category: string
          created_at?: string | null
          description: string
          id?: string
          image: string
          is_available?: boolean | null
          is_popular?: boolean | null
          name: string
          prep_time?: number | null
          price: number
          rating?: number | null
        }
        Update: {
          branch_id?: string
          category?: string
          created_at?: string | null
          description?: string
          id?: string
          image?: string
          is_available?: boolean | null
          is_popular?: boolean | null
          name?: string
          prep_time?: number | null
          price?: number
          rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
      promos: {
        Row: {
          branch_id: string
          code: string
          created_at: string | null
          expiry_date: string
          id: string
          is_active: boolean | null
          min_order_amount: number | null
          type: string
          value: number
        }
        Insert: {
          branch_id: string
          code: string
          created_at?: string | null
          expiry_date: string
          id?: string
          is_active?: boolean | null
          min_order_amount?: number | null
          type: string
          value: number
        }
        Update: {
          branch_id?: string
          code?: string
          created_at?: string | null
          expiry_date?: string
          id?: string
          is_active?: boolean | null
          min_order_amount?: number | null
          type?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "promos_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          branch_id: string
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
          password: string | null
          role: string
          username: string
        }
        Insert: {
          branch_id: string
          created_at?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          password?: string | null
          role: string
          username: string
        }
        Update: {
          branch_id?: string
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          password?: string | null
          role?: string
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      authenticate_customer: {
        Args: { p_email: string; p_password_hash: string }
        Returns: {
          customer_id: string
          email: string
          email_verified: boolean
          full_name: string
          is_active: boolean
          phone: string
        }[]
      }
      cleanup_expired_reset_tokens: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_customer_account: {
        Args: {
          p_email: string
          p_full_name: string
          p_marketing_consent?: boolean
          p_password_hash: string
          p_phone: string
          p_privacy_accepted: boolean
        }
        Returns: {
          created_at: string
          customer_id: string
          email: string
          email_verified: boolean
          full_name: string
          is_active: boolean
          marketing_consent: boolean
          phone: string
          privacy_accepted: boolean
        }[]
      }
      get_current_user_branch: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_customer_for_auth: {
        Args: { p_email: string }
        Returns: {
          created_at: string
          customer_id: string
          email: string
          email_verified: boolean
          full_name: string
          is_active: boolean
          marketing_consent: boolean
          password_hash: string
          phone: string
          privacy_accepted: boolean
        }[]
      }
      is_user_active: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      set_customer_context: {
        Args: { customer_id_param: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
