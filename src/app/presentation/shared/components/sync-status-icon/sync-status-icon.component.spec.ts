import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SyncStatusIconComponent } from './sync-status-icon.component';

describe('SyncStatusIconComponent', () => {
  let component: SyncStatusIconComponent;
  let fixture: ComponentFixture<SyncStatusIconComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SyncStatusIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SyncStatusIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
