/**
 * Neeva AI — Profile Tab
 *
 * Phase 7 target: Settings, Notifications, Subscription, Billing, Security.
 * Current: Placeholder screen.
 */

import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { User, Settings, Bell, Shield, CreditCard } from 'lucide-react-native';

const menuItems = [
  { icon: Bell, title: 'Notifications', color: '#8B5CF6' },
  { icon: Shield, title: 'Privacy & Security', color: '#06B6D4' },
  { icon: CreditCard, title: 'Subscription', color: '#A78BFA' },
  { icon: Settings, title: 'Settings', color: '#22D3EE' },
];

export default function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-app-dark" edges={['top']}>
      <StatusBar style="light" />
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="pt-4 pb-8 items-center">
          <View className="w-20 h-20 rounded-full bg-neeva-purple-600/30 items-center justify-center mb-4 border border-neeva-glass-border">
            <User size={36} color="#8B5CF6" />
          </View>
          <Text className="text-white text-card-title font-semibold">
            Your Profile
          </Text>
          <Text className="text-white/40 text-body-sm mt-1">
            Manage your account
          </Text>
        </View>

        {/* Menu Items */}
        {menuItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <Pressable
              key={index}
              className="bg-neeva-glass-dark/20 rounded-glass p-4 mb-3 border border-neeva-glass-border flex-row items-center active:opacity-70"
            >
              <View
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: `${item.color}20` }}
              >
                <IconComponent size={20} color={item.color} />
              </View>
              <Text className="text-white text-body flex-1 ml-4">
                {item.title}
              </Text>
              <Text className="text-white/30 text-lg">›</Text>
            </Pressable>
          );
        })}

        {/* Sign Out */}
        <Pressable className="mt-6 bg-neeva-glass-dark/20 rounded-glass p-4 border border-neeva-glass-border items-center active:opacity-70">
          <Text className="text-red-400 text-body font-medium">
            Sign Out
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
