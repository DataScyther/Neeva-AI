/**
 * Journey Repository
 *
 * Single source of truth for journey data.
 * Reads from local cache first (instant), syncs from cloud in background.
 */

import {
  collection,
  doc,
  getDocs,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { storageService } from '@/services/storage';
import type { JourneyProgress } from '@/features/journey/types/JourneyProgress';

export interface ExerciseProgress {
  completed: boolean;
  streak: number;
  lastCompletedAt?: Date;
}

const COLLECTION = 'users';

const DEFAULT_EXERCISES: { id: string; type: string; title: string }[] = [
  { id: '1', type: 'meditation', title: 'Mindful Breathing' },
  { id: '2', type: 'journaling', title: 'Gratitude Journal' },
  { id: '3', type: 'breathing', title: '4-7-8 Breathing' },
  { id: '4', type: 'meditation', title: 'Body Scan' },
  { id: 'breathing-basic', type: 'breathing', title: 'Basic Breathing Meditation' },
  { id: 'body-scan', type: 'meditation', title: 'Body Scan Relaxation' },
  { id: 'mindfulness', type: 'meditation', title: 'Mindful Awareness' },
  { id: 'loving-kindness', type: 'meditation', title: 'Loving Kindness' },
];

const EXERCISE_ROUTE_MAP: Record<string, string> = {
  meditation: '/journey/meditation/:id',
  breathing: '/journey/breathing/:id',
  journaling: '/journey/reflection',
  gratitude: '/journey/reflection',
};

function getLocalKey(uid: string): string {
  return `journey_progress_${uid}`;
}

function getDefaultRouteForExercise(type: string): string {
  return EXERCISE_ROUTE_MAP[type] || '/journey/placeholder';
}

function computeJourneyFromProgress(
  progress: Record<string, ExerciseProgress>
): JourneyProgress {
  const completedCount = DEFAULT_EXERCISES.filter((ex) => progress[ex.id]?.completed).length;
  const totalCount = DEFAULT_EXERCISES.length;
  const allCompleted = completedCount === totalCount;
  const noneStarted = completedCount === 0;

  if (noneStarted) {
    return {
      programId: 'wellness-basics',
      title: DEFAULT_EXERCISES[0].title,
      currentLesson: 1,
      totalLessons: totalCount,
      completionPercent: 0,
      lastActivity: null,
      resumeTarget: {
        exerciseId: DEFAULT_EXERCISES[0].id,
        route: getDefaultRouteForExercise(DEFAULT_EXERCISES[0].type),
      },
      status: 'not_started',
    };
  }

  if (allCompleted) {
    return {
      programId: 'wellness-basics',
      title: DEFAULT_EXERCISES[0].title,
      currentLesson: totalCount,
      totalLessons: totalCount,
      completionPercent: 100,
      lastActivity: null,
      resumeTarget: null,
      status: 'completed',
    };
  }

  const firstUncompletedIndex = DEFAULT_EXERCISES.findIndex(
    (ex) => !progress[ex.id]?.completed
  );
  const nextExercise = DEFAULT_EXERCISES[firstUncompletedIndex];
  const lastActivityDates = DEFAULT_EXERCISES
    .map((ex) => progress[ex.id]?.lastCompletedAt)
    .filter((d): d is Date => !!d);
  const lastActivity = lastActivityDates.length > 0
    ? lastActivityDates.reduce((latest, d) => d > latest ? d : latest)
    : null;

  return {
    programId: 'wellness-basics',
    title: DEFAULT_EXERCISES[0].title,
    currentLesson: firstUncompletedIndex + 1,
    totalLessons: totalCount,
    completionPercent: Math.round((completedCount / totalCount) * 100),
    lastActivity,
    resumeTarget: {
      exerciseId: nextExercise.id,
      route: getDefaultRouteForExercise(nextExercise.type),
    },
    status: 'active',
  };
}

export class JourneyRepository {
  // ─── Load (local-first, cloud as fallback) ────────────────────────────

  async loadExerciseProgress(uid: string): Promise<Record<string, ExerciseProgress>> {
    if (!uid) return {};

    const local = await this.loadFromLocal(uid);
    if (Object.keys(local).length > 0) return local;

    const fromCloud = await this.loadFromCloud(uid);
    if (Object.keys(fromCloud).length > 0) {
      await this.persistLocal(uid, fromCloud);
    }
    return fromCloud;
  }

  /**
   * Returns the active journey, reading from local cache first (instant).
   */
  async getActiveJourney(uid: string): Promise<JourneyProgress | null> {
    if (!uid) return null;
    const progress = await this.loadExerciseProgress(uid);
    return computeJourneyFromProgress(progress);
  }

  // ─── Save ────────────────────────────────────────────────────────────

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

  // ─── Cloud sync ──────────────────────────────────────────────────────

  /**
   * Fetches from Firestore, merges into local cache, returns merged result.
   * Never blocks UI — safe to call on mount or as background refresh.
   */
  async syncFromCloud(uid: string): Promise<JourneyProgress | null> {
    if (!uid) return null;

    const cloudData = await this.loadFromCloud(uid);
    if (Object.keys(cloudData).length > 0) {
      await this.persistLocal(uid, cloudData);
    }

    const merged = await this.loadFromLocal(uid);
    return computeJourneyFromProgress(merged);
  }

  // ─── Local persistence ───────────────────────────────────────────────

  async persistLocal(
    uid: string,
    progress: Record<string, ExerciseProgress>
  ): Promise<void> {
    if (!uid) return;
    try {
      const key = getLocalKey(uid);
      const existing = await this.loadFromLocal(uid);
      const merged = { ...existing, ...progress };
      await storageService.setJSON(key, merged);
    } catch (error) {
      console.error('Error persisting journey progress locally:', error);
    }
  }

  // ─── Private helpers ─────────────────────────────────────────────────

  private async loadFromLocal(uid: string): Promise<Record<string, ExerciseProgress>> {
    try {
      const data = await storageService.getJSON<Record<string, ExerciseProgress>>(
        getLocalKey(uid)
      );
      return data || {};
    } catch {
      return {};
    }
  }

  private async loadFromCloud(uid: string): Promise<Record<string, ExerciseProgress>> {
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
      console.error('Error loading exercise progress from cloud:', error);
      return {};
    }
  }
}

export const journeyRepository = new JourneyRepository();
export default journeyRepository;
