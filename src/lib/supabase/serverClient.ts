import { createClient } from '@supabase/supabase-js'
import { projectId } from '../../utils/supabase/info'

// Get the service role key from environment variables
const supabaseUrl = `https://${projectId}.supabase.co`
// @ts-ignore: process.env is available in Vite projects
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Validate that we have the required credentials
if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase service role key. Please check your environment configuration.')
}

// Create a Supabase client instance with service role privileges
// This client should only be used on the server-side or in secure environments
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    // With service role key, we have full access
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
  // Global error handling
  global: {
    headers: {
      'X-Client-Info': 'NeevaAI/1.0'
    }
  },
  // Configure request timeouts
  realtime: {
    timeout: 10000, // 10 seconds
  }
})

export type SupabaseAdminClient = typeof supabaseAdmin