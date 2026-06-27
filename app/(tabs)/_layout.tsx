/**
 * Neeva AI — Bottom Tab Navigator
 *
 * The navigation is permanently locked to five tabs:
 *   Home | Chat | Journey | Community | Profile
 *
 * No additional root tabs without explicit architectural approval.
 */

import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import { Home, MessageCircle, Compass, Users, User } from 'lucide-react-native';

type TabIconProps = {
  name: string;
  focused: boolean;
  color: string;
  size: number;
};

function TabIcon({ name, focused, color, size }: TabIconProps) {
  const iconProps = { color, size };
  switch (name) {
    case 'home':
      return <Home {...iconProps} />;
    case 'chat':
      return <MessageCircle {...iconProps} />;
    case 'journey':
      return <Compass {...iconProps} />;
    case 'community':
      return <Users {...iconProps} />;
    case 'profile':
      return <User {...iconProps} />;
    default:
      return <Home {...iconProps} />;
  }
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1A1428',
          borderTopColor: 'rgba(255, 255, 255, 0.08)',
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 24,
          paddingTop: 10,
          elevation: 0,
        },
        tabBarActiveTintColor: '#8B5CF6',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.35)',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="home" focused={false} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="chat" focused={false} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="journey"
        options={{
          title: 'Journey',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="journey" focused={false} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Community',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="community" focused={false} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="profile" focused={false} color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
