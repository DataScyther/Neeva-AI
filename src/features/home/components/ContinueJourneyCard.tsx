import React, { useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, Vibration, Platform } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  FadeInDown,
} from 'react-native-reanimated';
import Svg, { Circle, Path, Defs, RadialGradient, Stop } from 'react-native-svg';
import { ChevronRight } from 'lucide-react-native';
import { GlassCard } from '@/shared/components/GlassCard';
import { ProgressBar } from '@/shared/components/ProgressBar';
import { GradientButton } from '@/shared/components/GradientButton';
import { JourneyMeta } from './JourneyMeta';
import { JourneyMilestone } from './JourneyMilestone';
import { JourneyActions } from './JourneyActions';
import { typography, spacing } from '@/core/theme';

export interface ContinueJourneyCardProps {
  title: string;
  currentStep: number;
  totalSteps: number;
  percent: number;
  durationMinutesRemaining: number;
  streakDays: number;
  difficulty: string;
  lastCompletedText: string;
  milestoneText: string;
  onContinue: () => void;
  onRestart: () => void;
  onChooseAnother: () => void;
  onViewDetails: () => void;
  disabled?: boolean;
}

export const ContinueJourneyCard = React.memo(({
  title,
  currentStep,
  totalSteps,
  percent,
  durationMinutesRemaining,
  streakDays,
  difficulty,
  lastCompletedText,
  milestoneText,
  onContinue,
  onRestart,
  onChooseAnother,
  onViewDetails,
  disabled = false,
}: ContinueJourneyCardProps) => {
  return (
    <Animated.View
      entering={FadeInDown.delay(100).duration(600).springify()}
      style={styles.wrapper}
    >
      <GlassCard intensity="dark" className="border-neeva-purple-500/10">
        {/* Top Header Row */}
        <View style={styles.headerRow}>
          {/* SVG Mountain Illustration */}
          <View style={styles.iconWrapper}>
            <Svg width={48} height={48} viewBox="0 0 72 72">
              <Defs>
                <RadialGradient id="illusGlow" cx="50%" cy="50%" rx="50%" ry="50%">
                  <Stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.3} />
                  <Stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                </RadialGradient>
              </Defs>
              <Circle cx={36} cy={36} r={32} fill="url(#illusGlow)" />
              <Circle cx={36} cy={36} r={26} fill="#0E0922" stroke="rgba(139, 92, 246, 0.2)" strokeWidth={1} />

              {/* Left Mountain peak */}
              <Path d="M 16,50 L 30,26 L 44,50 Z" fill="#1A133A" stroke="rgba(139, 92, 246, 0.4)" strokeWidth={0.5} />
              {/* Main Mountain peak */}
              <Path d="M 28,50 L 46,18 L 60,50 Z" fill="#0D213E" stroke="rgba(6, 182, 212, 0.4)" strokeWidth={0.5} />
              {/* Winding teal path */}
              <Path
                d="M 36,50 Q 30,42 42,36 T 46,24"
                fill="none"
                stroke="#06B6D4"
                strokeWidth={2}
                strokeLinecap="round"
                strokeDasharray="2 3"
              />
              {/* Stars */}
              <Circle cx={22} cy={20} r={0.6} fill="#FFFFFF" opacity={0.8} />
              <Circle cx={54} cy={24} r={0.6} fill="#FFFFFF" opacity={0.6} />
            </Svg>
          </View>

          {/* Title & Step */}
          <View style={styles.titleWrapper}>
            <Text style={styles.titleText}>{title}</Text>
            <Text style={styles.stepText}>Day {currentStep} of {totalSteps}</Text>
          </View>

          {/* Visually Dominant Continue CTA */}
          <GradientButton
            title="Continue"
            onPress={onContinue}
            disabled={disabled}
            size="sm"
            style={styles.continueBtn}
            icon={<ChevronRight size={14} color="#FFFFFF" />}
          />
        </View>

        {/* Progress bar */}
        <ProgressBar percent={percent} height={6} style={styles.progressContainer} />

        {/* Meta Grid info */}
        <JourneyMeta
          durationMinutesRemaining={durationMinutesRemaining}
          streakDays={streakDays}
          difficulty={difficulty}
          lastCompletedText={lastCompletedText}
        />

        {/* Milestone Indicator */}
        <JourneyMilestone milestoneText={milestoneText} />

        {/* Secondary text action rows */}
        <JourneyActions
          onRestart={onRestart}
          onChooseAnother={onChooseAnother}
          onViewDetails={onViewDetails}
          disabled={disabled}
        />
      </GlassCard>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: spacing.xl,
    marginVertical: spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    marginRight: spacing.md,
  },
  titleWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: typography.fontFamily.display,
  },
  stepText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.4)',
    fontFamily: typography.fontFamily.sans,
    marginTop: 2,
  },
  continueBtn: {
    width: 104,
  },
  progressContainer: {
    marginVertical: spacing.md,
  },
});

export default ContinueJourneyCard;
