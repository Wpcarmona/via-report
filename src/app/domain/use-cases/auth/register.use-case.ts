import { inject, Injectable } from '@angular/core';
import { AuthRepository } from '../../repositories/auth.repository';
import { User } from '../../entities/entities';

@Injectable({
  providedIn: 'root',
})
export class RegisterUseCase {

  private authRepository = inject(AuthRepository);

  async execute(email: string, password: string, fullName: string): Promise<User> {
    return this.authRepository.register(email, password, fullName);
  }
}
