import React, { useMemo } from 'react';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useTheme } from '@/hooks/useTheme';
import { MoodPoint } from './MoodPoint';

interface TimelinePoint {
  x: number;
  y: number;
  moodLevel: number | null;
}

interface MoodTimelineProps {
  points: TimelinePoint[];
  svgWidth: number;
  svgHeight: number;
}

export const MoodTimeline = React.memo(({ points, svgWidth, svgHeight }: MoodTimelineProps) => {
  const { colors } = useTheme();

  const pathD = useMemo(() => {
    if (points.length < 2) return '';

    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cx1 = (prev.x + curr.x) / 2;
      const cx2 = (prev.x + curr.x) / 2;
      d += ` C ${cx1} ${prev.y}, ${cx2} ${curr.y}, ${curr.x} ${curr.y}`;
    }
    return d;
  }, [points]);

  const areaD = useMemo(() => {
    if (points.length < 2) return '';
    const last = points[points.length - 1];
    const first = points[0];
    return `${pathD} L ${last.x} ${svgHeight} L ${first.x} ${svgHeight} Z`;
  }, [pathD, points, svgHeight]);

  return (
    <Svg
      width={svgWidth}
      height={svgHeight}
    >
      <Defs>
        <LinearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={colors.brand.primary} stopOpacity={0.08} />
          <Stop offset="1" stopColor={colors.brand.primary} stopOpacity={0} />
        </LinearGradient>
      </Defs>

      {areaD.length > 0 && (
        <Path
          d={areaD}
          fill="url(#areaGrad)"
        />
      )}

      {pathD.length > 0 && (
        <Path
          d={pathD}
          stroke={colors.brand.primary}
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
          opacity={0.35}
        />
      )}
      {points.map((p, i) => (
        <MoodPoint
          key={i}
          cx={p.x}
          cy={p.y}
          moodLevel={p.moodLevel}
          isToday={i === points.length - 1}
        />
      ))}
    </Svg>
  );
});

MoodTimeline.displayName = 'MoodTimeline';
