import { SyncStatus, Report } from "../entities/entities";

export abstract class ReportRepository {
    abstract getAll(userId: string): Promise<Report[]>;
    abstract getById(id: string): Promise<Report | null>;
    abstract create(report: Report): Promise<void>;
    abstract update(report: Report): Promise<void>;
    abstract delete(id: string): Promise<void>;
    abstract getPendingReports(): Promise<Report[]>;
    abstract getPendingDeletions(): Promise<Report[]>;
    abstract updateSyncStatus(id: string, syncStatus: SyncStatus): Promise<void>;
}