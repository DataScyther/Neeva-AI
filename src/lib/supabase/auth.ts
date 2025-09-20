import { supabase } from './client'
import { User } from '@supabase/supabase-js'

// Authentication helper functions
export const signUp = async (email: string, password: string, name?: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name || email.split('@')[0],
      },
    },
  })
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    // Refresh the session to ensure we have a valid token
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return null
    }
    
    // Get user with refreshed session
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('Error getting current user:', error)
      // If it's a JWT error, try to refresh the session
      if (error.message.includes('jwt')) {
        const { data: { session }, error: refreshError } = await supabase.auth.refreshSession()
        if (refreshError) {
          console.error('Error refreshing session:', refreshError)
          return null
        }
        if (session?.user) {
          return session.user
        }
      }
      return null
    }
    
    return user
  } catch (error) {
    console.error('Unexpected error getting current user:', error)
    return null
  }
}

export const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
  return { data, error }
}

// New function to handle Google sign in
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  })
  return { data, error }
}

// Function to refresh the session
export const refreshSession = async () => {
  const { data, error } = await supabase.auth.refreshSession()
  return { data, error }
}

// Function to handle auth state changes
export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback)
  return subscription
}