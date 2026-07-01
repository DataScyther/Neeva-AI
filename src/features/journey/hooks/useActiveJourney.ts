import { useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { journeyRepository } from '@/repositories/JourneyRepository';
import { JourneyNavigationService } from '../services/JourneyNavigationService';
import type { JourneyProgress } from '../types/JourneyProgress';

const ACTIVE_JOURNEY_QUERY_KEY = ['active-journey'] as const;

export function useActiveJourney(uid: string | null) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [...ACTIVE_JOURNEY_QUERY_KEY, uid],
    queryFn: async () => {
      if (!uid) return null;
      return journeyRepository.getActiveJourney(uid);
    },
    enabled: !!uid,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!uid) return;
    const sync = async () => {
      try {
        const merged = await journeyRepository.syncFromCloud(uid);
        if (merged) {
          queryClient.setQueryData([...ACTIVE_JOURNEY_QUERY_KEY, uid], merged);
        }
      } catch {
        // Local data already displayed — background sync is best-effort
      }
    };
    const timer = setTimeout(() => void sync(), 100);
    return () => clearTimeout(timer);
  }, [uid, queryClient]);

  const resumeJourney = useCallback((journey: JourneyProgress) => {
    const destination = JourneyNavigationService.resolve(journey);
    if (destination.type === 'route') {
      router.push({ pathname: destination.pathname as any, params: destination.params });
    } else {
      router.push('/journey/placeholder');
    }
  }, []);

  const refetchJourney = useCallback(() => {
    return queryClient.invalidateQueries({ queryKey: [...ACTIVE_JOURNEY_QUERY_KEY, uid] });
  }, [queryClient, uid]);

  return {
    ...query,
    isLoading: uid === null || query.isLoading,
    resumeJourney,
    refetchJourney,
  };
}
