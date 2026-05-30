import { inject, Injectable } from '@angular/core';
import { catchError, delay, Observable, of, tap, throwError } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

const url: string = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  #http = inject(HttpClient);

  findAll(): Observable<User[]> {
    return this.#http.get<User[]>(`${url}`).pipe(
      tap((users) => console.log(users)),
      catchError((err) => {
        return throwError(() => new Error(err));
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
      });
    }

    return this.#http.get<User>(`${url}/${id}`).pipe(
      delay(2000),
      catchError((err) => {
        return throwError(() => new Error(err.error.error));
      }),
    );
  }

  create(user: Partial<User>): Observable<User> {
    return this.#http.post<User>(`${url}`, user).pipe(
      catchError((err) => {
        return throwError(() => new Error(err));
      }),
    );
  }

  update(user: Partial<User>, id: string): Observable<User> {
    return this.#http.put<User>(`${url}/${id}`, user).pipe(
      catchError((err) => {
        return throwError(() => new Error(err));
      }),
    );
  }

  deleteById(id: string): Observable<User> {
    return this.#http.delete<User>(`${url}/${id}`).pipe(
      tap((val) => console.log(val)),
      catchError((err) => {
        return throwError(() => new Error(err));
      }),
    );
  }
}
