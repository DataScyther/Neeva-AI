/**
 * MoodStatusCard — Daily mood check-in card.
 *
 * Displays:
 *  • "How are you feeling today?" prompt
 *  • A row of selectable mood emoji buttons
 *  • Optional "last check-in" time indicator
 *
 * Uses GlassCard as the container for visual consistency.
 */

import React, { useState, useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import { GlassCard } from '@/shared/components/GlassCard';

// ── Mood Data ──────────────────────────────────────────────────────────────

interface MoodOption {
  emoji: string;
  label: string;
  color: string;
}

const MOOD_OPTIONS: MoodOption[] = [
  { emoji: '😊', label: 'Happy', color: '#22D3EE' },
  { emoji: '😌', label: 'Calm', color: '#8B5CF6' },
  { emoji: '😐', label: 'Neutral', color: '#A78BFA' },
  { emoji: '😔', label: 'Sad', color: '#6D28D9' },
  { emoji: '😰', label: 'Anxious', color: '#0891B2' },
];

// ── Mood Button ────────────────────────────────────────────────────────────

interface MoodButtonProps {
  mood: MoodOption;
  isSelected: boolean;
  onPress: () => void;
  index: number;
}

function MoodButton({ mood, isSelected, onPress, index }: MoodButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.88, { damping: 15, stiffness: 400 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 12, stiffness: 300 });
  }, [scale]);

  return (
    <Animated.View
      entering={FadeInDown.delay(100 + index * 60)
        .duration(400)
        .springify()}
      style={animatedStyle}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        className={`items-center justify-center w-14 h-14 rounded-2xl ${
          isSelected
            ? 'bg-neeva-purple-600/40 border-2 border-neeva-purple-400'
            : 'bg-white/5 border border-white/10'
        }`}
        accessibilityLabel={`Select mood: ${mood.label}`}
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected }}
      >
        <Text className="text-2xl">{mood.emoji}</Text>
      </Pressable>
      <Text
        className={`text-center mt-1.5 text-label ${
          isSelected ? 'text-neeva-purple-300 font-semibold' : 'text-white/40'
        }`}
      >
        {mood.label}
      </Text>
    </Animated.View>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────

interface MoodStatusCardProps {
  /** Callback when a mood is selected. */
  onMoodSelect?: (mood: MoodOption) => void;
  /** Optional last check-in time string. */
  lastCheckIn?: string | null;
}

export function MoodStatusCard({
  onMoodSelect,
  lastCheckIn,
}: MoodStatusCardProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const handleMoodPress = useCallback(
    (mood: MoodOption) => {
      setSelectedMood(mood.emoji);
      onMoodSelect?.(mood);
    },
    [onMoodSelect],
  );

  return (
    <Animated.View entering={FadeInDown.delay(150).duration(500).springify()}>
      <GlassCard intensity="dark" className="mx-5 mb-4">
        {/* Title row */}
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-white text-card-title font-semibold">
            How are you feeling?
          </Text>
          {lastCheckIn && (
            <Text className="text-white/30 text-caption">
              Last: {lastCheckIn}
            </Text>
          )}
        </View>

        <Text className="text-white/50 text-body-sm mb-5">
          Take a moment to check in with yourself today.
        </Text>

        {/* Mood emoji row */}
        <View className="flex-row justify-between">
          {MOOD_OPTIONS.map((mood, index) => (
            <MoodButton
              key={mood.emoji}
              mood={mood}
              isSelected={selectedMood === mood.emoji}
              onPress={() => handleMoodPress(mood)}
              index={index}
            />
          ))}
        </View>
      </GlassCard>
    </Animated.View>
  );
}

export default MoodStatusCard;
