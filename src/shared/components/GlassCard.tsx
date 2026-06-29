/**
 * GlassCard — Frosted glass container component
 *
 * The signature Neeva visual element.
 * Supports pressable and non-pressable variants.
 */

import React from 'react';
import { View, Pressable, StyleSheet, type ViewProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  type WithSpringConfig,
} from 'react-native-reanimated';
import { shadows } from '@/core/theme';

import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

interface GlassCardProps extends ViewProps {
  children: React.ReactNode;
  onPress?: () => void;
  intensity?: 'light' | 'medium' | 'dark';
  className?: string;
  themeColor?: string; // Dynamic border highlight and glow tint
}

const intensityStyles = {
  light: 'bg-neeva-glass-light',
  medium: 'bg-neeva-glass-medium',
  dark: 'bg-neeva-glass-dark/30',
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
  themeColor,
  style,
  onLayout,
  ...viewProps
}: GlassCardProps) {
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });

  const handleLayout = React.useCallback(
    (event: any) => {
      const { width, height } = event.nativeEvent.layout;
      setDimensions({ width, height });
      if (onLayout) {
        onLayout(event);
      }
    },
    [onLayout]
  );

  const animatedStyle = useAnimatedStyle(() => {
    if (!onPress) return {};
    return {
      transform: [
        { scale: withSpring(1, springConfig) },
      ],
    };
  });

  // Extract border radius from className to match SVG path exactly
  let rx = 24;
  if (className.includes('rounded-glass-sm')) {
    rx = 12;
  } else if (className.includes('rounded-glass-lg')) {
    rx = 24;
  } else if (className.includes('rounded-glass')) {
    rx = 16;
  }

  const baseStyles = `rounded-glass-lg p-5 ${intensityStyles[intensity]} ${className}`;

  const combinedStyle = [
    styles.shadow,
    themeColor ? { shadowColor: themeColor, shadowOpacity: 0.2, shadowRadius: 16 } : null,
    animatedStyle,
    style as any,
  ];

  const svgBorder = dimensions.width > 0 && dimensions.height > 0 ? (
    <View style={[StyleSheet.absoluteFill, { borderRadius: rx, overflow: 'hidden' }]} pointerEvents="none">
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id={`glassBorderGrad-${rx}-${themeColor || 'default'}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop
              offset="0%"
              stopColor={themeColor ? '#FFFFFF' : 'rgba(255, 255, 255, 0.25)'}
              stopOpacity={themeColor ? 0.32 : 1.0}
            />
            {themeColor ? (
              <Stop offset="25%" stopColor={themeColor} stopOpacity={0.22} />
            ) : null}
            <Stop offset="60%" stopColor="rgba(255, 255, 255, 0.06)" />
            <Stop offset="100%" stopColor="rgba(255, 255, 255, 0.02)" />
          </LinearGradient>
        </Defs>
        <Rect
          x={0.5}
          y={0.5}
          width={dimensions.width - 1}
          height={dimensions.height - 1}
          rx={rx - 0.5}
          ry={rx - 0.5}
          fill="none"
          stroke={`url(#glassBorderGrad-${rx}-${themeColor || 'default'})`}
          strokeWidth={1}
        />
      </Svg>
    </View>
  ) : (
    <View
      style={[
        StyleSheet.absoluteFill,
        {
          borderRadius: rx,
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.08)',
        },
      ]}
      pointerEvents="none"
    />
  );

  if (onPress) {
    return (
      <AnimatedPressable
        onPress={onPress}
        onLayout={handleLayout}
        className={baseStyles}
        style={combinedStyle}
        {...(viewProps as any)}
      >
        {svgBorder}
        {children}
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedView
      onLayout={handleLayout}
      className={baseStyles}
      style={combinedStyle}
      {...viewProps}
    >
      {svgBorder}
      {children}
    </AnimatedView>
  );
}

const styles = StyleSheet.create({
  shadow: {
    ...shadows.glass,
  },
});

export default GlassCard;
