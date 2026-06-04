import { inject, Injectable, signal } from '@angular/core';
import { ReportRepository } from '../../domain/repositories/report.repository';
import { FirestoreDatasource } from '../../infrastructure/datasources/remote/firestore.datasource';
import { CloudinaryDatasource } from '../../infrastructure/datasources/remote/cloudinary.datasource';
import { NetworkService } from './network';
import { SyncStatus } from 'src/app/domain/entities/sync-status.enum';
import { ReportMapper } from '../../infrastructure/mappers/report.mapper';
import { Report } from 'src/app/domain/entities/report.entity';

@Injectable({
  providedIn: 'root',
})
export class SyncService {
  private networkService = inject(NetworkService);
  private reportRepository = inject(ReportRepository);
  private firestoreDatasource = inject(FirestoreDatasource);
  private cloudinaryDatasource = inject(CloudinaryDatasource);

  lastStatusUpdate = signal<{ id: string; status: SyncStatus } | null>(null);

  async syncPendingReports(): Promise<void> {
    if (!this.networkService.online()) return;

    const pendingReports = await this.reportRepository.getPendingReports();
    for (const report of pendingReports) {
      await this.reportRepository.updateSyncStatus(report.id, SyncStatus.SYNCING);
      this.lastStatusUpdate.set({ id: report.id, status: SyncStatus.SYNCING });

      try {
        let reportToSync = report;
        if (report.photoUrl && this.cloudinaryDatasource.isLocalPath(report.photoUrl)) {
          const cloudinaryUrl = await this.cloudinaryDatasource.uploadPhoto(report.photoUrl);
          reportToSync = new Report(
            report.id, report.userId, report.title, report.description,
            cloudinaryUrl, report.latitude, report.longitude,
            report.weatherInfo, report.syncStatus, report.createdAt, report.updatedAt
          );
          await this.reportRepository.update(reportToSync);
        }

        const model = ReportMapper.toFirestore(reportToSync);
        await this.firestoreDatasource.save(model);
        await this.reportRepository.updateSyncStatus(report.id, SyncStatus.SYNCED);
        this.lastStatusUpdate.set({ id: report.id, status: SyncStatus.SYNCED });
      } catch (error) {
        await this.reportRepository.updateSyncStatus(report.id, SyncStatus.ERROR);
        this.lastStatusUpdate.set({ id: report.id, status: SyncStatus.ERROR });
      }
    }

    const pendingDeletions = await this.reportRepository.getPendingDeletions();
    for (const report of pendingDeletions) {
      try {
        await this.firestoreDatasource.delete(report.id);
      } catch (error) {
        console.error('Error eliminando de Firestore', error);
      } finally {
        await this.reportRepository.delete(report.id);
      }
    }
  }

  async deleteReport(id: string, syncStatus: SyncStatus): Promise<void> {
    if (this.networkService.online() && syncStatus === SyncStatus.SYNCED) {
      await this.firestoreDatasource.delete(id);
      await this.reportRepository.delete(id);
    } else if (syncStatus === SyncStatus.PENDING) {
      await this.reportRepository.delete(id);
    } else {
      await this.reportRepository.updateSyncStatus(id, SyncStatus.DELETED);
    }
  }

  async downloadRemoteReports(userId: string): Promise<void> {
    if (!this.networkService.online()) return;

    const remoteModels = await this.firestoreDatasource.getAll(userId);
    const localReports = await this.reportRepository.getAll(userId);
    const localMap = new Map(localReports.map(r => [r.id, r]));

    for (const remoteModel of remoteModels) {
      const remoteReport = ReportMapper.fromFirestore(remoteModel);
      const localReport = localMap.get(remoteReport.id);

      if (!localReport) {
        await this.reportRepository.create(remoteReport);
      } else if (localReport.syncStatus === SyncStatus.DELETED) {
        continue;
      } else if (remoteReport.updatedAt > localReport.updatedAt) {
        await this.reportRepository.update(remoteReport);
      }
    }
  }

}
