import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../../core/auth/services/auth.service';
import { Register } from '../../../core/models/register.interface';
import { User, UserRole } from '../../../core/models/users.interface';
import { UsersService } from '../../../core/services/users.service';
import { ToastService } from '../../../shared/ui/toast/toast.service';

@Component({
  selector: 'app-manage-users',
  imports: [FormsModule],
  templateUrl: './manage-users.component.html',
})
export class ManageUsersComponent {
  readonly users = signal<User[]>([]);
  readonly registerForm = signal<Register>({ username: '', password: '', role: 'Cashier' });
  readonly editingId = signal<number | null>(null);
  readonly editUsername = signal('');
  readonly editPassword = signal('');

  readonly roleOptions = computed<UserRole[]>(() => (this.auth.isBoss() ? ['Cashier', 'Chef', 'Admin'] : ['Cashier', 'Chef']));
  readonly visibleUsers = computed(() => (this.auth.isBoss() ? this.users() : this.users().filter((user) => user.role !== 'Admin')));

  constructor(
    readonly auth: AuthService,
    private readonly usersService: UsersService,
    private readonly toast: ToastService,
  ) {
    this.load();
  }

  canManage(user: User): boolean {
    return this.auth.isBoss() || user.role !== 'Admin';
  }

  canDelete(user: User): boolean {
    return this.canManage(user) && user.id !== 1;
  }

  register(): void {
    const data = this.registerForm();
    this.auth.register(data).subscribe({
      next: () => {
        this.toast.success('User registered.');
        this.registerForm.set({ username: '', password: '', role: 'Cashier' });
        this.load();
      },
      error: () => this.toast.error('Unable to register user.'),
    });
  }

  startEdit(user: User): void {
    this.editingId.set(user.id);
    this.editUsername.set(user.username);
    this.editPassword.set('');
  }

  save(user: User): void {
    const data: { username?: string; password?: string } = { username: this.editUsername().trim() };
    if (this.editPassword().trim()) {
      data.password = this.editPassword().trim();
    }

    this.usersService.update(user.id, data).subscribe({
      next: () => {
        this.toast.success('User updated.');
        this.editingId.set(null);
        this.load();
      },
      error: () => this.toast.error('Unable to update user.'),
    });
  }

  delete(user: User): void {
    if (!this.canDelete(user) || !window.confirm(`Delete ${user.username}?`)) {
      return;
    }

    this.usersService.delete(user.id).subscribe({
      next: () => {
        this.toast.success('User deleted.');
        this.load();
      },
      error: () => this.toast.error('Unable to delete user.'),
    });
  }

  private load(): void {
    this.usersService.getAll().subscribe({ next: (users) => this.users.set(users.data ?? []), error: () => this.toast.error('Unable to load users.') });
  }
}
