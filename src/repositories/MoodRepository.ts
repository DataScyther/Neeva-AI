/**
 * Mood Repository
 *
 * Manages mood entries in Firestore with local storage fallback.
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
import { storageService } from '@/services/storage';
import type { MoodEntry } from '@/shared/types';

const COLLECTION = 'users';

function getLocalKey(uid: string): string {
  return `moods_${uid}`;
}

export class MoodRepository {
  async loadMoods(uid: string): Promise<MoodEntry[]> {
    if (!uid) return [];

    if (!db) {
      const local = await storageService.getJSON<MoodEntry[]>(getLocalKey(uid));
      return local || [];
    }

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
    if (!uid) return false;

    if (!db) {
      try {
        const key = getLocalKey(uid);
        const existing = await storageService.getJSON<MoodEntry[]>(key) || [];
        existing.push(entry);
        await storageService.setJSON(key, existing);
        return true;
      } catch (error) {
        console.error('Error saving mood locally:', error);
        return false;
      }
    }

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
