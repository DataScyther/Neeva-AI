import { supabase } from '../lib/supabase/client'

// Test Supabase connection
export const testSupabaseConnection = async () => {
  console.log('[Supabase Test] Testing connection...');
  
  try {
    // Test auth status
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    console.log('[Supabase Test] Session check result:', { session, sessionError });
    
    if (sessionError) {
      console.error('[Supabase Test] Session error:', sessionError);
    } else {
      console.log('[Supabase Test] Session check successful');
    }
    
    console.log('[Supabase Test] Connection test completed');
  } catch (error) {
    console.error('[Supabase Test] Connection test failed:', error);
  }
}

// Run the test if this file is executed directly
if (typeof window !== 'undefined') {
  testSupabaseConnection();
}