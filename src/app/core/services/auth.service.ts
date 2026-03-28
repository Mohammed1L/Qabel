import { Injectable, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  LoginRequest,
  RegisterRequest,
  StoredUser,
} from '../../shared/models/auth.models';

const TOKEN_KEY = 'qabel_token';
const USER_KEY  = 'qabel_user';

type ApiTokenResponse = {
  success: boolean;
  data: {
    token: string;
    userId?: string;
    user?: { id?: string };
  };
};

function decodeJwt(token: string): Record<string, string> {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return {};
  }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http       = inject(HttpClient);
  private readonly router     = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly apiUrl     = environment.apiUrl;
  private readonly isBrowser  = isPlatformBrowser(this.platformId);

  private readonly _currentUser = signal<StoredUser | null>(this.loadUserFromStorage());

  readonly currentUser     = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => !!this._currentUser());
  readonly userId          = computed(() => this._currentUser()?.userId ?? null);

  register(payload: RegisterRequest): Observable<StoredUser> {
    return this.http
      .post<ApiTokenResponse>(`${this.apiUrl}/auth/register`, payload)
      .pipe(
        map((res) => {
          const claims = decodeJwt(res.data.token);
          return {
            token:  res.data.token,
            userId: res.data.userId ?? res.data.user?.id ?? claims['sub'] ?? '',
            name:   payload.name,
            email:  payload.email,
          } satisfies StoredUser;
        }),
        tap((user) => this.storeSession(user)),
      );
  }

  login(payload: LoginRequest): Observable<StoredUser> {
    return this.http
      .post<ApiTokenResponse>(`${this.apiUrl}/auth/login`, payload)
      .pipe(
        map((res) => {
          const claims = decodeJwt(res.data.token);
          return {
            token:  res.data.token,
            userId: res.data.userId ?? res.data.user?.id ?? claims['sub'] ?? '',
            name:   claims['name'] ?? payload.email.split('@')[0],
            email:  payload.email,
          } satisfies StoredUser;
        }),
        tap((user) => this.storeSession(user)),
      );
  }

  googleLogin(code: string): Observable<StoredUser> {
    return this.http
      .post<ApiTokenResponse>(`${this.apiUrl}/auth/google`, { code })
      .pipe(
        map((res) => {
          const claims = decodeJwt(res.data.token);
          return {
            token:  res.data.token,
            userId: res.data.userId ?? res.data.user?.id ?? claims['sub'] ?? '',
            name:   claims['name'] ?? claims['email']?.split('@')[0] ?? 'User',
            email:  claims['email'] ?? '',
          } satisfies StoredUser;
        }),
        tap((user) => this.storeSession(user)),
      );
  }

  /** Clears token + user from storage and resets signal (no navigation). */
  clearSession(): void {
    if (this.isBrowser) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
    this._currentUser.set(null);
  }

  logout(): void {
    this.clearSession();
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return this.isBrowser ? localStorage.getItem(TOKEN_KEY) : null;
  }

  private storeSession(user: StoredUser): void {
    if (this.isBrowser) {
      localStorage.setItem(TOKEN_KEY, user.token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
    this._currentUser.set(user);
  }

  private loadUserFromStorage(): StoredUser | null {
    if (!this.isBrowser) return null;
    try {
      const raw = localStorage.getItem(USER_KEY);
      if (!raw) return null;
      const user = JSON.parse(raw) as StoredUser;
      // Evict sessions where userId was incorrectly stored as an email
      if (!user.userId || user.userId.includes('@')) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        return null;
      }
      return user;
    } catch {
      return null;
    }
  }
}
