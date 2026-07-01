import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrendingUp } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { spacing, borderRadius } from '@/core/theme';

export const WeeklyHistoryHeader = React.memo(() => {
  const { colors } = useTheme();

  return (
    <View style={styles.header}>
      <View style={styles.titleContainer}>
        <TrendingUp size={16} color={colors.brand.primary} style={styles.titleIcon} />
        <Text style={[styles.title, { color: colors.text.primary }]}>Weekly History</Text>
      </View>
      <View style={[styles.badge, { backgroundColor: `${colors.brand.primary}10`, borderColor: `${colors.brand.primary}20` }]}>
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleIcon: {
    marginRight: spacing.xs * 1.5,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
    opacity: 0.8,
  },
  thisWeek: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

