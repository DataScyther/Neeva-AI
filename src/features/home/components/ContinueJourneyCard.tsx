import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ProgressBar } from '@/shared/components/ProgressBar';
import { useTheme } from '@/hooks/useTheme';
import { JourneyThumbnail } from './JourneyThumbnail';
import { LessonStatus } from './LessonStatus';
import { ContinueButton } from './ContinueButton';
import { JourneyCompletedState } from './JourneyCompletedState';
import { JourneyLoadingState } from './JourneyLoadingState';
import { JourneyErrorState } from './JourneyErrorState';
import { EmptyJourneyState } from './EmptyJourneyState';
import type { JourneyProgress } from '@/features/journey/types/JourneyProgress';

interface ContinueJourneyCardProps {
  journey: JourneyProgress | null | undefined;
  isLoading: boolean;
  error: Error | null;
  onContinue: (journey: JourneyProgress) => void;
  onRetry: () => void;
  onStartJourney: () => void;
  onExplorePrograms: () => void;
}

export const ContinueJourneyCard = React.memo(({
  journey,
  isLoading,
  error,
  onContinue,
  onRetry,
  onStartJourney,
  onExplorePrograms,
}: ContinueJourneyCardProps) => {
  const { colors } = useTheme();

  if (!journey && !error) {
    return (
      <Animated.View entering={FadeInDown.delay(100).duration(600).springify()}>
        <JourneyLoadingState />
      </Animated.View>
    );
  }

  if (error) {
    return (
      <Animated.View entering={FadeInDown.delay(100).duration(600).springify()}>
        <JourneyErrorState onRetry={onRetry} />
      </Animated.View>
    );
  }

  if (!journey) {
    return null;
  }

  if (journey.status === 'completed') {
    return (
      <Animated.View entering={FadeInDown.delay(100).duration(600).springify()}>
        <JourneyCompletedState onExplore={onExplorePrograms} />
      </Animated.View>
    );
  }

  if (journey.status === 'not_started') {
    return (
      <Animated.View entering={FadeInDown.delay(100).duration(600).springify()}>
        <EmptyJourneyState onStart={onStartJourney} />
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeInDown.delay(100).duration(600).springify()}>
      <Pressable
        onPress={() => onContinue(journey)}
        style={[styles.card, { backgroundColor: colors.surface.primary, borderColor: colors.border.default }]}
        accessibilityRole="button"
        accessibilityLabel={`${journey.title}, Lesson ${journey.currentLesson} of ${journey.totalLessons}, ${journey.completionPercent} percent complete. Continue.`}
      >
        <View style={styles.topRow}>
          <JourneyThumbnail />
          <View style={styles.content}>
            <Text
              style={[styles.title, { color: colors.text.primary }]}
              numberOfLines={2}
              allowFontScaling
            >
              {journey.title}
            </Text>
            <LessonStatus current={journey.currentLesson} total={journey.totalLessons} />
          </View>
          <View style={styles.chevron}>
            <Text style={[styles.chevronText, { color: colors.text.secondary }]}>›</Text>
          </View>
        </View>

        <View style={styles.progressRow}>
          <ProgressBar
            percent={journey.completionPercent}
            height={8}
            variant="default"
            color={colors.brand.primary}
            trackColor={`${colors.border.default}80`}
            style={styles.progress}
          />
          <Text style={[styles.percentText, { color: colors.text.secondary }]}>
            {journey.completionPercent}% Complete
          </Text>
        </View>

        <ContinueButton onPress={() => onContinue(journey)} />
      </Pressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  content: {
    flex: 1,
    marginLeft: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 2,
  },
  chevron: {
    marginLeft: 8,
  },
  chevronText: {
    fontSize: 24,
    opacity: 0.6,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  progress: {
    flex: 1,
    marginRight: 12,
  },
  percentText: {
    fontSize: 13,
    fontWeight: '500',
  },
});

export default ContinueJourneyCard;
