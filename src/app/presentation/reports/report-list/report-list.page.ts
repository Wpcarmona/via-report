import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonSpinner, IonList, IonItem, IonLabel, IonFab, IonFabButton, IonIcon } from '@ionic/angular/standalone';
import { GetReportsUseCase } from 'src/app/domain/use-cases/get-reports.use-case';
import { LogoutUseCase } from 'src/app/domain/use-cases/logout.use-case';
import { Router } from '@angular/router';
import { NetworkService } from 'src/app/core/services/network';
import { Auth } from '@angular/fire/auth';
import { Report } from 'src/app/domain/entities/report.entity';
  import { RouterLink } from '@angular/router';
import { SyncStatusIconComponent } from '../../shared/components/sync-status-icon/sync-status-icon.component';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.page.html',
  styleUrls: ['./report-list.page.scss'],
  standalone: true,
  imports: [IonIcon, IonFabButton, IonFab, IonLabel, IonItem, IonList, IonSpinner, IonButton, 
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    IonButtons,
    RouterLink,
    SyncStatusIconComponent
],
})
export class ReportListPage implements OnInit {
  private getReportUseCase = inject(GetReportsUseCase);
  private logoutUseCase = inject(LogoutUseCase);
  private router = inject(Router);
  private networkService = inject(NetworkService);
  private auth = inject(Auth);

  readonly isOnline = computed(() => this.networkService.online());

  reports = signal<Report[]>([]);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  ngOnInit() {
    this.loadReports();
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
      this.reports.set(result);
    } catch (error) {
      this.errorMessage.set(
        'Error al cargar los reportes. Intente nuevamente.',
      );
    } finally {
      this.isLoading.set(false);
    }
  }

  async logout() {
    await this.logoutUseCase.execute();
    this.router.navigate(['/login']);
  }
}
