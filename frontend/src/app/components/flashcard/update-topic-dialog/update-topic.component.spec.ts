import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTopicDialogComponent } from './update-topic.component';

describe('UpdateTopicComponent', () => {
  let component: UpdateTopicDialogComponent;
  let fixture: ComponentFixture<UpdateTopicDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateTopicDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateTopicDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
