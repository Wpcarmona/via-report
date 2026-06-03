import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./presentation/auth/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./presentation/auth/register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'report-list',
    loadComponent: () => import('./presentation/reports/report-list/report-list.page').then( m => m.ReportListPage),
    canActivate: [authGuard]
  },
  {
    path: 'report-create',
    loadComponent: () => import('./presentation/reports/report-create/report-create.page').then( m => m.ReportCreatePage),
    canActivate: [authGuard]
  },
  {
    path: 'report-detail/:id',
    loadComponent: () => import('./presentation/reports/report-detail/report-detail.page').then( m => m.ReportDetailPage),
    canActivate: [authGuard]
  },
];
