import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewActivityDialogComponent } from './new-activity-dialog.component';

describe('NewActivityDialogComponent', () => {
  let component: NewActivityDialogComponent;
  let fixture: ComponentFixture<NewActivityDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewActivityDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewActivityDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
