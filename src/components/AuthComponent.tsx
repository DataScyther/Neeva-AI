import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { authService, UserProfile } from '../lib/auth';
import { useAppContext } from './AppContext';
import {
  Loader2,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { NeevaLogo } from './NeevaLogo';

import { validateEmail, validatePassword, PasswordValidationResult, EmailValidationResult } from '../utils/validation';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';
import '../styles/auth-glassmorphism.css';

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
      <div className="auth-page">
        <div className="auth-card" style={{ marginTop: '25vh' }}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="auth-loading-card"
          >
            <div className="auth-loading-spinner">
              <Loader2 className="h-7 w-7 animate-spin" />
            </div>
            <h2 className="auth-loading-title">
              {authCompleted ? `Welcome back${user?.name ? `, ${user.name}` : ''}!` : 'Authenticating...'}
            </h2>
            <p className="auth-loading-sub">
              {authCompleted ? 'Preparing your wellness experience...' : 'Please wait while we verify your identity...'}
            </p>
            {isMobile && (
              <p className="auth-loading-mobile-hint">
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
    <div className="auth-page">
      
      {/* ── Frosted Glass Navigation Bar ── */}
      <nav className="auth-nav">
        <span className="auth-nav__brand">Neeva AI</span>
        <ul className="auth-nav__links">
          <li><button className="auth-nav__link">Features</button></li>
          <li><button className="auth-nav__link">About</button></li>
          <li><button className="auth-nav__link">Support</button></li>
        </ul>
        <button
          className="auth-nav__signup-btn"
          onClick={() => {
            setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
            setError(null);
            setForgotPasswordSent(false);
            if (authMode === 'signin') setName('');
          }}
        >
          {authMode === 'signin' ? 'Sign Up' : 'Sign In'}
        </button>
      </nav>

      {/* ── Frosted Glass Auth Card ── */}
      <div className="auth-card">

        {/* Logo at top center */}
        <div className="auth-logo-wrap">
          <div className="auth-logo-orb-container">
            <motion.div
              className="absolute rounded-full"
              style={{ width: 88, height: 88, background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)' }}
              animate={{ scale: [1, 1.22, 1], opacity: [0.6, 0.2, 0.6] }}
              transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute rounded-full"
              style={{ width: 72, height: 72, border: '1px solid rgba(167,139,250,0.25)' }}
              animate={{ rotate: 360, scale: [1, 1.06, 1] }}
              transition={{ rotate: { duration: 8, repeat: Infinity, ease: 'linear' }, scale: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' } }}
            />
            <motion.div
              animate={{ scale: [1, 1.07, 1], filter: ['drop-shadow(0 0 8px rgba(139,92,246,0.35))', 'drop-shadow(0 0 18px rgba(139,92,246,0.6))', 'drop-shadow(0 0 8px rgba(139,92,246,0.35))'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <NeevaLogo size="xl" breathe glow />
            </motion.div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={authMode}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Heading */}
            <div className="auth-heading">
              <h2 className="auth-heading__title">{activeCopy.title}</h2>
              <p className="auth-heading__subtitle">{activeCopy.description}</p>
            </div>

              <div className="space-y-6">
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className="glass-alert-error">
                        <AlertTriangle className="h-4 w-4" />
                        <span>{error}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Forgot Password Success State */}
                {forgotPasswordSent ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="glass-success-block">
                      <div className="glass-success-icon">
                        <CheckCircle className="w-8 h-8" />
                      </div>
                      <h3 className="auth-heading__title" style={{ fontSize: '1.5rem' }}>Check Your Email</h3>
                      <p className="auth-heading__subtitle" style={{ fontSize: '1rem', marginTop: '0.5rem' }}>
                        We've sent a secure reset link to<br/><strong style={{ color: '#1e1b3a' }}>{email}</strong>
                      </p>
                      <p style={{ fontSize: '0.8125rem', color: 'rgba(55,48,80,0.5)', marginTop: '1rem' }}>
                        Click the link in the email to reset your password. The link will expire in 1 hour.
                      </p>
                      <button
                        className="glass-btn-ghost"
                        style={{ marginTop: '2rem' }}
                        onClick={() => {
                          setForgotPasswordSent(false);
                          setAuthMode('signin');
                          setError(null);
                        }}
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Sign In
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <>
                    {/* Forgot Password Mode */}
                    {authMode === 'forgot' ? (
                      <div>
                        <div className="glass-input-group">
                          <label htmlFor="email" className="glass-input-label">Email Address</label>
                          <input
                            id="email"
                            type="email"
                            placeholder="your.email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                            className="glass-input"
                            autoComplete="email"
                            autoCapitalize="none"
                            autoCorrect="off"
                            inputMode="email"
                          />
                        </div>

                        <button
                          className="glass-btn-primary"
                          onClick={handleForgotPassword}
                          disabled={isLoading || !email}
                        >
                          {isLoading ? (
                            <><Loader2 className="w-4 h-4 animate-spin" />Sending...</>
                          ) : (
                            'Send Reset Email'
                          )}
                        </button>

                        <button
                          className="glass-btn-ghost"
                          style={{ marginTop: '0.75rem' }}
                          onClick={() => {
                            setAuthMode('signin');
                            setError(null);
                            setForgotPasswordSent(false);
                          }}
                          disabled={isLoading}
                        >
                          <ArrowLeft className="w-4 h-4" />
                          Back to Sign In
                        </button>
                      </div>
                    ) : (
                      /* Sign In / Sign Up Form */
                      <div>
                        <AnimatePresence>
                          {authMode === 'signup' && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              style={{ overflow: 'hidden' }}
                            >
                              <div className="glass-input-group">
                                <label htmlFor="name" className="glass-input-label">Full Name</label>
                                <input
                                  id="name"
                                  type="text"
                                  placeholder="John Doe"
                                  value={name}
                                  onChange={(e) => setName(e.target.value)}
                                  disabled={isLoading}
                                  className="glass-input"
                                  autoComplete="name"
                                  autoCapitalize="words"
                                  inputMode="text"
                                />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="glass-input-group">
                          <label htmlFor="email" className="glass-input-label">Email Address</label>
                          <input
                            id="email"
                            type="email"
                            placeholder="your.email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                            className={`glass-input ${
                              emailValidation && !emailValidation.isValid
                                ? 'glass-input--error'
                                : emailValidation && emailValidation.isValid
                                ? 'glass-input--success'
                                : ''
                            }`}
                            autoComplete="email"
                            autoCapitalize="none"
                            autoCorrect="off"
                            inputMode="email"
                          />
                          {emailValidation && !emailValidation.isValid && (
                            <div className="glass-validation glass-validation--error">
                              <AlertTriangle className="w-3 h-3" />
                              <span>{emailValidation.error}</span>
                            </div>
                          )}
                          {emailSuggestion && (
                            <div className="glass-validation glass-validation--info">
                              <Info className="w-3 h-3" />
                              <button
                                type="button"
                                onClick={() => {
                                  const suggestion = emailSuggestion.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
                                  if (suggestion) setEmail(suggestion[1]);
                                }}
                                style={{ textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit', color: 'inherit' }}
                              >
                                {emailSuggestion}
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="glass-input-group">
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <label htmlFor="password" className="glass-input-label" style={{ marginBottom: 0 }}>Password</label>
                            {authMode === 'signin' && (
                              <button
                                type="button"
                                onClick={() => setAuthMode('forgot')}
                                className="auth-forgot-link"
                                disabled={isLoading}
                              >
                                Forgot Password?
                              </button>
                            )}
                          </div>
                          <div className="glass-input-wrap">
                            <input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your secure password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              disabled={isLoading}
                              className="glass-input glass-input--password"
                              autoComplete={authMode === 'signin' ? 'current-password' : 'new-password'}
                              autoCapitalize="none"
                              autoCorrect="off"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="glass-password-toggle"
                              disabled={isLoading}
                              aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                          {authMode === 'signup' && showPasswordRequirements && (
                            <div className="glass-pw-strength">
                              <PasswordStrengthIndicator
                                validation={passwordValidation}
                                password={password}
                              />
                            </div>
                          )}
                        </div>

                        {/* Remember me + Forgot (visual only for signin) */}
                        {authMode === 'signin' && (
                          <div className="auth-options-row">
                            <label className="auth-remember">
                              <input type="checkbox" />
                              <span className="auth-remember__label">Remember me</span>
                            </label>
                          </div>
                        )}

                        <button
                          className="glass-btn-primary"
                          onClick={authMode === 'signin' ? handleEmailSignIn : handleEmailSignUp}
                          disabled={isLoading || !formValid}
                        >
                          {isLoading ? (
                            <><Loader2 className="w-4 h-4 animate-spin" />{authMode === 'signin' ? 'Authenticating...' : 'Creating account...'}</>
                          ) : (
                            authMode === 'signin' ? 'Sign In to Neeva' : 'Create Account'
                          )}
                        </button>

                        {!formValid && (
                          <div className="glass-form-hint">
                            {authMode === 'signin' && 'Please enter your email and password'}
                            {authMode === 'signup' && 'Please fill all fields to continue'}
                          </div>
                        )}

                        {/* Divider */}
                        <div className="auth-divider">
                          <span className="auth-divider__line" />
                          <span className="auth-divider__text">OR</span>
                          <span className="auth-divider__line" />
                        </div>

                        {/* OAuth Grid */}
                        <div className="auth-oauth-grid">
                          <button
                            type="button"
                            className="glass-btn-social"
                            onClick={handleGoogleSignIn}
                            disabled={isLoading || isAuthenticating}
                            data-google-signin
                          >
                            <svg className="w-7 h-7" viewBox="0 0 24 24">
                              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            <span>Google</span>
                          </button>

                          <button
                            type="button"
                            className="glass-btn-social"
                            onClick={() => {}}
                            disabled={isLoading || isAuthenticating}
                          >
                            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.15 2.95.97 3.67 2.06-3.32 1.93-2.61 5.92.51 7.15-.71 1.76-1.53 3.32-2.83 4.8zm-3.33-14.73c.69-1.02 1.17-2.43 1.05-3.83-1.43.1-3.03.9-3.9 1.93-.72.86-1.31 2.31-1.15 3.68 1.48.16 2.99-.75 4-1.78z" />
                            </svg>
                            <span>Apple</span>
                          </button>

                          <button
                            type="button"
                            className="glass-btn-social"
                            onClick={() => {}}
                            disabled={isLoading || isAuthenticating}
                          >
                            <svg className="w-6 h-6" viewBox="0 0 24 24">
                              <path fill="#F25022" d="M11.4 21.8H0V10.4h11.4v11.4zm0-12.4H0V-2h11.4v11.4zm12.4 12.4H12.4V10.4h11.4v11.4zm0-12.4H12.4V-2h11.4v11.4z" transform="translate(0 2)" />
                            </svg>
                            <span>Microsoft</span>
                          </button>
                        </div>

                        {/* Footer links */}
                        <div className="auth-footer-links">
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
                            className="auth-guest-link"
                          >
                            Explore as Guest
                          </button>
                          
                          <p className="auth-switch-text">
                            {authMode === 'signin' ? "Don't have an account? " : "Already have an account? "}
                            <button
                              type="button"
                              onClick={() => {
                                setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
                                setError(null);
                                setForgotPasswordSent(false);
                                if (authMode === 'signin') setName('');
                              }}
                              className="auth-switch-btn"
                              disabled={isLoading}
                            >
                              {authMode === 'signin' ? 'Sign up' : 'Sign in'}
                            </button>
                          </p>
                        </div>

                      </div>
                    )}
                  </>
                )}

              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* Footer Terms */}
          <div className="auth-terms">
            <p>
              By continuing, you agree to Neeva's{' '}
              <a href="#">Terms of Service</a>
              {' '}and{' '}
              <a href="#">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
  );
};

export default AuthComponent;
