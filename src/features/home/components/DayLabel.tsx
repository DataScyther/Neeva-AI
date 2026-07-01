import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface DayLabelProps {
  label: string;
  isToday?: boolean;
}

export const DayLabel = React.memo(({ label, isToday }: DayLabelProps) => {
  const { colors } = useTheme();

  return (
    <Text
      style={[
        styles.label,
        { color: isToday ? colors.brand.primary : colors.text.secondary },
        isToday && styles.today,
      ]}
    >
      {label}
    </Text>
  );
});

DayLabel.displayName = 'DayLabel';

const styles = StyleSheet.create({
  label: {
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  today: {
    fontWeight: '700',
  },
});
