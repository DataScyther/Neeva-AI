import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Dimensions,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { Mail, Lock, User, AlertCircle, ArrowLeft, ChevronDown, Check } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { useAuth } from '@/shared/hooks/useAuth';
import { analyticsService } from '@/services/analytics';
import { TextField } from '@/shared/components/TextField';
import { PasswordField } from '@/shared/components/PasswordField';
import { Checkbox } from '@/shared/components/Checkbox';
import { PasswordStrengthMeter } from '@/features/auth/components/PasswordStrengthMeter';
import { signupSchema, type SignupFormData } from '@/features/auth/validators';
import { AUTH_STRINGS } from '@/features/auth/constants';

const { width } = Dimensions.get('window');

const ROLE_OPTIONS = [
  'Individual User',
  'Health Practitioner',
  'Wellness Coach',
  'Researcher',
  'Other',
];

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
  const [showRolePicker, setShowRolePicker] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Individual User');

  const {
    control,
    handleSubmit,
    watch,
    setValue,
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
        analyticsService.trackEvent('auth_signup', { action: 'attempt', role: selectedRole });
        await signup(data.name, data.email, data.password);
        analyticsService.trackEvent('auth_signup', { action: 'success' });
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Signup failed';
        analyticsService.trackEvent('auth_signup', { action: 'failed', reason: msg });
      }
    },
    [signup, clearError, selectedRole]
  );

  const handleSignIn = useCallback(() => {
    router.push('/auth/login');
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
          testID="signup-scroll-view"
        >
          {/* Header Row: Back button + Title */}
          <Animated.View
            entering={FadeInDown.duration(600).springify()}
            className="flex-row items-center mb-8 mt-2"
          >
            <Pressable
              onPress={() => router.back()}
              className="mr-4 p-1 rounded-full active:bg-slate-100"
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            >
              <ArrowLeft size={24} color="#1E293B" />
            </Pressable>
            <Text className="text-slate-800 text-page-title font-bold tracking-tight">
              Create Account
            </Text>
          </Animated.View>

          {/* Form Fields Directly on Light Canvas */}
          <Animated.View entering={FadeInDown.delay(100).duration(600).springify()}>
            {error && (
              <View
                className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-4 flex-row items-center"
                accessibilityRole="alert"
              >
                <AlertCircle size={16} color="#EF4444" className="mr-2" />
                <Text className="text-red-600 text-body-sm flex-1 font-medium">{error}</Text>
              </View>
            )}

            {/* Full Name */}
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextField
                  theme="light"
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
                  leftIcon={<User size={18} color="rgba(15, 23, 42, 0.4)" />}
                  accessibilityLabel={AUTH_STRINGS.SIGNUP_NAME_LABEL}
                  accessibilityHint="Enter your full name"
                />
              )}
            />

            {/* Email */}
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextField
                  theme="light"
                  label="Work Email"
                  placeholder="nathan.roberts@example.com"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  returnKeyType="next"
                  editable={!loading}
                  leftIcon={<Mail size={18} color="rgba(15, 23, 42, 0.4)" />}
                  accessibilityLabel="Work Email"
                  accessibilityHint="Enter your email address"
                />
              )}
            />

            {/* Role Dropdown Selector */}
            <Pressable
              onPress={() => setShowRolePicker(true)}
              className="mb-5"
              accessibilityRole="combobox"
              accessibilityLabel="Role"
            >
              <Text className="text-body-sm font-semibold mb-2 text-slate-600">
                Role
              </Text>
              <View className="flex-row items-center justify-between rounded-xl border border-slate-200 px-4 py-3.5 bg-white">
                <Text className="text-slate-800 text-body font-medium">
                  {selectedRole}
                </Text>
                <ChevronDown size={18} color="#94A3B8" />
              </View>
            </Pressable>

            {/* Password */}
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextField
                  theme="light"
                  secureTextEntry
                  label={AUTH_STRINGS.SIGNUP_PASSWORD_LABEL}
                  placeholder="••••••••"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  autoCapitalize="none"
                  autoComplete="new-password"
                  returnKeyType="next"
                  editable={!loading}
                  leftIcon={<Lock size={18} color="rgba(15, 23, 42, 0.4)" />}
                  accessibilityLabel={AUTH_STRINGS.SIGNUP_PASSWORD_LABEL}
                  accessibilityHint="Create a password of at least 8 characters"
                />
              )}
            />

            {password.length > 0 && (
              <PasswordStrengthMeter password={password} />
            )}

            {/* Confirm Password */}
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <PasswordField
                  theme="light"
                  label={AUTH_STRINGS.SIGNUP_CONFIRM_PASSWORD_LABEL}
                  placeholder="••••••••"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.confirmPassword?.message}
                  autoCapitalize="none"
                  autoComplete="new-password"
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit(onSubmit)}
                  editable={!loading}
                  leftIcon={<Lock size={18} color="rgba(15, 23, 42, 0.4)" />}
                  accessibilityLabel={AUTH_STRINGS.SIGNUP_CONFIRM_PASSWORD_LABEL}
                  accessibilityHint="Confirm your password by entering it again"
                />
              )}
            />

            {/* Unified Terms & Privacy Checkbox */}
            <View className="mt-4">
              <Controller
                control={control}
                name="acceptTerms"
                render={({ field: { onChange, value } }) => (
                  <Checkbox
                    theme="light"
                    checked={value}
                    onPress={() => {
                      const nextVal = !value;
                      onChange(nextVal);
                      // Update acceptPrivacy concurrently to satisfy zod validation
                      setValue('acceptPrivacy', nextVal as any, { shouldValidate: true });
                    }}
                    label="I agree to the Terms & Conditions and Privacy Policy"
                    error={errors.acceptTerms?.message}
                  />
                )}
              />
            </View>

            {/* Primary Submit Button */}
            <Pressable
              onPress={handleSubmit(onSubmit)}
              disabled={!isValid || loading}
              className={`w-full mt-8 py-4.5 rounded-full items-center justify-center bg-[#1C51E2] ${
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
                {loading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </Pressable>
          </Animated.View>

          {/* Bottom Redirect */}
          <Animated.View
            entering={FadeInDown.delay(200).duration(600).springify()}
            className="items-center mt-8 mb-6"
          >
            <View className="flex-row items-center justify-center">
              <Text className="text-slate-500 text-body-sm font-medium">
                {AUTH_STRINGS.SIGNUP_HAS_ACCOUNT}{' '}
              </Text>
              <Pressable
                onPress={handleSignIn}
                disabled={loading}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessibilityRole="link"
                accessibilityLabel={AUTH_STRINGS.SIGNUP_LOGIN_CTA}
              >
                <Text className="text-[#1C51E2] text-body-sm font-bold">
                  {AUTH_STRINGS.SIGNUP_LOGIN_CTA}
                </Text>
              </Pressable>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Custom Bottom Selection Modal for Role */}
      <Modal
        visible={showRolePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowRolePicker(false)}
      >
        <View className="flex-1 justify-end bg-black/40">
          <Pressable className="flex-1" onPress={() => setShowRolePicker(false)} />
          <View className="bg-white rounded-t-2xl px-6 pt-4 pb-10 max-h-[50%]">
            {/* Sheet Handle Indicator */}
            <View className="w-12 h-1 bg-slate-200 rounded-full align-self-center mx-auto mb-4" />
            
            {/* Title */}
            <Text className="text-slate-800 text-card-title font-bold mb-4 font-display">
              Select Role
            </Text>

            {/* List options */}
            <ScrollView showsVerticalScrollIndicator={false}>
              {ROLE_OPTIONS.map((option) => (
                <Pressable
                  key={option}
                  onPress={() => {
                    setSelectedRole(option);
                    setShowRolePicker(false);
                  }}
                  className="py-4 border-b border-slate-100 flex-row justify-between items-center active:bg-slate-50"
                >
                  <Text className={`text-slate-800 text-body font-semibold ${selectedRole === option ? 'text-[#1C51E2]' : ''}`}>
                    {option}
                  </Text>
                  {selectedRole === option && (
                    <Check size={16} color="#1C51E2" strokeWidth={3} />
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export default SignupScreen;
