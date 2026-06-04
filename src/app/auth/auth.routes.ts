import { Routes } from '@angular/router';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { LoginPage } from './pages/login-page/login-page';
import { NotAuthenticatedGuard } from './guards/not-authenticated.guard';

export const authRoutes: Routes = [
  {
    path: '',
    component: AuthLayout,
    // canMatch: [NotAuthenticatedGuard],
    children: [
      {
        path: 'login',
        component: LoginPage,
        title: 'Iniciar Sesión',
      },
      {
        path: '**',
        redirectTo: 'login',
      },
    ],
  },
];

export default authRoutes;
