import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonContent,
  IonButton,
  IonInput,
} from '@ionic/angular/standalone';
import { LoginUseCase } from 'src/app/domain/use-cases/login.use-case';
import { CustomInputComponent } from '../../shared/components/custom-input/custom-input.component';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    CustomInputComponent,
  ],
})
export class LoginPage implements OnInit {
  
  private loginUseCase = inject(LoginUseCase);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  async ngOnInit() {
    await this.auth.authStateReady();
    if (this.auth.currentUser) {
      this.router.navigate(['/report-list']);
    }
  }

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
