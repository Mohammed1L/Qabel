import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UserProgress } from '../../shared/models/progress.models';

type ApiResponse<T> = { success: boolean; data: T };

@Injectable({ providedIn: 'root' })
export class ProgressService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getProgress(userId: string): Observable<UserProgress> {
    return this.http
      .get<ApiResponse<UserProgress>>(`${this.apiUrl}/users/${userId}/progress`)
      .pipe(map((res) => res.data));
  }
}
