// src/lib/auth.ts
import {
  signInWithPopup,
  signInWithRedirect,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  User,
  updateProfile,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from './firebase';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phoneNumber?: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date;
  preferences?: {
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    language: string;
  };
  stats?: {
    totalSessions: number;
    totalMinutes: number;
    streakDays: number;
    lastActivityDate: Date;
  };
}

const USERS_COLLECTION = 'users';

class AuthService {
  private currentUser: User | null = null;
  private userProfile: UserProfile | null = null;
  private authStateListeners: Array<(user: User | null) => void> = [];

  constructor() {
    // Listen to auth state changes
    onAuthStateChanged(auth, async (user) => {
      this.currentUser = user;
      if (user) {
        await this.loadUserProfile(user.uid);
      } else {
      }
      this.notifyAuthStateListeners(user);
    });
  }

  // Sign in with Google using redirect instead of popup
  async signInWithGoogle(): Promise<UserProfile> {
    try {
      // Use redirect instead of popup to avoid popup blockers
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      // Try popup first, fallback to redirect if blocked
      let result;
      try {
        result = await signInWithPopup(auth, provider);
      } catch (popupError: any) {
        if (popupError.code === 'auth/popup-blocked') {
          console.log('Popup blocked, using redirect method');
          await signInWithRedirect(auth, provider);
          return this.userProfile!; // Will be handled by redirect result
        }
        throw popupError;
      }

      const user = result.user;
      if (!user) {
        throw new Error('No user returned from Google sign-in');
      }

      // Create user profile
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        name: user.displayName || 'User',
        photoURL: user.photoURL || undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: new Date(),
        preferences: {
          theme: 'light',
          notifications: true,
          language: 'en',
        },
        stats: {
          totalSessions: 1,
          totalMinutes: 0,
          streakDays: 1,
          lastActivityDate: new Date(),
        },
      };

      // Save to Firestore
      await setDoc(doc(db, 'users', user.uid), userProfile);
      
      this.userProfile = userProfile;
      this.notifyAuthStateListeners(user);
      
      return userProfile;
    } catch (error) {
      console.error('Google Sign-In error:', error);
      throw error;
    }
  }

  // Email/Password Sign Up
  async signUpWithEmail(email: string, password: string, displayName?: string): Promise<UserProfile> {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;

      if (!user) {
        throw new Error('No user returned from email sign-up');
      }

      // Update the user's display name if provided
      if (displayName) {
        await updateProfile(user, { displayName });
      }

      // Check if user exists in Firestore, create if not
      const userProfile = await this.ensureUserProfile(user);

      return userProfile;
    } catch (error) {
      console.error('Email sign-up error:', error);
      throw error;
    }
  }

  // Email/Password Sign In
  async signInWithEmail(email: string, password: string): Promise<UserProfile> {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;

      if (!user) {
        throw new Error('No user returned from email sign-in');
      }

      // Load existing user profile
      await this.loadUserProfile(user.uid);
      
      if (!this.userProfile) {
        throw new Error('User profile not found');
      }

      // Update last login
      await this.updateUserProfile({ lastLoginAt: new Date() });
      
      this.notifyAuthStateListeners(user);
      
      return this.userProfile;
    } catch (error) {
      console.error('Email Sign-In error:', error);
      throw error;
    }
  }

  // Ensure user profile exists in Firestore
  private async ensureUserProfile(user: User): Promise<UserProfile> {
    const userDocRef = doc(db, USERS_COLLECTION, user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      // User exists, update last login
      const existingProfile = userDoc.data() as UserProfile;
      await updateDoc(userDocRef, {
        lastLoginAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      this.userProfile = {
        ...existingProfile,
        lastLoginAt: new Date(),
        updatedAt: new Date(),
      };

      return this.userProfile;
    } else {
      // Create new user profile - filter out undefined values
      const newProfileData: any = {
        uid: user.uid,
        name: user.displayName || 'User',
        email: user.email || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        preferences: {
          theme: 'auto',
          notifications: true,
          language: 'en',
        },
        stats: {
          totalSessions: 0,
          totalMinutes: 0,
          streakDays: 0,
          lastActivityDate: serverTimestamp(),
        },
      };

      // Only add optional fields if they have values
      if (user.phoneNumber) {
        newProfileData.phoneNumber = user.phoneNumber;
      }
      if (user.photoURL) {
        newProfileData.photoURL = user.photoURL;
      }

      await setDoc(userDocRef, newProfileData);

      // Create the profile object to return
      const newProfile: UserProfile = {
        uid: user.uid,
        name: user.displayName || 'User',
        email: user.email || '',
        phoneNumber: user.phoneNumber || undefined,
        photoURL: user.photoURL || undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: new Date(),
        preferences: {
          theme: 'auto',
          notifications: true,
          language: 'en',
        },
        stats: {
          totalSessions: 0,
          totalMinutes: 0,
          streakDays: 0,
          lastActivityDate: new Date(),
        },
      };

      this.userProfile = newProfile;
      return newProfile;
    }
  }

  // Load user profile from Firestore
  private async loadUserProfile(uid: string): Promise<void> {
    try {
      const userDocRef = doc(db, USERS_COLLECTION, uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        this.userProfile = {
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          lastLoginAt: data.lastLoginAt?.toDate() || new Date(),
          stats: {
            ...data.stats,
            lastActivityDate: data.stats?.lastActivityDate?.toDate() || new Date(),
          },
        } as UserProfile;
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  }

  // Update user profile
  async updateUserProfile(updates: Partial<UserProfile>): Promise<void> {
    if (!this.currentUser || !this.userProfile) {
      throw new Error('No user logged in');
    }

    try {
      const userDocRef = doc(db, USERS_COLLECTION, this.currentUser.uid);
      
      // Filter out undefined values
      const cleanUpdates: any = {};
      Object.keys(updates).forEach(key => {
        const value = (updates as any)[key];
        if (value !== undefined) {
          cleanUpdates[key] = value;
        }
      });
      
      await updateDoc(userDocRef, {
        ...cleanUpdates,
        updatedAt: serverTimestamp(),
      });

      // Update local profile
      this.userProfile = {
        ...this.userProfile,
        ...updates,
        updatedAt: new Date(),
      };
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Get current user profile
  getCurrentUserProfile(): UserProfile | null {
    return this.userProfile;
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  // Listen to auth state changes
  onAuthStateChange(listener: (user: User | null) => void): () => void {
    this.authStateListeners.push(listener);
    return () => {
      const index = this.authStateListeners.indexOf(listener);
      if (index > -1) {
        this.authStateListeners.splice(index, 1);
      }
    };
  }

  private notifyAuthStateListeners(user: User | null): void {
    this.authStateListeners.forEach(listener => listener(user));
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
