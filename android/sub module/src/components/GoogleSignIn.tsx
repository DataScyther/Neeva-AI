// Real Google Sign-In Component for actual Gmail account integration
import React, { useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Chrome } from 'lucide-react';

// Google Sign-In types
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: () => void;
          revoke: (email: string, callback: () => void) => void;
        };
      };
    };
  }
}

interface GoogleSignInProps {
  onSuccess: (credentialResponse: any) => void;
  onError: (error: any) => void;
  disabled?: boolean;
  buttonText?: string;
}

export function GoogleSignIn({ 
  onSuccess, 
  onError, 
  disabled = false, 
  buttonText = "Continue with Google" 
}: GoogleSignInProps) {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const demoMode = import.meta.env.VITE_GOOGLE_DEMO_MODE === 'true';

  // Initialize Google Sign-In
  useEffect(() => {
    if (!googleClientId) {
      console.error('Google Client ID not found. Please set VITE_GOOGLE_CLIENT_ID in your .env file');
      return;
    }

    // Load Google Sign-In script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      if (window.google) {
        try {
          window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: handleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
            use_fedcm_for_prompt: false, // Disable FedCM to avoid the error
            ux_mode: 'popup', // Force popup mode instead of FedCM
          });
          console.log('Google Sign-In initialized successfully');
        } catch (error) {
          console.warn('Google Sign-In initialization failed, will use popup fallback:', error);
        }
      }
    };

    script.onerror = () => {
      console.error('Failed to load Google Sign-In script');
      onError(new Error('Failed to load Google Sign-In'));
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup
      const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [googleClientId, onError]);

  // Handle Google credential response
  const handleCredentialResponse = useCallback(async (response: any) => {
    try {
      if (response.credential) {
        // Decode the JWT token to get user info
        const userInfo = parseJwt(response.credential);
        console.log('Google Sign-In Success:', userInfo);
        
        // Call the success callback with user info
        onSuccess({
          credential: response.credential,
          userInfo: userInfo
        });
      } else {
        throw new Error('No credential received from Google');
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      onError(error);
    }
  }, [onSuccess, onError]);

  // Parse JWT token to extract user information
  const parseJwt = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing JWT:', error);
      return null;
    }
  };

  // Handle button click - trigger Google Sign-In popup
  const handleGoogleSignIn = useCallback(() => {
    if (!window.google) {
      console.warn('Google Sign-In not initialized, using popup fallback');
      handleGoogleSignInPopup();
      return;
    }

    try {
      // Try using the standard Google Sign-In prompt first
      window.google.accounts.id.prompt();
    } catch (error) {
      console.warn('Standard Google prompt failed, using popup fallback:', error);
      // Fallback to popup method if GSI prompt fails
      handleGoogleSignInPopup();
    }
  }, [onError]);

  // Alternative: Create a custom popup for more control
  const handleGoogleSignInPopup = useCallback(() => {
    if (!googleClientId) {
      onError(new Error('Google Client ID not configured'));
      return;
    }

    const redirectUri = window.location.origin + '/auth/google/callback';
    const scope = 'openid email profile';
    const responseType = 'code';
    const state = Math.random().toString(36).substring(7); // Random state for CSRF protection

    // Build Google OAuth URL
    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    googleAuthUrl.searchParams.append('client_id', googleClientId);
    googleAuthUrl.searchParams.append('redirect_uri', redirectUri);
    googleAuthUrl.searchParams.append('scope', scope);
    googleAuthUrl.searchParams.append('response_type', responseType);
    googleAuthUrl.searchParams.append('state', state);
    googleAuthUrl.searchParams.append('access_type', 'offline');
    googleAuthUrl.searchParams.append('prompt', 'consent');

    // Open popup window
    const popup = window.open(
      googleAuthUrl.toString(),
      'google-signin',
      'width=500,height=600,scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=no,directories=no,status=no'
    );

    if (!popup) {
      onError(new Error('Popup blocked. Please allow popups for this site.'));
      return;
    }

    // Listen for popup messages
    const messageListener = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
        popup.close();
        onSuccess(event.data.credential);
        window.removeEventListener('message', messageListener);
      } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
        popup.close();
        onError(new Error(event.data.error));
        window.removeEventListener('message', messageListener);
      }
    };

    window.addEventListener('message', messageListener);

    // Check if popup was closed manually
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        window.removeEventListener('message', messageListener);
      }
    }, 1000);
  }, [googleClientId, onSuccess, onError]);

  if (!googleClientId || googleClientId.includes('demo_client_id')) {
    return (
      <Button
        type="button"
        variant="outline"
        className="w-full hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-200"
        onClick={() => {
          // Demo mode - simulate successful Google sign-in
          const demoUser = {
            sub: 'demo_user_123',
            email: 'demo@gmail.com',
            name: 'Demo Google User',
            picture: 'https://lh3.googleusercontent.com/a/default-user',
            email_verified: true,
            given_name: 'Demo',
            family_name: 'User'
          };
          
          const mockCredential = {
            userInfo: demoUser
          };
          
          onSuccess(mockCredential);
        }}
        disabled={disabled}
      >
        <Chrome className="w-4 h-4 mr-2 text-blue-500" />
        {demoMode ? "Demo: Continue with Google" : "Configure Google OAuth"}
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-200"
      onClick={handleGoogleSignIn}
      disabled={disabled}
    >
      <Chrome className="w-4 h-4 mr-2 text-blue-500" />
      {buttonText}
    </Button>
  );
}

// Helper component for Google Sign-In with custom styling
export function GoogleSignInCustom({ 
  onSuccess, 
  onError, 
  disabled = false 
}: GoogleSignInProps) {
  return (
    <GoogleSignIn
      onSuccess={onSuccess}
      onError={onError}
      disabled={disabled}
      buttonText="Sign in with Google"
    />
  );
}

export default GoogleSignIn;

// Demo Mode Status Component
export function GoogleAuthStatus() {
  const demoMode = import.meta.env.VITE_GOOGLE_DEMO_MODE === 'true';
  const hasRealCredentials = import.meta.env.VITE_GOOGLE_CLIENT_ID &&
                             !import.meta.env.VITE_GOOGLE_CLIENT_ID?.includes('demo_client_id');

  if (hasRealCredentials) {
    return (
      <div className="text-xs text-green-600 dark:text-green-400 mt-2 text-center">
        ✅ Real Google OAuth configured
      </div>
    );
  }

  if (demoMode) {
    return (
      <div className="text-xs text-blue-600 dark:text-blue-400 mt-2 text-center">
        🔵 Demo mode: Click button to test Google sign-in flow
      </div>
    );
  }

  return (
    <div className="text-xs text-orange-600 dark:text-orange-400 mt-2 text-center">
      ⚠️ Configure Google OAuth for real Gmail authentication
    </div>
  );
}
