import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Clock, Activity, Sparkles } from 'lucide-react-native';
import { typography, borderRadius } from '@/core/theme';

export interface RecommendationMetaProps {
  durationMinutes: number;
  difficulty: string;
  moodBenefit: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const InteractiveChip = React.memo(({ children, style }: { children: React.ReactNode; style?: any }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(scale.value, { damping: 15, stiffness: 400 }) }],
    opacity: withSpring(opacity.value, { damping: 15, stiffness: 200 }),
  }));

  const handlePressIn = () => {
    scale.value = 0.94;
    opacity.value = 0.85;
  };

  const handlePressOut = () => {
    scale.value = 1.0;
    opacity.value = 1.0;
  };

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[style, animatedStyle]}
      accessible={true}
      accessibilityRole="button"
    >
      {children}
    </AnimatedPressable>
  );
});

export const RecommendationMeta = React.memo(({
  durationMinutes,
  difficulty,
  moodBenefit,
}: RecommendationMetaProps) => {
  return (
    <View style={styles.container}>
      {/* Duration Badge */}
      <InteractiveChip style={[styles.badge, styles.glassBadge]}>
        <Clock size={12} color="rgba(255, 255, 255, 0.55)" />
        <Text style={styles.badgeText}>{durationMinutes} min</Text>
      </InteractiveChip>

      {/* Difficulty Badge */}
      <InteractiveChip style={[styles.badge, styles.glassBadge]}>
        <Activity size={12} color="rgba(255, 255, 255, 0.55)" />
        <Text style={styles.badgeText}>{difficulty}</Text>
      </InteractiveChip>

      {/* Mood Benefit Badge */}
      <InteractiveChip style={[styles.badge, styles.benefitBadge]}>
        <Sparkles size={12} color="#22D3EE" />
        <Text style={[styles.badgeText, styles.benefitText]}>{moodBenefit}</Text>
      </InteractiveChip>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 0,
    marginBottom: 0,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 26,
    paddingHorizontal: 10,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    gap: 6,
  },
  glassBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  benefitBadge: {
    backgroundColor: 'rgba(34, 211, 238, 0.04)', // Softer cyan tint
    borderColor: 'rgba(34, 211, 238, 0.1)',
  },
  badgeText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.65)',
    fontWeight: '600',
    fontFamily: typography.fontFamily.sans,
  },
  benefitText: {
    color: '#22D3EE', // Cyan-300
    fontWeight: '700',
  },
});

export default RecommendationMeta;

