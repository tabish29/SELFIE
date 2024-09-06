import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventiPreviewComponent } from './eventi-preview.component';

describe('EventiPreviewComponent', () => {
  let component: EventiPreviewComponent;
  let fixture: ComponentFixture<EventiPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventiPreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventiPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
