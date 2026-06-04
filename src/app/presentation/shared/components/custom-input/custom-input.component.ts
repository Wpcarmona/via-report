import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { IonInput } from '@ionic/angular/standalone';

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
  standalone: true,
  imports: [IonInput, ReactiveFormsModule, CommonModule],
})
export class CustomInputComponent {
  control = input.required<AbstractControl>();
  label = input<string>('');
  type = input<string>('text');
  errorMessage = input<string>('');
  variant = input<'default' | 'dark'>('default');
}
