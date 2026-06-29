import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Heart } from 'lucide-react-native';
import { GlassCard } from '@/shared/components/GlassCard';
import { typography, spacing } from '@/core/theme';

export interface DailyEncouragementCardProps {
  encouragementText: string;
}

export const DailyEncouragementCard = React.memo(({
  encouragementText,
}: DailyEncouragementCardProps) => {
  return (
    <Animated.View
      entering={FadeInDown.delay(300).duration(600).springify()}
      style={styles.container}
    >
      <GlassCard intensity="dark" style={styles.card}>
        <Heart size={12} color="rgba(167, 139, 250, 0.5)" fill="rgba(167, 139, 250, 0.15)" style={styles.icon} />
        <Text style={styles.text} allowFontScaling={true}>
          {encouragementText}
        </Text>
      </GlassCard>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.xl,
    marginVertical: spacing.sm,
    alignItems: 'center',
    width: '100%',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    maxWidth: '90%',
    width: 'auto',
  },
  icon: {
    marginRight: spacing.sm,
  },
  text: {
    fontSize: 11,
    fontStyle: 'italic',
    color: 'rgba(255, 255, 255, 0.4)',
    fontFamily: typography.fontFamily.sans,
    textAlign: 'center',
    flexShrink: 1,
  },
});

export default DailyEncouragementCard;
