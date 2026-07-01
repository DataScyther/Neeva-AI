import React from 'react';
import { Pressable, Text, ActivityIndicator } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface ContinueButtonProps {
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export const ContinueButton = React.memo(({
  onPress,
  disabled = false,
  loading = false,
}: ContinueButtonProps) => {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={{
        backgroundColor: disabled ? `${colors.brand.primary}80` : colors.brand.primary,
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 44,
      }}
      accessibilityRole="button"
      accessibilityLabel="Continue journey"
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors.brand.contrastText} />
      ) : (
        <Text
          style={{
            fontSize: 15,
            fontWeight: '600',
            color: colors.brand.contrastText,
          }}
        >
          Continue
        </Text>
      )}
    </Pressable>
  );
});
