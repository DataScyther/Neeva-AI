import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRealtimeCollection } from '@/hooks/useRealtimeSubscription';
import { journeyRepository } from '@/repositories/JourneyRepository';

export interface ExerciseProgressDoc {
  id: string;
  completed: boolean;
  streak: number;
  lastCompletedAt?: Date;
}

export function useRealtimeExercises(uid: string | null) {
  const exercisesQuery = useMemo(
    () => (uid ? collection(db, 'users', uid, 'exercises') : null),
    [uid],
  );

  useRealtimeCollection<ExerciseProgressDoc>(exercisesQuery, ['exercises', uid], !!uid);

  return useQuery({
    queryKey: ['exercises', uid],
    queryFn: async () => {
      if (!uid) return [];
      const progress = await journeyRepository.loadExerciseProgress(uid);
      return Object.entries(progress).map(([id, p]) => ({
        id,
        completed: p.completed,
        streak: p.streak,
        lastCompletedAt: p.lastCompletedAt,
      })) as ExerciseProgressDoc[];
    },
    enabled: !!uid,
    staleTime: Infinity,
    select: (data: ExerciseProgressDoc[]) => {
      const record: Record<string, ExerciseProgressDoc> = {};
      data.forEach((doc) => {
        record[doc.id] = doc;
      });
      return record;
    },
  });
}
