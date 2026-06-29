import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Clock, Flame, Calendar, BarChart } from 'lucide-react-native';
import { typography, spacing } from '@/core/theme';

export interface JourneyMetaProps {
  durationMinutesRemaining: number;
  streakDays: number;
  difficulty: string;
  lastCompletedText: string;
}

export const JourneyMeta = React.memo(({
  durationMinutesRemaining,
  streakDays,
  difficulty,
  lastCompletedText,
}: JourneyMetaProps) => {
  return (
    <View style={styles.container}>
      {/* Row 1 */}
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Clock size={12} color="rgba(255, 255, 255, 0.4)" style={styles.icon} />
          <Text style={styles.metaText}>{durationMinutesRemaining} min remaining</Text>
        </View>

        <View style={styles.metaItem}>
          <Flame size={12} color="#F59E0B" style={styles.icon} />
          <Text style={[styles.metaText, styles.streakText]}>{streakDays}-Day Streak</Text>
        </View>
      </View>

      {/* Row 2 */}
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <BarChart size={12} color="rgba(255, 255, 255, 0.4)" style={styles.icon} />
          <Text style={styles.metaText}>{difficulty}</Text>
        </View>

        <View style={styles.metaItem}>
          <Calendar size={12} color="rgba(255, 255, 255, 0.4)" style={styles.icon} />
          <Text style={styles.metaText}>Last: {lastCompletedText}</Text>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
    width: '100%',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 6,
  },
  metaText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    fontFamily: typography.fontFamily.sans,
  },
  streakText: {
    color: '#F59E0B', // Amber color for fires
    fontWeight: '600',
  },
});

export default JourneyMeta;
