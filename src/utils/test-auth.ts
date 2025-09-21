import { signIn, signUp, signOut } from '../lib/supabase/auth';

// Test authentication functions
export const testAuth = async () => {
  try {
    // Test sign up
    console.log('Testing sign up...');
    const signUpResult = await signUp('test@example.com', 'password123', 'Test User');
    console.log('Sign up result:', signUpResult);
    
    // Test sign in
    console.log('Testing sign in...');
    const signInResult = await signIn('test@example.com', 'password123');
    console.log('Sign in result:', signInResult);
    
    // Test sign out
    console.log('Testing sign out...');
    const signOutResult = await signOut();
    console.log('Sign out result:', signOutResult);
    
    console.log('Authentication tests completed successfully!');
  } catch (error) {
    console.error('Authentication test failed:', error);
  }
};