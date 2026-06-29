import React, { useCallback, useEffect, useRef } from 'react';
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
import { Mail, Lock, User, AlertCircle } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { useAuth } from '@/shared/hooks/useAuth';
import { analyticsService } from '@/services/analytics';
import { Button } from '@/shared/components/Button';
import { TextField } from '@/shared/components/TextField';
import { PasswordField } from '@/shared/components/PasswordField';
import { Checkbox } from '@/shared/components/Checkbox';
import { GlassCard } from '@/shared/components/GlassCard';
import { PasswordStrengthMeter } from '@/features/auth/components/PasswordStrengthMeter';
import { signupSchema, type SignupFormData } from '@/features/auth/validators';
import { AUTH_STRINGS } from '@/features/auth/constants';

const { width } = Dimensions.get('window');

export function SignupScreen() {
  const router = useRouter();
  const {
    signup,
    loading,
    error,
    clearError,
    isAuthenticated,
    emailVerified,
  } = useAuth();

  const hasNavigated = useRef(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false as any,
      acceptPrivacy: false as any,
    },
  });

  const password = watch('password') || '';

  useEffect(() => {
    if (isAuthenticated && !hasNavigated.current) {
      hasNavigated.current = true;
      if (!emailVerified) {
        router.replace('/auth/email-verification');
      } else {
        router.replace('/onboarding');
      }
    }
  }, [isAuthenticated, emailVerified, router]);

  const onSubmit = useCallback(
    async (data: SignupFormData) => {
      try {
        clearError();
        analyticsService.trackEvent('auth_signup', { action: 'attempt' });
        await signup(data.name, data.email, data.password);
        analyticsService.trackEvent('auth_signup', { action: 'success' });
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Signup failed';
        analyticsService.trackEvent('auth_signup', { action: 'failed', reason: msg });
      }
    },
    [signup, clearError]
  );

  const handleSignIn = useCallback(() => {
    router.push('/auth/login');
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
          testID="signup-scroll-view"
        >
          {/* Top Logo & Branding */}
          <Animated.View
            entering={FadeInDown.duration(600).springify()}
            className="items-center mb-8 mt-4"
          >
            <View className="mb-4">
              <Image
                source={require('@/shared/assets/neeva-logo.jpg')}
                style={{
                  width: width * 0.28,
                  height: width * 0.28,
                  borderRadius: (width * 0.28) / 2,
                  resizeMode: 'contain',
                }}
              />
            </View>
            <Text className="text-4xl font-bold text-white tracking-tight font-display mb-1">
              Neeva
            </Text>
            <Text className="text-neeva-cyan-400 text-body font-medium text-center">
              {AUTH_STRINGS.SIGNUP_SUBTITLE}
            </Text>
          </Animated.View>

          {/* Form Panel */}
          <Animated.View entering={FadeInDown.delay(100).duration(600).springify()}>
            <GlassCard intensity="dark" className="p-6 mb-6">
              <Text
                className="text-white text-section-title font-semibold mb-2 font-display"
                accessibilityRole="header"
              >
                {AUTH_STRINGS.SIGNUP_TITLE}
              </Text>
              <Text className="text-white/40 text-body-sm mb-6">
                Create an account to start your wellness journey.
              </Text>

              {error && (
                <View
                  className="bg-red-500/10 border border-red-500/20 rounded-glass-sm px-4 py-3 mb-4 flex-row items-center"
                  accessibilityRole="alert"
                >
                  <AlertCircle size={16} color="#F87171" className="mr-2" />
                  <Text className="text-red-400 text-body-sm flex-1">{error}</Text>
                </View>
              )}

              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextField
                    label={AUTH_STRINGS.SIGNUP_NAME_LABEL}
                    placeholder={AUTH_STRINGS.SIGNUP_NAME_PLACEHOLDER}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.name?.message}
                    autoCapitalize="words"
                    autoComplete="name"
                    returnKeyType="next"
                    editable={!loading}
                    leftIcon={<User size={18} color="rgba(255,255,255,0.4)" />}
                    accessibilityLabel={AUTH_STRINGS.SIGNUP_NAME_LABEL}
                    accessibilityHint="Enter your full name"
                  />
                )}
              />

              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextField
                    label={AUTH_STRINGS.SIGNUP_EMAIL_LABEL}
                    placeholder={AUTH_STRINGS.SIGNUP_EMAIL_PLACEHOLDER}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.email?.message}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    returnKeyType="next"
                    editable={!loading}
                    leftIcon={<Mail size={18} color="rgba(255,255,255,0.4)" />}
                    accessibilityLabel={AUTH_STRINGS.SIGNUP_EMAIL_LABEL}
                    accessibilityHint="Enter your email address"
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <PasswordField
                    label={AUTH_STRINGS.SIGNUP_PASSWORD_LABEL}
                    placeholder={AUTH_STRINGS.SIGNUP_PASSWORD_PLACEHOLDER}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.password?.message}
                    autoCapitalize="none"
                    autoComplete="new-password"
                    returnKeyType="next"
                    editable={!loading}
                    leftIcon={<Lock size={18} color="rgba(255,255,255,0.4)" />}
                    accessibilityLabel={AUTH_STRINGS.SIGNUP_PASSWORD_LABEL}
                    accessibilityHint="Create a password of at least 8 characters"
                  />
                )}
              />

              {password.length > 0 && (
                <PasswordStrengthMeter password={password} />
              )}

              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <PasswordField
                    label={AUTH_STRINGS.SIGNUP_CONFIRM_PASSWORD_LABEL}
                    placeholder={AUTH_STRINGS.SIGNUP_CONFIRM_PASSWORD_PLACEHOLDER}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.confirmPassword?.message}
                    autoCapitalize="none"
                    autoComplete="new-password"
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit(onSubmit)}
                    editable={!loading}
                    leftIcon={<Lock size={18} color="rgba(255,255,255,0.4)" />}
                    accessibilityLabel={AUTH_STRINGS.SIGNUP_CONFIRM_PASSWORD_LABEL}
                    accessibilityHint="Confirm your password by entering it again"
                  />
                )}
              />

              {/* Checkboxes */}
              <View className="mt-4 space-y-3">
                <Controller
                  control={control}
                  name="acceptTerms"
                  render={({ field: { onChange, value } }) => (
                    <Checkbox
                      checked={value}
                      onPress={() => onChange(!value)}
                      label={AUTH_STRINGS.SIGNUP_TERMS}
                      error={errors.acceptTerms?.message}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="acceptPrivacy"
                  render={({ field: { onChange, value } }) => (
                    <Checkbox
                      checked={value}
                      onPress={() => onChange(!value)}
                      label={AUTH_STRINGS.SIGNUP_PRIVACY}
                      error={errors.acceptPrivacy?.message}
                    />
                  )}
                />
              </View>

              <Button
                title={AUTH_STRINGS.SIGNUP_BUTTON}
                onPress={handleSubmit(onSubmit)}
                disabled={!isValid || loading}
                loading={loading}
                variant="primary"
                size="lg"
                className="w-full mt-6"
                accessibilityLabel={AUTH_STRINGS.SIGNUP_BUTTON}
                accessibilityHint="Double tap to register and create your account"
              />
            </GlassCard>
          </Animated.View>

          {/* Bottom Login Redirect */}
          <Animated.View
            entering={FadeInDown.delay(200).duration(600).springify()}
            className="items-center mt-2 mb-8"
          >
            <View className="flex-row items-center justify-center">
              <Text className="text-white/40 text-body-sm font-medium">
                {AUTH_STRINGS.SIGNUP_HAS_ACCOUNT}{' '}
              </Text>
              <Pressable
                onPress={handleSignIn}
                disabled={loading}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessibilityRole="link"
                accessibilityLabel={AUTH_STRINGS.SIGNUP_LOGIN_CTA}
              >
                <Text className="text-neeva-cyan-400 text-body-sm font-semibold">
                  {AUTH_STRINGS.SIGNUP_LOGIN_CTA}
                </Text>
              </Pressable>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default SignupScreen;
