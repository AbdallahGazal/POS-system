import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { Dish } from '../../../core/models/dishes.interface';
import { Order, OrderStatus } from '../../../core/models/orders.interface';
import { DishesService } from '../../../core/services/dishes.service';
import { OrdersService } from '../../../core/services/orders.service';
import { ToastService } from '../../../shared/ui/toast/toast.service';

type StatusFilter = OrderStatus | 'All';

@Component({
  selector: 'app-manage-orders',
  imports: [CurrencyPipe, DatePipe, FormsModule],
  templateUrl: './manage-orders.component.html',
})
export class ManageOrdersComponent {
  readonly orders = signal<Order[]>([]);
  readonly dishes = signal<Dish[]>([]);
  readonly statusFilter = signal<StatusFilter>('All');
  readonly statuses: OrderStatus[] = ['Pending', 'In Progress', 'Completed', 'Delivered'];

  readonly filteredOrders = computed(() => this.orders().filter((order) => this.statusFilter() === 'All' || order.status === this.statusFilter()));

  constructor(
    private readonly ordersService: OrdersService,
    private readonly dishesService: DishesService,
    private readonly toast: ToastService,
  ) {
    this.load();
  }

  dishName(id: number): string {
    return this.dishes().find((dish) => dish.id === id)?.name ?? `Dish #${id}`;
  }

  updateStatus(order: Order, status: OrderStatus): void {
    this.ordersService.updateStatus(order.id, status).subscribe({ next: () => { this.toast.success('Order status updated.'); this.load(); }, error: () => this.toast.error('Unable to update order.') });
  }

  cancel(order: Order): void {
    if (order.status !== 'Pending' || !window.confirm(`Cancel order #${order.id}?`)) return;
    this.ordersService.delete(order.id).subscribe({ next: () => { this.toast.success('Order cancelled.'); this.load(); }, error: () => this.toast.error('Unable to cancel order.') });
  }

  private load(): void {
    forkJoin({ orders: this.ordersService.getAll(), dishes: this.dishesService.getAll() }).subscribe({
      next: ({ orders, dishes }) => { this.orders.set(orders.data ?? []); this.dishes.set(dishes.data ?? []); },
      error: () => this.toast.error('Unable to load orders.'),
    });
  }
}
