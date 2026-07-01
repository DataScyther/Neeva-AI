import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { Mail, Lock, AlertCircle } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { useAuth } from '@/shared/hooks/useAuth';
import { authService } from '@/services/auth';
import type { UserProfile } from '@/services/auth/types';
import { analyticsService } from '@/services/analytics';
import { useAppStore } from '@/core/store/useAppStore';

import { Button } from '@/shared/components/Button';
import { TextField } from '@/shared/components/TextField';
import { PasswordField } from '@/shared/components/PasswordField';
import { GoogleSignInButton } from '@/features/auth/components/GoogleSignInButton';
import { loginSchema, type LoginFormData } from '@/features/auth/validators';
import { AUTH_STRINGS } from '@/features/auth/constants';

const { width } = Dimensions.get('window');

const FacebookIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path
      fill="#1877F2"
      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
    />
  </Svg>
);

export function LoginScreen() {
  const router = useRouter();
  const {
    login,
    loading,
    error,
    clearError,
    isAuthenticated,
    emailVerified,
    onboardingCompleted,
  } = useAuth();

  const addToast = useAppStore((state) => state.addToast);
  const setUser = useAppStore((state) => state.setUser);
  const setEmailVerified = useAppStore((state) => state.setEmailVerified);
  const setOnboardingCompleted = useAppStore((state) => state.setOnboardingCompleted);

  const [googleLoading, setGoogleLoading] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);
  const hasNavigated = useRef(false);

  const { control, handleSubmit, formState } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { errors, isValid } = formState;

  useEffect(() => {
    if (isAuthenticated && !hasNavigated.current) {
      hasNavigated.current = true;

      if (!emailVerified) {
        router.replace('/auth/email-verification');
      } else if (!onboardingCompleted) {
        router.replace('/onboarding');
      } else {
        router.replace('/(tabs)');
      }
    }
  }, [isAuthenticated, emailVerified, onboardingCompleted, router]);

  const onSubmit = useCallback(
    async (data: LoginFormData) => {
      try {
        clearError();
        analyticsService.trackEvent('login_attempt');
        await login(data.email, data.password);
        analyticsService.trackEvent('login_success');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Login failed';
        analyticsService.trackEvent('login_failed', { reason: message });
      }
    },
    [login, clearError]
  );

  const handleGoogleSignIn = useCallback(async () => {
    setGoogleLoading(true);
    clearError();
    analyticsService.trackEvent('login_attempt', { action: 'google' });
    try {
      if (Platform.OS !== 'web') {
        addToast({
          type: 'error',
          message: 'Google Sign-In is not configured for mobile yet. Please use email/password.',
        });
        return;
      }
      await authService.signInWithGoogle();
      analyticsService.trackEvent('login_success', { method: 'google' });
    } catch (err: any) {
      if (err?.message?.includes('Redirecting')) return;
      const msg = err instanceof Error ? err.message : 'Google sign-in failed';
      analyticsService.trackEvent('login_failed', { reason: msg });
      addToast({
        type: 'error',
        message: msg,
      });
    } finally {
      setGoogleLoading(false);
    }
  }, [clearError, addToast]);

  const handleFacebookSignIn = useCallback(async () => {
    setFacebookLoading(true);
    clearError();
    analyticsService.trackEvent('login_attempt', { action: 'facebook' });
    try {
      addToast({
        type: 'info',
        message: 'Facebook Sign-In is not configured for mobile yet. Please use email/password.',
      });
    } finally {
      setFacebookLoading(false);
    }
  }, [clearError, addToast]);

  const handleGuestMode = useCallback(() => {
    analyticsService.trackEvent('login_attempt', { action: 'guest' });
    const guestProfile: UserProfile = {
      uid: `guest-${Date.now()}`,
      name: 'Guest User',
      email: `guest-${Date.now()}@example.com`,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLoginAt: new Date(),
      preferences: { theme: 'dark', notifications: false, language: 'en', tone: 'auto' },
      stats: { totalSessions: 1, totalMinutes: 0, streakDays: 0, lastActivityDate: new Date() },
    };
    setUser(guestProfile);
    setEmailVerified(true);
    setOnboardingCompleted(true);
    router.replace('/(tabs)');
  }, [setUser, setEmailVerified, setOnboardingCompleted, router]);

  const handleForgotPassword = useCallback(() => {
    analyticsService.trackEvent('login_attempt', {
      action: 'forgot_password',
    });
    router.push('/auth/forgot-password');
  }, [router]);

  const handleSignUp = useCallback(() => {
    analyticsService.trackEvent('login_attempt', { action: 'signup' });
    router.push('/auth/signup');
  }, [router]);

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFF]">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="flex-grow px-6 py-8"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          testID="login-scroll-view"
        >
          {/* Header Row: Circle Logo left, App Name/Version right */}
          <Animated.View
            entering={FadeInDown.duration(600).springify()}
            className="flex-row items-center justify-between mb-8 mt-2"
          >
            <View className="flex-row items-center space-x-3">
              <View 
                className="w-12 h-12 rounded-full bg-white items-center justify-center border border-slate-100 shadow-sm"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 3,
                  elevation: 1,
                }}
              >
                <Image
                  source={require('@/shared/assets/neeva-logo.png')}
                  style={{
                    width: 28,
                    height: 28,
                    resizeMode: 'contain',
                  }}
                />
              </View>
              <Text className="text-slate-800 text-body font-bold tracking-tight ml-2">
                Neeva AI
              </Text>
            </View>
            <Text className="text-slate-400 text-caption font-semibold">
              1.0.0 Beta
            </Text>
          </Animated.View>

          {/* Form Fields Directly on Canvas */}
          <Animated.View entering={FadeInDown.delay(100).duration(600).springify()}>
            {error && (
              <View
                className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-4 flex-row items-center"
                testID="login-error"
                accessibilityRole="alert"
              >
                <AlertCircle size={16} color="#EF4444" className="mr-2" />
                <Text className="text-red-600 text-body-sm flex-1 font-medium">{error}</Text>
              </View>
            )}

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextField
                  theme="light"
                  label={AUTH_STRINGS.LOGIN_EMAIL_LABEL}
                  placeholder={AUTH_STRINGS.LOGIN_EMAIL_PLACEHOLDER}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  returnKeyType="next"
                  editable={!loading}
                  testID="login-email-input"
                  leftIcon={<Mail size={18} color="rgba(15, 23, 42, 0.4)" />}
                  accessibilityLabel={AUTH_STRINGS.LOGIN_EMAIL_LABEL}
                  accessibilityHint="Enter the email associated with your account"
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextField
                  theme="light"
                  secureTextEntry
                  label={AUTH_STRINGS.LOGIN_PASSWORD_LABEL}
                  placeholder={AUTH_STRINGS.LOGIN_PASSWORD_PLACEHOLDER}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  autoCapitalize="none"
                  autoComplete="password"
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit(onSubmit)}
                  editable={!loading}
                  testID="login-password-input"
                  leftIcon={<Lock size={18} color="rgba(15, 23, 42, 0.4)" />}
                  accessibilityLabel={AUTH_STRINGS.LOGIN_PASSWORD_LABEL}
                  accessibilityHint="Enter your password"
                />
              )}
            />

            <Pressable
              onPress={handleForgotPassword}
              className="self-center mb-6 py-1"
              disabled={loading}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              testID="login-forgot-password"
              accessibilityRole="link"
              accessibilityLabel={AUTH_STRINGS.LOGIN_FORGOT_PASSWORD}
            >
              <Text className="text-[#1C51E2] text-body-sm font-semibold">
                {AUTH_STRINGS.LOGIN_FORGOT_PASSWORD}
              </Text>
            </Pressable>

            {/* Primary Sign In Button */}
            <Pressable
              onPress={handleSubmit(onSubmit)}
              disabled={!isValid || loading}
              className={`w-full py-4.5 rounded-full items-center justify-center bg-[#1C51E2] ${
                (!isValid || loading) ? 'opacity-50' : 'active:opacity-90'
              }`}
              style={{
                shadowColor: '#1C51E2',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 6,
                elevation: 4,
              }}
            >
              <Text className="text-white text-body-lg font-bold">
                {loading ? 'Signing In...' : AUTH_STRINGS.LOGIN_BUTTON}
              </Text>
            </Pressable>

            {/* Or Divider */}
            <View className="flex-row items-center my-6">
              <View className="flex-1 h-px bg-slate-200" />
              <Text className="text-slate-400 text-caption mx-4 font-semibold uppercase tracking-wider">
                Or
              </Text>
              <View className="flex-1 h-px bg-slate-200" />
            </View>

            {/* Google Sign In */}
            <GoogleSignInButton
              theme="light"
              onPress={handleGoogleSignIn}
              loading={googleLoading}
              disabled={loading}
            />

            {/* Facebook Sign In */}
            <Pressable
              onPress={handleFacebookSignIn}
              disabled={loading || facebookLoading}
              className="flex-row items-center justify-center rounded-xl px-8 py-3.5 border border-slate-200 bg-white active:opacity-85 shadow-sm shadow-slate-100 mt-4"
              accessibilityRole="button"
              accessibilityLabel="Continue with Facebook"
            >
              <FacebookIcon />
              <Text className="text-slate-800 font-semibold ml-3 text-body">
                Continue with Facebook
              </Text>
            </Pressable>

            {/* Explore as Guest Option */}
            <Pressable
              onPress={handleGuestMode}
              className="items-center mt-6 py-2 active:opacity-75"
              accessibilityRole="button"
              accessibilityLabel="Explore as Guest"
            >
              <Text className="text-[#1C51E2] text-body-sm font-semibold underline underline-offset-4">
                Explore as Guest
              </Text>
            </Pressable>
          </Animated.View>

          {/* Bottom Redirect */}
          <Animated.View
            entering={FadeInDown.delay(200).duration(600).springify()}
            className="items-center mt-8 mb-6"
          >
            <View className="flex-row items-center justify-center mb-6">
              <Text className="text-slate-500 text-body-sm font-medium">
                {AUTH_STRINGS.LOGIN_NO_ACCOUNT}{' '}
              </Text>
              <Pressable
                onPress={handleSignUp}
                disabled={loading}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                testID="login-signup-link"
                accessibilityRole="link"
                accessibilityLabel={AUTH_STRINGS.LOGIN_SIGNUP_CTA}
              >
                <Text className="text-[#1C51E2] text-body-sm font-bold">
                  {AUTH_STRINGS.LOGIN_SIGNUP_CTA}
                </Text>
              </Pressable>
            </View>

            <Text className="text-slate-400 text-caption text-center px-4 leading-5 font-medium">
              By continuing, you agree to Neeva's{' '}
              <Text className="underline text-slate-500">Terms of Service</Text> and{' '}
              <Text className="underline text-slate-500">Privacy Policy</Text>.
            </Text>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default LoginScreen;
