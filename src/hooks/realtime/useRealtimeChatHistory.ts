import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { collection, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRealtimeCollection } from '@/hooks/useRealtimeSubscription';
import { chatRepository } from '@/repositories/ChatRepository';
import type { ChatMessage } from '@/shared/types';

export function useRealtimeChatHistory(uid: string | null) {
  const enabled = !!(uid && db);

  const chatsQuery = useMemo(
    () =>
      uid && db
        ? query(collection(db, 'users', uid, 'chats'), orderBy('timestamp', 'asc'))
        : null,
    [uid],
  );

  useRealtimeCollection<ChatMessage>(chatsQuery, ['chats', uid], enabled);

  return useQuery({
    queryKey: ['chats', uid],
    queryFn: async () => {
      if (!uid) return [];
      return chatRepository.loadChatHistory(uid);
    },
    enabled,
    staleTime: Infinity,
  });
}
