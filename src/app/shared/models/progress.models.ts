export interface SessionSummary {
  sessionId: string;
  jobPosting: string;
  createdAt: string;
  totalQuestions: number;
  averageScore: number;
}

export interface UserProgress {
  userId: string;
  totalSessions: number;
  totalQuestionsAnswered: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  sessions: SessionSummary[];
}
