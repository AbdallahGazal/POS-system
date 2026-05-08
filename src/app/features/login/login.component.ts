import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../core/auth/services/auth.service';
import { Login } from '../../core/models/register.interface';
import { ToastService } from '../../shared/ui/toast/toast.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  readonly credentials: Login = { username: '', password: '' };
  readonly loading = signal(false);
  readonly error = signal('');

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
    private readonly toast: ToastService,
  ) {}

  submit(): void {
    this.error.set('');
    this.loading.set(true);

    this.auth.login(this.credentials).subscribe({
      next: ({ user }) => {
        this.loading.set(false);
        this.toast.success(`Welcome, ${user.username}`);

        const target = user.role === 'Admin' ? '/admin' : user.role === 'Chef' ? '/kitchen' : '/menu';
        void this.router.navigate([target]);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Invalid username or password.');
      },
    });
  }
}
