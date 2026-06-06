import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const IsAdminGuard: CanMatchFn = async (route: Route, segments: UrlSegment[]) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAdmin = authService.user()?.isAdmin;

  if (!isAdmin) {
    router.navigateByUrl('/not-administrator');
    return false;
  }

  return true;
};
