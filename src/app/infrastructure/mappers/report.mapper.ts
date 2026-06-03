import { Report, SyncStatus } from 'src/app/domain/entities/entities';
import { ReportSqliteModel, ReportFirestoreModel } from '../models/models';

export class ReportMapper {
  static fromSqlite(reportSqlitemodel: ReportSqliteModel): Report {
    return new Report(
      reportSqlitemodel.id,
      reportSqlitemodel.userId,
      reportSqlitemodel.title,
      reportSqlitemodel.description,
      reportSqlitemodel.photoUrl,
      reportSqlitemodel.latitude,
      reportSqlitemodel.longitude,
      reportSqlitemodel.weatherInfo,
      reportSqlitemodel.syncStatus as SyncStatus,
      new Date(reportSqlitemodel.createdAt),
      new Date(reportSqlitemodel.updatedAt),
    );
  }

  static toSqlite(report: Report): ReportSqliteModel {
    return {
      id: report.id,
      userId: report.userId,
      title: report.title,
      description: report.description,
      photoUrl: report.photoUrl,
      latitude: report.latitude,
      longitude: report.longitude,
      weatherInfo: report.weatherInfo,
      syncStatus: report.syncStatus,
      createdAt: report.createdAt.getTime(),
      updatedAt: report.updatedAt.getTime(),
    };
  }

  static fromFirestore(reportFirestoreModel: ReportFirestoreModel): Report {
    return new Report(
      reportFirestoreModel.id,
      reportFirestoreModel.userId,
      reportFirestoreModel.title,
      reportFirestoreModel.description,
      reportFirestoreModel.photoUrl,
      reportFirestoreModel.latitude,
      reportFirestoreModel.longitude,
      reportFirestoreModel.weatherInfo,
      reportFirestoreModel.syncStatus as SyncStatus,
      new Date(reportFirestoreModel.createdAt),
      new Date(reportFirestoreModel.updatedAt),
    );
  }

  static toFirestore(report: Report): ReportFirestoreModel {
    return {
      id: report.id,
      userId: report.userId,
      title: report.title,
      description: report.description,
      photoUrl: report.photoUrl,
      latitude: report.latitude,
      longitude: report.longitude,
      weatherInfo: report.weatherInfo,
      syncStatus: report.syncStatus,
      createdAt: report.createdAt.getTime(),
      updatedAt: report.updatedAt.getTime(),
    };
  }
}
