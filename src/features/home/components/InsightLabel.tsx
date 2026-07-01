import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { spacing, borderRadius } from '@/core/theme';

interface InsightLabelProps {
  text: string;
}

export const InsightLabel = React.memo(({ text }: InsightLabelProps) => {
  const { colors } = useTheme();

  if (!text) return null;

  return (
    <View style={[styles.container, { backgroundColor: `${colors.brand.primary}08`, borderColor: `${colors.brand.primary}18` }]}>
      <View style={styles.header}>
        <Sparkles size={13} color={colors.brand.primary} style={styles.icon} />
        <Text style={[styles.headerText, { color: colors.brand.primary }]}>Neeva AI Insight</Text>
      </View>
      <Text style={[styles.text, { color: colors.text.secondary }]}>{text}</Text>
    </View>
  );
});

InsightLabel.displayName = 'InsightLabel';

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  icon: {
    marginRight: 6,
  },
  headerText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18,
    letterSpacing: 0.1,
  },
});

