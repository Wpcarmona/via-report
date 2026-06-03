import { inject, Injectable } from '@angular/core';
import { ReportRepository } from '../../domain/repositories/report.repository';
import { FirestoreDatasource } from '../../infrastructure/datasources/remote/firestore.datasource';
import { NetworkService } from './network';
import { SyncStatus } from 'src/app/domain/entities/sync-status.enum';
import { ReportMapper } from '../../infrastructure/mappers/report.mapper';

@Injectable({
  providedIn: 'root',
})
export class SyncService {
  private networkService = inject(NetworkService);
  private reportRepository = inject(ReportRepository);
  private firestoreDatasource = inject(FirestoreDatasource);

  async syncPendingReports(): Promise<void> {
    if (!this.networkService.online()) return;
    const pendingReports = await this.reportRepository.getPendingReports();
    for (const report of pendingReports) {
      await this.reportRepository.updateSyncStatus(
        report.id,
        SyncStatus.SYNCING,
      );
      const mapperToModel = ReportMapper.toFirestore(report);
      try {
        await this.firestoreDatasource.save(mapperToModel);
        await this.reportRepository.updateSyncStatus(report.id, SyncStatus.SYNCED);
      } catch (error) {
        await this.reportRepository.updateSyncStatus(report.id, SyncStatus.ERROR);
      }
    }
  }
}
