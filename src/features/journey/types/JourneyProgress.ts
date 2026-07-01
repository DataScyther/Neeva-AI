export type JourneyStatus = 'not_started' | 'active' | 'completed';

export interface ResumeTarget {
  exerciseId: string;
  route: string;
}

export interface JourneyProgress {
  programId: string;
  title: string;
  currentLesson: number;
  totalLessons: number;
  completionPercent: number;
  lastActivity: Date | null;
  resumeTarget: ResumeTarget | null;
  status: JourneyStatus;
}
