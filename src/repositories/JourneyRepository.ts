/**
 * Journey Repository
 *
 * Manages exercise progress in Firestore.
 */

import {
  collection,
  doc,
  getDocs,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface ExerciseProgress {
  completed: boolean;
  streak: number;
  lastCompletedAt?: Date;
}

const COLLECTION = 'users';

export class JourneyRepository {
  async loadExerciseProgress(uid: string): Promise<Record<string, ExerciseProgress>> {
    if (!uid || !db) return {};

    try {
      const exercisesRef = collection(db, COLLECTION, uid, 'exercises');
      const snapshot = await getDocs(exercisesRef);
      const results: Record<string, ExerciseProgress> = {};

      snapshot.forEach((doc) => {
        const data = doc.data();
        results[doc.id] = {
          completed: data.completed ?? false,
          streak: data.streak ?? 0,
          lastCompletedAt: data.lastCompletedAt?.toDate?.() ?? undefined,
        };
      });

      return results;
    } catch (error) {
      console.error('Error loading exercise progress:', error);
      return {};
    }
  }

  async saveProgress(
    uid: string,
    exerciseId: string,
    streak: number
  ): Promise<boolean> {
    if (!uid || !exerciseId || !db) return false;

    try {
      const docRef = doc(db, COLLECTION, uid, 'exercises', exerciseId);
      await setDoc(
        docRef,
        {
          id: exerciseId,
          completed: true,
          streak,
          lastCompletedAt: serverTimestamp(),
        },
        { merge: true }
      );
      return true;
    } catch (error) {
      console.error('Error saving exercise progress:', error);
      throw error;
    }
  }
}

export const journeyRepository = new JourneyRepository();
export default journeyRepository;
