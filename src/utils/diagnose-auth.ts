import { supabase } from '../lib/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export const diagnoseAuth = async () => {
  console.log('=== Supabase Authentication Diagnostic ===');
  console.log('Project ID:', projectId);
  console.log('Public Anon Key:', publicAnonKey ? 'Present' : 'Missing');
  console.log('Supabase URL: https://' + projectId + '.supabase.co');
  
  // Test connection
  try {
    console.log('\n--- Testing connection ---');
    const { data, error } = await supabase.rpc('now'); // Simple RPC call
    if (error) {
      console.error('Connection test failed:', error);
    } else {
      console.log('Connection test successful');
    }
  } catch (error) {
    console.error('Connection test error:', error);
  }
  
  // Test auth settings
  try {
    console.log('\n--- Testing auth settings ---');
    // This will help us see what auth settings are configured
    console.log('Auth settings:', supabase.auth);
  } catch (error) {
    console.error('Auth settings error:', error);
  }
  
  console.log('\n=== End Diagnostic ===');
};