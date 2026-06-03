import { inject, Injectable } from '@angular/core';
import { ReportRepository } from '../repositories/report.repository';
import { Report } from '../entities/entities';

@Injectable({
  providedIn: 'root',
})
export class GetReportByIdUseCase {

  private reportRepository = inject(ReportRepository);

  async execute(id: string): Promise<Report | null> {
    return this.reportRepository.getById(id);
  }
  
}
