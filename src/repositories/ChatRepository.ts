/**
 * Chat Repository
 *
 * Manages chat message history in Firestore.
 */

import {
  collection,
  doc,
  getDocs,
  setDoc,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { ChatMessage } from '@/shared/types';

const COLLECTION = 'users';

export class ChatRepository {
  async loadChatHistory(uid: string): Promise<ChatMessage[]> {
    if (!uid || !db) return [];

    try {
      const chatsRef = collection(db, COLLECTION, uid, 'chats');
      const chatsQuery = query(chatsRef, orderBy('timestamp', 'asc'));
      const snapshot = await getDocs(chatsQuery);

      return snapshot.docs.map((doc) => ({
        ...doc.data(),
        timestamp: (doc.data().timestamp as Timestamp).toDate(),
      })) as ChatMessage[];
    } catch (error) {
      console.error('Error loading chat history:', error);
      return [];
    }
  }

  async saveMessage(uid: string, message: ChatMessage): Promise<boolean> {
    if (!uid || !db) return false;

    try {
      const docRef = doc(db, COLLECTION, uid, 'chats', message.id);
      const data: Record<string, any> = {
        id: message.id,
        content: message.content,
        isUser: message.isUser,
        timestamp: Timestamp.fromDate(message.timestamp),
      };
      if (message.reasoning) {
        data.reasoning = message.reasoning;
      }
      await setDoc(docRef, data);
      return true;
    } catch (error) {
      console.error('Error saving chat message:', error);
      throw error;
    }
  }
}

export const chatRepository = new ChatRepository();
export default chatRepository;
