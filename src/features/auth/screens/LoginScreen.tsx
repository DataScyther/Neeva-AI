import React, { useCallback, useEffect } from 'react';
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
import { useAuth } from '@/shared/hooks/useAuth';
import { Button } from '@/shared/components/Button';
import { TextField } from '@/shared/components/TextField';
import { PasswordField } from '@/shared/components/PasswordField';
import { GlassCard } from '@/shared/components/GlassCard';
import { loginSchema, type LoginFormData } from '@/features/auth/validators';
import { AUTH_STRINGS } from '@/features/auth/constants';

interface LoginScreenProps {
  onNavigate: (screen: string) => void;
  onSuccess: () => void;
}

export function LoginScreen({ onNavigate, onSuccess }: LoginScreenProps) {
  const { login, loading, error, clearError } = useAuth();

  const { control, handleSubmit, formState: { errors, isValid } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = useCallback(async (data: LoginFormData) => {
    try { clearError(); await login(data.email, data.password); onSuccess(); } catch {}
  }, [login, onSuccess, clearError]);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-surface-dark">
      <ScrollView contentContainerClassName="flex-grow justify-center px-5 py-12" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View className="mb-8">
          <Text className="text-white text-section-title font-display font-bold mb-2">{AUTH_STRINGS.LOGIN_TITLE}</Text>
          <Text className="text-white/50 text-body">{AUTH_STRINGS.LOGIN_SUBTITLE}</Text>
        </View>
        {error && (
          <GlassCard intensity="dark" className="mb-6 border-status-error/30">
            <Text className="text-status-error text-body-sm">{error}</Text>
          </GlassCard>
        )}
        <GlassCard intensity="dark" className="mb-6">
          <Controller control={control} name="email" render={({ field: { onChange, onBlur, value } }) => (
            <TextField label={AUTH_STRINGS.LOGIN_EMAIL_LABEL} placeholder={AUTH_STRINGS.LOGIN_EMAIL_PLACEHOLDER} value={value} onChangeText={onChange} onBlur={onBlur} error={errors.email?.message} keyboardType="email-address" autoCapitalize="none" autoComplete="email" returnKeyType="next" editable={!loading} />
          )} />
          <Controller control={control} name="password" render={({ field: { onChange, onBlur, value } }) => (
            <PasswordField label={AUTH_STRINGS.LOGIN_PASSWORD_LABEL} placeholder={AUTH_STRINGS.LOGIN_PASSWORD_PLACEHOLDER} value={value} onChangeText={onChange} onBlur={onBlur} error={errors.password?.message} autoCapitalize="none" autoComplete="password" returnKeyType="done" onSubmitEditing={handleSubmit(onSubmit)} editable={!loading} />
          )} />
          <Pressable onPress={() => onNavigate('forgot_password')} className="items-end mt-1" disabled={loading}>
            <Text className="text-neeva-cyan-400 text-body-sm font-medium">{AUTH_STRINGS.LOGIN_FORGOT_PASSWORD}</Text>
          </Pressable>
          <Button title={AUTH_STRINGS.LOGIN_BUTTON} onPress={handleSubmit(onSubmit)} disabled={!isValid} loading={loading} variant="primary" size="lg" className="w-full mt-6" />
        </GlassCard>
        <View className="flex-row items-center justify-center mb-8">
          <Text className="text-white/40 text-body-sm">{AUTH_STRINGS.LOGIN_NO_ACCOUNT} </Text>
          <Pressable onPress={() => onNavigate('signup')} disabled={loading}>
            <Text className="text-neeva-purple-400 text-body-sm font-semibold">{AUTH_STRINGS.LOGIN_SIGNUP_CTA}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default LoginScreen;
