import { useMemo, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { doc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { useRealtimeDocument } from '@/hooks/useRealtimeSubscription';
import type { UserPreferences } from '@/shared/types';

export function useRealtimePreferences(uid: string | null) {
  const queryClient = useQueryClient();
  const enabled = !!(uid && isFirebaseConfigured());

  const docRef = useMemo(
    () => (uid && isFirebaseConfigured() ? doc(db!, 'users', uid) : null),
    [uid],
  );

  useRealtimeDocument<{ preferences: UserPreferences }>(
    docRef,
    ['profile', uid],
    enabled,
  );

  const queryFn = useCallback(
    () => queryClient.getQueryData<{ preferences: UserPreferences } | null>(['profile', uid]) ?? null,
    [queryClient, uid],
  );

  return useQuery({
    queryKey: ['profile', uid],
    queryFn,
    enabled,
    staleTime: Infinity,
    select: (data) => data?.preferences as UserPreferences | undefined,
  });
}
