import { supabase } from './client'
import { User } from '@supabase/supabase-js'

// Authentication helper functions
export const signUp = async (email: string, password: string, name?: string) => {
  try {
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
  } catch (err) {
    return { data: null, error: err };
  }
}

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    return { data, error }
  } catch (err) {
    return { data: null, error: err };
  }
}

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    
    return { error }
  } catch (err) {
    return { error: err };
  }
}

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('Error getting current user:', error)
      return null
    }
    
    return user
  } catch (error) {
    console.error('Unexpected error getting current user:', error)
    return null
  }
}

export const resetPassword = async (email: string) => {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email)
    
    return { data, error }
  } catch (err) {
    return { data: null, error: err };
  }
}

// Function to handle Google sign in
export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        skipBrowserRedirect: false,
      },
    })
    
    return { data, error }
  } catch (err) {
    return { data: null, error: err };
  }
}

// Function to refresh the session
export const refreshSession = async () => {
  try {
    const { data, error } = await supabase.auth.refreshSession()
    
    return { data, error }
  } catch (err) {
    return { data: null, error: err };
  }
}

// Function to handle auth state changes
export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback)
  return subscription
}

// Function to update user metadata
export const updateUserMetadata = async (metadata: object) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      data: metadata,
    })
    
    return { data, error }
  } catch (err) {
    return { data: null, error: err };
  }
}

// Function to update user email
export const updateUserEmail = async (newEmail: string) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      email: newEmail,
    })
    
    return { data, error }
  } catch (err) {
    return { data: null, error: err };
  }
}

// Function to update user password
export const updatePassword = async (newPassword: string) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    })
    
    return { data, error }
  } catch (err) {
    return { data: null, error: err };
  }
}