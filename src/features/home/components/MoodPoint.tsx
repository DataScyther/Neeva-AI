import React from 'react';
import { Circle } from 'react-native-svg';

const LEVEL_COLORS: Record<number, string> = {
  1: '#F43F5E',
  2: '#F59E0B',
  3: '#64748B',
  4: '#8B5CF6',
  5: '#22C55E',
};

interface MoodPointProps {
  cx: number;
  cy: number;
  moodLevel: number | null;
  isToday?: boolean;
}

export const MoodPoint = React.memo(({ cx, cy, moodLevel, isToday }: MoodPointProps) => {
  if (isToday) {
    const color = moodLevel !== null ? LEVEL_COLORS[moodLevel] : LEVEL_COLORS[4];
    return (
      <>
        <Circle cx={cx} cy={cy} r={10} fill={color} opacity={0.1} />
        <Circle cx={cx} cy={cy} r={8} fill={color} opacity={0.25} />
        <Circle cx={cx} cy={cy} r={5} fill="#FFFFFF" />
      </>
    );
  }

  if (moodLevel !== null) {
    return (
      <Circle
        cx={cx}
        cy={cy}
        r={5}
        fill={LEVEL_COLORS[moodLevel] || LEVEL_COLORS[3]}
      />
    );
  }

  return (
    <Circle
      cx={cx}
      cy={cy}
      r={3}
      fill="none"
      stroke="#64748B"
      strokeWidth={1}
      opacity={0.25}
    />
  );
});

MoodPoint.displayName = 'MoodPoint';
