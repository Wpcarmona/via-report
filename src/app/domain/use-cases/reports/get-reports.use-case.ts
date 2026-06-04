import { inject, Injectable } from '@angular/core';
import { ReportRepository } from '../../repositories/report.repository';
import { Report } from '../../entities/entities';

@Injectable({
  providedIn: 'root',
})
export class GetReportsUseCase {

  private reportRepository = inject(ReportRepository);

  async execute(userId: string): Promise<Report[]> {
    return this.reportRepository.getAll(userId);
  }
  
}
