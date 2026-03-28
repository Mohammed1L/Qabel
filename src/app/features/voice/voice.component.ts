import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-voice',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="soon-page">
      <div class="soon-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
          <line x1="12" y1="19" x2="12" y2="23"/>
          <line x1="8" y1="23" x2="16" y2="23"/>
        </svg>
      </div>
      <h1 class="soon-title">{{ lang.t('voice.title') }}</h1>
      <p class="soon-text">{{ lang.t('voice.description') }}</p>
      <span class="soon-tag">{{ lang.t('nav.soon') }}</span>
      <a routerLink="/app/session/start" class="soon-back">{{ lang.t('voice.backToInterview') }}</a>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .soon-page {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      min-height: 55vh;
      gap: 1rem;
      max-width: 420px;
      margin: 0 auto;
    }

    .soon-icon {
      width: 88px;
      height: 88px;
      border-radius: 22px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-muted);
      margin-bottom: 0.5rem;
    }

    .soon-title {
      font-size: 1.5rem;
      font-weight: 700;
      letter-spacing: -0.03em;
      color: var(--text-primary);
      margin: 0;
    }

    .soon-text {
      font-size: 0.92rem;
      color: var(--text-secondary);
      line-height: 1.6;
      margin: 0;
    }

    .soon-tag {
      display: inline-block;
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 0.3rem 1rem;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border);
      color: var(--text-muted);
    }

    .soon-back {
      margin-top: 0.5rem;
      font-size: 0.85rem;
      color: var(--text-secondary);
      text-decoration: none;
      font-weight: 500;
      transition: color 0.15s;
    }
    .soon-back:hover { color: var(--text-primary); }
  `],
})
export class VoiceComponent {
  readonly lang = inject(LanguageService);
}
