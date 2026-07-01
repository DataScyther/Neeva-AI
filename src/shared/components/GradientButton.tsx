import React, { useCallback } from 'react';
import {
  Text,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Vibration,
  Platform,
  View,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { typography } from '@/core/theme';
import { useTheme } from '@/hooks/useTheme';

export interface GradientButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  colors?: readonly string[];
  style?: ViewStyle;
  className?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const GradientButton = React.memo(({
  title,
  onPress,
  disabled = false,
  loading = false,
  icon,
  size = 'md',
  colors: propColors,
  style,
  className = '',
}: GradientButtonProps) => {
  const { colors: themeColors } = useTheme();
  const colors = propColors || [themeColors.brand.primary, themeColors.brand.secondary];

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    const isPressed = scale.value < 1.0;
    const springScale = withSpring(scale.value, {
      damping: 15,
      stiffness: 400,
      mass: 0.6,
    });

    return {
      transform: [{ scale: springScale }],
      opacity: withSpring(disabled ? 0.5 : 1.0, { damping: 15, stiffness: 200 }),
      // Deep glow shadow which shrinks/collapses on press to simulate physical depth
      shadowOpacity: withSpring(isPressed ? 0.12 : 0.35, { damping: 15 }),
      shadowRadius: withSpring(isPressed ? 6 : 18, { damping: 15 }),
      shadowOffset: {
        width: 0,
        height: withSpring(isPressed ? 2 : 8, { damping: 15 }),
      },
      // Android depth
      elevation: withSpring(isPressed ? 2 : 8, { damping: 15 }),
    };
  });

  const handlePressIn = useCallback(() => {
    if (!disabled && !loading) {
      scale.value = 0.95;
    }
  }, [disabled, loading, scale]);

  const handlePressOut = useCallback(() => {
    scale.value = 1.0;
  }, [scale]);

  const handlePress = useCallback(async () => {
    if (disabled || loading) return;

    try {
      // Try high-quality native haptic impact
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e) {
      // Fallback to standard Vibration API if Haptics is unavailable
      try {
        if (Platform.OS === 'ios') {
          Vibration.vibrate(10);
        } else {
          Vibration.vibrate([0, 8]);
        }
      } catch (err) {
        console.debug('Haptics fallback failed:', err);
      }
    }

    onPress();
  }, [disabled, loading, onPress]);

  // Size specific styles
  const btnHeight = size === 'sm' ? 40 : size === 'md' ? 48 : 56;
  const btnRadius = size === 'sm' ? 12 : size === 'md' ? 16 : 20;
  const fontSize = size === 'sm' ? 12 : size === 'md' ? 14 : 16;
  const iconLeftOffset = size === 'sm' ? 14 : size === 'md' ? 18 : 22;

  const activeShadowStyle = !disabled && !loading ? { shadowColor: themeColors.brand.primary } : {};
  const borderStyle = !disabled && !loading ? { borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.15)' } : {};

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={[
        styles.button,
        { height: btnHeight, borderRadius: btnRadius },
        activeShadowStyle,
        borderStyle,
        animatedStyle,
        style,
      ]}
      className={className}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: disabled || loading }}
    >
      {/* Background Gradient */}
      {!disabled && !loading && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <Svg width="100%" height="100%">
            <Defs>
              <LinearGradient id="gradientBtnGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor={colors[0]} />
                <Stop offset="100%" stopColor={colors[1]} />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" rx={btnRadius} fill="url(#gradientBtnGrad)" />
          </Svg>
        </View>
      )}

      {disabled && !loading && (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: themeColors.background.secondary, borderRadius: btnRadius }]} pointerEvents="none" />
      )}

      {loading ? (
        <ActivityIndicator size="small" color={themeColors.brand.contrastText} />
      ) : (
        <View style={styles.contentRow}>
          {icon && (
            <View style={[styles.iconContainer, { left: iconLeftOffset }]} pointerEvents="none">
              {icon}
            </View>
          )}
          <Text style={[styles.text, { fontSize, color: themeColors.brand.contrastText }]}>{title}</Text>
        </View>
      )}
    </AnimatedPressable>
  );
});

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    width: '100%',
    position: 'relative',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    position: 'relative',
    paddingHorizontal: 40,
  },
  iconContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: '700',
    fontFamily: typography.fontFamily.display,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});

export default GradientButton;
