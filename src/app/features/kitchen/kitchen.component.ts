import { Component, OnDestroy, signal } from '@angular/core';
import { forkJoin, interval, Subscription } from 'rxjs';

import { AuthService } from '../../core/auth/services/auth.service';
import { Dish } from '../../core/models/dishes.interface';
import { Order, OrderStatus } from '../../core/models/orders.interface';
import { DishesService } from '../../core/services/dishes.service';
import { OrdersService } from '../../core/services/orders.service';
import { OrderCardComponent } from '../../shared/ui/order-card/order-card.component';
import { ToastService } from '../../shared/ui/toast/toast.service';

@Component({
  selector: 'app-kitchen',
  imports: [OrderCardComponent],
  templateUrl: './kitchen.component.html',
  styleUrl: './kitchen.component.css',
})
export class KitchenComponent implements OnDestroy {
  readonly orders = signal<Order[]>([]);
  readonly dishes = signal<Dish[]>([]);
  readonly loading = signal(true);
  readonly statuses: OrderStatus[] = ['Pending', 'In Progress', 'Completed'];
  private readonly refreshSubscription: Subscription;

  constructor(
    readonly auth: AuthService,
    private readonly ordersService: OrdersService,
    private readonly dishesService: DishesService,
    private readonly toast: ToastService,
  ) {
    this.load();
    this.refreshSubscription = interval(15000).subscribe(() => this.load(false));
  }

  ngOnDestroy(): void {
    this.refreshSubscription.unsubscribe();
  }

  dishNames(): Record<number, string> {
    return Object.fromEntries(this.dishes().map((dish) => [dish.id, dish.name]));
  }

  ordersByStatus(status: OrderStatus): Order[] {
    return this.orders().filter((order) => order.status === status && order.status !== 'Delivered');
  }

  load(showLoading = true): void {
    if (showLoading) {
      this.loading.set(true);
    }

    forkJoin({ orders: this.ordersService.getAll(), dishes: this.dishesService.getAll() }).subscribe({
      next: ({ orders, dishes }) => {
        this.orders.set((orders.data ?? []).filter((order) => order.status !== 'Delivered'));
        this.dishes.set(dishes.data ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toast.error('Unable to load kitchen orders.');
      },
    });
  }

  updateStatus(order: Order, status: OrderStatus): void {
    this.ordersService.updateStatus(order.id, status).subscribe({
      next: () => {
        this.toast.success(`Order #${order.id} moved to ${status}.`);
        this.load(false);
      },
      error: () => this.toast.error('Unable to update order status.'),
    });
  }

  cancel(order: Order): void {
    this.ordersService.delete(order.id).subscribe({
      next: () => {
        this.toast.success(`Order #${order.id} cancelled.`);
        this.load(false);
      },
      error: () => this.toast.error('Unable to cancel order.'),
    });
  }
}
