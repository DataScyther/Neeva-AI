import { useEffect, useCallback, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { journeyRepository } from '@/repositories/JourneyRepository';
import { journeyCache } from '../services/JourneyCache';
import { JourneyNavigationService } from '../services/JourneyNavigationService';
import type { JourneyProgress } from '../types/JourneyProgress';

const ACTIVE_JOURNEY_QUERY_KEY = ['active-journey'] as const;

// Prime cache read at module scope — in flight before component mounts
const cachedPromise = journeyCache.get();

export function useActiveJourney(uid: string | null) {
  const queryClient = useQueryClient();
  const [cachedJourney, setCachedJourney] = useState<JourneyProgress | null>(null);
  const cacheRead = useRef(false);

  // Phase 2: Hydrate from cache immediately (AsyncStorage, not network)
  useEffect(() => {
    if (cacheRead.current) return;
    cacheRead.current = true;

    cachedPromise.then((cached) => {
      if (cached) {
        setCachedJourney(cached);
      }
    });
  }, []);

  const query = useQuery({
    queryKey: [...ACTIVE_JOURNEY_QUERY_KEY, uid],
    queryFn: async () => {
      if (!uid) return null;
      const journey = await journeyRepository.getActiveJourney(uid);
      // Write-through: update cache after every successful fetch
      if (journey) {
        await journeyCache.set(journey);
      }
      return journey;
    },
    enabled: !!uid,
    staleTime: Infinity,
  });

  // Keep cached journey in sync with query data
  useEffect(() => {
    if (query.data) {
      setCachedJourney(query.data);
    }
  }, [query.data]);

  // Phase 2 & 5: Background sync — fetch Firestore, diff, update cache + query
  useEffect(() => {
    if (!uid) return;
    const sync = async () => {
      try {
        const merged = await journeyRepository.syncFromCloud(uid);
        if (merged) {
          queryClient.setQueryData([...ACTIVE_JOURNEY_QUERY_KEY, uid], merged);
        }
      } catch (error) {
        console.warn('[useActiveJourney] Background sync failed, using cached data:', error);
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

  // Phase 3: isLoading only when we have NO data at all (first-time user)
  // Phase 4: isFetching for background refreshes (returning user — existing card stays)
  const data = query.data ?? cachedJourney ?? null;
  const hasData = data !== null;
  const isLoading = !hasData && (uid === null || query.isLoading);
  const isFetching = query.isFetching;

  return {
    ...query,
    data,
    isLoading,
    isFetching,
    resumeJourney,
    refetchJourney,
  };
}
