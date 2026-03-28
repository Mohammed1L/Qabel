import { FollowUpQuestion } from './answer.models';

export interface ReviewQuestion {
  questionId: string;
  questionText: string;
  category: string;
  difficulty: string;
  userAnswer: string | null;
  aiScore: number | null;
  aiFeedback: string | null;
  idealAnswer: string | null;
  followUpQuestions: FollowUpQuestion[] | null;
}

export interface SessionReview {
  sessionId: string;
  jobPosting: string;
  createdAt: string;
  questions: ReviewQuestion[];
}
