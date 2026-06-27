/**
 * Neeva AI — Onboarding Screen
 *
 * Phase 3 target: Full multi-step onboarding flow.
 * Current: Placeholder screen.
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function OnboardingScreen() {
  return (
    <SafeAreaView className="flex-1 bg-app-dark">
      <StatusBar style="light" />
      <View className="flex-1 px-6 justify-center">
        {/* Placeholder Card */}
        <View className="bg-neeva-glass-dark/30 rounded-glass-lg p-8 border border-neeva-glass-border items-center">
          <Text className="text-white text-hero font-bold mb-4">
            🌿
          </Text>
          <Text className="text-white text-section-title font-semibold mb-4">
            Welcome to Neeva
          </Text>
          <Text className="text-white/60 text-body text-center mb-8">
            Your personal AI wellness companion. Together, we'll build
            healthier habits, manage stress, and cultivate mindfulness.
          </Text>

          <Pressable
            className="w-full bg-neeva-purple-600 py-4 rounded-glass items-center active:opacity-80"
            onPress={() => router.replace('/(tabs)')}
          >
            <Text className="text-white font-semibold text-body-lg">
              Start Your Journey
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
