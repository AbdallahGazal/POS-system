import { Injectable, signal } from '@angular/core';

import { OrderItem } from '../models/orders.interface';

export interface CartItem extends OrderItem {
  dishName: string;
  price: number;
}

@Injectable({ providedIn: 'root' })
export class OrderDraftService {
  private readonly storageKey = 'pos_order_draft';
  private readonly itemsState = signal<CartItem[]>(this.load());

  readonly items = this.itemsState.asReadonly();

  addItem(item: CartItem): void {
    const existing = this.itemsState().find((cartItem) => cartItem.dishId === item.dishId);

    if (existing) {
      this.updateQuantity(item.dishId, existing.quantity + item.quantity);
      return;
    }

    this.setItems([...this.itemsState(), item]);
  }

  updateQuantity(dishId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(dishId);
      return;
    }

    this.setItems(this.itemsState().map((item) => (item.dishId === dishId ? { ...item, quantity } : item)));
  }

  updateNotes(dishId: number, notes: string): void {
    this.setItems(this.itemsState().map((item) => (item.dishId === dishId ? { ...item, notes } : item)));
  }

  removeItem(dishId: number): void {
    this.setItems(this.itemsState().filter((item) => item.dishId !== dishId));
  }

  clear(): void {
    this.setItems([]);
  }

  itemCount(): number {
    return this.itemsState().reduce((sum, item) => sum + item.quantity, 0);
  }

  total(): number {
    return this.itemsState().reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  private setItems(items: CartItem[]): void {
    this.itemsState.set(items);
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  private load(): CartItem[] {
    const stored = localStorage.getItem(this.storageKey);

    if (!stored) {
      return [];
    }

    try {
      return JSON.parse(stored) as CartItem[];
    } catch {
      localStorage.removeItem(this.storageKey);
      return [];
    }
  }
}
