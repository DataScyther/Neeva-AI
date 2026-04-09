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
  sendPasswordResetEmail,
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
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    language: string;
  };
  stats: {
    totalSessions: number;
    totalMinutes: number;
    streakDays: number;
    lastActivityDate: Date;
  };
}

const USERS_COLLECTION = 'users';

// Helper function to create a default UserProfile from Firebase User
function createDefaultUserProfile(user: User, overrides: Partial<UserProfile> = {}): UserProfile {
  return {
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
    ...overrides,
  };
}

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
      }
      this.notifyAuthStateListeners(user);
    });
  }

  // Sign in with Google using redirect instead of popup
  async signInWithGoogle(): Promise<UserProfile> {
    try {
      // Configure Google provider with proper settings
      const provider = new GoogleAuthProvider();

      // Only request basic scopes needed for authentication
      provider.addScope('email');

      // Set custom parameters to prompt user selection and enhance compatibility
      provider.setCustomParameters({
        prompt: 'select_account',
        access_type: 'online' // Don't need offline access for this app
      });

      console.log('Starting Google auth process');

      // Try popup first, fallback to redirect if blocked
      let result;
      try {
        result = await signInWithPopup(auth, provider);
        console.log('Popup auth succeeded');
      } catch (popupError: any) {
        console.error('Popup error:', popupError.code, popupError.message);
        if (popupError.code === 'auth/popup-blocked') {
          console.log('Popup blocked, using redirect method');
          // Redirect will be handled by Firebase's onAuthStateChanged
          await signInWithRedirect(auth, provider);
          // Throw to indicate that redirect was initiated - app will reload
          throw new Error('Redirecting to Google sign-in...');
        }
        throw popupError;
      }

      const user = result.user;
      if (!user) {
        throw new Error('No user returned from Google sign-in');
      }

      // Create user profile using helper function
      const userProfile: UserProfile = createDefaultUserProfile(user, {
        name: user.displayName || 'User',
        theme: 'light',
        notifications: true,
        language: 'en',
        totalSessions: 1,
        totalMinutes: 0,
        streakDays: 1,
        lastActivityDate: new Date(),
      });

      // Set the user profile immediately to ensure auth can continue even if Firestore fails
      this.userProfile = userProfile;
      this.currentUser = user;

      // Try to save to Firestore but don't block authentication if it fails
      try {
        console.log('Attempting to save user profile to Firestore');
        await setDoc(doc(db, 'users', user.uid), userProfile);
        console.log('Successfully saved user profile to Firestore');
      } catch (firestoreError) {
        // Log the error but continue with authentication
        console.warn('Failed to save profile to Firestore, continuing with local profile:', firestoreError);
        // No re-throw - we'll continue with the local profile
      }

      // Notify listeners even if Firestore saving failed
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

      // Notify listeners immediately after successful auth
      this.notifyAuthStateListeners(user);

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

      // Notify listeners immediately after successful auth
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
      // Create new user profile using helper function
      const newProfile = createDefaultUserProfile(user);

      await setDoc(userDocRef, newProfile);

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
      } else {
        // User document doesn't exist yet, create a minimal profile
        const currentUser = this.currentUser;
        if (currentUser) {
          // Create a minimal profile based on Firebase Auth user data
          this.userProfile = createDefaultUserProfile(currentUser);

          try {
            // Try to save the profile, but don't block auth if it fails
            const userDocRef = doc(db, USERS_COLLECTION, currentUser.uid);
            await setDoc(userDocRef, this.userProfile);
          } catch (saveError) {
            console.warn('Could not save user profile, continuing with local profile:', saveError);
          }
        }
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      // Continue with authentication even if Firestore access fails
      // Create a minimal profile from current user data
      const currentUser = this.currentUser;
      if (currentUser) {
        this.userProfile = createDefaultUserProfile(currentUser);
      }
    }
  }

  // Update user profile
  async updateUserProfile(updates: Partial<UserProfile>): Promise<void> {
    if (!this.currentUser || !this.userProfile) {
      throw new Error('No user logged in');
    }

    try {
      const userDocRef = doc(db, USERS_COLLECTION, this.currentUser.uid);

      // Filter out undefined values with proper typing
      const cleanUpdates: Partial<Record<keyof UserProfile, unknown>> = {};
      Object.keys(updates).forEach((key) => {
        const value = updates[key as keyof UserProfile];
        if (value !== undefined) {
          cleanUpdates[key as keyof UserProfile] = value;
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

  // Reset password
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Password reset error:', error);
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
