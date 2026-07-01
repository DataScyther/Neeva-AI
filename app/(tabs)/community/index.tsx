import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Users, Plus, MessageCircle } from 'lucide-react-native';
import { useUserId, useUserDisplayName } from '@/shared/hooks/useAuth';
import { useRealtimeConversations } from '@/hooks/realtime/useRealtimeConversations';
import { useRealtimeConversationDetails } from '@/hooks/realtime/useRealtimeConversationDetails';
import { Avatar } from '@/shared/components/Avatar';

function formatTimestamp(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Now';
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  return date.toLocaleDateString();
}

export default function CommunityListScreen() {
  const router = useRouter();
  const uid = useUserId();
  const displayName = useUserDisplayName();
  const { data: conversations, isLoading, refetch } = useRealtimeConversations(uid);

  const renderItem = useCallback(
    ({ item }: { item: { id: string; lastMessagePreview: string; lastMessageAt: Date; isMuted: boolean } }) => (
      <ConversationRow
        conversationId={item.id}
        lastMessagePreview={item.lastMessagePreview}
        lastMessageAt={item.lastMessageAt}
        isMuted={item.isMuted}
        onPress={() => router.push(`/(tabs)/community/${item.id}`)}
      />
    ),
    [router],
  );

  if (!uid) {
    return (
      <SafeAreaView className="flex-1 bg-app-dark" edges={['top']}>
        <StatusBar style="light" />
        <View className="flex-1 justify-center items-center px-5">
          <Text className="text-white/40 text-body">Sign in to see your groups</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-app-dark" edges={['top']}>
      <StatusBar style="light" />
      <View className="flex-1 px-5">
        <View className="pt-4 pb-4 flex-row items-center justify-between">
          <View>
            <Text className="text-white/40 text-label font-medium">Community</Text>
            <Text className="text-white text-card-title font-semibold mt-1">
              Your Groups
            </Text>
          </View>
          <Pressable
            onPress={() => router.push('/(tabs)/community/create')}
            className="bg-neeva-purple-600 w-10 h-10 rounded-full items-center justify-center active:opacity-70"
          >
            <Plus size={22} color="white" />
          </Pressable>
        </View>

        <FlatList
          data={conversations ?? []}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refetch}
              tintColor="rgba(255,255,255,0.5)"
            />
          }
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center pt-20">
              <View className="bg-neeva-cyan-600/20 w-20 h-20 rounded-full items-center justify-center mb-6">
                <Users size={36} color="#06B6D4" />
              </View>
              <Text className="text-white text-card-title font-semibold mb-2">
                No Groups Yet
              </Text>
              <Text className="text-white/40 text-body text-center max-w-xs mb-6">
                Create or join a group to connect with others on your wellness journey.
              </Text>
              <Pressable
                onPress={() => router.push('/(tabs)/community/create')}
                className="bg-neeva-purple-600 rounded-glass px-6 py-3 active:opacity-70"
              >
                <Text className="text-white text-body font-semibold">
                  Create a Group
                </Text>
              </Pressable>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

function ConversationRow({
  conversationId,
  lastMessagePreview,
  lastMessageAt,
  isMuted,
  onPress,
}: {
  conversationId: string;
  lastMessagePreview: string;
  lastMessageAt: Date;
  isMuted: boolean;
  onPress: () => void;
}) {
  const { data: conversation } = useRealtimeConversationDetails(conversationId);

  return (
    <Pressable
      onPress={onPress}
      className="bg-neeva-glass-dark/20 rounded-glass p-4 mb-3 border border-neeva-glass-border flex-row items-center active:opacity-70"
    >
      <Avatar name={conversation?.name} size="lg" />
      <View className="flex-1 ml-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-white text-body font-semibold flex-1" numberOfLines={1}>
            {conversation?.name ?? 'Group'}
          </Text>
          <Text className="text-white/30 text-label ml-2">
            {formatTimestamp(lastMessageAt)}
          </Text>
        </View>
        <View className="flex-row items-center mt-1">
          <Text
            className={`flex-1 text-body-sm ${isMuted ? 'text-white/30' : 'text-white/50'}`}
            numberOfLines={1}
          >
            {lastMessagePreview || 'No messages yet'}
          </Text>
          {!isMuted && (
            <View className="w-2 h-2 rounded-full bg-neeva-purple-500 ml-2" />
          )}
        </View>
      </View>
      <Text className="text-white/30 text-lg ml-2">›</Text>
    </Pressable>
  );
}
