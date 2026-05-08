import { CurrencyPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { AuthService } from '../../core/auth/services/auth.service';
import { Category } from '../../core/models/categories.interface';
import { Dish } from '../../core/models/dishes.interface';
import { CategoriesService } from '../../core/services/categories.service';
import { DishesService } from '../../core/services/dishes.service';
import { OrderDraftService } from '../../core/services/order-draft.service';
import { DishCardComponent } from '../../shared/ui/dish-card/dish-card.component';
import { ToastService } from '../../shared/ui/toast/toast.service';

@Component({
  selector: 'app-menu',
  imports: [CurrencyPipe, RouterLink, DishCardComponent],
  templateUrl: './menu.component.html',
})
export class MenuComponent {
  readonly dishes = signal<Dish[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly selectedCategoryId = signal<number | null>(null);
  readonly loading = signal(true);
  readonly error = signal('');

  readonly activeCategories = computed(() => this.categories().filter((category) => category.active));
  readonly visibleDishes = computed(() => {
    const selected = this.selectedCategoryId();
    const includeInactive = this.auth.hasRole('Admin');

    return this.dishes().filter((dish) => {
      const categoryMatches = selected === null || dish.categoryId === selected;
      const activeMatches = includeInactive || dish.active;
      return categoryMatches && activeMatches;
    });
  });

  constructor(
    readonly auth: AuthService,
    readonly draft: OrderDraftService,
    private readonly dishesService: DishesService,
    private readonly categoriesService: CategoriesService,
    private readonly toast: ToastService,
  ) {
    this.load();
  }

  categoryFor(dish: Dish): Category | undefined {
    return this.categories().find((category) => category.id === dish.categoryId);
  }

  quantityFor(dishId: number): number {
    return this.draft.items().find((item) => item.dishId === dishId)?.quantity ?? 0;
  }

  setQuantity(dish: Dish, quantity: number): void {
    const existing = this.draft.items().find((item) => item.dishId === dish.id);

    if (!existing && quantity > 0) {
      this.draft.addItem({ dishId: dish.id, dishName: dish.name, price: dish.price, quantity });
      this.toast.info(`${dish.name} added to order`);
      return;
    }

    if (existing) {
      this.draft.updateQuantity(dish.id, quantity);
    }
  }

  private load(): void {
    forkJoin({ dishes: this.dishesService.getAll(), categories: this.categoriesService.getAll() }).subscribe({
      next: ({ dishes, categories }) => {
        this.dishes.set(dishes.data ?? []);
        this.categories.set(categories.data ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Unable to load the menu.');
        this.loading.set(false);
      },
    });
  }
}
