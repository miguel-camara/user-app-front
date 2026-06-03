import { Component, inject } from '@angular/core';
import { UserFormDetail } from './user-form-detail/user-form-detail';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Loading } from '../../../shared/loading/loading';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'user-form',
  imports: [UserFormDetail, Loading],
  templateUrl: './user-form.component.html',
})
export class UserFormComponent {
  activedRoute = inject(ActivatedRoute);
  router = inject(Router);
  userService = inject(UserService);
  authService = inject(AuthService);

  userId = toSignal(this.activedRoute.params.pipe(map((params) => params['id'])));

  userResource = rxResource({
    params: () => ({
      id: this.userId(),
    }),
    stream: ({ params }) => {
      return this.userService.findById(params.id);
    },
  });
}
