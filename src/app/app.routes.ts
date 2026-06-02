import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
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
    loadComponent: () => import('./presentation/reports/report-list/report-list.page').then( m => m.ReportListPage)
  },
  {
    path: 'report-create',
    loadComponent: () => import('./presentation/reports/report-create/report-create.page').then( m => m.ReportCreatePage)
  },
  {
    path: 'report-detail',
    loadComponent: () => import('./presentation/reports/report-detail/report-detail.page').then( m => m.ReportDetailPage)
  },
];
