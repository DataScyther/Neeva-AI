import { supabase } from './client'
import { User } from '@supabase/supabase-js'

// Enhanced error logging function
const logAuthError = (operation: string, error: any) => {
  console.error(`[Supabase Auth] ${operation} failed:`, {
    message: error.message,
    code: error.code,
    status: error.status,
    details: error
  });
};

// Authentication helper functions
export const signUp = async (email: string, password: string, name?: string) => {
  try {
    // Determine the redirect URL based on environment
    const redirectUrl = `${window.location.origin}/`;
      
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || email.split('@')[0],
        },
        // Email confirmation is enabled by default
        emailRedirectTo: redirectUrl,
      },
    })
    
    if (error) {
      logAuthError('signUp', error);
    }
    
    return { data, error }
  } catch (err) {
    logAuthError('signUp (exception)', err);
    return { data: null, error: err };
  }
}

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) {
      logAuthError('signIn', error);
    }
    
    return { data, error }
  } catch (err) {
    logAuthError('signIn (exception)', err);
    return { data: null, error: err };
  }
}

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      logAuthError('signOut', error);
    }
    
    return { error }
  } catch (err) {
    logAuthError('signOut (exception)', err);
    return { error: err };
  }
}

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    // Refresh the session to ensure we have a valid token
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('Error getting session:', sessionError)
      return null
    }
    
    if (!session) {
      return null
    }
    
    // Get user with refreshed session
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('Error getting current user:', error)
      // If it's a JWT error, try to refresh the session
      if (error.message.includes('jwt') || error.message.includes('expired')) {
        const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession()
        if (refreshError) {
          console.error('Error refreshing session:', refreshError)
          return null
        }
        if (refreshedSession?.user) {
          return refreshedSession.user
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
  try {
    // Determine the redirect URL based on environment
    const redirectUrl = `${window.location.origin}/`;
      
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    })
    
    if (error) {
      logAuthError('resetPassword', error);
    }
    
    return { data, error }
  } catch (err) {
    logAuthError('resetPassword (exception)', err);
    return { data: null, error: err };
  }
}

// New function to handle Google sign in
export const signInWithGoogle = async () => {
  try {
    // Determine the redirect URL based on environment
    const redirectUrl = `${window.location.origin}/`;
      
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        skipBrowserRedirect: false,
      },
    })
    
    if (error) {
      logAuthError('signInWithGoogle', error);
    }
    
    return { data, error }
  } catch (err) {
    logAuthError('signInWithGoogle (exception)', err);
    return { data: null, error: err };
  }
}

// Function to refresh the session
export const refreshSession = async () => {
  try {
    const { data, error } = await supabase.auth.refreshSession()
    
    if (error) {
      logAuthError('refreshSession', error);
    }
    
    return { data, error }
  } catch (err) {
    logAuthError('refreshSession (exception)', err);
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
    
    if (error) {
      logAuthError('updateUserMetadata', error);
    }
    
    return { data, error }
  } catch (err) {
    logAuthError('updateUserMetadata (exception)', err);
    return { data: null, error: err };
  }
}

// Function to update user email
export const updateUserEmail = async (newEmail: string) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      email: newEmail,
    })
    
    if (error) {
      logAuthError('updateUserEmail', error);
    }
    
    return { data, error }
  } catch (err) {
    logAuthError('updateUserEmail (exception)', err);
    return { data: null, error: err };
  }
}

// Function to update user password
export const updatePassword = async (newPassword: string) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    })
    
    if (error) {
      logAuthError('updatePassword', error);
    }
    
    return { data, error }
  } catch (err) {
    logAuthError('updatePassword (exception)', err);
    return { data: null, error: err };
  }
}