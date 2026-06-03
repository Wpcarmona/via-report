import { inject, Injectable } from '@angular/core';
import { ReportRepository } from '../repositories/report.repository';
import { Report } from '../entities/entities';

@Injectable({
  providedIn: 'root',
})
export class SyncReportsUseCase {

  private reportRepository = inject(ReportRepository);

    async execute(): Promise<void> {
     
    }

    async getPending(): Promise<Report[]> {
      return this.reportRepository.getPendingReports();
    }
  
}
