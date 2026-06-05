import { inject, Injectable } from '@angular/core';
import { catchError, delay, Observable, of, tap, throwError } from 'rxjs';
import { User, UserPage } from '../interfaces/user.interface';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

const url: string = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  #http = inject(HttpClient);

  findAllList(page: number = 0, email: string = ''): Observable<UserPage> {
    return this.#http
      .get<UserPage>(`${url}/api/users/list`, {
        params: {
          email: email,
          page: page,
          size: 25,
          sort: 'name,asc',
        },
      })
      .pipe(
        catchError((err) => {
          console.log(err);

          return throwError(() => new Error(JSON.stringify(err.error)));
        }),
      );
  }

  findAll(page: number = 0): Observable<UserPage> {
    return this.#http
      .get<UserPage>(`${url}/api/users`, {
        params: {
          page: page,
          size: 25,
          sort: 'name,asc',
        },
      })
      .pipe(
        catchError((err) => {
          console.log(err);

          return throwError(() => new Error(JSON.stringify(err.error)));
        }),
      );
  }

  findById(id: string): Observable<User> {
    if (id === 'new') {
      return of({
        id: 'new',
        name: '',
        lastname: '',
        email: '',
        username: '',
        password: '',
        roles: [],
        admin: false,
      });
    }

    return this.#http.get<User>(`${url}/api/users/${id}`).pipe(
      catchError((err) => {
        return throwError(() => new Error(err.error?.error ?? 'null'));
      }),
    );
  }

  create(user: Partial<User>): Observable<User> {
    return this.#http.post<User>(`${url}/api/users`, user).pipe(
      catchError((err) => {
        return throwError(() => new Error(JSON.stringify(err.error)));
      }),
    );
  }

  update(user: Partial<User>, id: string): Observable<User> {
    return this.#http.put<User>(`${url}/api/users/${id}`, user).pipe(
      catchError((err) => {
        console.log(err);

        return throwError(() => new Error(JSON.stringify(err.error)));
      }),
    );
  }

  deleteById(id: string): Observable<string> {
    return this.#http.delete<string>(`${url}/api/users/${id}`).pipe(
      catchError((err) => {
        console.log(err.error);

        return throwError(() => new Error(JSON.stringify(err.error)));
      }),
    );
  }
}
