import {
  Component,
  inject,
  signal,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionService } from '../../../core/services/session.service';
import { ProgressService } from '../../../core/services/progress.service';
import { AuthService } from '../../../core/services/auth.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { LanguageService } from '../../../core/services/language.service';

const MAX_INTERVIEWS = 2;

@Component({
  selector: 'app-session-start',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    LoadingSpinnerComponent,
  ],
  templateUrl: './session-start.component.html',
  styleUrl: './session-start.component.scss',
})
export class SessionStartComponent implements OnInit {
  private readonly sessionService  = inject(SessionService);
  private readonly progressService = inject(ProgressService);
  private readonly authService     = inject(AuthService);
  private readonly router          = inject(Router);
  private readonly fb              = inject(FormBuilder);
  readonly lang                    = inject(LanguageService);

  readonly form = this.fb.group({
    jobPosting: ['', [Validators.required, Validators.minLength(30)]],
  });

  readonly showEditor   = signal(false);
  readonly loading      = signal(false);
  readonly error        = signal<string | null>(null);
  readonly limitReached = signal(false);

  ngOnInit(): void {
    const userId = this.authService.userId();
    if (!userId) return;

    this.progressService.getProgress(userId).subscribe({
      next: (progress) => {
        if (progress.totalSessions >= MAX_INTERVIEWS) {
          this.limitReached.set(true);
        }
      },
      error: () => { /* silently ignore — let the start attempt surface errors */ },
    });
  }

  openEditor(): void {
    this.showEditor.set(true);
  }

  start(): void {
    if (this.form.invalid) {
      this.form.controls.jobPosting.markAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.sessionService
      .startSession({ jobPosting: this.form.value.jobPosting! })
      .subscribe({
        next: (session) =>
          this.router.navigate(['/app/interview'], {
            queryParams: { sessionId: session.id },
          }),
        error: (err) => {
          if (err?.status === 403) {
            this.limitReached.set(true);
          } else {
            this.error.set(err?.error?.message ?? 'Failed to start session.');
          }
          this.loading.set(false);
        },
      });
  }
}
