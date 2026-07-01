import type { JourneyProgress } from '../types/JourneyProgress';

export type JourneyDestination =
  | { type: 'route'; pathname: string; params: Record<string, string> }
  | { type: 'placeholder'; journey: JourneyProgress };

export const JourneyNavigationService = {
  resolve(journey: JourneyProgress): JourneyDestination {
    const target = journey.resumeTarget;
    if (!target) {
      return { type: 'placeholder', journey };
    }

    return {
      type: 'route',
      pathname: target.route,
      params: { id: target.exerciseId },
    };
  },
};
