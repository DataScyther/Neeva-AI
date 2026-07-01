import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { collection, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRealtimeCollection } from '@/hooks/useRealtimeSubscription';
import { chatRepository } from '@/repositories/ChatRepository';
import type { ChatMessage } from '@/shared/types';

export function useRealtimeChatHistory(uid: string | null) {
  const chatsQuery = useMemo(
    () =>
      uid
        ? query(collection(db, 'users', uid, 'chats'), orderBy('timestamp', 'asc'))
        : null,
    [uid],
  );

  useRealtimeCollection<ChatMessage>(chatsQuery, ['chats', uid], !!uid);

  return useQuery({
    queryKey: ['chats', uid],
    queryFn: async () => {
      if (!uid) return [];
      return chatRepository.loadChatHistory(uid);
    },
    enabled: !!uid,
    staleTime: Infinity,
  });
}
