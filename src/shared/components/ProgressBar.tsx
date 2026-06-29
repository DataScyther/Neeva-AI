import React, { useEffect } from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

export interface ProgressBarProps {
  percent: number; // 0-100
  height?: number;
  colors?: readonly string[];
  trackColor?: string;
  style?: ViewStyle;
  className?: string;
}

export const ProgressBar = React.memo(({
  percent,
  height = 6,
  colors = ['#8B5CF6', '#06B6D4'],
  trackColor = 'rgba(255, 255, 255, 0.08)',
  style,
  className = '',
}: ProgressBarProps) => {
  const animatedPercent = useSharedValue(0);

  useEffect(() => {
    animatedPercent.value = withSpring(percent, { damping: 18, stiffness: 80 });
  }, [percent, animatedPercent]);

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${Math.max(0, Math.min(100, animatedPercent.value))}%`,
    };
  });

  const radius = height / 2;

  return (
    <View style={[styles.container, style]} className={className}>
      <View style={[styles.track, { height, borderRadius: radius, backgroundColor: trackColor }]}>
        <Animated.View style={[styles.progressBar, progressStyle]}>
          <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
            <Defs>
              <LinearGradient id="sharedProgressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor={colors[0]} />
                <Stop offset="100%" stopColor={colors[1]} />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#sharedProgressGrad)" rx={radius} />
          </Svg>
        </Animated.View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  track: {
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
  progressBar: {
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
});

export default ProgressBar;
