import React, { useState, useEffect } from 'react';
import { authService, UserProfile } from '../lib/auth';
import { useAppContext } from './AppContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import {
  Heart,
  Sparkles,
  User,
  Loader2,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react';

import { Alert, AlertDescription } from './ui/alert';

interface AuthComponentProps {
  onAuthSuccess?: () => void;
}

const AuthComponent: React.FC<AuthComponentProps> = ({ onAuthSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { dispatch } = useAppContext();

  useEffect(() => {
    console.log('AuthComponent: Setting up auth state listener');

    // Listen to auth state changes
    const unsubscribe = authService.onAuthStateChange((firebaseUser) => {
      console.log('AuthComponent: Auth state changed:', {
        firebaseUser: firebaseUser ? {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName
        } : null,
        currentProfile: authService.getCurrentUserProfile()
      });

      if (firebaseUser) {
        const profile = authService.getCurrentUserProfile();
        console.log('AuthComponent: User authenticated, profile:', profile);
        setUser(profile);
        if (profile) {
          // Update app context
          dispatch({
            type: 'SET_USER',
            payload: profile,
          });
          console.log('AuthComponent: Triggering onAuthSuccess callback');
          onAuthSuccess?.();
        }
      } else {
        console.log('AuthComponent: User logged out');
        setUser(null);
      }
    });

    return unsubscribe;
  }, [dispatch, onAuthSuccess]);

  // Email validation
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation
  const isValidPassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const handleEmailSignIn = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!isValidPassword(password)) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const userProfile = await authService.signInWithEmail(email, password);
      setUser(userProfile);
      // onAuthSuccess will be called via the useEffect listener
    } catch (err: any) {
      console.error('Email sign-in error:', err);

      // Handle specific Firebase errors
      let errorMessage = 'Sign-in failed';

      switch (err.code) {
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password. Please try again.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email address.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later.';
          break;
        default:
          errorMessage = err.message || 'An unexpected error occurred';
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignUp = async () => {
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters long');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!isValidPassword(password)) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const userProfile = await authService.signUpWithEmail(email, password, name.trim());
      setUser(userProfile);
      // onAuthSuccess will be called via the useEffect listener
    } catch (err: any) {
      console.error('Email sign-up error:', err);

      // Handle specific Firebase errors
      let errorMessage = 'Sign-up failed';

      switch (err.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'An account with this email already exists.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak. Please choose a stronger password.';
          break;
        default:
          errorMessage = err.message || 'An unexpected error occurred';
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await authService.resetPassword(email);
      setForgotPasswordSent(true);
    } catch (err: any) {
      console.error('Password reset error:', err);

      let errorMessage = 'Failed to send reset email';

      switch (err.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email address.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many requests. Please try again later.';
          break;
        default:
          errorMessage = err.message || 'An unexpected error occurred';
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Starting Google sign-in process...');
      const userProfile = await authService.signInWithGoogle();

      console.log('Google sign-in successful:', userProfile);
      setUser(userProfile);

      // Additional mobile-specific handling
      if (typeof window !== 'undefined' && 'ontouchstart' in window) {
        console.log('Mobile device detected, applying mobile-specific auth handling');

        // Force a page reload on mobile to ensure proper state synchronization
        // This helps with mobile browsers that may cache authentication state
        setTimeout(() => {
          if (authService.getCurrentUserProfile()) {
            console.log('Mobile auth state verified, triggering callback');
            onAuthSuccess?.();
          }
        }, 500);
      } else {
        // onAuthSuccess will be called via the useEffect listener
      }
    } catch (err) {
      console.error('Google Sign-in error:', err);
      setError(err instanceof Error ? err.message : 'Sign-in failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (user) {
    return (
      <Card className="w-full max-w-md mx-auto shadow-xl border border-gray-200 bg-white">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome back, {user.name}!
          </CardTitle>
          <CardDescription>
            Redirecting to your dashboard...
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="min-h-screen min-h-[100dvh] bg-white flex items-center justify-center p-4 overflow-y-auto">
      <Card className="w-full max-w-md mx-auto shadow-xl border border-gray-200 bg-white">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome to Neeva AI
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Your personal mental health companion
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Forgot Password Success State */}
          {forgotPasswordSent ? (
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-900">
                  Check Your Email
                </h3>
                <p className="text-gray-600">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
                <p className="text-sm text-gray-500">
                  Click the link in the email to reset your password. The link will expire in 1 hour.
                </p>
                <Button
                  onClick={() => {
                    setForgotPasswordSent(false);
                    setAuthMode('signin');
                    setError(null);
                  }}
                  variant="outline"
                  className="w-full mt-4"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Sign In
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Forgot Password Mode */}
              {authMode === 'forgot' ? (
                <div className="space-y-4">
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Reset Your Password
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Enter your email address and we'll send you a link to reset your password.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      className="h-12 text-base"
                      autoComplete="email"
                      autoCapitalize="none"
                      autoCorrect="off"
                      inputMode="email"
                    />
                  </div>

                  <Button
                    onClick={handleForgotPassword}
                    disabled={isLoading || !email}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-base font-medium"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Sending Reset Email...
                      </>
                    ) : (
                      'Send Reset Email'
                    )}
                  </Button>

                  <Button
                    onClick={() => {
                      setAuthMode('signin');
                      setError(null);
                      setForgotPasswordSent(false);
                    }}
                    variant="ghost"
                    disabled={isLoading}
                    className="w-full text-sm text-gray-600 hover:text-gray-900"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Sign In
                  </Button>
                </div>
              ) : (
                /* Sign In/Sign Up Form */
                <div className="space-y-4">
                  {authMode === 'signup' && (
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isLoading}
                        className="h-12 text-base"
                        autoComplete="name"
                        autoCapitalize="words"
                        inputMode="text"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      className="h-12 text-base"
                      autoComplete="email"
                      autoCapitalize="none"
                      autoCorrect="off"
                      inputMode="email"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="password" className="text-sm font-medium text-gray-700">
                        Password
                      </label>
                      {authMode === 'signin' && (
                        <button
                          type="button"
                          onClick={() => setAuthMode('forgot')}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                          disabled={isLoading}
                        >
                          Forgot Password?
                        </button>
                      )}
                    </div>
                    <div className="relative flex items-center">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        className="h-12 pr-12 text-base w-full"
                        autoComplete={authMode === 'signin' ? 'current-password' : 'new-password'}
                        autoCapitalize="none"
                        autoCorrect="off"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-6/6 -translate-y-6/6 z-10 flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                        disabled={isLoading}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={authMode === 'signin' ? handleEmailSignIn : handleEmailSignUp}
                      disabled={isLoading || !email || !password || (authMode === 'signup' && !name)}
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-base font-medium"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          {authMode === 'signin' ? 'Signing in...' : 'Creating account...'}
                        </>
                      ) : (
                        authMode === 'signin' ? 'Sign In' : 'Sign Up'
                      )}
                    </Button>

                    <Button
                      onClick={() => {
                        setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
                        setError(null);
                        setForgotPasswordSent(false);
                        // Clear form when switching modes
                        if (authMode === 'signin') {
                          setName('');
                        }
                      }}
                      variant="ghost"
                      disabled={isLoading}
                      className="w-full text-sm text-gray-600 hover:text-gray-900"
                    >
                      {authMode === 'signin'
                        ? "Don't have an account? Sign Up"
                        : "Already have an account? Sign In"}
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="relative">
            <Separator className="my-6" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-white px-3 text-xs text-gray-500 uppercase tracking-wide">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full h-12 bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 shadow-sm text-base font-medium"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </Button>

          <div className="text-center text-sm text-gray-600 space-y-2">
            <p className="flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              Personalized mental health support
            </p>
            <p className="flex items-center justify-center gap-2">
              <Heart className="w-4 h-4 text-red-500" />
              100% confidential and secure
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthComponent;
