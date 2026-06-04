import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonSpinner,
  IonBackButton,
  IonButton,
  IonButtons,
  AlertController,
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { GetReportByIdUseCase } from 'src/app/domain/use-cases/reports/get-report-by-id.use-case';
import { CustomInputComponent } from '../../shared/components/custom-input/custom-input.component';
import { CustomTextareaComponent } from '../../shared/components/custom-textarea/custom-textarea.component';
import { UpdateReportUseCase } from 'src/app/domain/use-cases/reports/update-report.use-case';
import { SyncService } from 'src/app/core/services/sync';
import { NetworkService } from 'src/app/core/services/network';
import { Report } from 'src/app/domain/entities/report.entity';
import { SyncStatus } from 'src/app/domain/entities/sync-status.enum';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GOOGLE_MAPS_API_KEY } from 'src/app/shared/constants/app.constants';
import { getDisplayPhotoUrl } from 'src/app/shared/utils/photo.utils';

@Component({
  selector: 'app-report-detail',
  templateUrl: './report-detail.page.html',
  styleUrls: ['./report-detail.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    ReactiveFormsModule,
    IonSpinner,
    IonBackButton,
    IonButton,
    IonButtons,
    CustomInputComponent,
    CustomTextareaComponent,
  ],
})
export class ReportDetailPage implements OnInit {
  private getReportByIdUseCase = inject(GetReportByIdUseCase);
  private updateReportUseCase = inject(UpdateReportUseCase);
  private syncService = inject(SyncService);
  private networkService = inject(NetworkService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private sanitizer = inject(DomSanitizer);
  private alertController = inject(AlertController);
  private fb = inject(FormBuilder);

  readonly isOnline = computed(() => this.networkService.online());

  report = signal<Report | null>(null);
  isLoading = signal(false);
  isSaving = signal(false);
  isEditing = signal(false);
  errorMessage = signal<string | null>(null);

  editForm = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    description: [''],
  });

  mapUrl = computed((): SafeResourceUrl | null => {
    const r = this.report();
    if (!r || !this.isOnline()) return null;
    const url = `https://www.google.com/maps/embed/v1/view?key=${GOOGLE_MAPS_API_KEY}&center=${r.latitude},${r.longitude}&zoom=15&maptype=roadmap`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  });

  ngOnInit() {
    this.loadReport();
  }

  async loadReport(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    try {
      const reportId = this.activatedRoute.snapshot.paramMap.get('id');
      if (!reportId) { this.router.navigate(['/report-list']); return; }
      const result = await this.getReportByIdUseCase.execute(reportId);
      if (!result) { this.router.navigate(['/report-list']); return; }
      this.report.set(result);
    } catch (error) {
      this.errorMessage.set('Error al cargar el reporte. Intente nuevamente.');
    } finally {
      this.isLoading.set(false);
    }
  }

  startEditing(): void {
    const r = this.report();
    if (!r) return;
    this.editForm.setValue({
      title: r.title,
      description: r.description ?? '',
    });
    this.isEditing.set(true);
  }

  cancelEditing(): void {
    this.isEditing.set(false);
    this.errorMessage.set(null);
  }

  async saveEdit(): Promise<void> {
    if (this.editForm.invalid) return;
    const r = this.report();
    if (!r) return;

    this.isSaving.set(true);
    this.errorMessage.set(null);
    const { title, description } = this.editForm.value;

    try {
      const updated = new Report(
        r.id, r.userId, title!, description ?? null,
        r.photoUrl, r.latitude, r.longitude,
        r.weatherInfo,
        r.syncStatus === SyncStatus.SYNCED ? SyncStatus.PENDING : r.syncStatus,
        r.createdAt, new Date(),
      );
      await this.updateReportUseCase.execute(updated);
      this.report.set(updated);
      this.isEditing.set(false);
    } catch (error) {
      this.errorMessage.set('Error al guardar los cambios.');
    } finally {
      this.isSaving.set(false);
    }
  }

  async confirmDelete(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Eliminar reporte',
      message: '¿Estás seguro? Esta acción no se puede deshacer.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', role: 'destructive', handler: async () => { await this.deleteReport(); } }
      ]
    });
    await alert.present();
  }

  private async deleteReport(): Promise<void> {
    const report = this.report();
    if (!report) return;
    try {
      await this.syncService.deleteReport(report.id, report.syncStatus);
      this.router.navigate(['/report-list']);
    } catch (error) {
      this.errorMessage.set('Error al eliminar el reporte.');
    }
  }

  getDisplayPhotoUrl = getDisplayPhotoUrl;

  getSyncStatusLabel(): string {
    switch (this.report()?.syncStatus) {
      case SyncStatus.PENDING: return 'Pendiente de sincronización';
      case SyncStatus.SYNCING: return 'Sincronizando...';
      case SyncStatus.SYNCED: return 'Sincronizado ✓';
      case SyncStatus.ERROR: return 'Error al sincronizar';
      default: return 'Desconocido';
    }
  }
}
