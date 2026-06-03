import { inject, Injectable } from '@angular/core';
import { ReportRepository } from '../repositories/report.repository';
import { Report } from '../entities/entities';

@Injectable({
  providedIn: 'root',
})
export class UpdateReportUseCase {

  private reportRepository = inject(ReportRepository);

  async execute(report: Report): Promise<void> {
    return this.reportRepository.update(report);
  }
  
}
