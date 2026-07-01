import {
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  serverTimestamp,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import {
  db,
} from '@/lib/firebase';
import {
  conversationsRef,
  conversationDocRef,
  conversationParticipantsRef,
  conversationParticipantDocRef,
  userConversationsRef,
  userConversationDocRef,
} from '@/lib/firestore';
import type { Conversation, ConversationParticipant, UserConversation } from '@/shared/types';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function ensureRef<T>(ref: T | null, name: string): T {
  if (!ref) throw new Error(`Firestore not initialized (${name})`);
  return ref;
}

export interface CreateGroupData {
  name: string;
  description?: string;
  imageURL?: string;
  createdBy: string;
  participantIds: string[];
  isSupportGroup?: boolean;
  category?: string;
}

export class ConversationRepository {
  async createGroup(data: CreateGroupData): Promise<string> {
    const conversationId = generateId();
    const now = new Date();
    const allParticipantIds = [
      ...new Set([data.createdBy, ...data.participantIds]),
    ];

    const conversation: Conversation = {
      id: conversationId,
      type: 'group',
      name: data.name,
      description: data.description,
      imageURL: data.imageURL,
      createdBy: data.createdBy,
      createdAt: now,
      updatedAt: now,
      participantIds: allParticipantIds,
      memberCount: allParticipantIds.length,
      metadata: data.isSupportGroup != null
        ? { isSupportGroup: data.isSupportGroup, category: data.category }
        : undefined,
    };

    const convRef = conversationDocRef(conversationId);
    if (!convRef) throw new Error('Firestore not initialized');
    await setDoc(convRef, conversation);

    const batch = allParticipantIds.map(async (uid) => {
      const participant: ConversationParticipant = {
        id: uid,
        role: uid === data.createdBy ? 'admin' : 'member',
        joinedAt: now,
        lastReadAt: now,
      };
      const partRef = conversationParticipantDocRef(conversationId, uid);
      if (!partRef) throw new Error('Firestore not initialized');
      await setDoc(partRef, participant);

      const ucRef = userConversationDocRef(uid, conversationId);
      if (!ucRef) throw new Error('Firestore not initialized');
      const userConv: UserConversation = {
        id: conversationId,
        lastReadAt: now,
        lastMessageAt: now,
        isPinned: false,
        isMuted: false,
        lastMessagePreview: 'Group created',
      };
      await setDoc(ucRef, userConv);
    });

    await Promise.all(batch);
    return conversationId;
  }

  async getConversation(conversationId: string): Promise<Conversation | null> {
    const snap = await getDoc(ensureRef(conversationDocRef(conversationId), 'conversationDocRef'));
    if (!snap.exists()) return null;
    const raw = snap.data() as Record<string, any>;
    return {
      ...raw,
      createdAt: raw.createdAt?.toDate?.() ?? new Date(),
      updatedAt: raw.updatedAt?.toDate?.() ?? new Date(),
      lastMessage: raw.lastMessage
        ? {
            ...raw.lastMessage,
            timestamp: raw.lastMessage.timestamp?.toDate?.() ?? new Date(),
          }
        : undefined,
    } as Conversation;
  }

  async getUserConversations(uid: string): Promise<UserConversation[]> {
    const snap = await getDocs(ensureRef(userConversationsRef(uid), 'userConversationsRef'));
    return snap.docs.map((doc) => {
      const raw = doc.data() as Record<string, any>;
      return {
        ...raw,
        lastReadAt: raw.lastReadAt?.toDate?.() ?? new Date(),
        lastMessageAt: raw.lastMessageAt?.toDate?.() ?? new Date(),
      } as UserConversation;
    });
  }

  async addParticipant(conversationId: string, uid: string): Promise<void> {
    const convSnap = await getDoc(ensureRef(conversationDocRef(conversationId), 'conversationDocRef'));
    if (!convSnap.exists()) throw new Error('Conversation not found');

    const now = new Date();
    const participant: ConversationParticipant = {
      id: uid,
      role: 'member',
      joinedAt: now,
      lastReadAt: now,
    };
    await setDoc(ensureRef(conversationParticipantDocRef(conversationId, uid), 'conversationParticipantDocRef'), participant);

    const ucRef = ensureRef(userConversationDocRef(uid, conversationId), 'userConversationDocRef');
    const userConv: UserConversation = {
      id: conversationId,
      lastReadAt: now,
      lastMessageAt: now,
      isPinned: false,
      isMuted: false,
      lastMessagePreview: 'You joined the group',
    };
    await setDoc(ucRef, userConv);

    const currentParticipants = convSnap.data().participantIds ?? [];
    await updateDoc(ensureRef(conversationDocRef(conversationId), 'conversationDocRef'), {
      participantIds: [...currentParticipants, uid],
      memberCount: (currentParticipants.length ?? 0) + 1,
      updatedAt: serverTimestamp(),
    });
  }

  async removeParticipant(conversationId: string, uid: string): Promise<void> {
    const convSnap = await getDoc(ensureRef(conversationDocRef(conversationId), 'conversationDocRef'));
    if (!convSnap.exists()) throw new Error('Conversation not found');

    await deleteDoc(ensureRef(conversationParticipantDocRef(conversationId, uid), 'conversationParticipantDocRef'));
    await deleteDoc(ensureRef(userConversationDocRef(uid, conversationId), 'userConversationDocRef'));

    const currentParticipants: string[] = convSnap.data().participantIds ?? [];
    await updateDoc(ensureRef(conversationDocRef(conversationId), 'conversationDocRef'), {
      participantIds: currentParticipants.filter((p: string) => p !== uid),
      memberCount: Math.max(0, (currentParticipants.length ?? 0) - 1),
      updatedAt: serverTimestamp(),
    });
  }

  async deleteConversation(conversationId: string): Promise<void> {
    const convSnap = await getDoc(ensureRef(conversationDocRef(conversationId), 'conversationDocRef'));
    if (!convSnap.exists()) return;

    const participantIds: string[] = convSnap.data().participantIds ?? [];

    const cleanup = participantIds.map(async (uid) => {
      await deleteDoc(ensureRef(userConversationDocRef(uid, conversationId), 'userConversationDocRef'));
      await deleteDoc(ensureRef(conversationParticipantDocRef(conversationId, uid), 'conversationParticipantDocRef'));
    });

    await Promise.all(cleanup);
    await deleteDoc(ensureRef(conversationDocRef(conversationId), 'conversationDocRef'));
  }

  async updateLastMessage(
    conversationId: string,
    message: { content: string; senderId: string; senderName: string; timestamp: Date },
  ): Promise<void> {
    const convSnap = await getDoc(ensureRef(conversationDocRef(conversationId), 'conversationDocRef'));
    if (!convSnap.exists()) return;

    const participantIds: string[] = convSnap.data().participantIds ?? [];

    const batch = writeBatch(db);
    batch.update(ensureRef(conversationDocRef(conversationId), 'conversationDocRef'), {
      lastMessage: {
        content: message.content,
        senderId: message.senderId,
        senderName: message.senderName,
        timestamp: Timestamp.fromDate(message.timestamp),
      },
      updatedAt: serverTimestamp(),
    });

    for (const uid of participantIds) {
      batch.update(ensureRef(userConversationDocRef(uid, conversationId), 'userConversationDocRef'), {
        lastMessagePreview: message.content,
        lastMessageAt: Timestamp.fromDate(message.timestamp),
      });
    }

    await batch.commit();
  }
}

export const conversationRepository = new ConversationRepository();
export default conversationRepository;
