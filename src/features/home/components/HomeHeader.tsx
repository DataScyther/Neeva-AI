/**
 * HomeHeader — Top hero section of the Home tab.
 *
 * Layout:
 *   - Top bar: Hamburger menu button (left), notification bell + avatar (right)
 *   - Greeting row: "Good morning/afternoon/evening, [User Name] 👋"
 *   - Welcome header: "I'm glad you're here. Let's take care of you today."
 *
 * Implements accessible buttons (min 44px touch targets) and dynamic greetings.
 */

import React, { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Menu, Bell } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Avatar } from '@/shared/components/Avatar';
import { useUserDisplayName, useUser } from '@/shared/hooks/useAuth';

// ── Helpers ────────────────────────────────────────────────────────────────

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

// ── Component ──────────────────────────────────────────────────────────────

interface HomeHeaderProps {
  /** Callback when hamburger menu is pressed */
  onMenuPress?: () => void;
  /** Callback when notification bell is pressed */
  onNotificationPress?: () => void;
  /** Optional override for username (useful for previews) */
  userNameOverride?: string;
}

export function HomeHeader({
  onMenuPress,
  onNotificationPress,
  userNameOverride,
}: HomeHeaderProps) {
  const displayName = useUserDisplayName();
  const user = useUser();
  const greeting = useMemo(() => getGreeting(), []);

  // Extract first name for greeting
  const firstName = useMemo(() => {
    if (userNameOverride) return userNameOverride;
    if (!displayName || displayName === 'User') return '';
    return displayName.split(' ')[0];
  }, [displayName, userNameOverride]);

  return (
    <Animated.View
      entering={FadeInDown.duration(600).springify()}
      style={styles.container}
    >
      {/* 1. Top Row: Navigation Controls */}
      <View style={styles.topRow}>
        <Pressable
          onPress={onMenuPress}
          hitSlop={12}
          style={styles.iconButton}
          className="bg-white/5 active:bg-white/10"
          accessibilityLabel="Open menu"
          accessibilityRole="button"
        >
          <Menu size={20} color="rgba(255,255,255,0.7)" />
        </Pressable>

        <View style={styles.rightControls}>
          <Pressable
            onPress={onNotificationPress}
            hitSlop={12}
            style={styles.iconButton}
            className="bg-white/5 active:bg-white/10 mr-3"
            accessibilityLabel="View notifications"
            accessibilityRole="button"
          >
            <Bell size={18} color="rgba(255,255,255,0.7)" />
            {/* Notification dot indicator */}
            <View style={styles.notificationDot} />
          </Pressable>

          <View style={styles.avatarWrapper}>
            <Avatar
              photoURL={user?.photoURL ?? null}
              name={displayName}
              size="md"
              className="border border-neeva-purple-500/20"
            />
            {/* User status green dot overlay */}
            <View style={styles.statusDot} />
          </View>
        </View>
      </View>

      {/* 2. Greeting Text */}
      <View style={styles.greetingSection}>
        <Text
          style={styles.greetingText}
          className="text-white/50 font-sans"
          allowFontScaling={true}
        >
          {greeting}{firstName ? `, ${firstName}` : ''} 👋
        </Text>

        {/* 3. Display Welcome Message */}
        <Text
          style={styles.welcomeText}
          className="text-white font-sans font-semibold"
          allowFontScaling={true}
        >
          I'm glad you're here.
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  rightControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 44, // Minimum 44px touch target compliance
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#06B6D4', // Cyan-500 status indicator
  },
  avatarWrapper: {
    position: 'relative',
  },
  statusDot: {
    position: 'absolute',
    top: -1,
    right: -1,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981', // Green active indicator status
    borderWidth: 2,
    borderColor: '#0B0B12', // Matches new dark surface background
  },
  greetingSection: {
    marginTop: 0,
  },
  greetingText: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500',
  },
  welcomeText: {
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.6,
    marginTop: 4,
  },
});

export default HomeHeader;
