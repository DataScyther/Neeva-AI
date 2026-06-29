import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Lightbulb } from 'lucide-react-native';
import { GlassCard } from '@/shared/components/GlassCard';
import { typography, spacing, borderRadius } from '@/core/theme';

export interface WellnessInsightCardProps {
  insightText: string;
}

export const WellnessInsightCard = React.memo(({
  insightText,
}: WellnessInsightCardProps) => {
  return (
    <Animated.View
      entering={FadeInDown.delay(200).duration(600).springify()}
      style={styles.wrapper}
    >
      <GlassCard intensity="dark" className="border-cyan-500/10">
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <Lightbulb size={16} color="#06B6D4" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.sectionTitle}>Wellness Insight</Text>
            <Text style={styles.bodyText} allowFontScaling={true}>
              {insightText}
            </Text>
          </View>
        </View>
      </GlassCard>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: spacing.xl,
    marginVertical: spacing.sm,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.sm,
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#06B6D4',
    textTransform: 'uppercase',
    letterSpacing: 1.0,
    fontFamily: typography.fontFamily.sans,
    marginBottom: 4,
  },
  bodyText: {
    fontSize: 13,
    lineHeight: 18,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: typography.fontFamily.sans,
  },
});

export default WellnessInsightCard;
