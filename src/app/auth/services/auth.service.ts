import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
// import { rxResource } from '@angular/core/rxjs-interop';
import { environment } from '../../../environments/environment';
import { AuthResponse } from '../interfaces/auth-response.interface';

// import { AuthResponse } from '@auth/interfaces/auth-response.interface';
// import { User } from '@auth/interfaces/user.interface';
// import { environment } from '@environment/environment';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
const baseUrl = environment.baseUrl;

interface Payload {
  isAuth: boolean;
  isAdmin: boolean;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  // private _authStatus = signal<AuthStatus>('checking');
  // private _user = signal<User | null>(null);
  private _token = signal<string | null>(sessionStorage.getItem('token'));

  private http = inject(HttpClient);

  // private _user: Payload = {
  //   isAuth: false,
  //   isAdmin: false,
  //   email: '',
  // };

  private _user = signal<Payload>({
    isAuth: false,
    isAdmin: false,
    email: '',
  });

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<any>(`${baseUrl}/login`, { email, password }).pipe(
      map((resp) => this.handleAuthSuccess(resp)),
      catchError((error: any) => this.handleAuthError(error)),
    );
  }

  private handleAuthSuccess({ token, email }: AuthResponse) {
    // this._user.set(user);
    // this._authStatus.set('authenticated');
    const payload: any = JSON.parse(atob(token.split('.')[1]));
    this._token.set(token);
    this._user.set({ email, isAuth: true, isAdmin: payload.isAdmin! });

    sessionStorage.setItem('token', token);
    sessionStorage.setItem('login', JSON.stringify(this._user()));

    console.log(payload);

    return true;
  }

  private handleAuthError(error: any) {
    this.logout();
    return of(false);
  }

  // user = computed(() => this._user());
  token = computed(() => this._token());
  isAdmin = computed(() => this._user().isAdmin);
  isAuthenticated = computed(() => this._user().isAuth);
  email = computed(() => this._user().email);

  logout() {
    this._token.set(null);
    this._user.set({
      isAuth: false,
      isAdmin: false,
      email: '',
    });
    sessionStorage.removeItem('login');
    sessionStorage.removeItem('token');

    //   this._authStatus.set('not-authenticated');
  }

  // private authResponseCache = new Map<string, AuthResponse>();

  // authStatus = computed<AuthStatus>(() => {
  //   if (this._authStatus() === 'checking') return 'checking';

  //   if (this._user()) {
  //     return 'authenticated';
  //   }

  //   return 'not-authenticated';
  // });

  // user = computed(() => this._user());
  // token = computed(this._token);
  // isAdmin = computed(() => this._user()?.roles.includes('admin') ?? false);
}
