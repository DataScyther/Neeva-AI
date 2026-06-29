import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { CheckCircle2, X } from 'lucide-react-native';
import { GlassCard } from '@/shared/components/GlassCard';

export interface CheckInSuccessCardProps {
  onDismiss: () => void;
  autoDismissMs?: number;
}

export const CheckInSuccessCard = React.memo(({
  onDismiss,
  autoDismissMs = 4000,
}: CheckInSuccessCardProps) => {
  useEffect(() => {
    if (autoDismissMs <= 0) return;

    const timer = setTimeout(() => {
      onDismiss();
    }, autoDismissMs);

    return () => clearTimeout(timer);
  }, [autoDismissMs, onDismiss]);

  return (
    <Animated.View
      entering={FadeInDown.duration(600).springify()}
      exiting={FadeOutUp.duration(400)}
      style={styles.container}
    >
      <GlassCard intensity="dark" className="border-emerald-500/30">
        <View style={styles.cardHeader}>
          <View style={styles.successBadge}>
            <CheckCircle2 size={20} color="#10B981" />
            <Text style={styles.successTitle}>Check-in completed</Text>
          </View>
          <Pressable
            onPress={onDismiss}
            style={styles.closeButton}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Dismiss success message"
          >
            <X size={16} color="rgba(255, 255, 255, 0.4)" />
          </Pressable>
        </View>

        <Text style={styles.messageText}>
          "Every small reflection helps you understand yourself better."
        </Text>
      </GlassCard>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginVertical: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  successBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
    fontFamily: 'SF Pro Display',
    marginLeft: 8,
  },
  closeButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageText: {
    fontSize: 13,
    lineHeight: 18,
    color: 'rgba(255, 255, 255, 0.6)',
    fontStyle: 'italic',
    fontFamily: 'SF Pro Text',
  },
});

export default CheckInSuccessCard;
