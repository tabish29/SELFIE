import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewNoteDialogComponent } from './new-note-dialog.component';

describe('NewNoteDialogComponent', () => {
  let component: NewNoteDialogComponent;
  let fixture: ComponentFixture<NewNoteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewNoteDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewNoteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
