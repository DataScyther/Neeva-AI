import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Play } from 'lucide-react-native';
import { GlassCard } from '@/shared/components/GlassCard';
import { GradientButton } from '@/shared/components/GradientButton';
import { RecommendationHeader, getBadgeStyleAndIcon } from './RecommendationHeader';
import { RecommendationMeta } from './RecommendationMeta';
import { RecommendationActions } from './RecommendationActions';
import { typography, spacing, borderRadius } from '@/core/theme';

export interface AIRecommendationCardProps {
  title: string;
  badgeText?: string;
  explanation: string;
  durationMinutes: number;
  difficulty: string;
  moodBenefit: string;
  ctaText: string;
  onStart: () => void;
  onNotNow: () => void;
  onShowAnother: () => void;
  onAskWhy: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export const AIRecommendationCard = React.memo(({
  title,
  badgeText,
  explanation,
  durationMinutes,
  difficulty,
  moodBenefit,
  ctaText,
  onStart,
  onNotNow,
  onShowAnother,
  onAskWhy,
  loading = false,
  disabled = false,
}: AIRecommendationCardProps) => {
  // Extract theme style dynamically based on the category/badge text
  const themeStyle = getBadgeStyleAndIcon(badgeText || '');

  return (
    <Animated.View
      entering={FadeInDown.delay(100).duration(800).springify().damping(20).stiffness(90)}
      style={styles.wrapper}
    >
      {/* Soft ambient back glow matches the dynamic recommendation theme */}
      <View style={[styles.ambientGlowLeft, { backgroundColor: themeStyle.color, shadowColor: themeStyle.color }]} />
      <View style={[styles.ambientGlowRight, { backgroundColor: themeStyle.color, shadowColor: themeStyle.color }]} />

      <GlassCard
        intensity="dark"
        themeColor={themeStyle.color}
        style={{ padding: spacing.xl }}
      >
        {/* Companion Header (Staggered) */}
        <Animated.View entering={FadeInDown.delay(200).duration(600)}>
          <RecommendationHeader title={title} badgeText={badgeText} />
        </Animated.View>

        {/* Visual grouping container for details & meta badges (Staggered) */}
        <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.bodyContainer}>
          {/* Dynamic Explanation Text */}
          <Text
            style={styles.explanationText}
            allowFontScaling={true}
          >
            {explanation}
          </Text>

          {/* Badges metadata */}
          <RecommendationMeta
            durationMinutes={durationMinutes}
            difficulty={difficulty}
            moodBenefit={moodBenefit}
          />
        </Animated.View>

        {/* Primary CTA (Staggered) */}
        <Animated.View entering={FadeInDown.delay(450).duration(600)} style={styles.ctaButton}>
          <GradientButton
            title={ctaText || "Start your session"}
            onPress={onStart}
            loading={loading}
            disabled={disabled}
            size="md"
            icon={<Play size={14} color="#FFFFFF" fill="#FFFFFF" />}
            colors={themeStyle.gradient}
          />
        </Animated.View>

        {/* Secondary Choices (Staggered) */}
        <Animated.View entering={FadeInDown.delay(550).duration(600)}>
          <RecommendationActions
            onNotNow={onNotNow}
            onShowAnother={onShowAnother}
            onAskWhy={onAskWhy}
            disabled={disabled || loading}
          />
        </Animated.View>
      </GlassCard>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: spacing.xl,
    marginVertical: spacing.sm,
    position: 'relative',
  },
  ambientGlowLeft: {
    position: 'absolute',
    left: 40,
    width: '45%',
    top: 20,
    bottom: 20,
    opacity: 0.12,
    borderRadius: 24,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.9,
    shadowRadius: 35,
    zIndex: -1,
  },
  ambientGlowRight: {
    position: 'absolute',
    right: 40,
    width: '45%',
    top: 20,
    bottom: 20,
    opacity: 0.08,
    borderRadius: 24,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 35,
    zIndex: -1,
  },
  bodyContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)', // Lighter glass layering
    borderColor: 'rgba(255, 255, 255, 0.08)',     // Increased border contrast
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,                 // Breathable 16px padding
    paddingVertical: spacing.lg,                   // Breathable 16px padding
    marginBottom: spacing.xl,                      // Stronger visual separation from CTA
  },
  explanationText: {
    fontSize: 14,
    lineHeight: 22,
    color: 'rgba(255, 255, 255, 0.85)',             // Improved inner contrast
    fontFamily: typography.fontFamily.sans,
    maxWidth: '96%',
    marginBottom: spacing.lg,
  },
  ctaButton: {
    marginBottom: spacing.md,
  },
});

export default AIRecommendationCard;
