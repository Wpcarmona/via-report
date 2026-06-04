import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { IonTextarea } from '@ionic/angular/standalone';

@Component({
  selector: 'app-custom-textarea',
  templateUrl: './custom-textarea.component.html',
  styleUrls: ['./custom-textarea.component.scss'],
  standalone: true,
  imports: [IonTextarea, ReactiveFormsModule, CommonModule],
})
export class CustomTextareaComponent {
  control = input.required<AbstractControl>();
  label = input<string>('');
  rows = input<number>(4);
  errorMessage = input<string>('');
  variant = input<'default' | 'dark'>('default');
}
