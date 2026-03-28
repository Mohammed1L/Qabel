import {
  Component,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../core/services/auth.service';
import { LanguageService } from '../../core/services/language.service';

interface NavItem {
  labelKey: string;
  icon: string;
  route: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent {
  readonly auth = inject(AuthService);
  readonly lang = inject(LanguageService);
  readonly navItems: NavItem[] = [
    { labelKey: 'nav.newSession', icon: 'add_circle_outline', route: '/app/session/start' },
    { labelKey: 'nav.interview',  icon: 'mic_none',            route: '/app/interview' },
    { labelKey: 'nav.progress',   icon: 'bar_chart',           route: '/app/progress' },
    { labelKey: 'nav.voice',      icon: 'mic',                 route: '/app/voice', disabled: true },
  ];

  logout(): void {
    this.auth.logout();
  }
}
