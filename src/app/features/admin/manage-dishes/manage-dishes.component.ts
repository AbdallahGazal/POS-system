import { CurrencyPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { Category } from '../../../core/models/categories.interface';
import { Dish, DishPayload } from '../../../core/models/dishes.interface';
import { CategoriesService } from '../../../core/services/categories.service';
import { DishesService } from '../../../core/services/dishes.service';
import { ToastService } from '../../../shared/ui/toast/toast.service';

type ActiveFilter = 'active' | 'inactive' | 'all';

@Component({
  selector: 'app-manage-dishes',
  imports: [CurrencyPipe, FormsModule],
  templateUrl: './manage-dishes.component.html',
})
export class ManageDishesComponent {
  readonly dishes = signal<Dish[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly activeFilter = signal<ActiveFilter>('active');
  readonly categoryFilter = signal<number | null>(null);
  readonly editingId = signal<number | null>(null);
  readonly form = signal<DishPayload>({ name: '', price: 0, categoryId: 0, active: true });

  readonly filteredDishes = computed(() => {
    return this.dishes().filter((dish) => {
      const activeMatches = this.activeFilter() === 'all' || (this.activeFilter() === 'active' ? dish.active : !dish.active);
      const categoryMatches = this.categoryFilter() === null || dish.categoryId === this.categoryFilter();
      return activeMatches && categoryMatches;
    });
  });

  constructor(
    private readonly dishesService: DishesService,
    private readonly categoriesService: CategoriesService,
    private readonly toast: ToastService,
  ) {
    this.load();
  }

  categoryName(id: number): string {
    return this.categories().find((category) => category.id === id)?.name ?? `#${id}`;
  }

  edit(dish: Dish): void {
    this.editingId.set(dish.id);
    this.form.set({ name: dish.name, price: dish.price, categoryId: dish.categoryId, active: dish.active });
  }

  reset(): void {
    this.editingId.set(null);
    this.form.set({ name: '', price: 0, categoryId: this.categories()[0]?.id ?? 0, active: true });
  }

  save(): void {
    const payload = this.form();
    const request = this.editingId() ? this.dishesService.update(this.editingId()!, payload) : this.dishesService.create(payload);
    request.subscribe({
      next: () => {
        this.toast.success(this.editingId() ? 'Dish updated.' : 'Dish created.');
        this.reset();
        this.load();
      },
      error: () => this.toast.error('Unable to save dish.'),
    });
  }

  toggleActive(dish: Dish): void {
    this.dishesService.update(dish.id, { name: dish.name, price: dish.price, categoryId: dish.categoryId, active: !dish.active }).subscribe({
      next: () => {
        this.toast.success(dish.active ? 'Dish deactivated.' : 'Dish activated.');
        this.load();
      },
      error: () => this.toast.error('Unable to update dish.'),
    });
  }

  private load(): void {
    forkJoin({ dishes: this.dishesService.getAll(), categories: this.categoriesService.getAll() }).subscribe(({ dishes, categories }) => {
      this.dishes.set(dishes.data ?? []);
      this.categories.set(categories.data ?? []);
      if (!this.form().categoryId) {
        this.form.update((form) => ({ ...form, categoryId: categories.data?.[0]?.id ?? 0 }));
      }
    });
  }
}
