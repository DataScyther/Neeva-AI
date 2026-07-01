import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { Home, MessageCircle, Compass, Users, User } from 'lucide-react-native';
import Animated from 'react-native-reanimated';
import { useUnreadCount } from '@/hooks/realtime/useUnreadCount';

type TabIconProps = {
  name: string;
  focused: boolean;
  color: string;
  size: number;
  badge?: number;
};

function TabIcon({ name, focused, color, size, badge }: TabIconProps) {
  const iconProps = { color, size: focused ? size + 1 : size };
  let iconComponent;

  switch (name) {
    case 'home':
      iconComponent = <Home {...iconProps} />;
      break;
    case 'chat':
      iconComponent = <MessageCircle {...iconProps} />;
      break;
    case 'journey':
      iconComponent = <Compass {...iconProps} />;
      break;
    case 'community':
      iconComponent = <Users {...iconProps} />;
      break;
    case 'profile':
      iconComponent = <User {...iconProps} />;
      break;
    default:
      iconComponent = <Home {...iconProps} />;
  }

  return (
    <View style={styles.iconContainer}>
      <Animated.View style={focused ? styles.iconActive : null}>
        {iconComponent}
        {badge != null && badge > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {badge > 99 ? '99+' : badge}
            </Text>
          </View>
        )}
      </Animated.View>
      {focused && <View style={styles.activeDot} />}
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    position: 'relative',
    top: 2,
  },
  iconActive: {
    transform: [{ scale: 1.12 }],
  },
  activeDot: {
    position: 'absolute',
    bottom: -6,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#8B5CF6',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -8,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
  },
});

export default function TabLayout() {
  const unreadCount = useUnreadCount();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'rgba(26, 20, 40, 0.92)',
          borderTopColor: 'rgba(255, 255, 255, 0.08)',
          borderTopWidth: 1,
          borderRadius: 24,
          height: 64,
          bottom: 24,
          left: 16,
          right: 16,
          paddingBottom: 0,
          paddingTop: 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 10,
        },
        tabBarActiveTintColor: '#8B5CF6',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.35)',
        tabBarLabelStyle: {
          display: 'none', // clean minimal floating appearance
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="home" focused={focused} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="chat" focused={focused} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="journey"
        options={{
          title: 'Journey',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="journey" focused={focused} color={color} size={size} />
          ),
        }}
      />
        <Tabs.Screen
          name="community"
          options={{
            title: 'Community',
            tabBarIcon: ({ color, size, focused }) => (
              <TabIcon
                name="community"
                focused={focused}
                color={color}
                size={size}
                badge={unreadCount}
              />
            ),
          }}
        />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="profile" focused={focused} color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
