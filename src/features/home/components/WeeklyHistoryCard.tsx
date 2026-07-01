import React, { useMemo, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { useTheme } from '@/hooks/useTheme';
import { spacing, borderRadius, shadows } from '@/core/theme';
import type { Mood } from '@/shared/types';
import { WeeklyHistoryHeader } from './WeeklyHistoryHeader';
import { MoodTimeline } from './MoodTimeline';
import { DayLabel } from './DayLabel';
import { InsightLabel } from './InsightLabel';
import { EmptyState } from './EmptyState';

interface WeeklyHistoryCardProps {
  moodEntries: Mood[];
  isLoading?: boolean;
  onCheckIn?: () => void;
}

const DAY_LABELS = ['THU', 'FRI', 'SAT', 'SUN', 'MON', 'TUE', 'TODAY'];
const GRAPH_HEIGHT = 100;
const GRAPH_PADDING_H = 20;
const CARD_H_PADDING = spacing.lg * 2;

function generateInsight(points: { moodLevel: number | null }[]): string {
  const valid = points.filter((p) => p.moodLevel !== null).map((p) => p.moodLevel!);
  if (valid.length === 0) return '';

  const avg = valid.reduce((a, b) => a + b, 0) / valid.length;
  const variance = valid.reduce((a, b) => a + (b - avg) ** 2, 0) / valid.length;

  if (variance < 0.5) {
    return 'Your mood has been steady over the past few days.';
  }
  if (avg > 4) {
    return "You've been feeling great this week. 🌱";
  }
  if (avg > 3) {
    return "You've been feeling more balanced this week.";
  }
  return "This week has had its ups and downs. Be kind to yourself.";
}

const CARD_WIDTH = Dimensions.get('window').width - spacing.xl * 2 - CARD_H_PADDING;

export const WeeklyHistoryCard = React.memo(({
  moodEntries,
  isLoading = false,
  onCheckIn,
}: WeeklyHistoryCardProps) => {
  const { colors } = useTheme();

  const timelineData = useMemo(() => {
    const today = new Date();
    const data: { moodLevel: number | null; date: Date }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dayEntries = moodEntries.filter(
        (e) => new Date(e.timestamp).toDateString() === d.toDateString()
      );
      const latest = dayEntries.length > 0 ? dayEntries[dayEntries.length - 1] : null;
      data.push({
        moodLevel: latest ? latest.rating : null,
        date: d,
      });
    }
    return data;
  }, [moodEntries]);

  const points = useMemo(() => {
    const svgWidth = CARD_WIDTH - GRAPH_PADDING_H * 2;
    const step = svgWidth / 6;
    const topY = GRAPH_PADDING_H;
    const bottomY = GRAPH_HEIGHT - GRAPH_PADDING_H;
    const range = bottomY - topY;

    return timelineData.map((item, idx) => {
      const x = GRAPH_PADDING_H + idx * step;
      const y = item.moodLevel !== null
        ? bottomY - ((item.moodLevel - 1) / 4) * range
        : bottomY;
      return { x, y, moodLevel: item.moodLevel };
    });
  }, [timelineData]);

  const hasData = useMemo(() => timelineData.some((d) => d.moodLevel !== null), [timelineData]);

  const insightText = useMemo(() => generateInsight(points), [points]);

  function SkeletonPulse({ children }: { children: React.ReactNode }) {
    const opacity = useSharedValue(0.3);
    useEffect(() => {
      opacity.value = withRepeat(
        withTiming(0.7, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    }, []);
    const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
    return <Animated.View style={animatedStyle}>{children}</Animated.View>;
  }

  if (isLoading) {
    return (
      <Animated.View
        entering={FadeInDown.delay(200).duration(600).springify()}
        style={styles.container}
      >
        <View style={[styles.card, { backgroundColor: colors.surface.primary, borderColor: colors.border.default, ...shadows.glass }]}>
          <View style={styles.accentBar}>
            <Svg width="100%" height={3}>
              <Defs>
                <LinearGradient id="skeletonAccentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <Stop offset="0%" stopColor={colors.brand.secondary || '#8B5CF6'} />
                  <Stop offset="50%" stopColor={colors.brand.primary} />
                  <Stop offset="100%" stopColor="#06B6D4" />
                </LinearGradient>
              </Defs>
              <Rect width="100%" height={3} fill="url(#skeletonAccentGrad)" />
            </Svg>
          </View>
          <WeeklyHistoryHeader />
          <SkeletonPulse>
            <View style={[styles.skeletonTimeline, { height: GRAPH_HEIGHT }]}>
              <View style={styles.skeletonRow}>
                {Array.from({ length: 7 }).map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.skeletonCircle,
                      { backgroundColor: colors.surface.secondary, borderColor: colors.border.default },
                    ]}
                  />
                ))}
              </View>
            </View>
            <View style={styles.daysRow}>
              {DAY_LABELS.map((label, i) => (
                <View
                  key={i}
                  style={[styles.skeletonLabel, { backgroundColor: colors.surface.secondary }]}
                />
              ))}
            </View>
          </SkeletonPulse>
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      entering={FadeInDown.delay(200).duration(600).springify()}
      style={styles.container}
    >
      <View style={[styles.card, { backgroundColor: colors.surface.primary, borderColor: colors.border.default, ...shadows.glass }]}>
        <View style={styles.accentBar}>
          <Svg width="100%" height={3}>
            <Defs>
              <LinearGradient id="cardAccentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor={colors.brand.secondary || '#8B5CF6'} />
                <Stop offset="50%" stopColor={colors.brand.primary} />
                <Stop offset="100%" stopColor="#06B6D4" />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height={3} fill="url(#cardAccentGrad)" />
          </Svg>
        </View>
        <WeeklyHistoryHeader />

        {!hasData ? (
          <EmptyState onCheckIn={onCheckIn} />
        ) : (
          <>
            <MoodTimeline
              points={points}
              svgWidth={CARD_WIDTH}
              svgHeight={GRAPH_HEIGHT}
            />

            <View style={styles.daysRow}>
              {timelineData.map((_, i) => (
                <DayLabel
                  key={i}
                  label={DAY_LABELS[i]}
                  isToday={i === timelineData.length - 1}
                />
              ))}
            </View>

            <InsightLabel text={insightText} />
          </>
        )}
      </View>
    </Animated.View>
  );
});

WeeklyHistoryCard.displayName = 'WeeklyHistoryCard';

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
  },
  card: {
    borderRadius: borderRadius['2xl'],
    borderWidth: 1,
    padding: spacing.lg,
    overflow: 'hidden',
  },
  accentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: GRAPH_PADDING_H,
    marginTop: spacing.xs,
  },
  skeletonTimeline: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  skeletonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: GRAPH_PADDING_H,
  },
  skeletonCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
  },
  skeletonLabel: {
    width: 28,
    height: 10,
    borderRadius: 2,
  },
});

