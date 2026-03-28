export interface GenerateQuestionsRequest {
  sessionId: string;
}

export interface Question {
  id: string | null;
  sessionId: string;
  questionText: string | null;
  category: string | null;
  difficulty: string | null;
  createdAt?: string;
  interviewComplete: boolean;
  completionReason: string | null;
}
