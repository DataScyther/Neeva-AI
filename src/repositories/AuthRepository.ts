/**
 * Auth Repository
 *
 * Re-export of auth service for consistency.
 * All auth operations go through here or the AuthService.
 */

export { authService } from '@/services/auth';
export type { UserProfile, AuthCredentials, SignUpData, AuthMethod, AuthState } from '@/services/auth/types';
