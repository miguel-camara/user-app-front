import { Component, inject, signal } from '@angular/core';
import { AlertService } from '../../../services/alert.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { UserService } from '../../services/user.service';
import { RouterLink } from '@angular/router';
import { Loading } from '../../../shared/loading/loading';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'user',
  imports: [RouterLink, Loading],
  templateUrl: './user.component.html',
})
export class UserComponent {
  alertService = inject(AlertService);
  userService = inject(UserService);

  userResource = rxResource({
    stream: () => {
      return this.userService.findAll();
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
      console.log(r);

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
