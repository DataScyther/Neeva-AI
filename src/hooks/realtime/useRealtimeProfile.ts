import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRealtimeDocument } from '@/hooks/useRealtimeSubscription';
import { profileRepository } from '@/repositories/ProfileRepository';
import type { UserProfile } from '@/services/auth/types';

export function useRealtimeProfile(uid: string | null) {
  const docRef = useMemo(
    () => (uid ? doc(db, 'users', uid) : null),
    [uid],
  );

  useRealtimeDocument<UserProfile>(docRef, ['profile', uid], !!uid);

  return useQuery({
    queryKey: ['profile', uid],
    queryFn: async () => {
      if (!uid) return null;
      return profileRepository.getProfileById(uid);
    },
    enabled: !!uid,
    staleTime: Infinity,
  });
}
