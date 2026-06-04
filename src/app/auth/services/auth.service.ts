import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse } from '../interfaces/auth-response.interface';

const baseUrl = environment.baseUrl;

interface Payload {
  isAuth: boolean;
  isAdmin: boolean;
  exp: number;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _token = signal<string | null>(sessionStorage.getItem('token'));

  private http = inject(HttpClient);

  private _user = signal<Payload | null>(JSON.parse(sessionStorage.getItem('login')!));

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<any>(`${baseUrl}/login`, { email, password }).pipe(
      map((resp) => this.handleAuthSuccess(resp)),
      catchError((error: any) => this.handleAuthError(error)),
    );
  }

  private handleAuthSuccess({ token, email }: AuthResponse) {
    const payload: any = JSON.parse(atob(token.split('.')[1]));
    this._token.set(token);
    this._user.set({ email, isAuth: true, isAdmin: payload.isAdmin!, exp: payload.exp! });

    sessionStorage.setItem('token', token);
    sessionStorage.setItem('login', JSON.stringify(this._user()));

    console.log(payload);

    return true;
  }

  private handleAuthError(error: any) {
    this.logout();
    return of(false);
  }

  isTokenExpired(): boolean {
    if (!this._user()) return true;
    if (!this.token()) return true;
    const exp = this._user()!.exp;
    const now = new Date().getTime() / 1000;
    if (now > exp) {
      this.logout();
      return true;
    }
    return false;
  }

  user = computed(() => {
    return this._user();
  });

  token = computed(() => {
    return this._token();
  });

  logout() {
    this._token.set(null);
    this._user.set({
      isAuth: false,
      isAdmin: false,
      email: '',
      exp: 0,
    });
    sessionStorage.removeItem('login');
    sessionStorage.removeItem('token');
  }
}
