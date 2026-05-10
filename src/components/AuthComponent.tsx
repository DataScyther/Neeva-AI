import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Sparkles,
  User,
  Loader2,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { NeevaOrb } from './NeevaOrb';

import { Alert, AlertDescription } from './ui/alert';
import { validateEmail, validatePassword, PasswordValidationResult, EmailValidationResult } from '../utils/validation';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';
import '../styles/auth-luxury.css';

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
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authCompleted, setAuthCompleted] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidationResult | null>(null);
  const [emailValidation, setEmailValidation] = useState<EmailValidationResult | null>(null);
  const [emailSuggestion, setEmailSuggestion] = useState<string>('');
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [formValid, setFormValid] = useState(false);

  const { dispatch } = useAppContext();
  
  // Mobile detection
  const isMobile = typeof window !== 'undefined' && 
    ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  useEffect(() => {
    console.log('AuthComponent: Setting up auth state listener');
    
    let authTimeout: ReturnType<typeof setTimeout>;
    let isSubscribed = true;

    // Listen to auth state changes
    const unsubscribe = authService.onAuthStateChange((firebaseUser) => {
      if (!isSubscribed) return;
      
      console.log('AuthComponent: Auth state changed:', {
        firebaseUser: firebaseUser ? {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName
        } : null,
        currentProfile: authService.getCurrentUserProfile(),
        isAuthenticating,
        authCompleted
      });

      if (firebaseUser && isAuthenticating) {
        const profile = authService.getCurrentUserProfile();
        console.log('AuthComponent: User authenticated, profile:', profile);
        
        if (profile) {
          // Clear any existing timeout
          if (authTimeout) clearTimeout(authTimeout);
          
          // Mobile-optimized auth completion
          const completeAuth = () => {
            if (!isSubscribed) return;
            
            setUser(profile);
            setAuthCompleted(true);
            setIsAuthenticating(false);
            
            // Update app context
            dispatch({
              type: 'SET_USER',
              payload: profile,
            });
            
            console.log('AuthComponent: Auth completed, triggering callback');
            
            // Trigger callback immediately
            if (onAuthSuccess) {
              onAuthSuccess();
            }
          };
          
          // On mobile, add a small delay to ensure Firebase auth is fully synced
          if (isMobile) {
            console.log('Mobile device: Adding 300ms delay for auth sync');
            authTimeout = setTimeout(completeAuth, 300);
          } else {
            completeAuth();
          }
        } else {
          // If profile is not ready yet, retry after a short delay
          console.log('Profile not ready, retrying...');
          authTimeout = setTimeout(() => {
            const retryProfile = authService.getCurrentUserProfile();
            if (retryProfile && isSubscribed) {
              setUser(retryProfile);
              setAuthCompleted(true);
              setIsAuthenticating(false);
              dispatch({
                type: 'SET_USER',
                payload: retryProfile,
              });
              if (onAuthSuccess) {
                onAuthSuccess();
              }
            }
          }, 500);
        }
      } else if (firebaseUser && authCompleted) {
        // Already completed, just ensure callback is triggered
        console.log('AuthComponent: Already completed, ensuring callback');
        if (onAuthSuccess) {
          onAuthSuccess();
        }
      } else if (!firebaseUser && isAuthenticating) {
        // Auth failed, reset state
        console.log('AuthComponent: Auth failed, resetting state');
        setIsAuthenticating(false);
        setAuthCompleted(false);
      }
    });

    return () => {
      isSubscribed = false;
      if (authTimeout) clearTimeout(authTimeout);
      unsubscribe();
    };
  }, [dispatch, onAuthSuccess, isAuthenticating, authCompleted, isMobile]);

  // Add a fallback timeout to prevent infinite loading states
  useEffect(() => {
    if (isAuthenticating) {
      const fallbackTimeout = setTimeout(() => {
        console.log('AuthComponent: Fallback timeout reached, forcing auth completion');
        setIsAuthenticating(false);
        setAuthCompleted(true);
        
        // Try to get the current user profile
        const currentProfile = authService.getCurrentUserProfile();
        if (currentProfile) {
          setUser(currentProfile);
          dispatch({
            type: 'SET_USER',
            payload: currentProfile,
          });
          if (onAuthSuccess) {
            onAuthSuccess();
          }
        } else {
          // If no profile, reset to allow retry
          setError('Authentication timed out. Please try again.');
        }
      }, 10000); // 10 second fallback

      return () => clearTimeout(fallbackTimeout);
    }
  }, [isAuthenticating, dispatch, onAuthSuccess]);

  // Real-time password validation
  useEffect(() => {
    if (password) {
      const validation = validatePassword(password, email, name);
      setPasswordValidation(validation);
      setShowPasswordRequirements(true);
    } else {
      setPasswordValidation(null);
      setShowPasswordRequirements(false);
    }
  }, [password, email, name]);

  // Check if form is valid for submission
  useEffect(() => {
    if (authMode === 'signin') {
      const emailValid = email.trim().length > 0;
      const passwordValid = password.trim().length > 0;
      setFormValid(emailValid && passwordValid);
    } else if (authMode === 'signup') {
      const nameValid = name.trim().length >= 2;
      const emailValid = email.trim().length > 0;
      const passwordValid = password.trim().length >= 6;
      setFormValid(nameValid && emailValid && passwordValid);
    } else {
      // Forgot password mode
      const emailValid = email.trim().length > 0;
      setFormValid(emailValid);
    }
  }, [authMode, name, email, password]);

  const handleEmailSignIn = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const emailVal = validateEmail(email);
    if (!emailVal.isValid) {
      setError(emailVal.error || 'Please enter a valid email address');
      return;
    }

    // For sign-in, we don't enforce all password rules, just check if it's not empty
    if (password.length < 6) {
      setError('Invalid email or password');
      return;
    }

    setIsLoading(true);
    setIsAuthenticating(true);
    setError(null);

    try {
      console.log('Starting email sign-in...');
      const userProfile = await authService.signInWithEmail(email, password);
      console.log('Email sign-in successful:', userProfile);
      
      // Don't set loading to false here, let the auth listener handle it
      // Auth success will be handled by the useEffect listener
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
      setIsAuthenticating(false);
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

    const emailVal = validateEmail(email);
    if (!emailVal.isValid) {
      setError(emailVal.error || 'Please enter a valid email address');
      return;
    }

    const passwordVal = validatePassword(password, email, name);
    if (!passwordVal.isValid) {
      setError(passwordVal.errors[0] || 'Password does not meet security requirements');
      return;
    }

    if (passwordVal.strength === 'weak') {
      setError('Please choose a stronger password');
      return;
    }

    setIsLoading(true);
    setIsAuthenticating(true);
    setError(null);

    try {
      console.log('Starting email sign-up...');
      const userProfile = await authService.signUpWithEmail(email, password, name.trim());
      console.log('Email sign-up successful:', userProfile);
      
      // Don't set loading to false here, let the auth listener handle it
      // Auth success will be handled by the useEffect listener
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
      setIsAuthenticating(false);
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    const emailVal = validateEmail(email);
    if (!emailVal.isValid) {
      setError(emailVal.error || 'Please enter a valid email address');
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
    setIsAuthenticating(true);
    setError(null);

    try {
      console.log('Starting Google sign-in process...');
      
      // Prevent double-tap on mobile
      if (isMobile) {
        // Disable the button temporarily
        const googleButton = document.querySelector('[data-google-signin]');
        if (googleButton) {
          (googleButton as HTMLButtonElement).disabled = true;
        }
      }
      
      const userProfile = await authService.signInWithGoogle();
      console.log('Google sign-in successful:', userProfile);
      
      // Don't set loading to false here, let the auth listener handle it
      // Auth success will be handled by the useEffect listener
    } catch (err) {
      console.error('Google Sign-in error:', err);
      setError(err instanceof Error ? err.message : 'Sign-in failed');
      setIsAuthenticating(false);
      setIsLoading(false);
      
      // Re-enable button on mobile
      if (isMobile) {
        setTimeout(() => {
          const googleButton = document.querySelector('[data-google-signin]');
          if (googleButton) {
            (googleButton as HTMLButtonElement).disabled = false;
          }
        }, 1000);
      }
    }
  };

  // Show loading state during authentication
  if ((isAuthenticating || authCompleted) && !error) {
    return (
      <div className="flex min-h-screen w-full flex-col md:flex-row bg-background">
        <div className="luxury-gradient-bg relative flex flex-1 flex-col items-center justify-center p-8 text-white">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="luxury-glass-overlay z-10 flex w-full max-w-md flex-col items-center justify-center rounded-2xl py-12 text-center shadow-2xl"
          >
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 shadow-xl backdrop-blur-md">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-white">
              {authCompleted ? `Welcome back${user?.name ? `, ${user.name}` : ''}!` : 'Authenticating...'}
            </h2>
            <p className="text-white/80">
              {authCompleted ? 'Preparing your luxury experience...' : 'Please wait while we verify your identity...'}
            </p>
            {isMobile && (
              <p className="mt-4 text-xs text-white/60">
                This may take a moment on mobile devices
              </p>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  const copy = {
    signin: {
      title: 'Welcome Back',
      description: 'Enter your credentials to access your personal AI space.'
    },
    signup: {
      title: 'Join Neeva',
      description: 'Unlock your premium personal companion today.'
    },
    forgot: {
      title: 'Reset Password',
      description: 'Enter your email to receive a secure reset link.'
    }
  };

  const activeCopy = copy[authMode];

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row bg-background">
      
      {/* Left Pane - Animated Gradient Branding */}
      <div className="luxury-gradient-bg relative hidden flex-1 md:flex" />

      {/* Right Pane - Auth Form */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-12 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-md">

          {/* ── Logo Header: Visible on ALL screen sizes ── */}
          <div className="mb-8 flex flex-col items-center text-center">
            {/* Optical-flow orb — layered pulse + orbit ring + shimmer */}
            <div className="relative mb-5 flex items-center justify-center">
              {/* Outermost slow-pulse glow ring */}
              <motion.div
                className="absolute rounded-full"
                style={{ width: 88, height: 88, background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)' }}
                animate={{ scale: [1, 1.22, 1], opacity: [0.6, 0.2, 0.6] }}
                transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
              />
              {/* Mid orbit ring — rotates slowly */}
              <motion.div
                className="absolute rounded-full border border-violet-400/25"
                style={{ width: 72, height: 72 }}
                animate={{ rotate: 360, scale: [1, 1.06, 1] }}
                transition={{ rotate: { duration: 8, repeat: Infinity, ease: 'linear' }, scale: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' } }}
              />
              {/* Inner fast shimmer ring */}
              <motion.div
                className="absolute rounded-full border border-pink-400/20"
                style={{ width: 58, height: 58 }}
                animate={{ rotate: -360, opacity: [0.4, 1, 0.4] }}
                transition={{ rotate: { duration: 5, repeat: Infinity, ease: 'linear' }, opacity: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' } }}
              />
              {/* The actual orb — breathing scale */}
              <motion.div
                animate={{ scale: [1, 1.07, 1], filter: ['drop-shadow(0 0 8px rgba(139,92,246,0.35))', 'drop-shadow(0 0 18px rgba(139,92,246,0.6))', 'drop-shadow(0 0 8px rgba(139,92,246,0.35))'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <NeevaOrb size="md" animated={false} />
              </motion.div>
            </div>

            {/* Wordmark */}
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-2xl font-bold tracking-tight bg-gradient-to-r from-fuchsia-700 via-violet-600 to-blue-600 dark:from-pink-400 dark:via-violet-400 dark:to-blue-400 bg-clip-text text-transparent"
              style={{ fontFamily: 'Outfit, Inter, sans-serif' }}
            >
              Neeva AI
            </motion.h1>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={authMode}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <div className="mb-8 space-y-2 text-center md:text-left">
                <h2 className="text-3xl font-bold tracking-tight text-foreground">
                  {activeCopy.title}
                </h2>
                <p className="text-muted-foreground">
                  {activeCopy.description}
                </p>
              </div>

              <div className="space-y-6">
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <Alert variant="destructive" className="mb-4 border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-400">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Forgot Password Success State */}
                {forgotPasswordSent ? (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="text-center space-y-6 py-8"
                  >
                    <div className="mx-auto w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20 shadow-lg shadow-green-500/10">
                      <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-semibold text-foreground">Check Your Email</h3>
                      <p className="text-muted-foreground text-lg">
                        We've sent a secure reset link to <br/><strong className="text-foreground">{email}</strong>
                      </p>
                      <p className="text-sm text-muted-foreground/80 mt-4">
                        Click the link in the email to reset your password. The link will expire in 1 hour.
                      </p>
                      <Button
                        variant="outline"
                        className="w-full mt-8 h-12 text-md"
                        onClick={() => {
                          setForgotPasswordSent(false);
                          setAuthMode('signin');
                          setError(null);
                        }}
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Sign In
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <>
                    {/* Forgot Password Mode */}
                    {authMode === 'forgot' ? (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium leading-none text-foreground">Email Address</label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="your.email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                            className="luxury-input h-12"
                            autoComplete="email"
                            autoCapitalize="none"
                            autoCorrect="off"
                            inputMode="email"
                          />
                        </div>

                        <Button
                          className="luxury-button h-12 w-full text-md font-medium"
                          onClick={handleForgotPassword}
                          disabled={isLoading || !email}
                        >
                          {isLoading ? (
                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending...</>
                          ) : (
                            'Send Reset Email'
                          )}
                        </Button>

                        <Button
                          variant="ghost"
                          className="w-full text-muted-foreground hover:text-foreground h-12"
                          onClick={() => {
                            setAuthMode('signin');
                            setError(null);
                            setForgotPasswordSent(false);
                          }}
                          disabled={isLoading}
                        >
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Back to Sign In
                        </Button>
                      </div>
                    ) : (
                      /* Sign In/Sign Up Form */
                      <div className="space-y-5">
                        <AnimatePresence>
                          {authMode === 'signup' && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="space-y-2 overflow-hidden"
                            >
                              <label htmlFor="name" className="text-sm font-medium leading-none text-foreground">Full Name</label>
                              <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={isLoading}
                                className="luxury-input h-12"
                                autoComplete="name"
                                autoCapitalize="words"
                                inputMode="text"
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium leading-none text-foreground">Email Address</label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="your.email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                            className={`luxury-input h-12 ${
                              emailValidation && !emailValidation.isValid
                                ? 'border-red-500 focus-visible:ring-red-500'
                                : emailValidation && emailValidation.isValid
                                ? 'border-green-500 focus-visible:ring-green-500'
                                : ''
                            }`}
                            autoComplete="email"
                            autoCapitalize="none"
                            autoCorrect="off"
                            inputMode="email"
                          />
                          {/* Email validation feedback */}
                          {emailValidation && !emailValidation.isValid && (
                            <div className="flex items-start gap-1.5 text-xs text-red-500 mt-1">
                              <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                              <span>{emailValidation.error}</span>
                            </div>
                          )}
                          {emailSuggestion && (
                            <div className="flex items-start gap-1.5 text-xs text-blue-500 mt-1">
                              <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                              <button
                                type="button"
                                onClick={() => {
                                  const suggestion = emailSuggestion.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
                                  if (suggestion) setEmail(suggestion[1]);
                                }}
                                className="underline hover:no-underline"
                              >
                                {emailSuggestion}
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label htmlFor="password" className="text-sm font-medium leading-none text-foreground">Password</label>
                            {authMode === 'signin' && (
                              <button
                                type="button"
                                onClick={() => setAuthMode('forgot')}
                                className="text-sm font-medium text-primary hover:underline transition-all"
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
                              placeholder="Enter your secure password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              disabled={isLoading}
                              className="luxury-input h-12 pr-10"
                              autoComplete={authMode === 'signin' ? 'current-password' : 'new-password'}
                              autoCapitalize="none"
                              autoCorrect="off"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 text-muted-foreground hover:text-foreground transition-colors"
                              disabled={isLoading}
                              aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                          {/* Password Strength Indicator for Sign Up */}
                          {authMode === 'signup' && showPasswordRequirements && (
                            <div className="mt-2 p-3 rounded-md bg-secondary/30 border border-border/30">
                              <PasswordStrengthIndicator
                                validation={passwordValidation}
                                password={password}
                              />
                            </div>
                          )}
                        </div>

                        <div className="space-y-4 pt-4">
                          <Button
                            className="luxury-button h-12 w-full text-md font-medium shadow-md shadow-primary/20"
                            onClick={authMode === 'signin' ? handleEmailSignIn : handleEmailSignUp}
                            disabled={isLoading || !formValid}
                          >
                            {isLoading ? (
                              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{authMode === 'signin' ? 'Authenticating...' : 'Creating account...'}</>
                            ) : (
                              authMode === 'signin' ? 'Sign In to Neeva' : 'Create Account'
                            )}
                          </Button>

                          {/* Form validation status message */}
                          {!formValid && (
                            <div className="text-center text-xs text-muted-foreground">
                              {authMode === 'signin' && 'Please enter your email and password'}
                              {authMode === 'signup' && 'Please fill all fields to continue'}
                            </div>
                          )}
                          
                          <div className="relative py-6">
                            <div className="absolute inset-0 flex items-center">
                              <span className="w-full border-t border-border/60" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase tracking-wider">
                              <span className="bg-background px-4 text-muted-foreground font-medium">
                                Or zero-friction sign-in
                              </span>
                            </div>
                          </div>

                          <Button
                            variant="outline"
                            type="button"
                            className="luxury-input h-12 w-full font-medium hover:bg-secondary/50 transition-colors"
                            onClick={handleGoogleSignIn}
                            disabled={isLoading || isAuthenticating}
                            data-google-signin
                          >
                            {isLoading ? (
                              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Signing in...</>
                            ) : (
                              <>
                                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Continue with Google
                              </>
                            )}
                          </Button>
                          
                          <div className="flex flex-col items-center gap-4 pt-4">
                            <button
                              type="button"
                              onClick={() => {
                                const guestProfile: UserProfile = {
                                  uid: `guest-${Date.now()}`,
                                  name: 'Guest User',
                                  email: `guest-${Date.now()}@example.com`,
                                  createdAt: new Date(),
                                  updatedAt: new Date(),
                                  lastLoginAt: new Date(),
                                  preferences: { theme: 'light', notifications: false, language: 'en' },
                                  stats: { totalSessions: 1, totalMinutes: 0, streakDays: 0, lastActivityDate: new Date() },
                                };
                                dispatch({ type: 'SET_USER', payload: guestProfile });
                                if (onAuthSuccess) onAuthSuccess();
                              }}
                              className="text-sm font-medium text-muted-foreground hover:text-foreground underline underline-offset-4 transition-all hover:scale-105"
                            >
                              Explore as Guest
                            </button>
                            
                            <p className="text-sm text-muted-foreground">
                              {authMode === 'signin' ? "Don't have an account? " : "Already have an account? "}
                              <button
                                type="button"
                                onClick={() => {
                                  setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
                                  setError(null);
                                  setForgotPasswordSent(false);
                                  if (authMode === 'signin') setName('');
                                }}
                                className="font-semibold text-primary hover:underline"
                                disabled={isLoading}
                              >
                                {authMode === 'signin' ? 'Sign up' : 'Sign in'}
                              </button>
                            </p>
                          </div>

                        </div>
                      </div>
                    )}
                  </>
                )}

              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* Footer Terms */}
          <div className="mt-12 text-center text-xs text-muted-foreground/80">
            <p>
              By continuing, you agree to Neeva's{' '}
              <a href="#" className="underline hover:text-foreground">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="underline hover:text-foreground">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthComponent;
