import { useEffect, useMemo, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  query as firestoreQuery,
  orderBy,
  limit,
  getDocs,
  getDoc,
  startAfter,
  doc,
  collection,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { MESSAGES_PAGE_SIZE } from '@/lib/firestore';
import { docSnapshotToData } from '@/hooks/useRealtimeSubscription';
import { messageRepository } from '@/repositories/MessageRepository';
import type { ConversationMessage } from '@/shared/types';

function messagesQueryKey(conversationId: string | null): string[] {
  return ['groupMessages', conversationId];
}

export function useRealtimeGroupMessages(conversationId: string | null) {
  const queryClient = useQueryClient();
  const key = messagesQueryKey(conversationId);
  const enabled = !!(conversationId && db);

  const messagesRef = useMemo(
    () =>
      conversationId && db
        ? firestoreQuery(
            collection(db, 'conversations', conversationId, 'messages'),
            orderBy('timestamp', 'desc'),
            limit(MESSAGES_PAGE_SIZE),
          )
        : null,
    [conversationId],
  );

  useEffect(() => {
    if (!conversationId || !messagesRef || !db) return;

    const unsubscribe = onSnapshot(
      messagesRef,
      (snapshot: any) => {
        const latest = snapshot.docs.map((doc: any) =>
          docSnapshotToData<ConversationMessage>(doc),
        );

        queryClient.setQueryData<ConversationMessage[]>(key, (existing = []) => {
          if (existing.length <= MESSAGES_PAGE_SIZE) return latest;

          const latestIds = new Set(latest.map((m) => m.id));
          const olderMessages = existing.filter((m) => !latestIds.has(m.id));
          return [...latest, ...olderMessages];
        });
      },
      (error: Error) => {
        console.error('[useRealtimeGroupMessages] Error:', error);
      },
    );

    return () => unsubscribe();
  }, [conversationId, messagesRef, queryClient, key]);

  const loadOlderMessages = useCallback(async (): Promise<number> => {
    if (!conversationId) return 0;

    const cached = queryClient.getQueryData<ConversationMessage[]>(key);
    if (!cached || cached.length === 0) return 0;

    const lastMessage = cached[cached.length - 1];

    const lastDocRef = doc(
      db,
      'conversations',
      conversationId,
      'messages',
      lastMessage.id,
    );
    const lastDocSnap = await getDoc(lastDocRef);
    if (!lastDocSnap.exists()) return 0;

    const olderQuery = firestoreQuery(
      collection(db, 'conversations', conversationId, 'messages'),
      orderBy('timestamp', 'desc'),
      startAfter(lastDocSnap),
      limit(MESSAGES_PAGE_SIZE),
    );

    const snapshot = await getDocs(olderQuery);
    const olderMessages = snapshot.docs.map((doc) =>
      docSnapshotToData<ConversationMessage>(doc),
    );

    if (olderMessages.length > 0) {
      queryClient.setQueryData<ConversationMessage[]>(key, (existing = []) => [
        ...existing,
        ...olderMessages,
      ]);
    }

    return olderMessages.length;
  }, [conversationId, queryClient, key]);

  const query = useQuery({
    queryKey: key,
    queryFn: async () => {
      if (!conversationId) return [];
      return messageRepository.getMessages(conversationId);
    },
    enabled,
    staleTime: Infinity,
    select: (data: ConversationMessage[]) => [...data].reverse(),
  });

  return {
    messages: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    loadOlderMessages,
    hasMore: (query.data ?? []).length >= MESSAGES_PAGE_SIZE,
  };
}
