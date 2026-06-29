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
import Animated, { FadeInDown } from 'react-native-reanimated';

import { useAuth } from '@/shared/hooks/useAuth';
import { authService } from '@/services/auth';
import type { UserProfile } from '@/services/auth/types';
import { analyticsService } from '@/services/analytics';
import { useAppStore } from '@/core/store/useAppStore';

import { Button } from '@/shared/components/Button';
import { TextField } from '@/shared/components/TextField';
import { PasswordField } from '@/shared/components/PasswordField';
import { GlassCard } from '@/shared/components/GlassCard';
import { GoogleSignInButton } from '@/features/auth/components/GoogleSignInButton';
import { loginSchema, type LoginFormData } from '@/features/auth/validators';
import { AUTH_STRINGS } from '@/features/auth/constants';

const { width } = Dimensions.get('window');

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
    <SafeAreaView className="flex-1 bg-app-dark">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="flex-grow justify-center px-6 py-12"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          testID="login-scroll-view"
        >
          {/* Top Brand Logo & Subtitle */}
          <Animated.View
            entering={FadeInDown.duration(600).springify()}
            className="items-center mb-8 mt-4"
          >
            <View className="mb-4">
              <Image
                source={require('@/shared/assets/neeva-logo.jpg')}
                style={{
                  width: width * 0.3,
                  height: width * 0.3,
                  borderRadius: (width * 0.3) / 2,
                  resizeMode: 'contain',
                }}
              />
            </View>
            <Text className="text-4xl font-bold text-white tracking-tight font-display mb-1">
              Neeva
            </Text>
            <Text className="text-neeva-cyan-400 text-body font-medium text-center">
              {AUTH_STRINGS.SPLASH_SUBTITLE}
            </Text>
          </Animated.View>

          {/* Form Card */}
          <Animated.View entering={FadeInDown.delay(100).duration(600).springify()}>
            <GlassCard intensity="dark" className="p-6 mb-6">
              <Text
                className="text-white text-section-title font-semibold mb-2 font-display"
                accessibilityRole="header"
                testID="login-title"
              >
                {AUTH_STRINGS.LOGIN_TITLE}
              </Text>
              <Text className="text-white/40 text-body-sm mb-6">
                Sign in to continue your wellness journey.
              </Text>

              {error && (
                <View
                  className="bg-red-500/10 border border-red-500/20 rounded-glass-sm px-4 py-3 mb-4 flex-row items-center"
                  testID="login-error"
                  accessibilityRole="alert"
                >
                  <AlertCircle size={16} color="#F87171" className="mr-2" />
                  <Text className="text-red-400 text-body-sm flex-1">{error}</Text>
                </View>
              )}

              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextField
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
                    leftIcon={<Mail size={18} color="rgba(255,255,255,0.4)" />}
                    accessibilityLabel={AUTH_STRINGS.LOGIN_EMAIL_LABEL}
                    accessibilityHint="Enter the email associated with your account"
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <PasswordField
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
                    leftIcon={<Lock size={18} color="rgba(255,255,255,0.4)" />}
                    accessibilityLabel={AUTH_STRINGS.LOGIN_PASSWORD_LABEL}
                    accessibilityHint="Enter your password"
                  />
                )}
              />

              <Pressable
                onPress={handleForgotPassword}
                className="self-end mb-6 py-1"
                disabled={loading}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                testID="login-forgot-password"
                accessibilityRole="link"
                accessibilityLabel={AUTH_STRINGS.LOGIN_FORGOT_PASSWORD}
              >
                <Text className="text-neeva-cyan-400 text-body-sm font-medium">
                  {AUTH_STRINGS.LOGIN_FORGOT_PASSWORD}
                </Text>
              </Pressable>

              <Button
                title={AUTH_STRINGS.LOGIN_BUTTON}
                onPress={handleSubmit(onSubmit)}
                disabled={!isValid || loading}
                loading={loading}
                variant="primary"
                size="lg"
                className="w-full"
                testID="login-submit-button"
                accessibilityLabel={AUTH_STRINGS.LOGIN_BUTTON}
                accessibilityHint="Tap to sign in to your account"
              />

              {/* Or Divider */}
              <View className="flex-row items-center my-5">
                <View className="flex-1 h-px bg-neeva-glass-border/30" />
                <Text className="text-white/30 text-caption mx-4 uppercase tracking-wider">
                  or
                </Text>
                <View className="flex-1 h-px bg-neeva-glass-border/30" />
              </View>

              {/* Google Sign In */}
              <GoogleSignInButton
                onPress={handleGoogleSignIn}
                loading={googleLoading}
                disabled={loading}
              />

              {/* Guest Mode */}
              <Pressable
                onPress={handleGuestMode}
                className="items-center mt-5 py-2 active:opacity-75"
                accessibilityRole="button"
                accessibilityLabel="Explore as Guest"
                accessibilityHint="Double tap to enter guest mode and explore the app"
              >
                <Text className="text-white/60 text-body-sm font-medium underline underline-offset-4">
                  Explore as Guest
                </Text>
              </Pressable>
            </GlassCard>
          </Animated.View>

          {/* Bottom links and Terms */}
          <Animated.View
            entering={FadeInDown.delay(200).duration(600).springify()}
            className="items-center"
          >
            <View className="flex-row items-center justify-center mb-6">
              <Text className="text-white/40 text-body-sm font-medium">
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
                <Text className="text-neeva-cyan-400 text-body-sm font-semibold">
                  {AUTH_STRINGS.LOGIN_SIGNUP_CTA}
                </Text>
              </Pressable>
            </View>

            <Text className="text-white/30 text-caption text-center px-4 leading-5">
              By continuing, you agree to Neeva's{' '}
              <Text className="underline text-white/40">Terms of Service</Text> and{' '}
              <Text className="underline text-white/40">Privacy Policy</Text>.
            </Text>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default LoginScreen;
