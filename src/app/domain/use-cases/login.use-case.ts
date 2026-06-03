import { Injectable, inject } from '@angular/core';
import { AuthRepository } from '../repositories/auth.repository';
import { User } from '../entities/entities';

@Injectable({
  providedIn: 'root',
})
export class LoginUseCase {
  
  private authRepository = inject(AuthRepository);
  // constructor(private authRepository: AuthRepository) {}

  async execute(email: string, password: string): Promise<User> {
    return this.authRepository.login(email, password);
  }
}
