import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthFacadeService } from '../services/auth-facade.service';

export const authGuard = () => {
  const authFacade = inject(AuthFacadeService);
  const router = inject(Router);

  if (authFacade.currentUser()) {
    return true;
  }

  return router.parseUrl('/login');
};
