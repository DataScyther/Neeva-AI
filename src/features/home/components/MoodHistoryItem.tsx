import React, { useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  FadeInDown,
} from 'react-native-reanimated';

export interface MoodHistoryItemProps {
  dayLabel: string;
  emoji: string | null;
  isSelected: boolean;
  onPress: () => void;
  index: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const MoodHistoryItem = React.memo(({
  dayLabel,
  emoji,
  isSelected,
  onPress,
  index,
}: MoodHistoryItemProps) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(scale.value, { damping: 15, stiffness: 350 }) }],
      borderColor: withSpring(
        isSelected ? '#06B6D4' : 'rgba(255, 255, 255, 0.08)',
        { damping: 20, stiffness: 200 }
      ),
      backgroundColor: withSpring(
        isSelected ? 'rgba(6, 182, 212, 0.12)' : 'rgba(255, 255, 255, 0.03)',
        { damping: 20, stiffness: 200 }
      ),
    };
  });

  const handlePressIn = useCallback(() => {
    scale.value = 0.92;
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = 1.0;
  }, [scale]);

  return (
    <View style={styles.itemWrapper}>
      <Text style={[styles.dayLabel, isSelected && styles.dayLabelSelected]}>
        {dayLabel}
      </Text>

      <AnimatedPressable
        entering={FadeInDown.delay(150 + index * 40)
          .duration(400)
          .springify()}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.emojiContainer, animatedStyle]}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`${dayLabel}. ${emoji ? `Mood entry: ${emoji}` : 'No mood entry recorded'}`}
        accessibilityState={{ selected: isSelected }}
      >
        {emoji ? (
          <Text style={styles.emojiText}>{emoji}</Text>
        ) : (
          <View style={styles.placeholderDot} />
        )}
      </AnimatedPressable>

      {/* Selected Indicator Dot */}
      <View style={styles.indicatorContainer}>
        {isSelected && (
          <Animated.View
            entering={FadeInDown.duration(200)}
            style={styles.indicator}
          />
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  itemWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  dayLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.4)',
    fontFamily: 'SF Pro Text',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dayLabelSelected: {
    color: '#06B6D4',
    fontWeight: '600',
  },
  emojiContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiText: {
    fontSize: 20,
  },
  placeholderDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  indicatorContainer: {
    height: 4,
    marginTop: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#06B6D4',
  },
});

export default MoodHistoryItem;
