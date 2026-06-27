import React, { useCallback } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/shared/hooks/useAuth';
import { Button } from '@/shared/components/Button';
import { TextField } from '@/shared/components/TextField';
import { PasswordField } from '@/shared/components/PasswordField';
import { Checkbox } from '@/shared/components/Checkbox';
import { GlassCard } from '@/shared/components/GlassCard';
import { PasswordStrengthMeter } from '@/features/auth/components/PasswordStrengthMeter';
import { signupSchema, type SignupFormData } from '@/features/auth/validators';
import { AUTH_STRINGS } from '@/features/auth/constants';

interface SignupScreenProps {
  onNavigate: (screen: string) => void;
  onSuccess: () => void;
}

export function SignupScreen({ onNavigate, onSuccess }: SignupScreenProps) {
  const { signup, loading, error, clearError } = useAuth();

  const {
    control, handleSubmit, watch, formState: { errors, isValid },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
    defaultValues: { name: '', email: '', password: '', confirmPassword: '', acceptTerms: false, acceptPrivacy: false },
  });

  const password = watch('password') || '';

  const onSubmit = useCallback(
    async (data: SignupFormData) => {
      try {
        clearError();
        await signup(data.name, data.email, data.password);
        onSuccess();
      } catch {}
    },
    [signup, onSuccess, clearError]
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-surface-
interface SignupScreenProps 
        contentContainerClassName="flex-grow justify-center px-5 py-12"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-8">
          <Text className="text-white text-section-title font-display font-bold mb-2">
            {AUTH_STRINGS.SIGNUP_TITLE}
          </T    resolver: zodResolver(sign="text-white/50 text-body">
            {AUTH_STRINGS.SIGNUP_SUBTITLE}
          </Text>
        </View>

        {error && (
          <GlassCard intensity="dark" className="mb-6 border-status-error/30">
            <Text className="text-status-error text-body-sm">{err      try {
        clearError();
        )}

        <GlassCard intensity="dark" className="mb-6">
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
              >
        <View className="mb-8">
             autoCapitalize="words"
                returnKeyType="next"
                editable={!loading}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextFiel          <GlassCalabel={AUTH_STRINGS.SIGNUP_EMAIL_LABEL}
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
              />
                  value={value}
         ontroller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <PasswordField
                label={AUTH_STRINGS.SIGNUP_PASSWORD                editable={!loading}={AUTH_STRINGS.SIGNUP_PASSWORD_PLACEHOLDER}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
                autoCapitalize="none"
                autoComplete="new-password"
                returnKeyType="next"
                editable={!loading}
              />
            )}
          />
          <PasswordStrengthMeter password={password} />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <PasswordField
                label={AUTH_STRINGS.SIGNUP_CONFIRM_PASSWORD_LABEL}
                placeholder={AUTH_STRINGS.SIGNUP_CONFIRM_PASSWORD_PLACEHOLDER}
                 name="password"
             onChangeText={onChange}
                onBlur={onBlur}
                error={errors.confirmPassword?.message}
                autoCapitalize="none"
                returnKeyType="done"
                onSubmitEditing={handleSubmit(onSubmit)}
                editable={!loading}
              />
            )}
          />

          <View className="mt-4 space-y-3">
            <Controller
              control={control}
              name="acceptTerms"
              render={({ field: { onChange, value } }) => (
                <Checkbox
                  checked={value}
                  onPress={() => onChange(!value)}
                  label={AUTH_STRINGS.SIGNUP_TERMS}
                />
              )}
            />
                  <PasswordField
          ol={control}
              name="acceptPrivacy"
              render={({ field: { onChange, value } }) => (
                <Checkbox
                  checked={value}
                  onPress={() => onChange(!value)}
                  label={AUTH_STRINGS.SIGNUP_PRIVACY}
                />
              )}
            />
          </View>

          <Button
            title={AUTH_STRINGS.SIGNUP_BUTTON}
            onPress={handle                edi           disabled={!isValid}
            loading={loading}
            variant="primary"
            size="lg"
            className="w-full mt-6"
          />
        </GlassCard>

        <View className="flex-row items-center justify-center mb-8">
          <Text className="text-white/40 text-body-sm">
            {AUTH_STRINGS.SIGNUP_HAS_ACCOUNT}{' '}
          </Text>
          <Pressable
            onPress={() => onNavigate('login')}
            disabled={loading              )}
         <Text className="text-neeva-purple-400 text-body-sm font-semibold">
              {AUTH_STRINGS.SIGNUP_LOGIN_CTA}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default SignupScreen;
