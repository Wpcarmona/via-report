import { inject, Injectable } from '@angular/core';
import { Report } from 'src/app/domain/entities/report.entity';
import { SyncStatus } from 'src/app/domain/entities/sync-status.enum';
import { ReportRepository } from 'src/app/domain/repositories/report.repository';
import { SqliteDatasource } from '../datasources/local/sqlite.datasource';
import { ReportMapper } from '../mappers/report.mapper';

@Injectable({
  providedIn: 'root',
})
export class ReportRepositoryImpl extends ReportRepository {
  private sqlite = inject(SqliteDatasource);

  override async getAll(userId: string): Promise<Report[]> {
    const reports = await this.sqlite.getAll(userId);
    return reports.map((report) => ReportMapper.fromSqlite(report));
  }
  override async getById(id: string): Promise<Report | null> {
    const report = await this.sqlite.getById(id);
    return report ? ReportMapper.fromSqlite(report) : null;
  }
  override create(report: Report): Promise<void> {
    const reportSqliteModel = ReportMapper.toSqlite(report);
    return this.sqlite.create(reportSqliteModel);
  }
  override update(report: Report): Promise<void> {
    const reportSqliteModel = ReportMapper.toSqlite(report);
    return this.sqlite.update(reportSqliteModel);
  }
  override delete(id: string): Promise<void> {
    return this.sqlite.delete(id);
  }
  override async getPendingReports(): Promise<Report[]> {
    const pendingsReports = await this.sqlite.getPendingReports();
    return pendingsReports.map((report) => ReportMapper.fromSqlite(report));
  }
  override async updateSyncStatus(
    id: string,
    syncStatus: SyncStatus,
  ): Promise<void> {
    return this.sqlite.updateSyncStatus(id, syncStatus);
  }
}
