import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface JourneyErrorStateProps {
  onRetry: () => void;
}

export const JourneyErrorState = React.memo(({ onRetry }: JourneyErrorStateProps) => {
  const { colors } = useTheme();

  return (
    <View
      style={{
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border.default,
        backgroundColor: colors.surface.primary,
        padding: 16,
        alignItems: 'center',
      }}
      accessibilityLabel="Unable to load your journey"
    >
      <Text
        style={{
          fontSize: 14,
          color: colors.text.secondary,
          marginBottom: 12,
          textAlign: 'center',
        }}
      >
        Unable to load your journey.
      </Text>
      <Pressable
        onPress={onRetry}
        style={{
          backgroundColor: colors.brand.primary,
          borderRadius: 10,
          paddingVertical: 10,
          paddingHorizontal: 24,
          minHeight: 44,
          justifyContent: 'center',
        }}
        accessibilityRole="button"
        accessibilityLabel="Retry loading journey"
      >
        <Text
          style={{
            fontSize: 14,
            fontWeight: '600',
            color: colors.brand.contrastText,
          }}
        >
          Retry
        </Text>
      </Pressable>
    </View>
  );
});
