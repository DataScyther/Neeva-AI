import React, { useState, useCallback } from 'react';
import { View, Text, Pressable, KeyboardAvoidingView, Platform, ScrollView, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, ArrowLeft } from 'lucide-react-native';
import { Button } from '@/shared/components/Button';
import { TextField } from '@/shared/components/TextField';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/shared/schemas/auth';
import { authService } from '@/services/auth';
import { isFirebaseConfigured } from '@/lib/firebase';
import { AUTH_STRINGS } from '@/features/auth/constants';

const { width } = Dimensions.get('window');

export default function ForgotPasswordScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const handleReset = useCallback(async (data: ForgotPasswordFormData) => {
    if (!isFirebaseConfigured()) {
      setAuthError('Firebase is not configured. Add your API key to .env and restart Expo.');
      return;
    }

    setIsLoading(true);
    setAuthError(null);
    try {
      await authService.resetPassword(data.email);
      setIsSuccess(true);
    } catch (error: any) {
      setAuthError(error?.message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-app-dark">
      <StatusBar style="light" />
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View className="flex-1 px-6 justify-center">
            <View className="items-center mb-8 mt-8">
              <View className="mb-3">
                <Image
                  source={require('@/shared/assets/neeva-logo.jpg')}
                  style={{
                    width: width * 0.3,
                    height: width * 0.3,
                    resizeMode: 'contain',
                  }}
                />
              </View>
              <Text className="text-4xl font-bold text-white tracking-tight">Neeva</Text>
            </View>

            <View className="bg-neeva-glass-dark/30 rounded-glass-lg p-6 border border-neeva-glass-border">
              <Text className="text-white text-section-title font-semibold mb-1">
                {AUTH_STRINGS.FORGOT_TITLE}
              </Text>
              
              {isSuccess ? (
                <View className="mt-4">
                  <Text className="text-neeva-cyan-400 font-semibold mb-2">
                    {AUTH_STRINGS.FORGOT_SUCCESS_TITLE}
                  </Text>
                  <Text className="text-white/60 text-body-sm mb-6 leading-5">
                    {AUTH_STRINGS.FORGOT_SUCCESS_MESSAGE}
                  </Text>
                  <Button
                    title={AUTH_STRINGS.FORGOT_BACK}
                    onPress={() => router.replace('/auth/login')}
                    size="lg"
                    className="w-full"
                    icon={<ArrowLeft size={16} color="#FFFFFF" className="mr-2" />}
                  />
                </View>
              ) : (
                <>
                  <Text className="text-white/40 text-body-sm mb-6">
                    {AUTH_STRINGS.FORGOT_SUBTITLE}
                  </Text>

                  {authError && (
                    <View className="bg-red-500/10 border border-red-500/20 rounded-glass-sm px-4 py-3 mb-4">
                      <Text className="text-red-400 text-body-sm">{authError}</Text>
                    </View>
                  )}

                  <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextField
                        label={AUTH_STRINGS.FORGOT_EMAIL_LABEL}
                        placeholder={AUTH_STRINGS.FORGOT_EMAIL_PLACEHOLDER}
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        error={errors.email?.message}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                        leftIcon={<Mail size={18} color="rgba(255,255,255,0.4)" />}
                      />
                    )}
                  />

                  <Button
                    title={AUTH_STRINGS.FORGOT_BUTTON}
                    onPress={handleSubmit(handleReset)}
                    loading={isLoading}
                    size="lg"
                    className="w-full mt-4"
                  />

                  <Pressable
                    className="flex-row items-center justify-center mt-6 py-2"
                    onPress={() => router.back()}
                  >
                    <ArrowLeft size={14} color="#22D3EE" />
                    <Text className="text-neeva-cyan-400 text-body-sm font-medium ml-2">
                      {AUTH_STRINGS.FORGOT_BACK}
                    </Text>
                  </Pressable>
                </>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
