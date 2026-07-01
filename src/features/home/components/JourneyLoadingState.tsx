import React from 'react';
import { View } from 'react-native';
import { SkeletonLoader } from '@/shared/components/SkeletonLoader';
import { useTheme } from '@/hooks/useTheme';

export const JourneyLoadingState = React.memo(() => {
  const { colors } = useTheme();

  return (
    <View
      style={{
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border.default,
        backgroundColor: colors.surface.primary,
        padding: 16,
      }}
      accessibilityLabel="Loading your journey"
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
        <SkeletonLoader width={56} height={56} borderRadius={12} />
        <View style={{ flex: 1, marginLeft: 14 }}>
          <SkeletonLoader width="70%" height={20} borderRadius={6} className="mb-2" />
          <SkeletonLoader width="40%" height={14} borderRadius={4} />
        </View>
      </View>
      <SkeletonLoader width="100%" height={8} borderRadius={4} className="mb-4" />
      <SkeletonLoader width="100%" height={44} borderRadius={10} />
    </View>
  );
});
