export interface StartSessionRequest {
  jobPosting: string;
}

export interface Session {
  id: string;
  userId: string;
  jobPosting: string;
  questions: unknown[];
  createdAt: string;
  endedAt?: string;
}
