import { useMemo, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { doc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { useRealtimeDocument } from '@/hooks/useRealtimeSubscription';
import { conversationRepository } from '@/repositories/ConversationRepository';
import type { Conversation } from '@/shared/types';

export function useRealtimeConversationDetails(conversationId: string | null) {
  const queryClient = useQueryClient();
  const enabled = !!(conversationId && isFirebaseConfigured());

  const docRef = useMemo(
    () => (conversationId && isFirebaseConfigured() ? doc(db!, 'conversations', conversationId) : null),
    [conversationId],
  );

  useRealtimeDocument<Conversation>(docRef, ['conversationDetail', conversationId], enabled);

  const queryFn = useCallback(
    () => queryClient.getQueryData<Conversation | null>(['conversationDetail', conversationId]) ?? null,
    [queryClient, conversationId],
  );

  return useQuery({
    queryKey: ['conversationDetail', conversationId],
    queryFn,
    enabled,
    staleTime: Infinity,
  });
}
