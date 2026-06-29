import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
import { Calendar } from 'lucide-react-native';
import { typography, spacing } from '@/core/theme';
import { MoodHistoryItem } from './MoodHistoryItem';
import { GlassCard } from '@/shared/components/GlassCard';
import type { MoodEntry } from '@/shared/types';

export interface MiniMoodHistoryProps {
  moodEntries: MoodEntry[];
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
}

const getEmojiForRating = (rating: number): string => {
  if (rating >= 9) return '🤩';
  if (rating >= 8) return '😊';
  if (rating >= 6) return '😌';
  if (rating >= 4) return '😐';
  if (rating >= 3) return '😰';
  if (rating >= 2) return '😔';
  return '🤯';
};

const getDayName = (date: Date): string => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[date.getDay()];
};

export const MiniMoodHistory = React.memo(({
  moodEntries,
  selectedDate,
  onSelectDate,
}: MiniMoodHistoryProps) => {
  // Generate the last 7 calendar days
  const lastSevenDays = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      days.push(d);
    }
    return days;
  }, []);

  // Map entries to dates
  const timelineData = useMemo(() => {
    return lastSevenDays.map((date) => {
      // Find all entries for this date
      const dayEntries = moodEntries.filter((entry) => {
        const entryDate = new Date(entry.timestamp);
        return entryDate.toDateString() === date.toDateString();
      });

      // Get the latest entry if multiple exist
      const latestEntry = dayEntries.length > 0 ? dayEntries[dayEntries.length - 1] : null;

      return {
        date,
        dayLabel: getDayName(date),
        emoji: latestEntry ? getEmojiForRating(latestEntry.mood) : null,
        entry: latestEntry,
      };
    });
  }, [lastSevenDays, moodEntries]);

  // Find note for the selected date
  const selectedDayInfo = useMemo(() => {
    if (!selectedDate) return null;

    const matched = timelineData.find(
      (item) => item.date.toDateString() === selectedDate.toDateString()
    );

    return matched || null;
  }, [selectedDate, timelineData]);

  return (
    <Animated.View
      entering={FadeInDown.delay(300).duration(600).springify()}
      style={styles.container}
    >
      <GlassCard intensity="dark">
        {/* Title */}
        <View style={styles.header}>
          <Calendar size={14} color="#06B6D4" />
          <Text style={styles.titleText}>Weekly History</Text>
        </View>

        {/* Timeline Row */}
        <View style={styles.timelineRow}>
          {timelineData.map((item, index) => {
            const isSelected = selectedDate !== null && selectedDate.toDateString() === item.date.toDateString();
            return (
              <MoodHistoryItem
                key={item.date.toISOString()}
                dayLabel={item.dayLabel}
                emoji={item.emoji}
                isSelected={isSelected}
                onPress={() => onSelectDate(item.date)}
                index={index}
              />
            );
          })}
        </View>

        {/* Dynamic Note Display with Speech Bubble styling */}
        {selectedDate && selectedDayInfo && (
          <Animated.View layout={Layout.springify()} style={styles.noteContainer}>
            <View style={styles.bubbleArrow} />
            <View style={styles.noteBubble}>
              {selectedDayInfo.entry ? (
                <>
                  <Text style={styles.noteTitle}>
                    Reflected on {selectedDayInfo.dayLabel}:
                  </Text>
                  <Text style={styles.noteContent}>
                    {selectedDayInfo.entry.note.trim()
                      ? `"${selectedDayInfo.entry.note}"`
                      : 'Checked in but left no reflection note.'}
                  </Text>
                </>
              ) : (
                <Text style={styles.noCheckInText}>
                  No check-in recorded for this day.
                </Text>
              )}
            </View>
          </Animated.View>
        )}
      </GlassCard>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.xl, // 24px
    marginVertical: spacing.sm,    // 8px standard
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  titleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#06B6D4',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginLeft: 8,
    fontFamily: typography.fontFamily.display,
  },
  timelineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noteContainer: {
    marginTop: spacing.lg,
    alignItems: 'center',
    width: '100%',
  },
  bubbleArrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  noteBubble: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  noteTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.4)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: typography.fontFamily.sans,
    marginBottom: 4,
  },
  noteContent: {
    fontSize: 13,
    lineHeight: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: typography.fontFamily.sans,
  },
  noCheckInText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.4)',
    textAlign: 'center',
    fontStyle: 'italic',
    fontFamily: typography.fontFamily.sans,
  },
});

export default MiniMoodHistory;
