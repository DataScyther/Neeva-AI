import { create } from 'zustand';
import { Platform } from 'react-native';
import { QueryClient } from '@tanstack/react-query';
import { storageService } from '@/services/storage';
import { moodRepository } from '@/repositories/MoodRepository';
import { journeyRepository } from '@/repositories/JourneyRepository';
import { profileRepository } from '@/repositories/ProfileRepository';
import { useAppStore } from './useAppStore';
import type { Mood } from '@/shared/types';

const STORAGE_KEY = 'sync_queue';

export interface SyncQueueItem {
  id: string;
  type: 'save_mood' | 'save_exercise_progress' | 'update_profile';
  payload: any;
  timestamp: number;
  status: 'pending' | 'syncing' | 'failed';
  error?: string;
  retryCount: number;
}

export interface SyncState {
  pendingQueue: SyncQueueItem[];
  isSyncing: boolean;
  lastError: string | null;
  isOnline: boolean;
  initializeQueue: () => Promise<void>;
  enqueueItem: (
    type: SyncQueueItem['type'],
    payload: any,
    queryClient: QueryClient
  ) => Promise<void>;
  processQueue: (queryClient: QueryClient) => Promise<void>;
  clearQueue: () => Promise<void>;
  setOnlineStatus: (isOnline: boolean, queryClient?: QueryClient) => Promise<void>;
}

export async function checkOnline(): Promise<boolean> {
  if (Platform.OS === 'web' && typeof navigator !== 'undefined' && !navigator.onLine) {
    return false;
  }
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 3000);
    // HEAD request to a reliable public endpoint with no-cors to bypass CORS blocking
    await fetch('https://www.google.com', { method: 'HEAD', mode: 'no-cors', signal: controller.signal });
    clearTimeout(id);
    return true;
  } catch {
    return false;
  }
}

function isAlreadySynced(item: SyncQueueItem, queryClient: QueryClient): boolean {
  try {
    if (item.type === 'save_mood') {
      const { uid, entry } = item.payload;
      if (!uid || !entry?.id) return false;
      const cached = queryClient.getQueryData<any[]>(['moods', uid]);
      if (!cached) return false;
      return cached.some((m: any) => m.id === entry.id);
    }

    if (item.type === 'save_exercise_progress') {
      const { uid, exerciseId, streak } = item.payload;
      if (!uid || !exerciseId) return false;
      const cached = queryClient.getQueryData<any>(['exercises', uid]);
      if (!cached) return false;
      const existing = cached[exerciseId];
      return existing?.completed === true && existing?.streak >= streak;
    }

    if (item.type === 'update_profile') {
      const { uid, updates } = item.payload;
      if (!uid || !updates) return false;
      const cached = queryClient.getQueryData<any>(['profile', uid]);
      if (!cached) return false;
      return Object.keys(updates).every((key) => cached[key] === updates[key]);
    }
  } catch {
    // If cache check fails, proceed with sync to be safe
  }
  return false;
}

