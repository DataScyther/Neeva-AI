import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '@/hooks/useTheme';
import { spacing, borderRadius } from '@/core/theme';

interface EmptyStateProps {
  onCheckIn?: () => void;
}

export const EmptyState = React.memo(({ onCheckIn }: EmptyStateProps) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.iconRing, { borderColor: colors.brand.primary }]}>
        <Svg width={36} height={36} viewBox="0 0 40 40">
          <Circle
            cx={20}
            cy={20}
            r={18}
            fill={colors.brand.primary}
            opacity={0.08}
          />
          <Path
            d="M20 10C15.582 10 12 13.582 12 18C12 20.5 13 22 14 24L16 28H24L26 24C27 22 28 20.5 28 18C28 13.582 24.418 10 20 10Z"
            fill={colors.brand.primary}
            opacity={0.12}
          />
          <Path
            d="M16 16C16 15.172 16.672 14.5 17.5 14.5C18.328 14.5 19 15.172 19 16C19 16.828 18.328 17.5 17.5 17.5C16.672 17.5 16 16.828 16 16Z"
            fill={colors.brand.primary}
          />
          <Path
            d="M21 16C21 15.172 21.672 14.5 22.5 14.5C23.328 14.5 24 15.172 24 16C24 16.828 23.328 17.5 22.5 17.5C21.672 17.5 21 16.828 21 16Z"
            fill={colors.brand.primary}
          />
          <Path
            d="M17.5 22.5C17.5 22.5 18.5 24.5 20 24.5C21.5 24.5 22.5 22.5 22.5 22.5"
            fill="none"
            stroke={colors.brand.primary}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        </Svg>
      </View>

      <Text style={[styles.mainText, { color: colors.text.primary }]}>
        No mood history yet
      </Text>
      <Text style={[styles.subText, { color: colors.text.secondary }]}>
        Start your first check-in today.
      </Text>

      {onCheckIn && (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.brand.primary }]}
          onPress={onCheckIn}
          activeOpacity={0.85}
        >
          <Text style={[styles.buttonText, { color: colors.brand.contrastText }]}>
            Check In
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
});

EmptyState.displayName = 'EmptyState';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing['2xl'],
    paddingHorizontal: spacing.xl,
  },
  iconRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5,
  },
  mainText: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: spacing.md,
    letterSpacing: 0.2,
  },
  subText: {
    fontSize: 13,
    fontWeight: '400',
    marginTop: spacing.xs,
  },
  button: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing['2xl'],
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
