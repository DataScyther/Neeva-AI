/**
 * GlassCard — Frosted glass container component
 *
 * The signature Neeva visual element.
 * Supports pressable and non-pressable variants.
 */

import React from 'react';
import { View, Pressable, type ViewProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  type WithSpringConfig,
} from 'react-native-reanimated';

interface GlassCardProps extends ViewProps {
  children: React.ReactNode;
  onPress?: () => void;
  intensity?: 'light' | 'medium' | 'dark';
  className?: string;
}

const intensityStyles = {
  light: 'bg-neeva-glass-light border border-neeva-glass-border',
  medium: 'bg-neeva-glass-medium border border-neeva-glass-border',
  dark: 'bg-neeva-glass-dark/30 border border-neeva-glass-border',
} as const;

const springConfig: WithSpringConfig = {
  damping: 20,
  stiffness: 300,
  mass: 0.5,
};

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function GlassCard({
  children,
  onPress,
  intensity = 'dark',
  className = '',
  style,
  ...viewProps
}: GlassCardProps) {
  const animatedStyle = useAnimatedStyle(() => {
    if (!onPress) return {};
    return {
      transform: [
        { scale: withSpring(1, springConfig) },
      ],
    };
  });

  const baseStyles = `rounded-glass-lg p-5 ${intensityStyles[intensity]} ${className}`;

  if (onPress) {
    return (
      <AnimatedPressable
        onPress={onPress}
        className={baseStyles}
        style={[animatedStyle, style as any]}
        {...(viewProps as any)}
      >
        {children}
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedView className={baseStyles} style={[animatedStyle, style as any]} {...viewProps}>
      {children}
    </AnimatedView>
  );
}

export default GlassCard;
