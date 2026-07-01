import React, { useEffect } from 'react';
import { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';

const LEVEL_COLORS: Record<number, string> = {
  1: '#F43F5E', // Rose red
  2: '#F59E0B', // Amber
  3: '#64748B', // Cool gray
  4: '#8B5CF6', // Purple
  5: '#10B981', // Emerald green
};

interface MoodPointProps {
  cx: number;
  cy: number;
  moodLevel: number | null;
  isToday?: boolean;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const MoodPoint = React.memo(({ cx, cy, moodLevel, isToday }: MoodPointProps) => {
  const { colors } = useTheme();
  const pulse = useSharedValue(0);

  useEffect(() => {
    if (isToday) {
      pulse.value = withRepeat(
        withTiming(1, {
          duration: 2000,
          easing: Easing.out(Easing.ease),
        }),
        -1,
        false
      );
    }
  }, [isToday]);

  const rippleProps = useAnimatedProps(() => {
    return {
      r: 6 + pulse.value * 12,
      opacity: 0.35 * (1 - pulse.value),
    };
  });

  const innerPulseProps = useAnimatedProps(() => {
    return {
      r: 4.5 + Math.sin(pulse.value * Math.PI) * 0.8,
    };
  });

  const activeColor = moodLevel !== null ? LEVEL_COLORS[moodLevel] : colors.brand.primary;

  if (isToday) {
    return (
      <>
        {/* Pulsing Glow Ring */}
        <AnimatedCircle
          cx={cx}
          cy={cy}
          fill={activeColor}
          animatedProps={rippleProps}
        />
        {/* Core Ring */}
        <Circle
          cx={cx}
          cy={cy}
          r={7.5}
          fill={activeColor}
          opacity={0.2}
        />
        {/* Solid Outer Ring */}
        <Circle
          cx={cx}
          cy={cy}
          r={5.5}
          stroke={activeColor}
          strokeWidth={1.5}
          fill={colors.surface.primary}
        />
        {/* Animating Inner Core */}
        <AnimatedCircle
          cx={cx}
          cy={cy}
          fill={activeColor}
          animatedProps={innerPulseProps}
        />
      </>
    );
  }

  if (moodLevel !== null) {
    const pointColor = LEVEL_COLORS[moodLevel] || LEVEL_COLORS[3];
    return (
      <>
        {/* Glass Outer Glow for logged days */}
        <Circle
          cx={cx}
          cy={cy}
          r={6.5}
          fill={pointColor}
          opacity={0.12}
        />
        <Circle
          cx={cx}
          cy={cy}
          r={4}
          fill={pointColor}
        />
      </>
    );
  }

  // Styled empty check-in node
  return (
    <Circle
      cx={cx}
      cy={cy}
      r={3}
      fill="none"
      stroke={colors.border.default}
      strokeWidth={1}
      strokeDasharray="2 2"
      opacity={0.4}
    />
  );
});

MoodPoint.displayName = 'MoodPoint';

