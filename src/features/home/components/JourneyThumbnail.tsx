import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

export const JourneyThumbnail = React.memo(() => {
  const { colors } = useTheme();

  return (
    <View
      style={{
        width: 56,
        height: 56,
        borderRadius: 12,
        backgroundColor: `${colors.brand.primary}1A`,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      accessibilityRole="image"
      accessibilityLabel="Program icon"
    >
      <Text style={{ fontSize: 28 }}>🧠</Text>
    </View>
  );
});
