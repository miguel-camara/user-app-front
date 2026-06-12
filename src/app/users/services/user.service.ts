import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { User, UserPage } from '../interfaces/user.interface';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

const url: string = environment.baseUrl;

const emptyUser: User = {
  id: 'new',
  name: '',
  lastname: '',
  email: '',
  username: '',
  password: '',
  roles: [],
  admin: false,
};

@Injectable({
  providedIn: 'root',
})
export class UserService {
  #http = inject(HttpClient);
  #userCache = new Map<string, UserPage>();
  #userCacheById = new Map<string, User>();

  findAllList(page: number = 0, email: string = ''): Observable<UserPage> {
    const key = `${page}-${email}`;
    if (this.#userCache.has(key)) {
      return of(this.#userCache.get(key)!);
    }

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
        tap((res) => {
          this.#userCache.set(key, res);
        }),
        catchError((err) => {
          return throwError(() => new Error(JSON.stringify(err.error)));
        }),
      );
  }

  findAll(page: number = 0): Observable<UserPage> {
    if (this.#userCache.has(`${page}`)) {
      return of(this.#userCache.get(`${page}`)!);
    }

    return this.#http
      .get<UserPage>(`${url}/api/users`, {
        params: {
          page: page,
          size: 25,
          sort: 'name,asc',
        },
      })
      .pipe(
        tap((res) => {
          this.#userCache.set(`${page}`, res);
        }),
        catchError((err) => {
          return throwError(() => new Error(JSON.stringify(err.error)));
        }),
      );
  }

  findById(id: string): Observable<User> {
    if (id === 'new') {
      return of(emptyUser);
    }

    if (this.#userCacheById.has(id)) {
      return of(this.#userCacheById.get(id)!);
    }

    return this.#http.get<User>(`${url}/api/users/${id}`).pipe(
      tap((res) => {
        this.#userCacheById.set(id, res);
      }),
      catchError((err) => {
        return throwError(() => new Error(err.error?.error ?? 'null'));
      }),
    );
  }

  create(user: Partial<User>): Observable<User> {
    return this.#http.post<User>(`${url}/api/users`, user).pipe(
      tap((res) => this.updateUserCache(res)),
      catchError((err) => {
        return throwError(() => new Error(JSON.stringify(err.error)));
      }),
    );
  }

  update(user: Partial<User>, id: string): Observable<User> {
    return this.#http.put<User>(`${url}/api/users/${id}`, user).pipe(
      tap((res) => this.updateUserCache(res)),
      catchError((err) => {
        return throwError(() => new Error(JSON.stringify(err.error)));
      }),
    );
  }

  deleteById(id: string): Observable<string> {
    return this.#http.delete<string>(`${url}/api/users/${id}`).pipe(
      tap((res) => this.deleteUserCache(res)),
      catchError((err) => {
        return throwError(() => new Error(JSON.stringify(err.error)));
      }),
    );
  }

  updateUserCache(user: User) {
    const userId = user.id;

    if (!this.#userCacheById.has(userId!)) {
      this.#userCache.values().next().value?.content.push(user);
    } else {
      this.#userCache.forEach((userResponse: UserPage) => {
        userResponse.content = userResponse.content.map((currentUser: User) =>
          currentUser.id === userId ? user : currentUser,
        );
      });
    }
    this.#userCacheById.set(userId!, user);
  }

  deleteUserCache(id: string) {
    this.#userCacheById.delete(id);

    this.#userCache.forEach((userResponse: UserPage) => {
      userResponse.content = userResponse.content.filter(
        (currentUser: User) => currentUser.id !== id,
      );
    });
  }
}
