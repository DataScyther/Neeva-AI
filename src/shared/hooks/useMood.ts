/**
 * useMood — Mood Tracking Hooks
 *
 * TanStack Query hooks for mood data (server state).
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { moodRepository } from '@/repositories/MoodRepository';
import type { MoodEntry } from '@/shared/types';

const MOOD_QUERY_KEY = ['moods'] as const;

export function useMoodEntries(uid: string | null) {
  return useQuery({
    queryKey: [...MOOD_QUERY_KEY, uid],
    queryFn: async () => {
      if (!uid) return [];
      return moodRepository.loadMoods(uid);
    },
    enabled: !!uid,
  });
}

export function useSaveMood() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ uid, entry }: { uid: string; entry: MoodEntry }) => {
      const success = await moodRepository.saveMood(uid, entry);
      if (!success) throw new Error('Failed to save mood entry');
      return entry;
    },
    onSuccess: (_data, { uid }) => {
      queryClient.invalidateQueries({ queryKey: [...MOOD_QUERY_KEY, uid] });
    },
  });
}

/**
 * Get today's mood entries (computed client-side).
 */
export function getTodayMoodEntries(entries: MoodEntry[]): MoodEntry[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return entries.filter((entry) => {
    const entryDate = new Date(entry.timestamp);
    return entryDate >= today;
  });
}
