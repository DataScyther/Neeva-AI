/**
 * Neeva AI — Shared Type Definitions
 *
 * Core application types shared across features.
 * Feature-specific types live in their respective feature folders.
 */

// ─── User ───────────────────────────────────────────────────────────────

export type Theme = 'dark' | 'light' | 'auto';
export type Tone = 'warm' | 'motivational' | 'soothing' | 'auto';
export type Language = 'en';

export interface UserPreferences {
  theme: Theme;
  notifications: boolean;
  language: Language;
  tone: Tone;
}

export interface UserStats {
  totalSessions: number;
  totalMinutes: number;
  streakDays: number;
  lastActivityDate: Date;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phoneNumber?: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date;
  preferences: UserPreferences;
  stats: UserStats;
}

// ─── Mood ───────────────────────────────────────────────────────────────

export interface MoodEntry {
  id: string;
  mood: number; // 1–10 scale
  note: string;
  timestamp: Date;
}

// ─── Chat ───────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  reasoning?: string;
}

// ─── Navigation ─────────────────────────────────────────────────────────

export type TabName = 'home' | 'chat' | 'journey' | 'community' | 'profile';
export type AuthScreen = 'login' | 'signup' | 'onboarding';
