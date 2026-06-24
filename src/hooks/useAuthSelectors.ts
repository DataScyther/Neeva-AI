// Shared custom hooks for the application

import { useMemo } from 'react';
import { useAppContext, MoodEntry } from '../components/AppContext';

/**
 * Hook to get the current user ID safely
 * Eliminates the need for (state.user as any)?.uid pattern
 */
export function useUserId(): string | null {
  const { state } = useAppContext();

  return useMemo(() => {
    if (!state.user) return null;

    // Handle both User and UserProfile types
    if ('uid' in state.user) {
      return state.user.uid;
    }
    if ('id' in state.user) {
      return state.user.id;
    }

    return null;
  }, [state.user]);
}

/**
 * Hook to check if user is authenticated with valid profile
 */
export function useIsAuthenticated(): boolean {
  const { state } = useAppContext();

  return useMemo(() => {
    const hasUser = state.user && (
      ('uid' in state.user && state.user.uid) ||
      ('id' in state.user && state.user.id)
    );

    return Boolean(hasUser && state.isAuthenticated);
  }, [state.user, state.isAuthenticated]);
}

/**
 * Hook to get today's mood entries (memoized)
 */
export function useTodayMoodEntries(): MoodEntry[] {
  const { state } = useAppContext();

  return useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return state.moodEntries.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      return entryDate >= today;
    });
  }, [state.moodEntries]);
}

/**
 * Hook to get user display name safely
 */
export function useUserDisplayName(): string {
  const { state } = useAppContext();

  return useMemo(() => {
    if (!state.user) return '';
    return state.user.name || 'User';
  }, [state.user]);
}

/**
 * Hook to get user email safely
 */
export function useUserEmail(): string {
  const { state } = useAppContext();

  return useMemo(() => {
    if (!state.user) return '';
    return state.user.email || '';
  }, [state.user]);
}
