import { CurrencyPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { OrdersService } from '../../core/services/orders.service';
import { OrderDraftService } from '../../core/services/order-draft.service';
import { ToastService } from '../../shared/ui/toast/toast.service';

@Component({
  selector: 'app-orders',
  imports: [CurrencyPipe, FormsModule, RouterLink],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent {
  readonly customerName = signal('');
  readonly loading = signal(false);
  readonly successOrderId = signal<number | null>(null);
  readonly successMessage = signal('');

  constructor(
    readonly draft: OrderDraftService,
    private readonly ordersService: OrdersService,
    private readonly toast: ToastService,
  ) {}

  checkout(): void {
    if (this.draft.items().length === 0) {
      this.toast.error('Add at least one dish before checkout.');
      return;
    }

    this.loading.set(true);
    this.ordersService
      .checkout({
        customerName: this.customerName().trim() || 'Walk-in Customer',
        items: this.draft.items().map(({ dishId, quantity, notes }) => ({ dishId, quantity, notes })),
      })
      .subscribe({
        next: (response) => {
          this.loading.set(false);
          this.successOrderId.set(response.orderId);
          this.successMessage.set(response.status);
          this.toast.success('Order checked out successfully.');
          this.draft.clear();
        },
        error: () => {
          this.loading.set(false);
          this.toast.error('Checkout failed.');
        },
      });
  }

  newOrder(): void {
    this.customerName.set('');
    this.successOrderId.set(null);
    this.successMessage.set('');
    this.draft.clear();
  }
}
