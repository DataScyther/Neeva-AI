import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useNavigationContext } from './NavigationContext';

interface ActiveIndicatorProps {
  activeIndex: number;
  totalTabs: number;
  containerWidth: number;
}

export function ActiveIndicator({
  activeIndex,
  totalTabs,
  containerWidth,
}: ActiveIndicatorProps) {
  const { colors } = useNavigationContext();
  const translateX = useSharedValue(0);

  const tabWidth = totalTabs > 0 ? containerWidth / totalTabs : 0;
  const indicatorWidth = 16;
  const offset = tabWidth / 2 - indicatorWidth / 2;

  useEffect(() => {
    if (tabWidth > 0) {
      translateX.value = withTiming(activeIndex * tabWidth + offset, {
        duration: 200,
        easing: Easing.bezier(0.2, 1, 0.3, 1),
      });
    }
  }, [activeIndex, tabWidth, offset]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  if (containerWidth === 0) return null;

  return (
    <Animated.View
      style={[
        styles.indicator,
        animatedStyle,
        {
          backgroundColor: colors.brand.primary,
          width: indicatorWidth,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  indicator: {
    position: 'absolute',
    bottom: 6,
    height: 4,
    borderRadius: 2,
    zIndex: 5,
  },
});

export default ActiveIndicator;
