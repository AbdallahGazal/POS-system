import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Category } from '../../../core/models/categories.interface';
import { Dish } from '../../../core/models/dishes.interface';

@Component({
  selector: 'app-dish-card',
  imports: [CurrencyPipe],
  templateUrl: './dish-card.component.html',
})
export class DishCardComponent {
  @Input({ required: true }) dish!: Dish;
  @Input() category?: Category;
  @Input() showAddToOrder = false;
  @Input() quantity = 0;

  @Output() quantityChange = new EventEmitter<number>();
  @Output() addToOrder = new EventEmitter<void>();

  increment(): void {
    const nextQuantity = this.quantity + 1;
    this.quantityChange.emit(nextQuantity);
    this.addToOrder.emit();
  }

  decrement(): void {
    this.quantityChange.emit(Math.max(0, this.quantity - 1));
  }
}
