import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRealtimeCollection } from '@/hooks/useRealtimeSubscription';
import { userConversationsRef } from '@/lib/firestore';
import { conversationRepository } from '@/repositories/ConversationRepository';
import type { UserConversation } from '@/shared/types';
import { useAppStore } from '@/core/store/useAppStore';

export function useUnreadCount(): number {
  const uid = useAppStore((state) => state.session.user?.uid ?? null);

  const conversationsQuery = useMemo(
    () => (uid ? userConversationsRef(uid) : null),
    [uid],
  );

  useRealtimeCollection<UserConversation>(
    conversationsQuery,
    ['userConversations', uid],
    !!uid,
  );

  const { data: conversations } = useQuery({
    queryKey: ['userConversations', uid],
    queryFn: async () => {
      if (!uid) return [];
      return conversationRepository.getUserConversations(uid);
    },
    enabled: !!uid,
    staleTime: Infinity,
  });

  if (!conversations || conversations.length === 0) return 0;

  const now = Date.now();
  return conversations.filter((uc) => {
    const lastRead = uc.lastReadAt?.getTime?.() ?? 0;
    const lastMsgAt = uc.lastMessageAt?.getTime?.() ?? 0;
    return lastMsgAt > lastRead && !uc.isMuted;
  }).length;
}
