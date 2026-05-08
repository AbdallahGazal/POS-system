import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';

import { UserRole } from '../../models/users.interface';
import { AuthService } from '../services/auth.service';

export const roleGuard = (...roles: UserRole[]): CanActivateFn => {
  return (): boolean | UrlTree => {
    const auth = inject(AuthService);
    const router = inject(Router);

    return auth.hasRole(...roles) ? true : router.createUrlTree(['/menu']);
  };
};
