/**
 * Mood Repository
 *
 * Manages mood entries in Firestore.
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
import type { MoodEntry } from '@/shared/types';

const COLLECTION = 'users';

export class MoodRepository {
  async loadMoods(uid: string): Promise<MoodEntry[]> {
    if (!uid || !db) return [];

    try {
      const moodsRef = collection(db, COLLECTION, uid, 'moods');
      const moodsQuery = query(moodsRef, orderBy('timestamp', 'asc'));
      const snapshot = await getDocs(moodsQuery);

      return snapshot.docs.map((doc) => ({
        ...doc.data(),
        timestamp: (doc.data().timestamp as Timestamp).toDate(),
      })) as MoodEntry[];
    } catch (error) {
      console.error('Error loading moods:', error);
      return [];
    }
  }

  async saveMood(uid: string, entry: MoodEntry): Promise<boolean> {
    if (!uid || !db) return false;

    try {
      const docRef = doc(db, COLLECTION, uid, 'moods', entry.id);
      await setDoc(docRef, {
        ...entry,
        timestamp: Timestamp.fromDate(entry.timestamp),
      });
      return true;
    } catch (error) {
      console.error('Error saving mood:', error);
      throw error;
    }
  }
}

export const moodRepository = new MoodRepository();
export default moodRepository;
