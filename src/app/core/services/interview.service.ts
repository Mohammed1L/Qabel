import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { GenerateQuestionsRequest, Question } from '../../shared/models/question.models';
import { SubmitAnswerRequest, AnswerFeedback } from '../../shared/models/answer.models';
import { Session } from '../../shared/models/session.models';

type ApiResponse<T> = { success: boolean; data: T };

@Injectable({ providedIn: 'root' })
export class InterviewService {
  private readonly http   = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  /** Generates a single question for the session. Call repeatedly for more questions. */
  generateQuestion(payload: GenerateQuestionsRequest): Observable<Question> {
    return this.http
      .post<ApiResponse<Question>>(`${this.apiUrl}/ai/questions/generate`, payload)
      .pipe(map((res) => res.data));
  }

  submitAnswer(payload: SubmitAnswerRequest): Observable<AnswerFeedback> {
    return this.http
      .post<ApiResponse<AnswerFeedback>>(`${this.apiUrl}/answers/submit`, payload)
      .pipe(map((res) => res.data));
  }

  /** Ends the interview session early. */
  endInterview(sessionId: string): Observable<Session> {
    return this.http
      .post<ApiResponse<Session>>(`${this.apiUrl}/sessions/${sessionId}/end`, {})
      .pipe(map((res) => res.data));
  }
}
