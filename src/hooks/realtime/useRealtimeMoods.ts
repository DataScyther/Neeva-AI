import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { collection, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRealtimeCollection } from '@/hooks/useRealtimeSubscription';
import { moodRepository } from '@/repositories/MoodRepository';
import type { MoodEntry } from '@/shared/types';

export function useRealtimeMoods(uid: string | null) {
  const moodsQuery = useMemo(
    () =>
      uid
        ? query(collection(db, 'users', uid, 'moods'), orderBy('timestamp', 'asc'))
        : null,
    [uid],
  );

  useRealtimeCollection<MoodEntry>(moodsQuery, ['moods', uid], !!uid);

  return useQuery({
    queryKey: ['moods', uid],
    queryFn: async () => {
      if (!uid) return [];
      return moodRepository.loadMoods(uid);
    },
    enabled: !!uid,
    staleTime: Infinity,
  });
}
