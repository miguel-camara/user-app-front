import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { UserService } from '../../services/user.service';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { AlertService } from '../../../shared/components/alert/alert.service';
import { Loading } from '../../../shared/components/loading/loading';
import { Pagination } from '../../components/pagination/pagination';
import { PaginationService } from '../../components/pagination/pagination.service';
import { DetailUserService } from '../../components/detail-user/detail-user.service';

@Component({
  selector: 'user',
  imports: [RouterLink, Loading, Pagination],
  templateUrl: './user.component.html',
})
export class UserComponent {
  alertService = inject(AlertService);
  userService = inject(UserService);
  paginationService = inject(PaginationService);
  authService = inject(AuthService);
  detailService = inject(DetailUserService);

  userResource = rxResource({
    params: () => ({
      page: this.paginationService.currentPage() - 1,
      email: this.authService.user()?.email,
    }),
    stream: ({ params }) => {
      return this.userService.findAllList(params.page, params.email);
    },
  });

  title = signal<string>('Listado de usuarios!');

  async onRemoveUser(id: string): Promise<void> {
    const res = await this.alertService.open({
      type: 'error',
      message: 'Esta acción no se podra deshacer',
      title: 'Eliminar',
      cancelText: 'Cancelar',
      confirmText: 'Eliminar',
      position: 'row',
      showCancelButton: true,
      closeOnBackdrop: false,
    });
    if (res) {
      await firstValueFrom(this.userService.deleteById(id));
      await this.alertService.open({
        autoClose: true,
        showConfirmButton: false,
        title: 'Eliminado',
        message: `Usuario eliminado`,
        timer: 2000,
      });

      const users = await firstValueFrom(
        this.userService.findAllList(
          this.paginationService.currentPage() - 1,
          this.authService.user()?.email,
        ),
      );

      this.userResource.set(users);
    }
  }
}
