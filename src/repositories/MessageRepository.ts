import {
  setDoc,
  getDocs,
  getDoc,
  updateDoc,
  query,
  orderBy,
  limit,
  startAfter,
  Timestamp,
} from 'firebase/firestore';
import {
  conversationMessagesRef,
  conversationMessageDocRef,
} from '@/lib/firestore';
import { docSnapshotToData } from '@/hooks/useRealtimeSubscription';
import { conversationRepository } from './ConversationRepository';
import type { ConversationMessage } from '@/shared/types';

export const MESSAGES_PAGE_SIZE = 50;

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function ensureRef<T>(ref: T | null, name: string): T {
  if (!ref) throw new Error(`Firestore not initialized (${name})`);
  return ref;
}

export interface SendMessageData {
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  type?: 'text' | 'system';
  replyTo?: string;
}

export class MessageRepository {
  async sendMessage(data: SendMessageData): Promise<ConversationMessage> {
    const messageId = generateId();
    const now = new Date();

    const message: ConversationMessage = {
      id: messageId,
      senderId: data.senderId,
      senderName: data.senderName,
      content: data.content,
      timestamp: now,
      type: data.type ?? 'text',
      replyTo: data.replyTo,
      readBy: [data.senderId],
    };

    const docRef = ensureRef(conversationMessageDocRef(data.conversationId, messageId), 'conversationMessageDocRef');
    await setDoc(docRef, {
      ...message,
      timestamp: Timestamp.fromDate(now),
    });

    await conversationRepository.updateLastMessage(data.conversationId, {
      content: data.content,
      senderId: data.senderId,
      senderName: data.senderName,
      timestamp: now,
    });

    return message;
  }

  async sendSystemMessage(
    conversationId: string,
    content: string,
  ): Promise<ConversationMessage> {
    return this.sendMessage({
      conversationId,
      senderId: 'system',
      senderName: 'System',
      content,
      type: 'system',
    });
  }

  async getMessages(
    conversationId: string,
    pageSize: number = MESSAGES_PAGE_SIZE,
    cursor?: ConversationMessage,
  ): Promise<ConversationMessage[]> {
    let messagesQuery = query(
      ensureRef(conversationMessagesRef(conversationId), 'conversationMessagesRef'),
      orderBy('timestamp', 'desc'),
      limit(pageSize),
    );

    if (cursor) {
      const cursorDoc = await getDoc(
        ensureRef(conversationMessageDocRef(conversationId, cursor.id), 'conversationMessageDocRef'),
      );
      if (cursorDoc.exists()) {
        messagesQuery = query(
          ensureRef(conversationMessagesRef(conversationId), 'conversationMessagesRef'),
          orderBy('timestamp', 'desc'),
          startAfter(cursorDoc),
          limit(pageSize),
        );
      }
    }

    const snapshot = await getDocs(messagesQuery);
    return snapshot.docs.map((doc) =>
      docSnapshotToData<ConversationMessage>(doc),
    );
  }

  async markAsRead(
    conversationId: string,
    messageId: string,
    uid: string,
  ): Promise<void> {
    const msgRef = ensureRef(conversationMessageDocRef(conversationId, messageId), 'conversationMessageDocRef');
    const snap = await getDoc(msgRef);
    if (!snap.exists()) return;

    const data = snap.data() as Record<string, any>;
    const currentReadBy: string[] = data.readBy ?? [];

    if (!currentReadBy.includes(uid)) {
      await updateDoc(msgRef, {
        readBy: [...currentReadBy, uid],
      });
    }
  }
}

export const messageRepository = new MessageRepository();
export default messageRepository;
