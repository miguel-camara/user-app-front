import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthResponse } from '../../interfaces/auth-response.interface';

@Component({
  selector: 'app-login-page',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login-page.html',
})
export class LoginPage {
  hasError = signal(false);

  fb = inject(FormBuilder);
  router = inject(Router);
  authService = inject(AuthService);

  loginForm = this.fb.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.minLength(5), Validators.required]],
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      this.hasError.set(true);
      setTimeout(() => {
        this.hasError.set(false);
      }, 2000);
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.login(email!, password!).subscribe({
      next: (response: boolean) => {
        this.router.navigate(['/users']);
      },
      error: (error: any) => {
        // if (error.status == 401) {
        // Swal.fire('Error en el Login', error.error.message, 'error')
        console.log('Ocurrio un error', error);

        // } else {
        //   throw error;
        // }
      },
    });

    // this.authService.login(email!, password!).subscribe(isAuthenticated => {
    //   if (isAuthenticated) {
    //     this.router.navigateByUrl('/');
    //     return;
    //   }
    //   this.hasError.set(true);
    //   setTimeout(() => {
    //     this.hasError.set(false);
    //   }, 2000);

    // })
  }
}
