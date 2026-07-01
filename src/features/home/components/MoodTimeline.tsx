import React, { useMemo } from 'react';
import Svg, { Path, Defs, LinearGradient, Stop, Line } from 'react-native-svg';
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

  // Compute grid line Y coordinates
  const topY = 20;
  const bottomY = svgHeight - 20;
  const midY = (topY + bottomY) / 2;

  const startX = points.length > 0 ? points[0].x : 20;
  const endX = points.length > 0 ? points[points.length - 1].x : svgWidth - 20;

  return (
    <Svg
      width={svgWidth}
      height={svgHeight}
    >
      <Defs>
        <LinearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={colors.brand.primary} stopOpacity={0.12} />
          <Stop offset="1" stopColor={colors.brand.primary} stopOpacity={0} />
        </LinearGradient>
        <LinearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor={colors.brand.secondary || '#8B5CF6'} />
          <Stop offset="50%" stopColor={colors.brand.primary} />
          <Stop offset="100%" stopColor="#06B6D4" />
        </LinearGradient>
      </Defs>

      {/* Guide lines (horizontal dashed) */}
      <Line
        x1={startX}
        y1={topY}
        x2={endX}
        y2={topY}
        stroke={colors.border.default}
        strokeWidth={1}
        strokeDasharray="4 4"
        opacity={0.3}
      />
      <Line
        x1={startX}
        y1={midY}
        x2={endX}
        y2={midY}
        stroke={colors.border.default}
        strokeWidth={1}
        strokeDasharray="4 4"
        opacity={0.3}
      />
      <Line
        x1={startX}
        y1={bottomY}
        x2={endX}
        y2={bottomY}
        stroke={colors.border.default}
        strokeWidth={1}
        strokeDasharray="4 4"
        opacity={0.3}
      />

      {/* Filled area under curve */}
      {areaD.length > 0 && (
        <Path
          d={areaD}
          fill="url(#areaGrad)"
        />
      )}

      {pathD.length > 0 && (
        <>
          {/* Futuristic glowing shadow line */}
          <Path
            d={pathD}
            stroke="url(#lineGrad)"
            strokeWidth={5}
            fill="none"
            strokeLinecap="round"
            opacity={0.25}
          />
          {/* Main sharp line */}
          <Path
            d={pathD}
            stroke="url(#lineGrad)"
            strokeWidth={2.5}
            fill="none"
            strokeLinecap="round"
            opacity={0.9}
          />
        </>
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

