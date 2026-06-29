import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { GlassCard } from '@/shared/components/GlassCard';
import { ProgressRing } from '@/shared/components/ProgressRing';
import { Sparkles } from 'lucide-react-native';
import { typography, spacing } from '@/core/theme';

interface MoodSnapshotCardProps {
  /** Mood emoji (default: '😌') */
  moodEmoji?: string;
  /** Mood label (default: 'Calm') */
  moodLabel?: string;
  /** Last check-in time (default: '8:32 AM') */
  checkInTime?: string;
  /** Short summary dynamically prepared by Neeva AI */
  aiSummary?: string;
  /** Weekly wellness streak completion percent (0-100, default: 75) */
  completionProgress?: number;
  /** Callback when card is pressed */
  onPress?: () => void;
}

export function MoodSnapshotCard({
  moodEmoji = '😌',
  moodLabel = 'Calm',
  checkInTime = '8:32 AM',
  aiSummary = "You're feeling centered and calm today. A short breathing break will help maintain this focus.",
  completionProgress = 75,
  onPress,
}: MoodSnapshotCardProps) {
  return (
    <Animated.View
      entering={FadeInDown.delay(300).duration(600).springify()}
      style={styles.wrapper}
    >
      <GlassCard
        intensity="dark"
        onPress={onPress}
        className="border-white/10"
        style={styles.heroCard}
        accessible={true}
        accessibilityRole={onPress ? "button" : "header"}
        accessibilityLabel={`Mood Snapshot. Checked in as ${moodLabel} at ${checkInTime}. AI Summary: ${aiSummary}. Check-in completion progress is ${completionProgress} percent.`}
      >
        {/* Card Header Section */}
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <Sparkles size={14} color="#A78BFA" />
            <Text style={styles.sectionTitle}>
              Mood Snapshot
            </Text>
          </View>
          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <Text style={styles.progressLabel}>
              Streak Progress
            </Text>
            <ProgressRing
              progress={completionProgress}
              size={24}
              strokeWidth={3}
              color="#06B6D4" // Cyan progress ring color
              trackColor="rgba(255, 255, 255, 0.08)"
              showPercentage={false}
            />
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} className="bg-white/5" />

        {/* Card Body Section */}
        <View style={styles.cardBody}>
          {/* Emoji Container with glowing background */}
          <View style={styles.emojiContainer} className="bg-neeva-purple-500/10 border border-neeva-purple-500/20">
            <Text style={styles.emojiText}>{moodEmoji}</Text>
          </View>

          {/* Text Content */}
          <View style={styles.contentContainer}>
            <View style={styles.labelRow}>
              <Text style={styles.moodLabel}>
                {moodLabel}
              </Text>
              <Text style={styles.timeLabel}>
                • {checkInTime}
              </Text>
            </View>
            <Text
              style={styles.aiSummary}
              allowFontScaling={true}
              numberOfLines={3}
            >
              {aiSummary}
            </Text>
          </View>
        </View>
      </GlassCard>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: spacing.xl,
    marginTop: 4,
    marginBottom: 20, // More breathing room below the hero card
  },
  heroCard: {
    padding: 24, // Better internal spacing (increased from default 20)
    // Stronger card elevation / deep purple radial glow
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 20,
    elevation: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16, // Better internal spacing
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 13.5, // Slightly larger title
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    marginLeft: 8, // More breathing room
    color: '#C4B5FD', // text-neeva-purple-300
    fontFamily: typography.fontFamily.display,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.4)',
    marginRight: 8,
    fontFamily: typography.fontFamily.sans,
  },
  divider: {
    height: 1,
    width: '100%',
    marginBottom: 20, // Better internal spacing (increased from 16)
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  emojiContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 18, // Better internal spacing
  },
  emojiText: {
    fontSize: 22,
  },
  contentContainer: {
    flex: 1,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6, // Better internal spacing
  },
  moodLabel: {
    fontSize: 18, // Slightly larger title (mood label)
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: typography.fontFamily.sans,
  },
  timeLabel: {
    fontSize: 14, // Slightly larger
    marginLeft: 6,
    color: 'rgba(255, 255, 255, 0.4)',
    fontFamily: typography.fontFamily.sans,
  },
  aiSummary: {
    fontSize: 13.5, // Slightly larger
    lineHeight: 19, // Adjusted line height
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: typography.fontFamily.sans,
  },
});

export default MoodSnapshotCard;
