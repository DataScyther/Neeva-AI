import React, { ReactNode } from "react";
import { authService, UserProfile } from '../lib/auth';
import { useAppStore, User, MoodEntry, ChatMessage, Exercise, AppState, ViewType } from '../store/useAppStore';
import { useUserDataQuery } from '../hooks/queries';

// Action types (kept for compatibility)
type AppAction =
  | { type: "SET_USER"; payload: User | UserProfile | null }
  | { type: "CLEAR_USER" }
  | { type: "SET_AUTHENTICATED"; payload: boolean }
  | { type: "SET_VIEW"; payload: ViewType }
  | { type: "ADD_MOOD_ENTRY"; payload: MoodEntry }
  | { type: "ADD_CHAT_MESSAGE"; payload: ChatMessage }
  | { type: "COMPLETE_EXERCISE"; payload: string }
  | { type: "SET_THEME"; payload: 'light' | 'dark' | 'auto' }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_INITIAL_DATA"; payload: Partial<AppState> };

export function AppProvider({
  children,
}: {
  children: ReactNode;
}) {
  const setUser = useAppStore((state) => state.setUser);
  const clearUser = useAppStore((state) => state.clearUser);
  const user = useAppStore((state) => state.user);

  // Sync auth state
  React.useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((firebaseUser) => {
      if (firebaseUser) {
        const profile = authService.getCurrentUserProfile();
        setUser(profile);
      } else {
        clearUser();
      }
    });

    return unsubscribe;
  }, [setUser, clearUser]);

  // Extract UID safely
  const uid = React.useMemo(() => {
    if (!user) return null;
    if ('uid' in user) return user.uid;
    if ('id' in user) return user.id;
    return null;
  }, [user]);

  // Sync server state (Firestore) using TanStack Query
  useUserDataQuery(uid);

  return <>{children}</>;
}

export function useAppContext() {
  const state = useAppStore();
  
  const dispatch = React.useCallback((action: AppAction) => {
    const store = useAppStore.getState();
    switch (action.type) {
      case "SET_USER":
        store.setUser(action.payload);
        break;
      case "CLEAR_USER":
        store.clearUser();
        break;
      case "SET_AUTHENTICATED":
        store.setAuthenticated(action.payload);
        break;
      case "SET_VIEW":
        store.setView(action.payload);
        break;
      case "ADD_MOOD_ENTRY":
        store.addMoodEntry(action.payload);
        break;
      case "ADD_CHAT_MESSAGE":
        store.addChatMessage(action.payload);
        break;
      case "COMPLETE_EXERCISE":
        store.completeExercise(action.payload);
        break;
      case "SET_THEME":
        store.setTheme(action.payload);
        break;
      case "SET_LOADING":
        store.setLoading(action.payload);
        break;
      case "SET_INITIAL_DATA":
        store.setInitialData(action.payload);
        break;
      default:
        break;
    }
  }, []);

  return { state, dispatch };
}

export type {
  User,
  MoodEntry,
  ChatMessage,
  Exercise,
  AppState,
  AppAction,
};
