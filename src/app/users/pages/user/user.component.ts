import { Component, inject, signal } from '@angular/core';
import { AlertService } from '../../../services/alert.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { UserService } from '../../services/user.service';
import { RouterLink } from '@angular/router';
import { Loading } from '../../../shared/loading/loading';
import { firstValueFrom } from 'rxjs';
import { PaginationService } from '../../shared/pagination/pagination.service';
import { Pagination } from '../../shared/pagination/pagination';

@Component({
  selector: 'user',
  imports: [RouterLink, Loading, Pagination],
  templateUrl: './user.component.html',
})
export class UserComponent {
  alertService = inject(AlertService);
  userService = inject(UserService);
  paginationService = inject(PaginationService);

  userResource = rxResource({
    params: () => ({
      page: this.paginationService.currentPage() - 1,
    }),
    stream: ({ params }) => {
      return this.userService.findAll(params.page);
    },
  });

  title = signal<string>('Listado de usuarios!');

  async onRemoveUser(id: string): Promise<void> {
    const res = await this.alertService.open({
      type: 'error',
      message: 'Esta acción no se podra deshacer',
      title: 'Eliminar',
      autoClose: false,
      cancelText: 'Cancelar',
      confirmText: 'Eliminar',
      position: 'row',
      showCancelButton: true,
      showConfirmButton: true,
    });
    if (res) {
      const r = await firstValueFrom(this.userService.deleteById(id));

      this.alertService.open({
        type: 'success',
        autoClose: true,
        showCancelButton: false,
        showConfirmButton: false,
        timer: 1000,
        title: 'Eliminado',
        message: `Usuario eliminado ${r.id}`,
      });
    }

    const users = await firstValueFrom(this.userService.findAll());
    this.userResource.set(users);
  }
}
