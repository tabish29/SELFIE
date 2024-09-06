import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttivitaImminenteComponent } from './attivita-imminente.component';

describe('AttivitaImminenteComponent', () => {
  let component: AttivitaImminenteComponent;
  let fixture: ComponentFixture<AttivitaImminenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AttivitaImminenteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttivitaImminenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
