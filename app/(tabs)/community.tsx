/**
 * Neeva AI — Community Tab
 *
 * Phase 6 target: Feed, Groups, Discussions, Support.
 * Current: Placeholder screen.
 */

import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Users } from 'lucide-react-native';

export default function CommunityScreen() {
  return (
    <SafeAreaView className="flex-1 bg-app-dark" edges={['top']}>
      <StatusBar style="light" />
      <View className="flex-1 px-5">
        {/* Header */}
        <View className="pt-4 pb-6">
          <Text className="text-white/40 text-label font-medium">
            Community
          </Text>
          <Text className="text-white text-card-title font-semibold mt-1">
            Connect with others
          </Text>
        </View>

        {/* Empty State */}
        <View className="flex-1 justify-center items-center">
          <View className="bg-neeva-cyan-600/20 w-20 h-20 rounded-full items-center justify-center mb-6">
            <Users size={36} color="#06B6D4" />
          </View>
          <Text className="text-white text-card-title font-semibold mb-2">
            Coming Soon
          </Text>
          <Text className="text-white/40 text-body text-center max-w-xs">
            Connect with a supportive community on your wellness journey.
            Groups and discussions are on the way.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
