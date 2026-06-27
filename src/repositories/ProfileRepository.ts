/**
 * Profile Repository
 *
 * Manages user profile data in Firestore.
 */

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { UserProfile } from '@/services/auth/types';
import type { User as FirebaseUser } from 'firebase/auth';

const COLLECTION = 'users';

function createDefaultProfile(user: FirebaseUser, name?: string): UserProfile {
  return {
    uid: user.uid,
    name: name || user.displayName || 'User',
    email: user.email || '',
    phoneNumber: user.phoneNumber || undefined,
    photoURL: user.photoURL || undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLoginAt: new Date(),
    preferences: {
      theme: 'dark',
      notifications: true,
      language: 'en',
      tone: 'auto',
    },
    stats: {
      totalSessions: 0,
      totalMinutes: 0,
      streakDays: 0,
      lastActivityDate: new Date(),
    },
  };
}

export class ProfileRepository {
  async loadProfile(user: FirebaseUser): Promise<UserProfile | null> {
    if (!db) return null;

    try {
      const userDocRef = doc(db, COLLECTION, user.uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as any;
        return {
          ...data,
          createdAt: data.createdAt?.toDate?.() ?? new Date(),
          updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
          lastLoginAt: data.lastLoginAt?.toDate?.() ?? new Date(),
          stats: {
            ...data.stats,
            lastActivityDate: data.stats?.lastActivityDate?.toDate?.() ?? new Date(),
          },
        } as UserProfile;
      }

      return null;
    } catch (error) {
      console.error('Error loading profile:', error);
      return null;
    }
  }

  async createProfile(user: FirebaseUser, name?: string): Promise<UserProfile> {
    const profile = createDefaultProfile(user, name);
    if (!db) return profile;

    try {
      const userDocRef = doc(db, COLLECTION, user.uid);
      await setDoc(userDocRef, profile);
    } catch (error) {
      console.warn('Could not save profile to Firestore:', error);
    }
    return profile;
  }

  async updateProfile(
    uid: string,
    updates: Partial<UserProfile>,
    currentProfile: UserProfile
  ): Promise<UserProfile> {
    const cleanUpdates: Record<string, unknown> = {};
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) cleanUpdates[key] = value;
    });

    if (db) {
      try {
        const userDocRef = doc(db, COLLECTION, uid);
        await updateDoc(userDocRef, { ...cleanUpdates, updatedAt: serverTimestamp() });
      } catch (error) {
        console.warn('Could not update profile in Firestore:', error);
      }
    }

    return { ...currentProfile, ...updates, updatedAt: new Date() };
  }

  async getProfileById(uid: string): Promise<UserProfile | null> {
    if (!db) return null;

    try {
      const userDocRef = doc(db, COLLECTION, uid);
      const docSnap = await getDoc(userDocRef);
      if (!docSnap.exists()) return null;

      const data = docSnap.data() as any;
      return {
        ...data,
        createdAt: data.createdAt?.toDate?.() ?? new Date(),
        updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
        lastLoginAt: data.lastLoginAt?.toDate?.() ?? new Date(),
      } as UserProfile;
    } catch {
      return null;
    }
  }
}

export const profileRepository = new ProfileRepository();
export default profileRepository;
