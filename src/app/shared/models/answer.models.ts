export interface SubmitAnswerRequest {
  questionId: string;
  answerText: string;
}

export interface FollowUpQuestion {
  question: string;
  idealAnswer: string;
}

export interface AnswerFeedback {
  answerId: string;
  questionId: string;
  aiScore: number;
  aiFeedback: string;
  idealAnswer: string;
  followUpQuestions: FollowUpQuestion[];
}
