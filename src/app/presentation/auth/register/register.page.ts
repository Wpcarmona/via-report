import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonButton,
  IonInput,
} from '@ionic/angular/standalone';
import { RegisterUseCase } from 'src/app/domain/use-cases/register.use-case';
import { Router } from '@angular/router';
import { IonRouterLink } from '@ionic/angular/standalone';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonItem,
    IonContent,
    IonHeader,
    IonTitle,
    IonInput,
    IonToolbar,
    CommonModule,
    IonRouterLink,
    ReactiveFormsModule,
  ],
})
export class RegisterPage {
  private registerUseCase = inject(RegisterUseCase);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    fullName: ['', [Validators.required, Validators.minLength(3)]],
  });

  async register() {
    if (this.registerForm.invalid) return;
    this.errorMessage.set(null);
    this.isLoading.set(true);
    const { email, password, fullName } = this.registerForm.value;
    try {
      await this.registerUseCase.execute(email!, password!, fullName!);
      this.router.navigate(['/report-list']);
    } catch (error) {
      this.errorMessage.set(
        'Error al registrarse. Verifique sus datos e intente nuevamente.',
      );
    } finally {
      this.isLoading.set(false);
    }
  }
}
