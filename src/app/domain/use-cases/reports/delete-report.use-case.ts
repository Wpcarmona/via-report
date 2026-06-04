import { inject, Injectable } from '@angular/core';
import { ReportRepository } from '../../repositories/report.repository';

@Injectable({
  providedIn: 'root',
})
export class DeleteReportUseCase {

  private reportRepository = inject(ReportRepository);

  async execute(reportId: string): Promise<void> {
    return this.reportRepository.delete(reportId);
  }
  
}
