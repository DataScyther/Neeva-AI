import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Award } from 'lucide-react-native';
import { typography, spacing } from '@/core/theme';

export interface JourneyMilestoneProps {
  milestoneText: string;
}

export const JourneyMilestone = React.memo(({ milestoneText }: JourneyMilestoneProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <Award size={12} color="#06B6D4" style={styles.icon} />
        <Text style={styles.titleText}>NEXT MILESTONE: </Text>
        <Text style={styles.detailText} allowFontScaling={true}>
          {milestoneText}
        </Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
    width: '100%',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(6, 182, 212, 0.08)', // subtle cyan tint
    borderColor: 'rgba(6, 182, 212, 0.15)',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  icon: {
    marginRight: 6,
  },
  titleText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#06B6D4', // cyan accent
    fontFamily: typography.fontFamily.sans,
    letterSpacing: 0.5,
  },
  detailText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
    fontFamily: typography.fontFamily.sans,
    flex: 1,
  },
});

export default JourneyMilestone;
