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
        }
        Insert: {
          branch_id: string
          count?: number | null
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          branch_id?: string
          count?: number | null
          created_at?: string | null
          id?: string
          name?: string
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
      orders: {
        Row: {
          branch_id: string
          created_at: string
          customer_address: string
          customer_name: string
          customer_phone: string
          discount: number | null
          id: string
          items: Json
          notes: string | null
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
          customer_name: string
          customer_phone: string
          discount?: number | null
          id?: string
          items: Json
          notes?: string | null
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
          customer_name?: string
          customer_phone?: string
          discount?: number | null
          id?: string
          items?: Json
          notes?: string | null
          promo_code?: string | null
          status?: string
          subtotal?: number
          total?: number
          updated_at?: string
        }
        Relationships: []
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
      [_ in never]: never
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
