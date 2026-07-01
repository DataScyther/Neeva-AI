/**
 * Neeva AI — Feature Flags
 *
 * Centralised feature toggle configuration.
 * Allows enabling/disabling features during development and migration.
 */

export const features = {
  /** Enable AI-powered chat */
  aiChat: true,

  /** Enable streaming AI responses */
  streamingAI: true,

  /** Enable mood tracking */
  moodTracking: true,

  /** Enable community features */
  community: false, // Phase 6 target

  /** Enable crisis support */
  crisisSupport: true,

  /** Enable analytics collection */
  analytics: true,

  /** Enable crash reporting */
  crashReporting: true,

  /** Enable onboarding flow */
  onboarding: true,

  /** Enable real-time Firestore subscriptions */
  realtimeData: true,

  /** Enable Google authentication */
  googleAuth: true,

  /** Enable email/password authentication */
  emailAuth: true,

  /** Enable anonymous sessions */
  anonymousAuth: false,

  /** Enable dark mode by default */
  darkMode: true,

  /** Enable notifications */
  notifications: true,

  /** Enable subscription management */
  subscriptions: false, // Phase 7 target

  /** Development-only features */
  dev: {
    /** Show debug overlay */
    debugOverlay: __DEV__,
    /** Log API calls */
    logApiCalls: __DEV__,
    /** Use mock data */
    useMockData: false,
  },
} as const;

export type FeatureFlag = keyof typeof features;

export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return features[flag] as boolean;
}
