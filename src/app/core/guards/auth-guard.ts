import { CanActivateFn } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = async () => {
  const auth = inject(Auth);
  const router = inject(Router);

  await auth.authStateReady();

  if (auth.currentUser) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
