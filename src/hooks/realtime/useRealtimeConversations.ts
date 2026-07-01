import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRealtimeCollection } from '@/hooks/useRealtimeSubscription';
import { userConversationsRef } from '@/lib/firestore';
import { conversationRepository } from '@/repositories/ConversationRepository';
import type { UserConversation } from '@/shared/types';

export function useRealtimeConversations(uid: string | null) {
  const conversationsQuery = useMemo(
    () => (uid ? userConversationsRef(uid) : null),
    [uid],
  );

  useRealtimeCollection<UserConversation>(
    conversationsQuery,
    ['conversations', uid],
    !!uid,
  );

  return useQuery({
    queryKey: ['conversations', uid],
    queryFn: async () => {
      if (!uid) return [];
      return conversationRepository.getUserConversations(uid);
    },
    enabled: !!uid,
    staleTime: Infinity,
  });
}
