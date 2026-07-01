import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ProgressBar } from '@/shared/components/ProgressBar';
import { useTheme } from '@/hooks/useTheme';

interface ContinueJourneyCardProps {
  title: string;
  currentStep: number;
  totalSteps: number;
  percent: number;
  onContinue: () => void;
  disabled?: boolean;
}

export const ContinueJourneyCard = React.memo(({
  title,
  currentStep,
  totalSteps,
  percent,
  onContinue,
  disabled = false,
}: ContinueJourneyCardProps) => {
  const { colors } = useTheme();

  return (
    <Animated.View
      entering={FadeInDown.delay(100).duration(600).springify()}
    >
      <Pressable
        onPress={onContinue}
        disabled={disabled}
        style={[styles.card, { backgroundColor: colors.surface.primary, borderColor: colors.border.default }]}
        accessibilityRole="button"
        accessibilityLabel={`${title}, Lesson ${currentStep} of ${totalSteps}, ${percent} percent complete`}
      >
        <View style={styles.topRow}>
          <View style={[styles.thumbnail, { backgroundColor: `${colors.brand.primary}1A` }]}>
            <Text style={styles.thumbnailText}>🧠</Text>
          </View>
          <View style={styles.content}>
            <Text style={[styles.title, { color: colors.text.primary }]}>{title}</Text>
            <Text style={[styles.lesson, { color: colors.text.secondary }]}>
              Lesson {currentStep} of {totalSteps}
            </Text>
          </View>
          <View style={styles.chevron}>
            <Text style={[styles.chevronText, { color: colors.text.secondary }]}>›</Text>
          </View>
        </View>

        <View style={styles.progressRow}>
          <ProgressBar percent={percent} height={6} style={styles.progress} />
          <Text style={[styles.percentText, { color: colors.brand.primary }]}>{percent}% Complete</Text>
        </View>

        <View style={[styles.button, { backgroundColor: colors.brand.primary }]}>
          <Text style={[styles.buttonText, { color: colors.brand.contrastText }]}>Continue</Text>
        </View>
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
  thumbnail: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  thumbnailText: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  lesson: {
    fontSize: 12,
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
    fontSize: 12,
    fontWeight: '500',
  },
  button: {
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ContinueJourneyCard;
