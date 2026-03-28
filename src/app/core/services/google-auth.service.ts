import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GoogleAuthService {
  private readonly platformId = inject(PLATFORM_ID);

  /** Redirects the browser to Google's OAuth2 consent screen. */
  signIn(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const redirectUri = `${window.location.origin}/oauth2/callback`;

    const params = new URLSearchParams({
      client_id:     environment.googleClientId,
      redirect_uri:  redirectUri,
      response_type: 'code',
      scope:         'openid email profile',
      access_type:   'offline',
      prompt:        'select_account',
    });

    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }
}
