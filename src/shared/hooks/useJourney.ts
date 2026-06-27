/**
 * useJourney — Journey/Exercise Hooks
 *
 * TanStack Query hooks for exercise progress (server state).
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { journeyRepository } from '@/repositories/JourneyRepository';

const JOURNEY_QUERY_KEY = ['journey'] as const;

export interface Exercise {
  id: string;
  type: 'meditation' | 'journaling' | 'gratitude' | 'breathing';
  title: string;
  description: string;
  duration: number;
  completed: boolean;
  streak: number;
}

const DEFAULT_EXERCISES: Exercise[] = [
  { id: '1', type: 'meditation', title: 'Mindful Breathing', description: 'Focus on your breath for 5 minutes', duration: 5, completed: false, streak: 0 },
  { id: '2', type: 'journaling', title: 'Gratitude Journal', description: "Write down 3 things you're grateful for", duration: 10, completed: false, streak: 0 },
  { id: '3', type: 'breathing', title: '4-7-8 Breathing', description: 'Inhale for 4, hold for 7, exhale for 8', duration: 8, completed: false, streak: 0 },
  { id: '4', type: 'meditation', title: 'Body Scan', description: 'Progressive muscle relaxation', duration: 12, completed: false, streak: 0 },
  { id: 'breathing-basic', type: 'breathing', title: 'Basic Breathing Meditation', description: 'Simple breath awareness for beginners', duration: 5, completed: false, streak: 0 },
  { id: 'body-scan', type: 'meditation', title: 'Body Scan Relaxation', description: 'Progressive relaxation through body awareness', duration: 10, completed: false, streak: 0 },
  { id: 'mindfulness', type: 'meditation', title: 'Mindful Awareness', description: 'Present moment awareness meditation', duration: 8, completed: false, streak: 0 },
  { id: 'loving-kindness', type: 'meditation', title: 'Loving Kindness', description: 'Cultivate compassion for yourself and others', duration: 12, completed: false, streak: 0 },
];

export function useExercises(uid: string | null) {
  return useQuery({
    queryKey: [...JOURNEY_QUERY_KEY, 'exercises', uid],
    queryFn: async () => {
      if (!uid) return DEFAULT_EXERCISES;

      const progress = await journeyRepository.loadExerciseProgress(uid);

      return DEFAULT_EXERCISES.map((ex) => {
        const stored = progress[ex.id];
        if (stored) {
          return { ...ex, completed: stored.completed, streak: stored.streak };
        }
        return ex;
      });
    },
    enabled: true,
  });
}

export function useSaveExerciseProgress() {
  const queryClient = useQueryClient();

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
      const success = await journeyRepository.saveProgress(uid, exerciseId, streak);
      if (!success) throw new Error('Failed to save exercise progress');
      return { exerciseId, streak };
    },
    onSuccess: (_, { uid }) => {
      queryClient.invalidateQueries({ queryKey: [...JOURNEY_QUERY_KEY, 'exercises', uid] });
    },
  });
}
