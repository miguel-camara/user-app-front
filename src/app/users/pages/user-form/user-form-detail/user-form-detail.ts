import { Component, inject, input, signal } from '@angular/core';
import { FormErrorLabel } from '../../../../shared/form-error-label/form-error-label';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../interfaces/user.interface';
import { Router } from '@angular/router';
import { FormUtils } from '../../../../utils/form-utils';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../../../services/user.service';
import { AlertService } from '../../../../services/alert.service';

@Component({
  selector: 'app-user-form-detail',
  imports: [FormErrorLabel, ReactiveFormsModule],
  templateUrl: './user-form-detail.html',
})
export class UserFormDetail {
  user = input.required<User>();

  router = inject(Router);
  fb = inject(FormBuilder);

  userService = inject(UserService);
  alertService = inject(AlertService);
  wasSaved = signal(false);

  userForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    lastname: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.pattern(FormUtils.emailPattern)]],
    username: ['', [Validators.required, Validators.minLength(5)]],
    password: ['', [Validators.required, Validators.minLength(5)]],
  });

  ngOnInit(): void {
    this.setFormValue(this.user());
  }

  setFormValue(formLike: Partial<User>) {
    this.userForm.reset(this.user() as any);
  }

  async onSubmit() {
    const isValid = this.userForm.valid;
    this.userForm.markAllAsTouched();

    if (!isValid) return;
    const formValue = this.userForm.value;

    const userLike: Partial<User> = {
      ...(formValue as any),
    };

    console.log(userLike);

    this.wasSaved.set(true);

    if (this.user().id === 'new') {
      // Crear Product
      const user = await firstValueFrom(this.userService.create(userLike));
      await this.alertService.open({
        type: 'success',
        showCancelButton: false,
        showConfirmButton: false,
        message: 'Creado con exito',
        title: 'Creado',
        autoClose: true,
        timer: 500,
      });
      this.router.navigate(['/users', user.id]);
    } else {
      // Actualizar Product
      await firstValueFrom(this.userService.update(userLike, this.user().id!));
      await this.alertService.open({
        type: 'success',
        showCancelButton: false,
        showConfirmButton: false,
        message: 'Actualizado con exito',
        title: 'Actualizado',
        autoClose: true,
        timer: 500,
      });
    }

    setTimeout(() => {
      this.wasSaved.set(false);
    }, 3000);
  }
}
