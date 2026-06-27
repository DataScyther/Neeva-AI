import React, { useState, useCallback } from 'react';
import { View, Text, Pressable, KeyboardAvoidingView, Platform, ScrollView, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock } from 'lucide-react-native';
import { Button } from '@/shared/components/Button';
import { TextField } from '@/shared/components/TextField';
import { loginSchema, type LoginFormData } from '@/shared/schemas/auth';
import { authService } from '@/services/auth';
import { isFirebaseConfigured } from '@/lib/firebase';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const handleEmailLogin = useCallback(async (data: LoginFormData) => {
    if (!isFirebaseConfigured()) {
      setAuthError('Firebase is not configured. Add your API key to .env and restart Expo.');
      return;
    }

    setIsLoading(true);
    setAuthError(null);
    try {
      await authService.signInWithEmail(data);
      router.replace('/');
    } catch (error: any) {
      setAuthError(error?.message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleGoogleLogin = useCallback(async () => {
    setIsGoogleLoading(true);
    setAuthError(null);
    try {
      await authService.signInWithGoogle();
    } catch (error: any) {
      if (error?.message?.includes('Redirecting')) return;
      setAuthError(error?.message || 'Google sign-in failed.');
    } finally {
      setIsGoogleLoading(false);
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
                    width: width * 0.35,
                    height: width * 0.35,
                    resizeMode: 'contain',
                  }}
                />
              </View>
              <Text className="text-4xl font-bold text-white tracking-tight">Neeva</Text>
              <Text className="text-neeva-cyan-400 text-body-lg mt-2">Your AI wellness companion</Text>
            </View>

            <View className="bg-neeva-glass-dark/30 rounded-glass-lg p-6 border border-neeva-glass-border">
              <Text className="text-white text-section-title font-semibold mb-1">Welcome Back</Text>
              <Text className="text-white/40 text-body-sm mb-6">Sign in to continue your wellness journey.</Text>

              {authError && (
                <View className="bg-red-500/10 border border-red-500/20 rounded-glass-sm px-4 py-3 mb-4">
                  <Text className="text-red-400 text-body-sm">{authError}</Text>
                </View>
              )}

              <Controller control={control} name="email" render={({ field: { onChange, onBlur, value } }) => (
                <TextField label="Email" placeholder="you@example.com" value={value} onChangeText={onChange} onBlur={onBlur} error={errors.email?.message} keyboardType="email-address" autoCapitalize="none" autoComplete="email" leftIcon={<Mail size={18} color="rgba(255,255,255,0.4)" />} />
              )} />

              <Controller control={control} name="password" render={({ field: { onChange, onBlur, value } }) => (
                <TextField label="Password" placeholder="Enter your password" value={value} onChangeText={onChange} onBlur={onBlur} error={errors.password?.message} secureTextEntry autoCapitalize="none" autoComplete="password" leftIcon={<Lock size={18} color="rgba(255,255,255,0.4)" />} />
              )} />

              <Pressable className="self-end mb-6" onPress={() => router.push('/auth/forgot-password')}>
                <Text className="text-neeva-cyan-400 text-body-sm">Forgot password?</Text>
              </Pressable>

              <Button title="Sign In" onPress={handleSubmit(handleEmailLogin)} loading={isLoading} size="lg" className="w-full" />

              {Platform.OS === 'web' && (
                <>
                  <View className="flex-row items-center my-6">
                    <View className="flex-1 h-px bg-neeva-glass-border" />
                    <Text className="text-white/30 text-body-sm mx-4">or</Text>
                    <View className="flex-1 h-px bg-neeva-glass-border" />
                  </View>

                  <Button title="Continue with Google" onPress={handleGoogleLogin} loading={isGoogleLoading} variant="secondary" size="lg" className="w-full" />
                </>
              )}
            </View>

            <View className="flex-row justify-center mt-8 mb-8">
              <Text className="text-white/40 text-body-sm">Don't have an account? </Text>
              <Pressable onPress={() => router.push('/auth/signup')}>
                <Text className="text-neeva-cyan-400 text-body-sm font-medium">Sign up</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
