import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { SessionReview } from '../../shared/models/review.models';

type ApiResponse<T> = { success: boolean; data: T };

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private readonly http   = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getSessionReview(sessionId: string): Observable<SessionReview> {
    return this.http
      .get<ApiResponse<SessionReview>>(`${this.apiUrl}/sessions/${sessionId}/review`)
      .pipe(map((res) => res.data));
  }
}
