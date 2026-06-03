import { CanActivateFn } from '@angular/router';
import {Auth} from "@angular/fire/auth";
import { inject } from '@angular/core';
import { Router } from '@angular/router';


export const authGuard: CanActivateFn = (route, state) => {

  const auth = inject(Auth);
  const router = inject(Router);

  if (!auth.currentUser) {
    router.navigate(['/login']);
    return false;
  }
  
  return true;
};
