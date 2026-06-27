import React, { useState, useCallback } from 'react';
import { View, Text, Pressable, KeyboardAvoidingView, Platform, ScrollView, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, User } from 'lucide-react-native';
import { Button } from '@/shared/components/Button';
import { TextField } from '@/shared/components/TextField';
import { PasswordField } from '@/shared/components/PasswordField';
import { signupSchema, type SignupFormData } from '@/shared/schemas/auth';
import { authService } from '@/services/auth';
import { isFirebaseConfigured } from '@/lib/firebase';

const { width } = Dimensions.get('window');

export default function SignupScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { control, handleSubmit, formState: { errors } } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const handleSignUp = useCallback(async (data: SignupFormData) => {
    if (!isFirebaseConfigured()) {
      setAuthError('Firebase is not configured. Add your API key to .env and restart Expo.');
      return;
    }

    setIsLoading(true);
    setAuthError(null);
    try {
      await authService.signUp({ name: data.name, email: data.email, password: data.password });
      router.replace('/onboarding');
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
            <View className="items-center mb-6 mt-8">
              <View className="mb-3">
                <Image
                  source={require('@/shared/assets/neeva-logo.jpg')}
                  style={{ width: width * 0.35, height: width * 0.35, resizeMode: 'contain' }}
                />
              </View>
              <Text className="text-4xl font-bold text-white tracking-tight">Neeva</Text>
              <Text className="text-neeva-cyan-400 text-body-lg mt-2">Begin your wellness journey</Text>
            </View>

            <View className="bg-neeva-glass-dark/30 rounded-glass-lg p-6 border border-neeva-glass-border">
              <Text className="text-white text-section-title font-semibold mb-1">Create Account</Text>
              <Text className="text-white/40 text-body-sm mb-6">Join Neeva and take the first step.</Text>

              {authError && (
                <View className="bg-red-500/10 border border-red-500/20 rounded-glass-sm px-4 py-3 mb-4">
                  <Text className="text-red-400 text-body-sm">{authError}</Text>
                </View>
              )}

              <Controller control={control} name="name" render={({ field: { onChange, onBlur, value } }) => (
                <TextField label="Full Name" placeholder="Your name" value={value} onChangeText={onChange} onBlur={onBlur} error={errors.name?.message} autoCapitalize="words" autoComplete="name" leftIcon={<User size={18} color="rgba(255,255,255,0.4)" />} />
              )} />

              <Controller control={control} name="email" render={({ field: { onChange, onBlur, value } }) => (
                <TextField label="Email" placeholder="you@example.com" value={value} onChangeText={onChange} onBlur={onBlur} error={errors.email?.message} keyboardType="email-address" autoCapitalize="none" autoComplete="email" leftIcon={<Mail size={18} color="rgba(255,255,255,0.4)" />} />
              )} />

              <Controller control={control} name="password" render={({ field: { onChange, onBlur, value } }) => (
                <PasswordField label="Password" placeholder="At least 8 characters" value={value} onChangeText={onChange} onBlur={onBlur} error={errors.password?.message} autoCapitalize="none" autoComplete="new-password" leftIcon={<Lock size={18} color="rgba(255,255,255,0.4)" />} />
              )} />

              <Controller control={control} name="confirmPassword" render={({ field: { onChange, onBlur, value } }) => (
                <PasswordField label="Confirm Password" placeholder="Re-enter your password" value={value} onChangeText={onChange} onBlur={onBlur} error={errors.confirmPassword?.message} autoCapitalize="none" autoComplete="new-password" leftIcon={<Lock size={18} color="rgba(255,255,255,0.4)" />} />
              )} />

              <Button title="Create Account" onPress={handleSubmit(handleSignUp)} loading={isLoading} size="lg" className="w-full" />

              <View className="flex-row justify-center mt-8 mb-8">
                <Text className="text-white/40 text-body-sm">Already have an account? </Text>
                <Pressable onPress={() => router.push('/auth/login')}>
                  <Text className="text-neeva-cyan-400 text-body-sm font-medium">Sign in</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
