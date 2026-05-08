import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Login, LoginResponse, LoginUser, Register } from '../../models/register.interface';
import { UserRole } from '../../models/users.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly tokenKey = 'pos_token';
  private readonly userKey = 'pos_user';
  private readonly currentUserState = signal<LoginUser | null>(this.loadStoredUser());

  readonly currentUser = this.currentUserState.asReadonly();
  readonly isAuthenticated = computed(() => !!this.currentUserState() && !!this.getToken());
  readonly isBossAdmin = computed(() => this.currentUserState()?.id === 1);

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
  ) {}

  login(credentials: Login): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.baseUrl}${environment.login}`, credentials).pipe(
      tap((response) => this.setSession(response)),
    );
  }

  register(data: Register): Observable<unknown> {
    return this.http.post(`${environment.baseUrl}${environment.register}`, data);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserState.set(null);
    void this.router.navigate(['/menu']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  isBoss(): boolean {
    return this.isBossAdmin();
  }

  hasRole(...roles: UserRole[]): boolean {
    const user = this.currentUserState();
    return !!user && roles.includes(user.role);
  }

  private setSession(response: LoginResponse): void {
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(this.userKey, JSON.stringify(response.user));
    this.currentUserState.set(response.user);
  }

  private loadStoredUser(): LoginUser | null {
    const stored = localStorage.getItem(this.userKey);

    if (!stored || !localStorage.getItem(this.tokenKey)) {
      return null;
    }

    try {
      return JSON.parse(stored) as LoginUser;
    } catch {
      localStorage.removeItem(this.userKey);
      return null;
    }
  }
}
