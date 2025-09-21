import { supabase } from '../lib/supabase/client';
import { projectId } from '../utils/supabase/info';

// Test Supabase connection
export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    console.log('Supabase URL: https://' + projectId + '.supabase.co');
    
    // Test a simple query to verify connection (using a table that might exist)
    // If you have a specific table you want to test with, replace 'users' with that table name
    const { data, error } = await supabase.from('users').select('id').limit(1);
    
    if (error) {
      console.error('Supabase connection test failed:', error);
      return { success: false, error: error.message };
    }
    
    console.log('Supabase connection test successful');
    return { success: true, data };
  } catch (error) {
    console.error('Supabase connection test error:', error);
    return { success: false, error: error.message };
  }
};