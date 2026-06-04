import { Injectable, inject } from '@angular/core';
import { AuthRepository } from '../repositories/auth.repository';

@Injectable({
  providedIn: 'root',
})
export class LogoutUseCase {
  private authRepository = inject(AuthRepository);

  async execute(): Promise<void> {
    return this.authRepository.logout();
  }
}
