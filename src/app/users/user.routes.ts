import { Routes } from '@angular/router';
import { UserLayout } from './layouts/user-layout/user-layout';
import { UserComponent } from './pages/user/user.component';
import { UserFormComponent } from './pages/user-form/user-form.component';
import { IsAdminGuard } from '../auth/guards/is-admin.guard';
import { NotAdministrator } from './pages/not-administrator/not-administrator';

export const routes: Routes = [
  {
    path: '',
    component: UserLayout,
    children: [
      {
        path: 'users',
        title: 'Lista de Usuarios',
        component: UserComponent,
      },
      {
        path: 'users/:id',
        component: UserFormComponent,
        canMatch: [IsAdminGuard],
      },
      {
        path: 'not-administrator',
        title: 'Sin Permisos',
        component: NotAdministrator,
      },
      {
        path: '**',
        redirectTo: 'users',
      },
    ],
  },
];

export default routes;
