import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { User, UserRole, Users } from '../models/users.interface';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly base = `${environment.baseUrl}${environment.users}`;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Users> {
    return this.http.get<Users>(this.base);
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${this.base}/${id}`);
  }

  update(id: number, data: { username?: string; password?: string; role?: UserRole }): Observable<unknown> {
    return this.http.put(`${this.base}/${id}`, data);
  }

  delete(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
