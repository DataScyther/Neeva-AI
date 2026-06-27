/**
 * Neeva AI — Home Tab
 *
 * Phase 4 target: Daily Check-in, Mood Snapshot, Continue Journey,
 * AI Recommendations, Progress Overview.
 *
 * Current: Placeholder with Neeva design language.
 */

import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Sparkles } from 'lucide-react-native';

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-app-dark" edges={['top']}>
      <StatusBar style="light" />
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row justify-between items-center pt-4 pb-6">
          <View>
            <Text className="text-white/40 text-label font-medium">
              Welcome back
            </Text>
            <Text className="text-white text-card-title font-semibold mt-1">
              Ready for today?
            </Text>
          </View>
          <View className="bg-neeva-purple-600/20 p-3 rounded-full">
            <Sparkles size={22} color="#8B5CF6" />
          </View>
        </View>

        {/* Daily Check-in Card */}
        <View className="bg-gradient-to-br from-neeva-purple-700/30 to-neeva-cyan-600/20 rounded-glass-lg p-6 mb-5 border border-neeva-glass-border">
          <Text className="text-white text-card-title font-semibold">
            How are you feeling?
          </Text>
          <Text className="text-white/50 text-body-sm mt-2">
            Take a moment to check in with yourself.
          </Text>
          <View className="flex-row mt-5 space-x-3">
            {['😊', '😐', '😔', '😰', '😤'].map((emoji) => (
              <View
                key={emoji}
                className="w-12 h-12 rounded-full bg-neeva-glass-highlight items-center justify-center"
              >
                <Text className="text-xl">{emoji}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Continue Journey Card */}
        <View className="bg-neeva-glass-dark/20 rounded-glass-lg p-6 mb-5 border border-neeva-glass-border">
          <Text className="text-white text-card-title font-semibold mb-2">
            Continue Your Journey
          </Text>
          <Text className="text-white/40 text-body-sm mb-4">
            Pick up where you left off.
          </Text>
          <View className="flex-row items-center justify-between bg-neeva-purple-600/10 rounded-glass p-4">
            <View className="flex-1">
              <Text className="text-white text-body-sm font-medium">
                Mindful Breathing
              </Text>
              <Text className="text-white/40 text-caption mt-1">
                5 min • Meditation
              </Text>
            </View>
            <View className="bg-neeva-purple-600 px-4 py-2 rounded-full">
              <Text className="text-white text-label font-semibold">
                Resume
              </Text>
            </View>
          </View>
        </View>

        {/* Progress Overview Card */}
        <View className="bg-neeva-glass-dark/20 rounded-glass-lg p-6 mb-5 border border-neeva-glass-border">
          <Text className="text-white text-card-title font-semibold mb-4">
            This Week
          </Text>
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-neeva-cyan-400 text-section-title font-bold">
                3
              </Text>
              <Text className="text-white/40 text-caption mt-1">
                Sessions
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-neeva-cyan-400 text-section-title font-bold">
                45
              </Text>
              <Text className="text-white/40 text-caption mt-1">
                Minutes
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-neeva-cyan-400 text-section-title font-bold">
                2
              </Text>
              <Text className="text-white/40 text-caption mt-1">
                Streak
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
