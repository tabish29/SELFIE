import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFlashCardComponent } from './view-flash-card.component';

describe('ViewFlashCardComponent', () => {
  let component: ViewFlashCardComponent;
  let fixture: ComponentFixture<ViewFlashCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewFlashCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewFlashCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
