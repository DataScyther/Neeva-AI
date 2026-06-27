/**
 * Analytics Service
 *
 * Centralised analytics tracking. Currently a no-op wrapper.
 * When PostHog or other providers are integrated, the implementation
 * lives here — screens only call trackEvent().
 */

export type AnalyticsEvent =
  | 'daily_checkin'
  | 'mood_logged'
  | 'journey_started'
  | 'journey_completed'
  | 'ai_conversation'
  | 'reflection_saved'
  | 'meditation_completed'
  | 'subscription_purchased'
  | 'auth_signin'
  | 'auth_signup'
  | 'auth_signout'
  | 'onboarding_completed'
  | 'crisis_resource_accessed'
  | 'error_occurred'
  | 'login_attempt'
  | 'login_success'
  | 'login_failed';

export interface AnalyticsProperties {
  [key: string]: string | number | boolean | undefined | null;
}

class AnalyticsService {
  private enabled = true;

  init(): void {
    // Future: Initialize PostHog or other provider
    if (__DEV__) {
      console.log('[Analytics] Initialized');
    }
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  trackEvent(event: AnalyticsEvent, properties?: AnalyticsProperties): void {
    if (!this.enabled) return;

    if (__DEV__) {
      console.log(`[Analytics] ${event}`, properties ?? '');
    }

    // Future: PostHog.capture(event, properties)
  }

  trackScreenView(screenName: string): void {
    this.trackEvent('ai_conversation' as AnalyticsEvent, { screen: screenName });
  }

  identifyUser(userId: string, traits?: Record<string, unknown>): void {
    if (__DEV__) {
      console.log(`[Analytics] Identify: ${userId}`, traits ?? '');
    }
    // Future: PostHog.identify(userId, traits)
  }

  reset(): void {
    // Future: PostHog.reset()
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;
