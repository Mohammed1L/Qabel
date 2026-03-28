import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-error-banner',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  template: `
    <div class="error-banner" role="alert">
      <mat-icon class="error-icon">error_outline</mat-icon>
      <span class="error-message">{{ message() }}</span>
      <button mat-icon-button aria-label="Dismiss" (click)="dismissed.emit()">
        <mat-icon>close</mat-icon>
      </button>
    </div>
  `,
  styles: [`
    .error-banner {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background-color: var(--mat-sys-error-container);
      color: var(--mat-sys-on-error-container);
      border-radius: 8px;
      padding: 0.75rem 1rem;
    }
    .error-icon { flex-shrink: 0; }
    .error-message { flex: 1; font: var(--mat-sys-body-medium); }
  `],
})
export class ErrorBannerComponent {
  readonly message = input.required<string>();
  readonly dismissed = output<void>();
}
