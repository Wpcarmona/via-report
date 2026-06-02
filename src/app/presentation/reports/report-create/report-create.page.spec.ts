import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportCreatePage } from './report-create.page';

describe('ReportCreatePage', () => {
  let component: ReportCreatePage;
  let fixture: ComponentFixture<ReportCreatePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
