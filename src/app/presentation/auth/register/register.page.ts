import { Component, inject, OnInit, signal } from '@angular/core';
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
import { RouterLink } from '@angular/router';
import { Auth } from '@angular/fire/auth';

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
    ReactiveFormsModule,
    RouterLink,
  ],
})
export class RegisterPage implements OnInit {
  private registerUseCase = inject(RegisterUseCase);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    fullName: ['', [Validators.required, Validators.minLength(3)]],
  });

  async ngOnInit() {
    await this.auth.authStateReady();
    if (this.auth.currentUser) {
      this.router.navigate(['/report-list']);
    }
  }

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
