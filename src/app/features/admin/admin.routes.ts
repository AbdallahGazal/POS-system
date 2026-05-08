import { Routes } from '@angular/router';

import { AdminComponent } from './admin.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: '', loadComponent: () => import('./dashboard/admin-dashboard.component').then((m) => m.AdminDashboardComponent) },
      { path: 'dishes', loadComponent: () => import('./manage-dishes/manage-dishes.component').then((m) => m.ManageDishesComponent) },
      { path: 'categories', loadComponent: () => import('./manage-categories/manage-categories.component').then((m) => m.ManageCategoriesComponent) },
      { path: 'users', loadComponent: () => import('./manage-users/manage-users.component').then((m) => m.ManageUsersComponent) },
      { path: 'orders', loadComponent: () => import('./manage-orders/manage-orders.component').then((m) => m.ManageOrdersComponent) },
    ],
  },
];
