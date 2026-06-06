import { Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../interfaces/user.interface';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../../../services/user.service';
import { FormErrorLabel } from '../../../../shared/components/form-error-label/form-error-label';
import { AlertService } from '../../../../shared/services/alert.service';
import { FormUtils } from '../../../../shared/utils/form-utils';
import { DetailUserService } from '../../../components/detail-user/detail-user.service';

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
    username: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(15)]],
    password: ['', [Validators.required, Validators.minLength(5)]],
    admin: [false],
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

    if (this.user().id === 'new') {
      // Crear Product
      this.userService.create(userLike).subscribe({
        next: (user) => {
          this.wasSaved.set(true);
          this.alertService.open({
            type: 'success',
            showCancelButton: false,
            showConfirmButton: false,
            message: 'Creado con exito',
            title: 'Creado',
            autoClose: true,
            timer: 500,
          });
          this.router.navigate(['/users', user.id]);
        },
        error: (err) => {
          this.alertService.open({
            type: 'error',
            showCancelButton: false,
            showConfirmButton: true,
            message: err,
            title: 'Error',
          });
        },
      });
    } else {
      // Actualizar Product
      this.wasSaved.set(true);

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
