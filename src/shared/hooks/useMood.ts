import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { moodRepository } from '@/repositories/MoodRepository';
import type { MoodEntry } from '@/shared/types';
import { useSyncStore } from '@/core/store/useSyncStore';

const MOOD_QUERY_KEY = ['moods'] as const;

export function useMoodEntries(uid: string | null) {
  const query = useQuery({
    queryKey: [...MOOD_QUERY_KEY, uid],
    queryFn: async () => {
      if (!uid) return [];
      return moodRepository.loadMoods(uid);
    },
    enabled: !!uid,
  });

  const pendingQueue = useSyncStore((state) => state.pendingQueue);
  const pendingMoods = useMemo(() => {
    return pendingQueue
      .filter((item) => item.type === 'save_mood' && item.payload.uid === uid)
      .map((item) => item.payload.entry as MoodEntry);
  }, [pendingQueue, uid]);

  return {
    ...query,
    data: useMemo(() => {
      if (!query.data) return undefined;
      const merged = [...query.data];
      pendingMoods.forEach((pm) => {
        const idx = merged.findIndex((m) => m.id === pm.id);
        if (idx >= 0) {
          merged[idx] = pm;
        } else {
          merged.push(pm);
        }
      });
      // Sort by timestamp asc
      return merged.sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
    }, [query.data, pendingMoods]),
  };
}

export function useSaveMood() {
  const queryClient = useQueryClient();
  const enqueueItem = useSyncStore((state) => state.enqueueItem);

  return useMutation({
    mutationFn: async ({ uid, entry }: { uid: string; entry: MoodEntry }) => {
      await enqueueItem('save_mood', { uid, entry }, queryClient);
      return entry;
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
