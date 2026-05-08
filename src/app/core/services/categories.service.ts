import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Categories, Category } from '../models/categories.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private readonly base = `${environment.baseUrl}${environment.categories}`;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Categories> {
    return this.http.get<Categories>(this.base);
  }

  getById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.base}/${id}`);
  }

  create(name: string): Observable<unknown> {
    return this.http.post(`${this.base}/${encodeURIComponent(name)}`, null);
  }

  update(id: number, data: { NewName?: string; Active?: boolean }): Observable<unknown> {
    return this.http.put(`${this.base}/${id}`, data);
  }
}
