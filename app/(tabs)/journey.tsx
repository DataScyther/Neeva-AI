/**
 * Neeva AI — Journey Tab
 *
 * Phase 4 target: CBT Exercises, Guided Meditation, Breathing Exercises,
 * Wellness Studio, Reflection, Progress Tracking.
 *
 * Current: Placeholder screen.
 */

import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Compass, Brain, Wind, Sparkles } from 'lucide-react-native';

const exercises = [
  { icon: Brain, title: 'CBT Exercises', desc: 'Cognitive Behavioral Therapy', color: '#8B5CF6' },
  { icon: Wind, title: 'Breathing', desc: 'Guided breathing techniques', color: '#06B6D4' },
  { icon: Sparkles, title: 'Meditation', desc: 'Guided mindfulness sessions', color: '#A78BFA' },
  { icon: Compass, title: 'Wellness Studio', desc: 'Explore wellness tools', color: '#22D3EE' },
];

export default function JourneyScreen() {
  return (
    <SafeAreaView className="flex-1 bg-app-dark" edges={['top']}>
      <StatusBar style="light" />
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="pt-4 pb-6">
          <Text className="text-white/40 text-label font-medium">
            Your Journey
          </Text>
          <Text className="text-white text-card-title font-semibold mt-1">
            Explore wellness exercises
          </Text>
        </View>

        {/* Exercise Cards */}
        {exercises.map((exercise, index) => {
          const IconComponent = exercise.icon;
          return (
            <View
              key={index}
              className="bg-neeva-glass-dark/20 rounded-glass-lg p-5 mb-4 border border-neeva-glass-border flex-row items-center"
            >
              <View
                className="w-14 h-14 rounded-full items-center justify-center"
                style={{ backgroundColor: `${exercise.color}20` }}
              >
                <IconComponent size={24} color={exercise.color} />
              </View>
              <View className="flex-1 ml-4">
                <Text className="text-white text-body font-semibold">
                  {exercise.title}
                </Text>
                <Text className="text-white/40 text-body-sm mt-1">
                  {exercise.desc}
                </Text>
              </View>
              <View className="bg-neeva-glass-highlight rounded-full px-3 py-1">
                <Text className="text-white/50 text-caption">Start</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
