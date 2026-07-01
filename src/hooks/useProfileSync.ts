import { useEffect, useMemo, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { doc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { useRealtimeDocument } from '@/hooks/useRealtimeSubscription';
import { useAppStore } from '@/core/store/useAppStore';
import type { UserProfile } from '@/services/auth/types';

export function useProfileSync(uid: string | null) {
  const queryClient = useQueryClient();
  const enabled = !!(uid && isFirebaseConfigured());

  const docRef = useMemo(
    () => (uid && isFirebaseConfigured() ? doc(db!, 'users', uid) : null),
    [uid],
  );

  useRealtimeDocument<UserProfile>(docRef, ['profile', uid], enabled);

  const queryFn = useCallback(
    () => queryClient.getQueryData<UserProfile | null>(['profile', uid]) ?? null,
    [queryClient, uid],
  );

  const { data: profile } = useQuery<UserProfile | null>({
    queryKey: ['profile', uid],
    queryFn,
    enabled,
    staleTime: Infinity,
  });

  const setUser = useAppStore((state) => state.setUser);
  const setTheme = useAppStore((state) => state.setTheme);

  useEffect(() => {
    if (!profile) return;

    setUser(profile);

    if (profile.preferences?.theme && profile.preferences.theme !== 'auto') {
      setTheme(profile.preferences.theme);
    }
  }, [profile, setUser, setTheme]);
}
