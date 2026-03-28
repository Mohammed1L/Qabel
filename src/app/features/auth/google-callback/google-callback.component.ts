import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-google-callback',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoadingSpinnerComponent],
  template: `
    <div class="callback-page">
      @if (error()) {
        <div class="callback-error">
          <p>{{ error() }}</p>
          <a href="/auth/login">Back to login</a>
        </div>
      } @else {
        <app-loading-spinner message="Signing you in with Google..." />
      }
    </div>
  `,
  styles: [`
    .callback-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg);
    }
    .callback-error {
      text-align: center;
      color: var(--text-secondary);
      font-size: 0.9rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .callback-error a {
      color: var(--text-primary);
      font-weight: 600;
      text-decoration: none;
    }
    .callback-error a:hover { text-decoration: underline; }
  `],
})
export class GoogleCallbackComponent implements OnInit {
  private readonly route  = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly auth   = inject(AuthService);

  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    const code = this.route.snapshot.queryParamMap.get('code');
    if (!code) {
      this.error.set('No authorization code received from Google.');
      return;
    }

    this.auth.googleLogin(code).subscribe({
      next: () => this.router.navigate(['/app/session/start']),
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Google sign-in failed. Please try again.');
      },
    });
  }
}
