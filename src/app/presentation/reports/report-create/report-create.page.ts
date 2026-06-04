import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonButton,
  IonSkeletonText,
} from '@ionic/angular/standalone';
import { CreateReportUseCase } from 'src/app/domain/use-cases/reports/create-report.use-case';
import { CustomInputComponent } from '../../shared/components/custom-input/custom-input.component';
import { CustomTextareaComponent } from '../../shared/components/custom-textarea/custom-textarea.component';
import { Router } from '@angular/router';
import { WeatherService } from 'src/app/core/services/weather';
import { NetworkService } from 'src/app/core/services/network';
import { Auth } from '@angular/fire/auth';
import { SyncStatus } from 'src/app/domain/entities/sync-status.enum';
import { Report } from 'src/app/domain/entities/report.entity';
import { Geolocation } from '@capacitor/geolocation';
import { Camera } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-report-create',
  templateUrl: './report-create.page.html',
  styleUrls: ['./report-create.page.scss'],
  standalone: true,
  imports: [
    IonSkeletonText,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    ReactiveFormsModule,
    IonBackButton,
    IonButton,
    CustomInputComponent,
    CustomTextareaComponent,
  ],
})
export class ReportCreatePage implements OnInit {
  private createReportUseCase = inject(CreateReportUseCase);
  private router = inject(Router);
  private weatherService = inject(WeatherService);
  private networkService = inject(NetworkService);
  private auth = inject(Auth);
  private fb = inject(FormBuilder);

  isLoading = signal(false);
  isLoadingWeather = signal(false);
  weatherInfo = signal<string | null>(null);
  errorMessage = signal<string | null>(null);
  photoLocalPath = signal<string | null>(null);
  photoPreview = signal<string | null>(null);
  latitude = signal<number | null>(null);
  longitude = signal<number | null>(null);

  reportForm = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    description: [''],
  });

  ngOnInit() {
    this.captureLocation();
  }

  async captureLocation(): Promise<void> {
    try {
      const coordinates = await Geolocation.getCurrentPosition({
        timeout: 15000,
        enableHighAccuracy: false,
      });
      this.latitude.set(coordinates.coords.latitude);
      this.longitude.set(coordinates.coords.longitude);
    } catch (error) {
      console.error('Error obteniendo ubicación', error);
      this.latitude.set(6.2442);
      this.longitude.set(-75.5812);
    } finally {
      if (this.networkService.online()) {
        await this.loadWeather();
      }
    }
  }

  async loadWeather(): Promise<void> {
    this.isLoadingWeather.set(true);
    try {
      const weather = await this.weatherService.getWeather(
        this.latitude()!,
        this.longitude()!,
      );
      this.weatherInfo.set(weather);
    } catch (error) {
      console.error(error);
    } finally {
      this.isLoadingWeather.set(false);
    }
  }

  async takePhoto(): Promise<void> {
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: 'base64',
        source: 'CAMERA',
      } as any);

      if (image.base64String) {
        const fileName = `photo_${Date.now()}.jpeg`;
        const saved = await Filesystem.writeFile({
          path: fileName,
          data: image.base64String,
          directory: Directory.Data,
        });
        this.photoLocalPath.set(saved.uri);
        this.photoPreview.set(Capacitor.convertFileSrc(saved.uri));
      }
    } catch (error) {
      console.error('Error tomando foto', error);
    }
  }

  async saveReport(): Promise<void> {
    if (this.reportForm.invalid) return;
    this.errorMessage.set(null);
    this.isLoading.set(true);
    const user = this.auth.currentUser;
    const { title, description } = this.reportForm.value;
    try {
      const report = new Report(
        crypto.randomUUID(),
        user!.uid,
        title!,
        description ?? null,
        this.photoLocalPath(),
        this.latitude()!,
        this.longitude()!,
        this.weatherInfo(),
        SyncStatus.PENDING,
        new Date(),
        new Date(),
      );
      await this.createReportUseCase.execute(report);
      this.router.navigate(['/report-list']);
    } catch (error) {
      this.errorMessage.set('Error al crear el reporte. Intente nuevamente.');
      console.log(error);
    } finally {
      this.isLoading.set(false);
    }
  }
}
