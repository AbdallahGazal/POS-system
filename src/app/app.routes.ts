import { Routes } from '@angular/router';

import { authGuard } from './core/auth/guards/auth.guard';
import { roleGuard } from './core/auth/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'menu', pathMatch: 'full' },
  { path: 'menu', loadComponent: () => import('./features/menu/menu.component').then((m) => m.MenuComponent) },
  { path: 'login', loadComponent: () => import('./features/login/login.component').then((m) => m.LoginComponent) },
  {
    path: 'orders',
    loadComponent: () => import('./features/orders/orders.component').then((m) => m.OrdersComponent),
    canActivate: [authGuard, roleGuard('Cashier', 'Admin')],
  },
  {
    path: 'kitchen',
    loadComponent: () => import('./features/kitchen/kitchen.component').then((m) => m.KitchenComponent),
    canActivate: [authGuard, roleGuard('Chef', 'Cashier', 'Admin')],
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard('Admin')],
    loadChildren: () => import('./features/admin/admin.routes').then((m) => m.adminRoutes),
  },
  { path: '**', redirectTo: 'menu' },
];
