import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateFlashcardDialogComponent } from './update-flashcard-dialog.component';

describe('UpdateFlashcardDialogComponent', () => {
  let component: UpdateFlashcardDialogComponent;
  let fixture: ComponentFixture<UpdateFlashcardDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateFlashcardDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateFlashcardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
