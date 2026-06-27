/**
 * Auth Provider
 *
 * Keeps Firebase auth state in sync with the Zustand store for all screens.
 */

import { useEffect } from 'react';
import { useAppStore } from '@/core/store/useAppStore';
import { authService } from '@/services/auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAppStore((state) => state.setUser);
  const clearSession = useAppStore((state) => state.clearSession);
  const setOnboardingCompleted = useAppStore((state) => state.setOnboardingCompleted);
  const setEmailVerified = useAppStore((state) => state.setEmailVerified);
  const setAuthInitialized = useAppStore((state) => state.setAuthInitialized);
  const initialize = useAppStore((state) => state.initialize);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        setEmailVerified(authService.isEmailVerified());
        const onboardingCompleted = await authService.isOnboardingCompleted();
        setOnboardingCompleted(onboardingCompleted);
      } else {
        clearSession();
      }
      setAuthInitialized(true);
    });

    return unsubscribe;
  }, [setUser, clearSession, setOnboardingCompleted, setEmailVerified, setAuthInitialized]);

  return <>{children}</>;
}

export default AuthProvider;
