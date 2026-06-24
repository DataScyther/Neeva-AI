import { create } from 'zustand';
import { UserProfile } from '../lib/auth';

export interface User {
  id: string;
  email: string;
  name: string;
  phoneNumber?: string;
  photoURL?: string;
  createdAt?: Date;
  updatedAt?: Date;
  lastLoginAt?: Date;
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

export interface MoodEntry {
  id: string;
  mood: number;
  note: string;
  timestamp: Date;
}

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  reasoning?: string;
}

export interface Exercise {
  id: string;
  type: 'meditation' | 'journaling' | 'gratitude' | 'breathing';
  title: string;
  description: string;
  duration: number;
  completed: boolean;
  streak: number;
}

export type ViewType =
  | 'dashboard'
  | 'chatbot'
  | 'mood'
  | 'exercises'
  | 'community'
  | 'settings'
  | 'insights'
  | 'meditation'
  | 'crisis'
  | 'wellness'
  | 'breathing';

export interface AppState {
  // State variables
  user: User | UserProfile | null;
  isAuthenticated: boolean;
  currentView: ViewType;
  moodEntries: MoodEntry[];
  chatHistory: ChatMessage[];
  exercises: Exercise[];
  theme: 'light' | 'dark' | 'auto';
  isLoading: boolean;

  // Actions
  setUser: (user: User | UserProfile | null) => void;
  clearUser: () => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setView: (view: ViewType) => void;
  addMoodEntry: (entry: MoodEntry) => void;
  addChatMessage: (message: ChatMessage) => void;

  /**
   * Used for streaming responses: incrementally updates an existing assistant message.
   */
  appendChatMessageContent: (messageId: string, contentDelta: string) => void;

  completeExercise: (exerciseId: string) => void;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  setLoading: (isLoading: boolean) => void;
  setInitialData: (payload: Partial<AppState>) => void;
}

const defaultExercises: Exercise[] = [
  {
    id: '1',
    type: 'meditation',
    title: 'Mindful Breathing',
    description: 'Focus on your breath for 5 minutes',
    duration: 5,
    completed: false,
    streak: 0,
  },
  {
    id: '2',
    type: 'journaling',
    title: 'Gratitude Journal',
    description: "Write down 3 things you're grateful for",
    duration: 10,
    completed: false,
    streak: 0,
  },
  {
    id: '3',
    type: 'breathing',
    title: '4-7-8 Breathing',
    description: 'Inhale for 4, hold for 7, exhale for 8',
    duration: 8,
    completed: false,
    streak: 0,
  },
  {
    id: '4',
    type: 'meditation',
    title: 'Body Scan',
    description: 'Progressive muscle relaxation',
    duration: 12,
    completed: false,
    streak: 0,
  },
  {
    id: 'breathing-basic',
    type: 'breathing',
    title: 'Basic Breathing Meditation',
    description: 'Simple breath awareness for beginners',
    duration: 5,
    completed: false,
    streak: 0,
  },
  {
    id: 'body-scan',
    type: 'meditation',
    title: 'Body Scan Relaxation',
    description: 'Progressive relaxation through body awareness',
    duration: 10,
    completed: false,
    streak: 0,
  },
  {
    id: 'mindfulness',
    type: 'meditation',
    title: 'Mindful Awareness',
    description: 'Present moment awareness meditation',
    duration: 8,
    completed: false,
    streak: 0,
  },
  {
    id: 'loving-kindness',
    type: 'meditation',
    title: 'Loving Kindness',
    description: 'Cultivate compassion for yourself and others',
    duration: 12,
    completed: false,
    streak: 0,
  },
];

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  currentView: 'dashboard',
  moodEntries: [],
  chatHistory: [],
  exercises: defaultExercises,
  theme: 'light',
  isLoading: false,

  // Actions
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  clearUser: () => set({ user: null, isAuthenticated: false }),
  setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setView: (currentView) => set({ currentView }),
  addMoodEntry: (entry) =>
    set((state) => ({ moodEntries: [...state.moodEntries, entry] })),
  addChatMessage: (message) =>
    set((state) => {
      if (state.chatHistory.some((m) => m.id === message.id)) {
        return {};
      }
      return { chatHistory: [...state.chatHistory, message] };
    }),

  appendChatMessageContent: (messageId, contentDelta) =>
    set((state) => ({
      chatHistory: state.chatHistory.map((m) =>
        m.id === messageId ? { ...m, content: m.content + contentDelta } : m
      ),
    })),

  completeExercise: (exerciseId) =>
    set((state) => ({
      exercises: state.exercises.map((ex) =>
        ex.id === exerciseId
          ? { ...ex, completed: true, streak: ex.streak + 1 }
          : ex
      ),
    })),
  setTheme: (theme) => set({ theme }),
  setLoading: (isLoading) => set({ isLoading }),
  setInitialData: (payload) =>
    set((state) => {
      let mergedExercises = state.exercises;
      if (payload.exercises) {
        mergedExercises = payload.exercises;
      }
      return {
        moodEntries: payload.moodEntries || state.moodEntries,
        chatHistory: payload.chatHistory || state.chatHistory,
        exercises: mergedExercises,
      };
    }),
}));
