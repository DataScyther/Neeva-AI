/**
 * Neeva AI — Chat Tab
 *
 * Phase 5 target: Streaming AI conversation with memory and attachment support.
 * Current: Placeholder screen.
 */

import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MessageCircle } from 'lucide-react-native';

export default function ChatScreen() {
  return (
    <SafeAreaView className="flex-1 bg-app-dark" edges={['top']}>
      <StatusBar style="light" />
      <View className="flex-1 px-5">
        {/* Header */}
        <View className="pt-4 pb-6">
          <Text className="text-white/40 text-label font-medium">
            Neeva Chat
          </Text>
          <Text className="text-white text-card-title font-semibold mt-1">
            How can I help you?
          </Text>
        </View>

        {/* Empty State */}
        <View className="flex-1 justify-center items-center">
          <View className="bg-neeva-purple-600/20 w-20 h-20 rounded-full items-center justify-center mb-6">
            <MessageCircle size={36} color="#8B5CF6" />
          </View>
          <Text className="text-white text-card-title font-semibold mb-2">
            Start a Conversation
          </Text>
          <Text className="text-white/40 text-body text-center max-w-xs">
            Neeva is here to listen, support, and guide you through your
            wellness journey.
          </Text>
        </View>

        {/* Input Bar Placeholder */}
        <View className="py-4">
          <View className="bg-neeva-glass-dark/40 rounded-glass-lg p-4 border border-neeva-glass-border flex-row items-center">
            <View className="flex-1">
              <Text className="text-white/30 text-body-sm">
                Message Neeva...
              </Text>
            </View>
            <View className="bg-neeva-purple-600 w-10 h-10 rounded-full items-center justify-center">
              <Text className="text-white text-sm">↑</Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
