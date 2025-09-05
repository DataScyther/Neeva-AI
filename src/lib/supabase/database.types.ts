// Types for Supabase database tables
// This file can be auto-generated using supabase cli:
// npx supabase gen types typescript --project-id YOUR_PROJECT_ID > database.types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // Define your table types here
      // Example:
      // users: {
      //   Row: {
      //     id: string
      //     created_at: string
      //     email: string
      //     full_name: string | null
      //   }
      //   Insert: {
      //     id?: string
      //     created_at?: string
      //     email: string
      //     full_name?: string | null
      //   }
      //   Update: {
      //     id?: string
      //     created_at?: string
      //     email?: string
      //     full_name?: string | null
      //   }
      // }
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
  }
}