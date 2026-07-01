import { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useNavigation } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { useSyncStore, checkOnline } from '@/core/store/useSyncStore';

export function useSyncRefresh(queryKeysToRefresh: any[][] = []) {
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const { processQueue, setOnlineStatus, initializeQueue } = useSyncStore();

  useEffect(() => {
    // Initialize the queue on mount
    void initializeQueue();
  }, [initializeQueue]);

  // Screen focus listener
  useEffect(() => {
    const handleFocus = () => {
      // Process queue first
      void processQueue(queryClient);
      
      // Refresh only keys that need check
      queryKeysToRefresh.forEach((key) => {
        void queryClient.invalidateQueries({ queryKey: key });
      });
    };

    const unsubscribe = navigation.addListener('focus', handleFocus);
    return unsubscribe;
  }, [navigation, queryClient, queryKeysToRefresh, processQueue]);

  // App resume/active listener
  useEffect(() => {
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        const online = await checkOnline();
        await setOnlineStatus(online, queryClient);
        
        queryKeysToRefresh.forEach((key) => {
          void queryClient.invalidateQueries({ queryKey: key });
        });
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [queryClient, queryKeysToRefresh, setOnlineStatus]);

  // Interval connectivity & sync check
  useEffect(() => {
    const interval = setInterval(async () => {
      const online = await checkOnline();
      const currentOnline = useSyncStore.getState().isOnline;
      if (online !== currentOnline) {
        await setOnlineStatus(online, queryClient);
      } else if (online) {
        const pending = useSyncStore.getState().pendingQueue;
        if (pending.length > 0) {
          void processQueue(queryClient);
        }
      }
    }, 15000); // Check every 15 seconds

    return () => clearInterval(interval);
  }, [queryClient, setOnlineStatus, processQueue]);
}

export default useSyncRefresh;
