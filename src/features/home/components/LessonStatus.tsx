import React from 'react';
import { Text } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface LessonStatusProps {
  current: number;
  total: number;
}

export const LessonStatus = React.memo(({ current, total }: LessonStatusProps) => {
  const { colors } = useTheme();

  return (
    <Text
      style={{
        fontSize: 14,
        color: colors.text.secondary,
        fontWeight: '400',
      }}
      accessibilityLabel={`Lesson ${current} of ${total}`}
    >
      Lesson {current} of {total}
    </Text>
  );
});
