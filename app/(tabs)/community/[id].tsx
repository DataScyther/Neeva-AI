import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Send } from 'lucide-react-native';
import { useUserId, useUserDisplayName } from '@/shared/hooks/useAuth';
import { useRealtimeGroupMessages } from '@/hooks/realtime/useRealtimeGroupMessages';
import { useRealtimeConversationDetails } from '@/hooks/realtime/useRealtimeConversationDetails';
import { useSendGroupMessage, useLeaveGroup } from '@/hooks/mutations/useGroupMutations';
import type { ConversationMessage } from '@/shared/types';

export default function GroupChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const uid = useUserId();
  const displayName = useUserDisplayName();
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const { data: conversation } = useRealtimeConversationDetails(id);
  const {
    messages,
    isLoading,
    loadOlderMessages,
  } = useRealtimeGroupMessages(id);

  const sendMessage = useSendGroupMessage();
  const leaveGroup = useLeaveGroup();

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || !uid || !id) return;

    sendMessage.mutate({
      conversationId: id,
      senderId: uid,
      senderName: displayName,
      content: trimmed,
    });

    setInput('');
  }, [input, uid, id, displayName, sendMessage]);

  const handleLeave = useCallback(() => {
    if (!uid || !id) return;
    leaveGroup.mutate(
      { conversationId: id, uid, userName: displayName },
      { onSuccess: () => router.back() },
    );
  }, [uid, id, displayName, leaveGroup, router]);

  const renderMessage = useCallback(
    ({ item }: { item: ConversationMessage }) => {
      const isSystem = item.type === 'system';
      const isOwn = item.senderId === uid;

      if (isSystem) {
        return (
          <View className="items-center my-3">
            <Text className="text-white/30 text-body-sm italic">
              {item.content}
            </Text>
          </View>
        );
      }

      return (
        <View
          className={`my-1 max-w-[80%] ${isOwn ? 'self-end' : 'self-start'}`}
        >
          {!isOwn && (
            <Text className="text-white/40 text-label mb-1 ml-1">
              {item.senderName}
            </Text>
          )}
          <View
            className={`rounded-2xl px-4 py-2.5 ${
              isOwn
                ? 'bg-neeva-purple-600 rounded-tr-sm'
                : 'bg-neeva-glass-dark/30 rounded-tl-sm border border-neeva-glass-border'
            }`}
          >
            <Text className="text-white text-body-sm">{item.content}</Text>
          </View>
          <Text
            className={`text-white/25 text-label mt-1 ${isOwn ? 'text-right' : 'text-left'}`}
          >
            {formatTime(item.timestamp)}
          </Text>
        </View>
      );
    },
    [uid],
  );

  if (!id) {
    return (
      <SafeAreaView className="flex-1 bg-app-dark" edges={['top']}>
        <View className="flex-1 justify-center items-center">
          <Text className="text-white/40">Conversation not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-app-dark" edges={['top']}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Header */}
        <View className="px-4 py-3 flex-row items-center border-b border-neeva-glass-border">
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center active:opacity-70"
          >
            <ArrowLeft size={22} color="white" />
          </Pressable>
          <View className="flex-1 ml-2">
            <Text className="text-white text-body font-semibold" numberOfLines={1}>
              {conversation?.name ?? 'Group'}
            </Text>
            {conversation && (
              <Text className="text-white/40 text-label">
                {conversation.memberCount} {conversation.memberCount === 1 ? 'member' : 'members'}
              </Text>
            )}
          </View>
          <Pressable
            onPress={handleLeave}
            className="active:opacity-70 px-3 py-2"
          >
            <Text className="text-red-400 text-body-sm">Leave</Text>
          </Pressable>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          className="flex-1 px-4"
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          onEndReached={loadOlderMessages}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            isLoading ? (
              <View className="py-4 items-center">
                <ActivityIndicator color="rgba(255,255,255,0.3)" />
              </View>
            ) : null
          }
          contentContainerStyle={{
            paddingTop: 12,
            paddingBottom: 12,
            flexGrow: 1,
            justifyContent: 'flex-end',
          }}
          inverted={false}
        />

        {/* Input Bar */}
        <View className="px-4 py-3 border-t border-neeva-glass-border">
          <View className="flex-row items-center bg-neeva-glass-dark/40 rounded-glass-lg px-4 py-2 border border-neeva-glass-border">
            <TextInput
              className="flex-1 text-white text-body-sm py-2"
              placeholder="Message..."
              placeholderTextColor="rgba(255,255,255,0.3)"
              value={input}
              onChangeText={setInput}
              multiline
              maxLength={2000}
            />
            <Pressable
              onPress={handleSend}
              disabled={!input.trim() || sendMessage.isPending}
              className={`w-10 h-10 rounded-full items-center justify-center ml-2 ${
                input.trim()
                  ? 'bg-neeva-purple-600 active:opacity-70'
                  : 'bg-neeva-purple-600/30'
              }`}
            >
              <Send size={18} color="white" />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function formatTime(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h = hours % 12 || 12;
  const m = minutes.toString().padStart(2, '0');
  return `${h}:${m} ${ampm}`;
}
