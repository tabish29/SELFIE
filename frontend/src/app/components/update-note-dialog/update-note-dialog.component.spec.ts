import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateNoteDialogComponent } from './update-note-dialog.component';

describe('UpdateNoteDialogComponent', () => {
  let component: UpdateNoteDialogComponent;
  let fixture: ComponentFixture<UpdateNoteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateNoteDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateNoteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
