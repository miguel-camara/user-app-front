import { Routes } from '@angular/router';
import { UserLayout } from './layouts/user-layout/user-layout';
import { UserComponent } from './pages/user/user.component';
import { UserFormComponent } from './pages/user-form/user-form.component';

export const routes: Routes = [
  {
    path: '',
    component: UserLayout,
    children: [
      {
        path: 'users',
        component: UserComponent,
      },
      {
        path: 'users/:id',
        component: UserFormComponent,
      },
      {
        path: '**',
        redirectTo: 'users',
      },
    ],
  },
];

export default routes;
