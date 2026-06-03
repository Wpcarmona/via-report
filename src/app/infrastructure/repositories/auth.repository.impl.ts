import { inject, Injectable } from '@angular/core';
import { User } from 'src/app/domain/entities/user.entity';
import { AuthRepository } from 'src/app/domain/repositories/auth.repository';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  Auth
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthRepositoryImpl extends AuthRepository {

  private auth = inject(Auth);

  override async login(email: string, password: string): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(
      this.auth,
      email,
      password,
    );
    return new User(
      userCredential.user.uid,
      userCredential.user.email || '',
      userCredential.user.displayName || '',
      userCredential.user.metadata.creationTime
        ? new Date(userCredential.user.metadata.creationTime)
        : new Date(),
    );
  }
  override async register(
    email: string,
    password: string,
    fullName: string,
  ): Promise<User> {
    const userCredential = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password,
    );
    await updateProfile(userCredential.user, { displayName: fullName });
    return new User(
      userCredential.user.uid,
      userCredential.user.email || '',
      fullName,
      userCredential.user.metadata.creationTime
        ? new Date(userCredential.user.metadata.creationTime)
        : new Date(),
    );
  }
  override async logout(): Promise<void> {
    await signOut(this.auth);
  }
}
