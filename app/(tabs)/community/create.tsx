import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { ArrowLeft, Users } from 'lucide-react-native';
import { useUserId, useUserDisplayName } from '@/shared/hooks/useAuth';
import { useCreateGroup } from '@/hooks/mutations/useGroupMutations';

export default function CreateGroupScreen() {
  const router = useRouter();
  const uid = useUserId();
  const displayName = useUserDisplayName();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSupportGroup, setIsSupportGroup] = useState(false);

  const createGroup = useCreateGroup();

  const handleCreate = useCallback(() => {
    if (!uid || !name.trim()) return;

    createGroup.mutate(
      {
        name: name.trim(),
        description: description.trim() || undefined,
        createdBy: uid,
        participantIds: [uid],
        isSupportGroup,
      },
      {
        onSuccess: (conversationId) => {
          router.replace(`/(tabs)/community/${conversationId}`);
        },
      },
    );
  }, [name, description, isSupportGroup, uid, createGroup, router]);

  return (
    <SafeAreaView className="flex-1 bg-app-dark" edges={['top']}>
      <StatusBar style="light" />
      <View className="flex-1 px-5">
        {/* Header */}
        <View className="pt-4 pb-6 flex-row items-center">
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center active:opacity-70"
          >
            <ArrowLeft size={22} color="white" />
          </Pressable>
          <Text className="text-white text-card-title font-semibold ml-4">
            Create Group
          </Text>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Group Name */}
          <View className="mb-5">
            <Text className="text-white/60 text-body-sm font-medium mb-2">
              Group Name
            </Text>
            <TextInput
              className="bg-neeva-glass-dark/20 rounded-glass px-4 py-3 text-white text-body border border-neeva-glass-border"
              placeholder="e.g. Anxiety Support Circle"
              placeholderTextColor="rgba(255,255,255,0.3)"
              value={name}
              onChangeText={setName}
              maxLength={100}
              autoFocus
            />
          </View>

          {/* Description */}
          <View className="mb-5">
            <Text className="text-white/60 text-body-sm font-medium mb-2">
              Description (optional)
            </Text>
            <TextInput
              className="bg-neeva-glass-dark/20 rounded-glass px-4 py-3 text-white text-body border border-neeva-glass-border"
              placeholder="What's this group about?"
              placeholderTextColor="rgba(255,255,255,0.3)"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              maxLength={500}
              textAlignVertical="top"
            />
          </View>

          {/* Support Group Toggle */}
          <View className="bg-neeva-glass-dark/20 rounded-glass p-4 border border-neeva-glass-border flex-row items-center justify-between mb-8">
            <View className="flex-1 mr-4">
              <Text className="text-white text-body font-medium">
                Support Group
              </Text>
              <Text className="text-white/40 text-body-sm mt-1">
                Members can share their experiences and support each other
              </Text>
            </View>
            <Switch
              value={isSupportGroup}
              onValueChange={setIsSupportGroup}
              trackColor={{ false: 'rgba(255,255,255,0.1)', true: '#8B5CF680' }}
              thumbColor={isSupportGroup ? '#8B5CF6' : 'rgba(255,255,255,0.4)'}
            />
          </View>

          {/* Create Button */}
          <Pressable
            onPress={handleCreate}
            disabled={!name.trim() || createGroup.isPending}
            className={`rounded-glass py-4 items-center ${
              name.trim() && !createGroup.isPending
                ? 'bg-neeva-purple-600 active:opacity-70'
                : 'bg-neeva-purple-600/30'
            }`}
          >
            {createGroup.isPending ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-body font-semibold">
                Create Group
              </Text>
            )}
          </Pressable>

          {createGroup.isError && (
            <Text className="text-red-400 text-body-sm text-center mt-4">
              {createGroup.error?.message ?? 'Failed to create group'}
            </Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
