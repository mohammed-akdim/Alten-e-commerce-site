import { Routes } from '@angular/router';
import { adminGuard } from '../../guards/admin.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'products',
    loadComponent: () => import('./products/product-management.component').then(m => m.ProductManagementComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'users',
    loadComponent: () => import('./users/user-management.component').then(m => m.UserManagementComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'orders',
    loadComponent: () => import('./orders/order-management.component').then(m => m.OrderManagementComponent),
    canActivate: [adminGuard]
  }
]; 