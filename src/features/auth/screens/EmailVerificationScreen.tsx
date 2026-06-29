import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, Pressable, ScrollView, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Mail, RefreshCw, LogOut, CheckCircle2, ArrowRight } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { useAuth } from '@/shared/hooks/useAuth';
import { Button } from '@/shared/components/Button';
import { GlassCard } from '@/shared/components/GlassCard';
import { AUTH_STRINGS } from '@/features/auth/constants';
import { useAppStore } from '@/core/store/useAppStore';

const { width } = Dimensions.get('window');

export function EmailVerificationScreen() {
  const router = useRouter();
  const {
    user,
    sendVerificationEmail,
    checkEmailVerified,
    logout,
    loading,
    error,
    clearError,
  } = useAuth();

  const addToast = useAppStore((state) => state.addToast);
  const [cooldown, setCooldown] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const checkInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-check verification status every 5 seconds while on this screen
  useEffect(() => {
    checkInterval.current = setInterval(async () => {
      try {
        const verified = await checkEmailVerified();
        if (verified) {
          clearInterval(checkInterval.current!);
          addToast({
            type: 'success',
            message: 'Email successfully verified!',
          });
          router.replace('/onboarding');
        }
      } catch (err) {
        // Silent fail for background check
      }
    }, 5000);

    return () => {
      if (checkInterval.current) {
        clearInterval(checkInterval.current);
      }
    };
  }, [checkEmailVerified, router, addToast]);

  // Cooldown countdown timer for resending verification email
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResend = useCallback(async () => {
    if (cooldown > 0) return;
    try {
      clearError();
      await sendVerificationEmail();
      setCooldown(30); // 30 seconds cooldown
      addToast({
        type: 'success',
        message: AUTH_STRINGS.VERIFICATION_RESENT,
      });
    } catch (err) {
      addToast({
        type: 'error',
        message: err instanceof Error ? err.message : AUTH_STRINGS.ERROR_GENERIC,
      });
    }
  }, [sendVerificationEmail, cooldown, clearError, addToast]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    clearError();
    try {
      const verified = await checkEmailVerified();
      if (verified) {
        addToast({
          type: 'success',
          message: 'Email successfully verified!',
        });
        router.replace('/onboarding');
      } else {
        addToast({
          type: 'warning',
          message: 'Email is not verified yet. Please check your inbox and try again.',
        });
      }
    } catch (err) {
      addToast({
        type: 'error',
        message: err instanceof Error ? err.message : AUTH_STRINGS.ERROR_GENERIC,
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [checkEmailVerified, clearError, router, addToast]);

  const handleSkip = useCallback(() => {
    // Skip verification for now - marked onboarded or continue
    router.replace('/onboarding');
  }, [router]);

  const handleSignOut = useCallback(async () => {
    try {
      if (checkInterval.current) {
        clearInterval(checkInterval.current);
      }
      await logout();
      router.replace('/auth/login');
    } catch (err) {
      addToast({
        type: 'error',
        message: 'Failed to sign out.',
      });
    }
  }, [logout, router, addToast]);

  return (
    <SafeAreaView className="flex-1 bg-app-dark">
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow justify-center px-6 py-12"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Top Branding / Logo */}
        <Animated.View
          entering={FadeInDown.duration(500).springify()}
          className="items-center mb-8"
        >
          <View className="w-20 h-20 rounded-full bg-neeva-purple-600/20 border border-neeva-glass-border items-center justify-center mb-4">
            <Mail size={40} color="#8B5CF6" />
          </View>
          <Text className="text-4xl font-bold text-white tracking-tight font-display">
            {AUTH_STRINGS.SPLASH_TITLE}
          </Text>
        </Animated.View>

        {/* Verification Card */}
        <Animated.View entering={FadeInDown.delay(100).duration(500).springify()}>
          <GlassCard intensity="dark" className="p-6 mb-6">
            <Text
              className="text-white text-section-title font-semibold mb-2"
              accessibilityRole="header"
            >
              {AUTH_STRINGS.VERIFICATION_TITLE}
            </Text>

            <Text className="text-white/50 text-body mb-6 leading-6">
              {AUTH_STRINGS.VERIFICATION_SUBTITLE}
            </Text>

            {user?.email && (
              <View className="bg-neeva-glass-highlight/50 border border-neeva-glass-border/30 rounded-glass-sm p-4 mb-6 items-center">
                <Text className="text-white/40 text-caption font-medium mb-1">
                  Sent to:
                </Text>
                <Text className="text-neeva-cyan-400 font-semibold text-body">
                  {user.email}
                </Text>
              </View>
            )}

            {error && (
              <View className="bg-red-500/10 border border-red-500/20 rounded-glass-sm px-4 py-3 mb-6">
                <Text className="text-red-400 text-body-sm">{error}</Text>
              </View>
            )}

            <Button
              title={AUTH_STRINGS.VERIFICATION_REFRESH}
              onPress={handleRefresh}
              loading={isRefreshing}
              variant="primary"
              size="lg"
              className="w-full mb-3"
              icon={<RefreshCw size={16} color="#FFFFFF" />}
              accessibilityLabel="Check if verified"
              accessibilityHint="Checks if you have verified your email via the link sent"
            />

            <Button
              title={
                cooldown > 0
                  ? `${AUTH_STRINGS.VERIFICATION_RESEND} (${cooldown}s)`
                  : AUTH_STRINGS.VERIFICATION_RESEND
              }
              onPress={handleResend}
              disabled={cooldown > 0 || loading}
              variant="secondary"
              size="lg"
              className="w-full"
              accessibilityLabel="Resend verification email"
              accessibilityHint="Sends a new verification link to your email address"
            />
          </GlassCard>
        </Animated.View>

        {/* Footer Actions */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(500).springify()}
          className="items-center space-y-4 mt-4"
        >
          <Pressable
            className="flex-row items-center py-2 active:opacity-70"
            onPress={handleSkip}
            accessibilityRole="link"
            accessibilityLabel="Skip verification"
            accessibilityHint="Proceed to the application without email verification"
          >
            <Text className="text-white/50 text-body-sm font-semibold mr-1">
              {AUTH_STRINGS.VERIFICATION_SKIP}
            </Text>
            <ArrowRight size={14} color="rgba(255,255,255,0.4)" />
          </Pressable>

          <Pressable
            className="flex-row items-center py-2 active:opacity-70"
            onPress={handleSignOut}
            accessibilityRole="link"
            accessibilityLabel="Sign out of your account"
          >
            <LogOut size={14} color="#F87171" className="mr-2" />
            <Text className="text-red-400 text-body-sm font-medium">
              Sign Out / Edit Email
            </Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default EmailVerificationScreen;
