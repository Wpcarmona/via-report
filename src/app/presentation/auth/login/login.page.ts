import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonInput,
  IonItem,
} from '@ionic/angular/standalone';
import { LoginUseCase } from 'src/app/domain/use-cases/login.use-case';
import { Router } from '@angular/router';
import { IonRouterLink } from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonInput,
    IonItem,
    CommonModule,
    IonRouterLink,
    ReactiveFormsModule,
  ],
})
export class LoginPage {
  private loginUseCase = inject(LoginUseCase);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  async login() {
    if (this.loginForm.invalid) return;
    this.errorMessage.set(null);
    this.isLoading.set(true);
    const { email, password } = this.loginForm.value;
    try {
      await this.loginUseCase.execute(email!, password!);
      this.router.navigate(['/report-list']);
    } catch (error) {
      this.errorMessage.set(
        'Error al iniciar sesión. Verifique sus credenciales e intente nuevamente.',
      );
    } finally {
      this.isLoading.set(false);
    }
  }
}
