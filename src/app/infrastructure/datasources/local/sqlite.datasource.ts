import { Injectable } from '@angular/core';
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from '@capacitor-community/sqlite';
import { ReportSqliteModel } from '../../models/report-sqlite.model';

@Injectable({
  providedIn: 'root',
})
export class SqliteDatasource {
  private sqliteConnection = new SQLiteConnection(CapacitorSQLite);
  private db: SQLiteDBConnection | null = null;

  async initDB(): Promise<void> {
    const db = await this.sqliteConnection.createConnection(
      'via_report_db',
      false,
      'no-encryption',
      1,
      false,
    );
    await db.open();
    await db.execute(`CREATE TABLE IF NOT EXISTS reports (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      photoUrl TEXT,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      weatherInfo TEXT,
      syncStatus TEXT NOT NULL,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL
    )`);
    this.db = db;
  }

  private getDB(): SQLiteDBConnection {
    if (!this.db) throw new Error('Base de datos no inicializada');
    return this.db;
  }

  async getAll(userId: string): Promise<ReportSqliteModel[]> {
    const db = this.getDB();
    const result = await db.query('SELECT * FROM reports WHERE userId = ?', [
      userId,
    ]);
    return result.values ?? [];
  }

  async getById(id: string): Promise<ReportSqliteModel | null> {
    const db = this.getDB();
    const result = await db.query('SELECT * FROM reports WHERE id = ?', [id]);
    return result.values && result.values.length > 0 ? result.values[0] : null;
  }

  async create(report: ReportSqliteModel): Promise<void> {
    const db = this.getDB();
    await db.run(
      'INSERT INTO reports (id, userId, title, description, photoUrl, latitude, longitude, weatherInfo, syncStatus, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        report.id,
        report.userId,
        report.title,
        report.description,
        report.photoUrl,
        report.latitude,
        report.longitude,
        report.weatherInfo,
        report.syncStatus,
        report.createdAt,
        report.updatedAt,
      ],
    );
  }

  async update(report: ReportSqliteModel): Promise<void> {
    const db = this.getDB();
    await db.run(
      'UPDATE reports SET title = ?, description = ?, photoUrl = ?, latitude = ?, longitude = ?, weatherInfo = ?, syncStatus = ?, updatedAt = ? WHERE id = ?',
      [
        report.title,
        report.description,
        report.photoUrl,
        report.latitude,
        report.longitude,
        report.weatherInfo,
        report.syncStatus,
        report.updatedAt,
        report.id,
      ],
    );
  }

  async delete(id: string): Promise<void> {
    const db = this.getDB();
    await db.run('DELETE FROM reports WHERE id = ?', [id]);
  }

  async getPendingReports(): Promise<ReportSqliteModel[]> {
    const db = this.getDB();
    const result = await db.query(
      'SELECT * FROM reports WHERE syncStatus = ?',
      ['pending']
    );
    return result.values ?? [];
  }

  async getPendingDeletions(): Promise<ReportSqliteModel[]> {
    const db = this.getDB();
    const result = await db.query(
      'SELECT * FROM reports WHERE syncStatus = ?',
      ['deleted']
    );
    return result.values ?? [];
  }

  async updateSyncStatus(id: string, syncStatus: string): Promise<void> {
    const db = this.getDB();
    await db.run(
      'UPDATE reports SET syncStatus = ? WHERE id = ?',
      [syncStatus, id],
    );
  }
}
