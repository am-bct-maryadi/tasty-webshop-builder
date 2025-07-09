import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      branches: {
        Row: {
          id: string;
          name: string;
          address: string;
          is_open: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          address: string;
          is_open?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          address?: string;
          is_open?: boolean;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          image: string;
          category: string;
          rating: number;
          prep_time: number;
          is_available: boolean;
          is_popular: boolean;
          branch_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          price: number;
          image: string;
          category: string;
          rating?: number;
          prep_time?: number;
          is_available?: boolean;
          is_popular?: boolean;
          branch_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          price?: number;
          image?: string;
          category?: string;
          rating?: number;
          prep_time?: number;
          is_available?: boolean;
          is_popular?: boolean;
          branch_id?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          count: number;
          branch_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          count?: number;
          branch_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          count?: number;
          branch_id?: string;
        };
      };
      promos: {
        Row: {
          id: string;
          code: string;
          type: 'percentage' | 'fixed';
          value: number;
          min_order_amount: number;
          is_active: boolean;
          expiry_date: string;
          branch_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          type: 'percentage' | 'fixed';
          value: number;
          min_order_amount?: number;
          is_active?: boolean;
          expiry_date: string;
          branch_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          type?: 'percentage' | 'fixed';
          value?: number;
          min_order_amount?: number;
          is_active?: boolean;
          expiry_date?: string;
          branch_id?: string;
        };
      };
      users: {
        Row: {
          id: string;
          username: string;
          email: string;
          role: 'admin' | 'manager' | 'staff';
          is_active: boolean;
          branch_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          username: string;
          email: string;
          role: 'admin' | 'manager' | 'staff';
          is_active?: boolean;
          branch_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          email?: string;
          role?: 'admin' | 'manager' | 'staff';
          is_active?: boolean;
          branch_id?: string;
        };
      };
      brand_settings: {
        Row: {
          id: string;
          company_name: string;
          logo: string;
          tagline: string;
          description: string;
          website: string;
          email: string;
          phone: string;
          address: string;
          social_media: any;
          footer_text: string;
          copyright_text: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_name: string;
          logo?: string;
          tagline?: string;
          description?: string;
          website?: string;
          email?: string;
          phone?: string;
          address?: string;
          social_media?: any;
          footer_text?: string;
          copyright_text?: string;
          updated_at?: string;
        };
        Update: {
          company_name?: string;
          logo?: string;
          tagline?: string;
          description?: string;
          website?: string;
          email?: string;
          phone?: string;
          address?: string;
          social_media?: any;
          footer_text?: string;
          copyright_text?: string;
          updated_at?: string;
        };
      };
    };
  };
}