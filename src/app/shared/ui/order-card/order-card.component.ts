import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Order, OrderStatus } from '../../../core/models/orders.interface';
import { UserRole } from '../../../core/models/users.interface';

@Component({
  selector: 'app-order-card',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './order-card.component.html',
})
export class OrderCardComponent {
  @Input({ required: true }) order!: Order;
  @Input() currentUserRole?: UserRole;
  @Input() dishNames: Record<number, string> = {};

  @Output() statusChange = new EventEmitter<OrderStatus>();
  @Output() cancel = new EventEmitter<void>();

  canAdvance(): boolean {
    return (this.currentUserRole === 'Chef' || this.currentUserRole === 'Admin') && this.order.status !== 'Delivered';
  }

  canCancel(): boolean {
    return this.order.status === 'Pending';
  }

  nextStatus(): OrderStatus | null {
    if (this.order.status === 'Pending') {
      return 'In Progress';
    }

    if (this.order.status === 'In Progress') {
      return 'Completed';
    }

    if (this.order.status === 'Completed') {
      return 'Delivered';
    }

    return null;
  }

  statusClasses(status: string): string {
    if (status === 'Pending') {
      return 'bg-amber-100 text-amber-700';
    }

    if (status === 'In Progress') {
      return 'bg-blue-100 text-blue-700';
    }

    if (status === 'Delivered') {
      return 'bg-indigo-100 text-indigo-700';
    }

    return 'bg-emerald-100 text-emerald-700';
  }
}