export const useSyncStore = create<SyncState>((set, get) => ({
  pendingQueue: [],
  isSyncing: false,
  lastError: null,
  isOnline: true,

  initializeQueue: async () => {
    try {
      const savedQueue = await storageService.getJSON<SyncQueueItem[]>(STORAGE_KEY);
      if (savedQueue && Array.isArray(savedQueue)) {
        // Any items marked 'syncing' should revert to 'pending' upon initialization
        const sanitized = savedQueue.map((item) =>
          item.status === 'syncing' ? { ...item, status: 'pending' as const } : item
        );
        set({ pendingQueue: sanitized });
      }
      const online = await checkOnline();
      set({ isOnline: online });
    } catch (err) {
      console.error('[useSyncStore] Queue initialization failed:', err);
    }
  },

  enqueueItem: async (type, payload, queryClient) => {
    const id = `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const newItem: SyncQueueItem = {
      id,
      type,
      payload,
      timestamp: Date.now(),
      status: 'pending',
      retryCount: 0,
    };

    // 1. Persist mood data to AsyncStorage immediately (before queue processing)
    if (type === 'save_mood') {
      const { uid, entry } = payload;
      if (uid && entry) {
        await moodRepository.persistMoods(uid, [entry]);
      }
    }

    // 2. Save queue item to Zustand state and AsyncStorage (for retry tracking)
    const updatedQueue = [...get().pendingQueue, newItem];
    set({ pendingQueue: updatedQueue });
    await storageService.setJSON(STORAGE_KEY, updatedQueue);

    // 3. Apply optimistic updates immediately to UI / Query Client
    if (type === 'save_mood') {
      const { uid, entry } = payload;
      if (uid && entry) {
        queryClient.setQueryData(['moods', uid], (old: any[] = []) => {
          if (old.some((m) => m.id === entry.id)) return old;
          return [...old, entry];
        });
      }
    } else if (type === 'save_exercise_progress') {
      const { uid, exerciseId, streak } = payload;
      if (uid && exerciseId) {
        queryClient.setQueryData(['exercises', uid], (old: Record<string, any> = {}) => {
          return { ...old, [exerciseId]: { ...old[exerciseId], completed: true, streak } };
        });
      }
    } else if (type === 'update_profile') {
      const { uid, updates } = payload;
      if (uid && updates) {
        const userStore = useAppStore.getState();
        const currentUser = userStore.session.user;
        if (currentUser && currentUser.uid === uid) {
          // Perform optimistic update on Zustand session user
          userStore.setUser({ ...currentUser, ...updates });
        }
      }
    }

    // 4. Trigger processing in background
    void get().processQueue(queryClient);
  },

  processQueue: async (queryClient) => {
    if (get().isSyncing) return;

    const online = await checkOnline();
    set({ isOnline: online });
    if (!online) {
      return;
    }

    const queue = get().pendingQueue;
    if (queue.length === 0) return;

    set({ isSyncing: true, lastError: null });

    const updatedQueue = [...queue];
    let hasChanges = false;

    for (let i = 0; i < updatedQueue.length; i++) {
      const item = updatedQueue[i];
      if (item.status === 'syncing') continue;

      // Check if data is already synced via onSnapshot (real-time subscription)
      if (isAlreadySynced(item, queryClient)) {
        updatedQueue.splice(i, 1);
        i--;
        hasChanges = true;
        continue;
      }

      updatedQueue[i] = { ...item, status: 'syncing' };
      set({ pendingQueue: [...updatedQueue] });

      try {
        if (item.type === 'save_mood') {
          const { uid, entry } = item.payload as { uid: string; entry: Mood };
          await moodRepository.syncToCloud(uid, entry);
          queryClient.invalidateQueries({ queryKey: ['moods', uid] });

        } else if (item.type === 'save_exercise_progress') {
          const { uid, exerciseId, streak } = item.payload;
          await journeyRepository.saveProgress(uid, exerciseId, streak);
          queryClient.invalidateQueries({ queryKey: ['exercises', uid] });

        } else if (item.type === 'update_profile') {
          const { uid, updates } = item.payload;
          const currentProfile = useAppStore.getState().session.user;
          if (currentProfile) {
            await profileRepository.updateProfile(uid, updates, currentProfile);
          }
        }

        // Successfully synced, remove from queue
        updatedQueue.splice(i, 1);
        i--;
        hasChanges = true;
      } catch (error) {
        console.error(`[useSyncStore] Sync error for item ${item.id}:`, error);

        const isNetworkError =
          error instanceof Error &&
          (error.message.includes('network') ||
            error.message.includes('offline') ||
            error.message.includes('connection') ||
            error.message.includes('Failed to fetch'));

        if (isNetworkError) {
          // Revert status to retry later
          updatedQueue[i] = {
            ...item,
            status: 'pending',
            retryCount: item.retryCount + 1,
          };
          set({ isOnline: false });
          break; // Stop queue processing since network is down
        } else {
          // Permanent failure
          updatedQueue[i] = {
            ...item,
            status: 'failed',
            error: error instanceof Error ? error.message : 'Permanent failure',
            retryCount: item.retryCount + 1,
          };
          set({ lastError: error instanceof Error ? error.message : 'Sync execution failed' });
        }
        hasChanges = true;
      }
    }

    if (hasChanges) {
      set({ pendingQueue: updatedQueue });
      await storageService.setJSON(STORAGE_KEY, updatedQueue);
    }

    set({ isSyncing: false });
  },

  clearQueue: async () => {
    set({ pendingQueue: [], lastError: null });
    await storageService.delete(STORAGE_KEY);
  },

  setOnlineStatus: async (isOnline, queryClient) => {
    set({ isOnline });
    if (isOnline && queryClient) {
      void get().processQueue(queryClient);
    }
  },
}));

export default useSyncStore;
