import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PomodoroReportComponent } from './pomodoro-report.component';

describe('PomodoroReportComponent', () => {
  let component: PomodoroReportComponent;
  let fixture: ComponentFixture<PomodoroReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PomodoroReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PomodoroReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
