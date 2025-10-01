import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase/client';
import { useAppContext } from './AppContext';

const AuthCallbackHandler: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { dispatch } = useAppContext();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the URL hash parameters
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        
        // Check if there's an error in the callback
        const error = params.get('error');
        const errorDescription = params.get('error_description');
        
        if (error) {
          throw new Error(`Authentication error: ${error}${errorDescription ? ` - ${errorDescription}` : ''}`);
        }
        
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        const tokenType = params.get('token_type');
        
        if (accessToken && refreshToken && tokenType) {
          // Set the session in Supabase
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          
          if (sessionError) {
            throw new Error(`Failed to set session: ${sessionError.message}`);
          }
          
          // Get the user data
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          
          if (userError) {
            throw new Error(`Failed to get user: ${userError.message}`);
          }
          
          if (user) {
            // Update the app context with user data
            dispatch({
              type: 'SET_USER',
              payload: {
                id: user.id,
                email: user.email || '',
                name: user.user_metadata?.name || 'User',
              },
            });
            
            // Clear the hash from the URL
            window.history.replaceState({}, document.title, window.location.pathname);
            
            // Redirect to the dashboard by updating app state
            // The app will automatically switch to the dashboard view when user is set
          } else {
            throw new Error('No user data received');
          }
        } else {
          // If no tokens and no errors, redirect to login by clearing user state
          dispatch({ type: 'SET_USER', payload: null });
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred during authentication');
      } finally {
        setLoading(false);
      }
    };
    
    handleAuthCallback();
  }, [dispatch]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Processing authentication...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-r from-red-500 to-orange-600 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-red-600">
              Authentication Error
            </h1>
            <p className="text-muted-foreground mt-2">
              We're sorry, but something went wrong during authentication.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Error Details</h2>
            <div className="bg-gray-100 p-4 rounded-md mb-4">
              <p className="text-sm text-gray-700">
                {error}
              </p>
            </div>
            <button 
              onClick={() => {
                dispatch({ type: 'SET_USER', payload: null });
                window.history.replaceState({}, document.title, window.location.pathname);
              }}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
            >
              Return to Login
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // If no error and not loading, show a success message
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-green-500 to-teal-600 p-3 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-green-600">
          Authentication Successful
        </h1>
        <p className="text-muted-foreground mt-2">
          Redirecting to your dashboard...
        </p>
      </div>
    </div>
  );
};

export default AuthCallbackHandler;
