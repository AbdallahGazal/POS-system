import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { Category } from '../../../core/models/categories.interface';
import { Dish } from '../../../core/models/dishes.interface';
import { Order } from '../../../core/models/orders.interface';
import { User } from '../../../core/models/users.interface';
import { CategoriesService } from '../../../core/services/categories.service';
import { DishesService } from '../../../core/services/dishes.service';
import { OrdersService } from '../../../core/services/orders.service';
import { UsersService } from '../../../core/services/users.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterLink],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent {
  readonly orders = signal<Order[]>([]);
  readonly dishes = signal<Dish[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly users = signal<User[]>([]);
  readonly loading = signal(true);

  readonly todaysOrders = computed(() => {
    const today = new Date().toDateString();
    return this.orders().filter((order) => new Date(order.date).toDateString() === today).length;
  });

  constructor(
    ordersService: OrdersService,
    dishesService: DishesService,
    categoriesService: CategoriesService,
    usersService: UsersService,
  ) {
    forkJoin({
      orders: ordersService.getAll(),
      dishes: dishesService.getAll(),
      categories: categoriesService.getAll(),
      users: usersService.getAll(),
    }).subscribe({
      next: ({ orders, dishes, categories, users }) => {
        this.orders.set(orders.data ?? []);
        this.dishes.set(dishes.data ?? []);
        this.categories.set(categories.data ?? []);
        this.users.set(users.data ?? []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
