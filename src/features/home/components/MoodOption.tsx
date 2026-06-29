import React, { useCallback } from 'react';
import { Text, Pressable, StyleSheet, Platform, Vibration } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  FadeInDown,
} from 'react-native-reanimated';
import { borderRadius, typography } from '@/core/theme';

export interface MoodOptionProps {
  emoji: string;
  label: string;
  isSelected: boolean;
  onPress: () => void;
  index: number;
  color?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const MoodOption = React.memo(({
  emoji,
  label,
  isSelected,
  onPress,
  index,
  color = '#8B5CF6',
}: MoodOptionProps) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    // When selected, scale up slightly (1.05x). Otherwise, follow the press interaction scale.
    const baseScale = isSelected ? 1.05 : 1.0;
    return {
      transform: [
        {
          scale: withSpring(scale.value * baseScale, {
            damping: 12,
            stiffness: 250,
          }),
        },
      ],
      borderColor: withSpring(
        isSelected ? `${color}b0` : 'rgba(255, 255, 255, 0.08)',
        { damping: 20, stiffness: 200 }
      ),
      backgroundColor: withSpring(
        isSelected ? `${color}22` : 'rgba(255, 255, 255, 0.03)',
        { damping: 20, stiffness: 200 }
      ),
      // Sleek neon glow for selected state
      shadowColor: color,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: withSpring(isSelected ? 0.35 : 0, { damping: 15, stiffness: 200 }),
      shadowRadius: withSpring(isSelected ? 10 : 0, { damping: 15, stiffness: 200 }),
      elevation: isSelected ? 4 : 0,
    };
  });

  const handlePressIn = useCallback(() => {
    scale.value = 0.96; // Scale animation on tap (0.96 -> 1.0 spring)
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = 1.0;
  }, [scale]);

  const handlePress = useCallback(() => {
    try {
      if (Platform.OS === 'ios') {
        Vibration.vibrate(10);
      } else {
        Vibration.vibrate(15);
      }
    } catch (e) {
      console.debug('Haptic feedback not available:', e);
    }
    onPress();
  }, [onPress]);

  return (
    <AnimatedPressable
      entering={FadeInDown.delay(100 + index * 50)
        .duration(500)
        .springify()}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.container, animatedStyle]}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`Select mood: ${label}`}
      accessibilityState={{ selected: isSelected }}
    >
      <Text style={styles.emojiText}>{emoji}</Text>
      <Text
        style={[
          styles.labelText,
          isSelected ? { color: '#FFFFFF', fontWeight: '600' } : { color: 'rgba(255, 255, 255, 0.5)' },
        ]}
        numberOfLines={1}
        allowFontScaling={true}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
});

const styles = StyleSheet.create({
  container: {
    width: 82,
    height: 92,
    borderRadius: borderRadius.xl, // Use design token
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
    paddingVertical: 12,
  },
  emojiText: {
    fontSize: 36, // Larger emoji
    marginBottom: 4,
  },
  labelText: {
    fontSize: 11,
    fontFamily: typography.fontFamily.sans, // Use design token
    textAlign: 'center',
  },
});

export default MoodOption;

