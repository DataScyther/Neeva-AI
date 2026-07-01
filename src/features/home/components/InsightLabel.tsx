import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { spacing } from '@/core/theme';

interface InsightLabelProps {
  text: string;
}

export const InsightLabel = React.memo(({ text }: InsightLabelProps) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.divider, { backgroundColor: colors.border.default }]} />
      <Text style={[styles.text, { color: colors.text.secondary }]}>{text}</Text>
    </View>
  );
});

InsightLabel.displayName = 'InsightLabel';

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.lg,
  },
  divider: {
    height: 1,
    opacity: 0.5,
    marginBottom: spacing.md,
  },
  text: {
    fontSize: 13,
    fontWeight: '500',
    fontStyle: 'italic',
    letterSpacing: 0.2,
  },
});
