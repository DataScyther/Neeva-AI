import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { useTheme } from '@/hooks/useTheme';

interface MoodSnapshotCardProps {
  moodEmoji?: string;
  moodLabel?: string;
  supportText?: string;
  onPress?: () => void;
}

export function MoodSnapshotCard({
  moodEmoji = '😌',
  moodLabel = "You're feeling balanced",
  supportText = 'Keep up the good work.',
  onPress,
}: MoodSnapshotCardProps) {
  const { colors } = useTheme();

  return (
    <Animated.View
      entering={FadeInDown.delay(200).duration(600).springify()}
    >
      <Pressable
        onPress={onPress}
        style={[styles.card, { backgroundColor: colors.surface.primary, borderColor: colors.border.default }]}
        accessibilityRole="button"
        accessibilityLabel={`Mood Snapshot. ${moodLabel}. ${supportText}`}
      >
        <View style={styles.left}>
          <View style={[styles.emojiContainer, { backgroundColor: `${colors.brand.primary}1A` }]}>
            <Text style={styles.emoji}>{moodEmoji}</Text>
          </View>
          <View style={styles.center}>
            <Text style={[styles.label, { color: colors.brand.primary }]}>Mood Snapshot</Text>
            <Text style={[styles.status, { color: colors.text.primary }]}>{moodLabel}</Text>
            <Text style={[styles.support, { color: colors.text.secondary }]}>{supportText}</Text>
          </View>
        </View>
        <ChevronRight size={20} color={colors.text.secondary} style={{ opacity: 0.6 }} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  emojiContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  emoji: {
    fontSize: 24,
  },
  center: {
    flex: 1,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  status: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  support: {
    fontSize: 13,
  },
});

export default MoodSnapshotCard;
