import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonFab,
  IonFabButton,
  IonIcon,
  ViewWillEnter,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/angular/standalone';
import { GetReportsUseCase } from 'src/app/domain/use-cases/get-reports.use-case';
import { LogoutUseCase } from 'src/app/domain/use-cases/logout.use-case';
import { Router, RouterLink } from '@angular/router';
import { NetworkService } from 'src/app/core/services/network';
import { Auth } from '@angular/fire/auth';
import { Report } from 'src/app/domain/entities/report.entity';
import { SyncStatus } from 'src/app/domain/entities/sync-status.enum';
import { SyncStatusIconComponent } from '../../shared/components/sync-status-icon/sync-status-icon.component';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader/skeleton-loader.component';
import { addIcons } from 'ionicons';
import { add, chevronForward } from 'ionicons/icons';
import { SyncService } from 'src/app/core/services/sync';
import { getDisplayPhotoUrl } from 'src/app/shared/utils/photo.utils';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.page.html',
  styleUrls: ['./report-list.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonFabButton,
    IonFab,
    IonLabel,
    IonItem,
    IonList,
    IonButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    IonButtons,
    RouterLink,
    SyncStatusIconComponent,
    IonRefresher,
    IonRefresherContent,
    SkeletonLoaderComponent,
  ],
})
export class ReportListPage implements ViewWillEnter {
  private getReportUseCase = inject(GetReportsUseCase);
  private logoutUseCase = inject(LogoutUseCase);
  private syncService = inject(SyncService);
  private router = inject(Router);
  private networkService = inject(NetworkService);
  private auth = inject(Auth);

  readonly isOnline = computed(() => this.networkService.online());

  reports = signal<Report[]>([]);
  isLoading = signal(false);
  isDownloading = signal(false);
  errorMessage = signal<string | null>(null);

  constructor() {
    addIcons({ add, chevronForward });
    effect(() => {
      const update = this.syncService.lastStatusUpdate();
      if (!update) return;
      this.reports.update(reports =>
        reports.map(r => {
          if (r.id === update.id) {
            return new Report(
              r.id, r.userId, r.title, r.description,
              r.photoUrl, r.latitude, r.longitude,
              r.weatherInfo, update.status, r.createdAt, r.updatedAt
            );
          }
          return r;
        })
      );
    });
  }

  ionViewWillEnter(): void {
    this.loadReports();
    const user = this.auth.currentUser;
    if (user && this.networkService.online()) {
      this.syncService.syncPendingReports();
      this.isDownloading.set(true);
      this.syncService.downloadRemoteReports(user.uid)
        .then(() => this.loadReports())
        .catch(err => console.error('Error descargando reportes', err))
        .finally(() => this.isDownloading.set(false));
    }
  }

  async handleRefresh(event: any): Promise<void> {
    const user = this.auth.currentUser;
    if (user && this.networkService.online()) {
      this.syncService.syncPendingReports();
      await this.syncService.downloadRemoteReports(user.uid);
    }
    await this.loadReports();
    event.target.complete();
  }

  async loadReports() {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    const user = this.auth.currentUser;
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    try {
      const result = await this.getReportUseCase.execute(user.uid);
      this.reports.set(result.filter(r => r.syncStatus !== SyncStatus.DELETED));
    } catch (error) {
      this.errorMessage.set('Error al cargar los reportes. Intente nuevamente.');
    } finally {
      this.isLoading.set(false);
    }
  }

  getDisplayPhotoUrl = getDisplayPhotoUrl;

  async logout() {
    await this.logoutUseCase.execute();
    this.router.navigate(['/login']);
  }
}
