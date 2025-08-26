import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Types
interface User {
  id: string;
  email: string;
  name: string;
}

interface MoodEntry {
  id: string;
  mood: number;
  note: string;
  timestamp: Date;
}

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface Exercise {
  id: string;
  type: 'meditation' | 'journaling' | 'gratitude' | 'breathing';
  title: string;
  description: string;
  duration: number;
  completed: boolean;
  streak: number;
}

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  currentView: 'dashboard' | 'chatbot' | 'mood' | 'exercises' | 'community' | 'settings' | 'insights' | 'meditation' | 'crisis';
  moodEntries: MoodEntry[];
  chatHistory: ChatMessage[];
  exercises: Exercise[];
  theme: 'light' | 'dark' | 'auto';
  isLoading: boolean;
}

type AppAction = 
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_VIEW'; payload: AppState['currentView'] }
  | { type: 'ADD_MOOD_ENTRY'; payload: MoodEntry }
  | { type: 'ADD_CHAT_MESSAGE'; payload: ChatMessage }
  | { type: 'COMPLETE_EXERCISE'; payload: string }
  | { type: 'SET_THEME'; payload: AppState['theme'] }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  currentView: 'dashboard',
  moodEntries: [],
  chatHistory: [],
  exercises: [
    {
      id: '1',
      type: 'meditation',
      title: 'Mindful Breathing',
      description: 'Focus on your breath for 5 minutes',
      duration: 5,
      completed: false,
      streak: 0
    },
    {
      id: '2',
      type: 'journaling',
      title: 'Gratitude Journal',
      description: 'Write down 3 things you\'re grateful for',
      duration: 10,
      completed: false,
      streak: 0
    },
    {
      id: '3',
      type: 'breathing',
      title: '4-7-8 Breathing',
      description: 'Inhale for 4, hold for 7, exhale for 8',
      duration: 8,
      completed: false,
      streak: 0
    },
    {
      id: '4',
      type: 'meditation',
      title: 'Body Scan',
      description: 'Progressive muscle relaxation',
      duration: 12,
      completed: false,
      streak: 0
    },
    {
      id: 'breathing-basic',
      type: 'breathing',
      title: 'Basic Breathing Meditation',
      description: 'Simple breath awareness for beginners',
      duration: 5,
      completed: false,
      streak: 0
    },
    {
      id: 'body-scan',
      type: 'meditation',
      title: 'Body Scan Relaxation',
      description: 'Progressive relaxation through body awareness',
      duration: 10,
      completed: false,
      streak: 0
    },
    {
      id: 'mindfulness',
      type: 'meditation',
      title: 'Mindful Awareness',
      description: 'Present moment awareness meditation',
      duration: 8,
      completed: false,
      streak: 0
    },
    {
      id: 'loving-kindness',
      type: 'meditation',
      title: 'Loving Kindness',
      description: 'Cultivate compassion for yourself and others',
      duration: 12,
      completed: false,
      streak: 0
    }
  ],
  theme: 'light',
  isLoading: false
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: action.payload !== null
      };
    case 'SET_VIEW':
      return { ...state, currentView: action.payload };
    case 'ADD_MOOD_ENTRY':
      return {
        ...state,
        moodEntries: [...state.moodEntries, action.payload]
      };
    case 'ADD_CHAT_MESSAGE':
      return {
        ...state,
        chatHistory: [...state.chatHistory, action.payload]
      };
    case 'COMPLETE_EXERCISE':
      return {
        ...state,
        exercises: state.exercises.map(ex =>
          ex.id === action.payload
            ? { ...ex, completed: true, streak: ex.streak + 1 }
            : ex
        )
      };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}

export type { User, MoodEntry, ChatMessage, Exercise, AppState, AppAction };