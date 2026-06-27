/**
 * Onboarding Repository
 *
 * Manages onboarding data in Firestore.
 * Isolates data source access from business logic.
 */

import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { UserProfile } from '@/services/auth/types';

export class OnboardingRepository {
  /**
   * Save onboarding profile data to Firestore.
   */
  async saveProfile(
    uid: string,
    data: {
      displayName: string;
      primaryGoals: string[];
      initialMood: string;
      reminderPreference: string;
      notificationsEnabled: boolean;
    }
  ): Promise<void> {
    if (!db) return;

    try {
      const userDocRef = doc(db, 'users', uid);
      await updateDoc(userDocRef, {
        displayName: data.displayName.trim(),
        primaryGoals: data.primaryGoals,
        initialMood: data.initialMood,
        reminderPreference: data.reminderPreference,
        notificationsEnabled: data.notificationsEnabled,
        onboardingCompleted: true,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error saving onboarding profile:', error);
      throw error;
    }
  }

  /**
   * Load onboarding profile data from Firestore.
   */
  async loadProfile(uid: string): Promise<Partial<UserProfile> | null> {
    if (!db || !uid) return null;

    try {
      const userDocRef = doc(db, 'users', uid);
      const docSnap = await getDoc(userDocRef);

      if (!docSnap.exists()) return null;

      const data = docSnap.data();
      return {
        displayName: data.displayName as string | undefined,
        primaryGoals: data.primaryGoals as string[] | undefined,
        initialMood: data.initialMood as string | undefined,
        reminderPreference: data.reminderPreference as string | undefined,
        notificationsEnabled: data.notificationsEnabled as boolean | undefined,
      };
    } catch (error) {
      console.error('Error loading onboarding profile:', error);
      return null;
    }
  }

  /**
   * Mark onboarding as completed in Firestore.
   */
  async completeOnboarding(uid: string): Promise<void> {
    if (!db || !uid) return;

    try {
      const userDocRef = doc(db, 'users', uid);
      await updateDoc(userDocRef, {
        onboardingCompleted: true,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error marking onboarding complete:', error);
      throw error;
    }
  }
}

export const onboardingRepository = new OnboardingRepository();
export default onboardingRepository;
