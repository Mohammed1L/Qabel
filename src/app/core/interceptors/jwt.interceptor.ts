import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router      = inject(Router);
  const token       = authService.getToken();

  const request = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      // On 401 from a non-auth endpoint, force the user back to login
      if (error.status === 401 && !req.url.includes('/auth/')) {
        authService.clearSession();
        router.navigate(['/auth/login'], {
          queryParams: { reason: 'session-expired' },
        });
      }
      return throwError(() => error);
    }),
  );
};
