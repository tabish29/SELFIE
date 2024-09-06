import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UltimaNotaComponent } from './ultima-nota.component';

describe('UltimaNotaComponent', () => {
  let component: UltimaNotaComponent;
  let fixture: ComponentFixture<UltimaNotaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UltimaNotaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UltimaNotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
