import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../../core/auth/services/auth.service';

@Component({
  selector: 'app-nav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent {
  readonly menuOpen = signal(false);

  constructor(readonly auth: AuthService) {}

  logout(): void {
    this.menuOpen.set(false);
    this.auth.logout();
  }
}
