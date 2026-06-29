import React, { useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Compass } from 'lucide-react-native';
import { GlassCard } from '@/shared/components/GlassCard';
import { GradientButton } from '@/shared/components/GradientButton';
import { typography, spacing } from '@/core/theme';

export interface EmptyJourneyStateProps {
  onExplore: () => void;
}

export const EmptyJourneyState = React.memo(({ onExplore }: EmptyJourneyStateProps) => {
  return (
    <Animated.View
      entering={FadeInDown.delay(100).duration(600).springify()}
      style={styles.container}
    >
      <GlassCard intensity="dark" className="border-neeva-purple-500/10">
        <View style={styles.cardContent}>
          <View style={styles.iconContainer}>
            <Compass size={24} color="#8B5CF6" />
          </View>
          <Text style={styles.titleText}>Start your first wellness journey.</Text>
          <Text style={styles.subtext}>
            Choose a structured path to build focus, reduce stress, or improve sleep.
          </Text>

          <GradientButton
            title="Explore Journeys"
            onPress={onExplore}
            size="sm"
            style={styles.button}
          />
        </View>
      </GlassCard>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.xl,
    marginVertical: spacing.sm,
  },
  cardContent: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  titleText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: typography.fontFamily.display,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 12,
    lineHeight: 18,
    color: 'rgba(255, 255, 255, 0.5)',
    fontFamily: typography.fontFamily.sans,
    textAlign: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  button: {
    width: 160,
  },
});

export default EmptyJourneyState;
