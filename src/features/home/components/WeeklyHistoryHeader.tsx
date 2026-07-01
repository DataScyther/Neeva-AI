import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { spacing } from '@/core/theme';

export const WeeklyHistoryHeader = React.memo(() => {
  const { colors } = useTheme();

  return (
    <View style={styles.header}>
      <Text style={[styles.title, { color: colors.text.primary }]}>Weekly History</Text>
      <View style={styles.badge}>
        <View style={[styles.badgeDot, { backgroundColor: colors.brand.primary }]} />
        <Text style={[styles.thisWeek, { color: colors.brand.primary }]}>This Week</Text>
      </View>
    </View>
  );
});

WeeklyHistoryHeader.displayName = 'WeeklyHistoryHeader';

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
    opacity: 0.8,
  },
  thisWeek: {
    fontSize: 12,
    fontWeight: '600',
  },
});
