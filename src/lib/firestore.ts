import { collection, doc, type DocumentReference, type DocumentData, type CollectionReference } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const MESSAGES_PAGE_SIZE = 50;

export function isFirestoreReady(): boolean {
  return db !== null;
}

export const COLLECTIONS = {
  USERS: 'users',
  CONVERSATIONS: 'conversations',
  MESSAGES: 'messages',
  PARTICIPANTS: 'participants',
  MOODS: 'moods',
  CHATS: 'chats',
  EXERCISES: 'exercises',
} as const;

export function userDocRef(uid: string): DocumentReference | null {
  if (!db) return null;
  return doc(db, COLLECTIONS.USERS, uid);
}

export function userSubcollectionRef(uid: string, subcollection: string): CollectionReference | null {
  if (!db) return null;
  return collection(db, COLLECTIONS.USERS, uid, subcollection);
}

export function userMoodsRef(uid: string) {
  return userSubcollectionRef(uid, COLLECTIONS.MOODS);
}

export function userChatsRef(uid: string) {
  return userSubcollectionRef(uid, COLLECTIONS.CHATS);
}

export function userExercisesRef(uid: string) {
  return userSubcollectionRef(uid, COLLECTIONS.EXERCISES);
}

export function userConversationsRef(uid: string) {
  return userSubcollectionRef(uid, COLLECTIONS.CONVERSATIONS);
}

export function userConversationDocRef(uid: string, conversationId: string): DocumentReference | null {
  if (!db) return null;
  return doc(db, COLLECTIONS.USERS, uid, COLLECTIONS.CONVERSATIONS, conversationId);
}

export function conversationsRef(): CollectionReference | null {
  if (!db) return null;
  return collection(db, COLLECTIONS.CONVERSATIONS);
}

export function conversationDocRef(conversationId: string): DocumentReference | null {
  if (!db) return null;
  return doc(db, COLLECTIONS.CONVERSATIONS, conversationId);
}

export function conversationMessagesRef(conversationId: string): CollectionReference | null {
  if (!db) return null;
  return collection(db, COLLECTIONS.CONVERSATIONS, conversationId, COLLECTIONS.MESSAGES);
}

export function conversationMessageDocRef(conversationId: string, messageId: string): DocumentReference | null {
  if (!db) return null;
  return doc(db, COLLECTIONS.CONVERSATIONS, conversationId, COLLECTIONS.MESSAGES, messageId);
}

export function conversationParticipantsRef(conversationId: string): CollectionReference | null {
  if (!db) return null;
  return collection(db, COLLECTIONS.CONVERSATIONS, conversationId, COLLECTIONS.PARTICIPANTS);
}

export function conversationParticipantDocRef(
  conversationId: string,
  participantId: string,
): DocumentReference | null {
  if (!db) return null;
  return doc(db, COLLECTIONS.CONVERSATIONS, conversationId, COLLECTIONS.PARTICIPANTS, participantId);
}
