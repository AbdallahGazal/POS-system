import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Dish, Dishes, DishPayload } from '../models/dishes.interface';

@Injectable({
  providedIn: 'root',
})
export class DishesService {
  private readonly base = `${environment.baseUrl}${environment.dishes}`;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Dishes> {
    return this.http.get<Dishes>(this.base);
  }

  getById(id: number): Observable<Dish> {
    return this.http.get<Dish>(`${this.base}/${id}`);
  }

  getByCategory(categoryId: number): Observable<Dishes> {
    return this.http.get<Dishes>(`${this.base}?categoryId=${categoryId}`);
  }

  create(dish: DishPayload): Observable<unknown> {
    return this.http.post(this.base, dish);
  }

  update(id: number, dish: DishPayload): Observable<unknown> {
    return this.http.put(`${this.base}/${id}`, dish);
  }
}
