import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Session, StartSessionRequest } from '../../shared/models/session.models';

type ApiResponse<T> = { success: boolean; data: T };

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly http   = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  startSession(payload: StartSessionRequest): Observable<Session> {
    return this.http
      .post<ApiResponse<Session>>(`${this.apiUrl}/sessions/start`, payload)
      .pipe(map((res) => res.data));
  }

  getSession(id: string): Observable<Session> {
    return this.http
      .get<ApiResponse<Session>>(`${this.apiUrl}/sessions/${id}`)
      .pipe(map((res) => res.data));
  }
}
