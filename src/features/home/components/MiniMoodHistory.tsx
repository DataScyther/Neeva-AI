import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Svg, { Path, Circle } from 'react-native-svg';
import type { MoodEntry } from '@/shared/types';

import { useTheme } from '@/hooks/useTheme';

interface MiniMoodHistoryProps {
  moodEntries: MoodEntry[];
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getEmojiForRating(rating: number): string {
  if (rating >= 9) return '🤩';
  if (rating >= 8) return '😊';
  if (rating >= 6) return '😌';
  if (rating >= 4) return '😐';
  if (rating >= 3) return '😰';
  if (rating >= 2) return '😔';
  return '🤯';
}

function getMoodValue(rating: number): number {
  if (rating >= 9) return 5;
  if (rating >= 8) return 4;
  if (rating >= 6) return 3;
  if (rating >= 4) return 2;
  return 1;
}

export const MiniMoodHistory = React.memo(({
  moodEntries,
}: MiniMoodHistoryProps) => {
  const { colors } = useTheme();

  const timelineData = useMemo(() => {
    const today = new Date();
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dayEntries = moodEntries.filter(
        (e) => new Date(e.timestamp).toDateString() === d.toDateString()
      );
      const latest = dayEntries.length > 0 ? dayEntries[dayEntries.length - 1] : null;
      data.push({
        day: DAYS[d.getDay()],
        emoji: latest ? getEmojiForRating(latest.mood) : null,
        value: latest ? getMoodValue(latest.mood) : null,
      });
    }
    return data;
  }, [moodEntries]);

  const graphWidth = 260;
  const graphHeight = 60;
  const padding = 20;

  const points = useMemo(() => {
    const step = (graphWidth - padding * 2) / 6;
    return timelineData.map((item, i) => {
      const x = padding + i * step;
      const y = item.value
        ? graphHeight - (item.value / 5) * (graphHeight - 16) - 8
        : graphHeight - 8;
      return { x, y, value: item.value };
    });
  }, [timelineData]);

  const pathD = useMemo(() => {
    if (points.length === 0) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cx1 = (prev.x + curr.x) / 2;
      const cx2 = (prev.x + curr.x) / 2;
      d += ` C ${cx1} ${prev.y}, ${cx2} ${curr.y}, ${curr.x} ${curr.y}`;
    }
    return d;
  }, [points]);

  return (
    <Animated.View
      entering={FadeInDown.delay(200).duration(600).springify()}
      style={styles.container}
    >
      <View style={[styles.card, { backgroundColor: colors.surface.primary, borderColor: colors.border.default }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text.primary }]}>Weekly History</Text>
          <Text style={[styles.thisWeek, { color: colors.brand.primary }]}>This Week</Text>
        </View>

        <View style={styles.graphContainer}>
          <Svg width={graphWidth} height={graphHeight}>
            {points.filter((p) => p.value !== null).length > 1 && (
              <Path
                d={pathD}
                stroke={colors.brand.primary}
                strokeWidth={2}
                fill="none"
                strokeLinecap="round"
              />
            )}
            {points.map((p, i) => (
              p.value !== null ? (
                <Circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r={4}
                  fill={colors.brand.primary}
                />
              ) : null
            ))}
          </Svg>
        </View>

        <View style={styles.daysRow}>
          {timelineData.map((item, i) => (
            <View key={i} style={styles.dayItem}>
              <Text style={styles.dayEmoji}>{item.emoji || '·'}</Text>
              <Text style={[styles.dayLabel, { color: colors.text.secondary }]}>{item.day}</Text>
            </View>
          ))}
        </View>
      </View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
  },
  thisWeek: {
    fontSize: 11,
    fontWeight: '500',
  },
  graphContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayItem: {
    alignItems: 'center',
    width: 32,
  },
  dayEmoji: {
    fontSize: 16,
    marginBottom: 4,
  },
  dayLabel: {
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
});

export default MiniMoodHistory;
