import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CheckoutPayload, CheckoutResponse, Order, Orders, OrderStatus } from '../models/orders.interface';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private readonly base = `${environment.baseUrl}${environment.orders}`;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Orders> {
    return this.http.get<Orders>(this.base);
  }

  getById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.base}/${id}`);
  }

  checkout(data: CheckoutPayload): Observable<CheckoutResponse> {
    return this.http.post<CheckoutResponse>(`${environment.baseUrl}${environment.checkout}`, data);
  }

  updateStatus(id: number, status: OrderStatus): Observable<unknown> {
    return this.http.put(`${this.base}/${id}/status`, { NewStatus: status });
  }

  delete(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
