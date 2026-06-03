import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSpinner, IonBackButton } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { GetReportByIdUseCase } from 'src/app/domain/use-cases/get-report-by-id.use-case';
import { Report } from 'src/app/domain/entities/report.entity';
import { SyncStatus } from 'src/app/domain/entities/sync-status.enum';

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
    IonSpinner,
    IonBackButton
],
})
export class ReportDetailPage implements OnInit {
  private getReportByIdUseCase = inject(GetReportByIdUseCase);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  report = signal<Report | null>(null);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  ngOnInit() {
    this.loadReport();
  }

  async loadReport(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    try {
      const reportId = this.activatedRoute.snapshot.paramMap.get('id');
      if (!reportId) {
        this.router.navigate(['/report-list']);
        return;
      }
      const result = await this.getReportByIdUseCase.execute(reportId);
      if (!result) {
        this.router.navigate(['/report-list']);
        return;
      }
      this.report.set(result);
    } catch (error) {
      this.errorMessage.set('Error al cargar el reporte. Intente nuevamente.');
    } finally {
      this.isLoading.set(false);
    }
  }

  getSyncStatusLabel(): string {
    const report = this.report()?.syncStatus;
    switch (report) {
      case SyncStatus.PENDING:
        return 'Pendiente';
      case SyncStatus.SYNCING:
        return 'Sincronizando...';
      case SyncStatus.SYNCED:
        return 'Sincronizado';
      case SyncStatus.ERROR:
        return 'Error al sincronizar';
      default:
        return 'Desconocido';
    }
  }
}
