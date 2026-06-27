/**
 * SplashScreen — App initialization screen
 *
 * Responsibilities:
 * - Initialize Firebase auth
 * - Restore session if available
 * - Navigate to appropriate screen based on auth state
 */

import React, { useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { useAuth } from '@/shared/hooks/useAuth';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Sparkles } from 'lucide-react-native';

interface SplashScreenProps {
  onComplete: (destination: 'auth' | 'home') => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const { initialized, isAuthenticated, initialize } = useAuth();
  const logoScale = useSharedValue(0.3);
  const logoOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);
  const hasNavigated = useRef(false);

  // Initialization
  useEffect(() => {
    initialize().catch(console.error);
  }, [initialize]);

  // Animation sequence
  useEffect(() => {
    logoScale.value = withSequence(
      withTiming(1.1, { duration: 600, easing: Easing.out(Easing.back()) }),
      withTiming(1, { duration: 200 })
    );
    logoOpacity.value = withTiming(1, { duration: 400 });

    setTimeout(() => {
      subtitleOpacity.value = withTiming(1, { duration: 400 });
    }, 300);
  }, [logoScale, logoOpacity, subtitleOpacity]);

  // Navigate once initialized
  useEffect(() => {
    if (initialized && !hasNavigated.current) {
      hasNavigated.current = true;
      const timer = setTimeout(() => {
        runOnJS(onComplete)(isAuthenticated ? 'home' : 'auth');
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [initialized, isAuthenticated, onComplete]);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const subtitleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  return (
    <View className="flex-1 bg-surface-dark items-center justify-center">
      {/* Animated Logo */}
      <Animated.View
        style={logoAnimatedStyle}
        className="items-center mb-8"
      >
        <View className="w-24 h-24 rounded-full bg-neeva-purple-600/20 items-center justify-center border border-neeva-glass-border">
          <Sparkles size={48} color="#8B5CF6" />
        </View>
      </Animated.View>

      {/* Title */}
      <Text className="text-white text-page-title font-display font-bold mb-2">
        Neeva
      </Text>

      {/* Subtitle */}
      <Animated.View style={subtitleAnimatedStyle}>
        <Text className="text-white/50 text-body text-center px-8 mb-12">
          Your personal wellness companion
        </Text>
      </Animated.View>

      {/* Loading indicator */}
      {!initialized && (
        <LoadingSpinner size={24} color="#8B5CF6" />
      )}
    </View>
  );
}

export default SplashScreen;