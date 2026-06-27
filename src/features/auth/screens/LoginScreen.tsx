/**
 * Neeva AI - Login Screen
 *
 * Production implementation of the authentication entry point.
 * Follows Neeva Design System v1.0 and architectural patterns.
 */

import React, { useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useAuth } from '@/shared/hooks/useAuth';
import { analyticsService } from '@/services/analytics';
import { Button } from '@/shared/components/Button';
import { TextField } from '@/shared/components/TextField';
import { PasswordField } from '@/shared/components/PasswordField';
import { GlassCard } from '@/shared/components/GlassCard';
import { loginSchema, type LoginFormData } from '@/features/auth/validators';
import { AUTH_STRINGS } from '@/features/auth/constants';

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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-app-dark"
    >
      <ScrollView
        contentContainerClassName="flex-grow justify-center px-5 py-12"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        testID="login-scroll-view"
      >
        <View className="mb-8">
          <Text
            className="text-white text-section-title font-display font-bold mb-2"
            accessibilityRole="header"
            accessibilityLabel={AUTH_STRINGS.LOGIN_TITLE}
            testID="login-title"
          >
            {AUTH_STRINGS.LOGIN_TITLE}
          </Text>
          <Text className="text-white/50 text-body">
            {AUTH_STRINGS.LOGIN_SUBTITLE}
          </Text>
        </View>

        {error && (
          <GlassCard
            intensity="dark"
            className="mb-6 border-red-500/30"
            testID="login-error"
          >
            <Text
              className="text-red-400 text-body-sm"
              accessibilityRole="alert"
            >
              {error}
            </Text>
          </GlassCard>
        )}

        <GlassCard intensity="dark" className="mb-6">
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
                accessibilityLabel={AUTH_STRINGS.LOGIN_EMAIL_LABEL}
                accessibilityHint="Enter the email associated with your account"
                accessible
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
                accessibilityLabel={AUTH_STRINGS.LOGIN_PASSWORD_LABEL}
                accessibilityHint="Enter your password"
                accessible
              />
            )}
          />

          <Pressable
            onPress={handleForgotPassword}
            className="items-end mt-1"
            disabled={loading}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            testID="login-forgot-password"
            accessibilityRole="link"
            accessibilityLabel={AUTH_STRINGS.LOGIN_FORGOT_PASSWORD}
            accessible
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
            className="w-full mt-6"
            testID="login-submit-button"
            accessibilityLabel={AUTH_STRINGS.LOGIN_BUTTON}
            accessibilityHint="Tap to sign in to your account"
            accessible
          />
        </GlassCard>

        <View className="flex-row items-center justify-center mb-8">
          <Text className="text-white/40 text-body-sm">
            {AUTH_STRINGS.LOGIN_NO_ACCOUNT}{' '}
          </Text>
          <Pressable
            onPress={handleSignUp}
            disabled={loading}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            testID="login-signup-link"
            accessibilityRole="link"
            accessibilityLabel={AUTH_STRINGS.LOGIN_SIGNUP_CTA}
            accessible
          >
            <Text className="text-neeva-cyan-400 text-body-sm font-semibold">
              {AUTH_STRINGS.LOGIN_SIGNUP_CTA}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default LoginScreen;
