import React from 'react';
import { View, Text, Pressable, StyleSheet, type ViewStyle } from 'react-native';
import { typography, spacing } from '@/core/theme';

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  actionText?: string;
  onActionPress?: () => void;
  style?: ViewStyle;
  className?: string;
}

export const SectionHeader = React.memo(({
  title,
  subtitle,
  icon,
  actionText,
  onActionPress,
  style,
  className = '',
}: SectionHeaderProps) => {
  return (
    <View style={[styles.container, style]} className={className}>
      <View style={styles.leftSection}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <View>
          <Text
            style={styles.title}
            allowFontScaling={true}
            numberOfLines={1}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={styles.subtitle}
              allowFontScaling={true}
              numberOfLines={2}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      {actionText && onActionPress && (
        <Pressable
          onPress={onActionPress}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={({ pressed }) => [
            styles.actionButton,
            pressed && styles.actionButtonPressed,
          ]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={actionText}
        >
          <Text style={styles.actionText}>{actionText}</Text>
        </Pressable>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
    width: '100%',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    marginRight: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: typography.fontSize.caption,
    fontWeight: typography.fontWeight['section-title'],
    color: '#FFFFFF',
    fontFamily: typography.fontFamily.display,
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing['section-title'] ?? 0,
  },
  subtitle: {
    fontSize: typography.fontSize.label,
    color: 'rgba(255, 255, 255, 0.4)',
    fontFamily: typography.fontFamily.sans,
    marginTop: spacing.xs / 4,
  },
  actionButton: {
    paddingVertical: spacing.xs,
  },
  actionButtonPressed: {
    opacity: 0.7,
  },
  actionText: {
    fontSize: typography.fontSize.label,
    color: '#06B6D4',
    fontWeight: typography.fontWeight.label,
    fontFamily: typography.fontFamily.sans,
  },
});

export default SectionHeader;
