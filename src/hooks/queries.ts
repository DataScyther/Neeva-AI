import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAppStore, MoodEntry, ChatMessage } from '../store/useAppStore';
import {
  loadUserData,
  getCompletedExercises,
  saveMoodEntry,
  saveChatMessage,
  saveExerciseProgress,
} from '../lib/db';

/**
 * Hook to fetch user data (moods, chats) and sync to Zustand
 */
export function useUserDataQuery(uid: string | null) {
  const setInitialData = useAppStore((state) => state.setInitialData);
  const setLoading = useAppStore((state) => state.setLoading);

  const query = useQuery({
    queryKey: ['userData', uid],
    queryFn: async () => {
      if (!uid) return { moodEntries: [], chatHistory: [], exercises: [] };
      const data = await loadUserData(uid);
      const completedExercises = await getCompletedExercises(uid);

      // Merge exercises into static list
      const defaultExercises = useAppStore.getState().exercises;
      const mergedExercises = defaultExercises.map((ex) => {
        const stored = completedExercises[ex.id];
        if (stored) {
          return { ...ex, completed: stored.completed, streak: stored.streak };
        }
        return ex;
      });

      return {
        moodEntries: data.moodEntries || [],
        chatHistory: data.chatHistory || [],
        exercises: mergedExercises,
      };
    },
    enabled: !!uid,
  });

  // Keep Zustand store in sync with server state
  useEffect(() => {
    if (query.data) {
      setInitialData(query.data);
    }
  }, [query.data, setInitialData]);

  useEffect(() => {
    setLoading(query.isLoading);
  }, [query.isLoading, setLoading]);

  return query;
}

/**
 * Mutation hook to save a mood entry
 */
export function useSaveMoodMutation() {
  const queryClient = useQueryClient();
  const addMoodEntry = useAppStore((state) => state.addMoodEntry);

  return useMutation({
    mutationFn: async ({ uid, entry }: { uid: string; entry: MoodEntry }) => {
      const success = await saveMoodEntry(uid, entry);
      if (!success) throw new Error('Failed to save mood entry');
      return entry;
    },
    onMutate: async ({ entry }) => {
      // Optimistic update
      addMoodEntry(entry);
    },
    onSuccess: (_, { uid }) => {
      queryClient.invalidateQueries({ queryKey: ['userData', uid] });
    },
  });
}

/**
 * Mutation hook to save a chat message
 */
export function useSaveChatMutation() {
  const queryClient = useQueryClient();
  const addChatMessage = useAppStore((state) => state.addChatMessage);

  return useMutation({
    mutationFn: async ({ uid, message }: { uid: string; message: ChatMessage }) => {
      const success = await saveChatMessage(uid, message);
      if (!success) throw new Error('Failed to save chat message');
      return message;
    },
    onMutate: async ({ message }) => {
      // Optimistic update
      addChatMessage(message);
    },
    onSuccess: (_, { uid }) => {
      queryClient.invalidateQueries({ queryKey: ['userData', uid] });
    },
  });
}

/**
 * Mutation hook to save exercise progress
 */
export function useSaveExerciseMutation() {
  const queryClient = useQueryClient();
  const completeExercise = useAppStore((state) => state.completeExercise);

  return useMutation({
    mutationFn: async ({
      uid,
      exerciseId,
      streak,
    }: {
      uid: string;
      exerciseId: string;
      streak: number;
    }) => {
      const success = await saveExerciseProgress(uid, exerciseId, streak);
      if (!success) throw new Error('Failed to save exercise progress');
      return { exerciseId, streak };
    },
    onMutate: async ({ exerciseId }) => {
      // Optimistic update
      completeExercise(exerciseId);
    },
    onSuccess: (_, { uid }) => {
      queryClient.invalidateQueries({ queryKey: ['userData', uid] });
    },
  });
}
