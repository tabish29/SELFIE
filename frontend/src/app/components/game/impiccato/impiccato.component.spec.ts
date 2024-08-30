import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpiccatoComponent } from './impiccato.component';

describe('ImpiccatoComponent', () => {
  let component: ImpiccatoComponent;
  let fixture: ComponentFixture<ImpiccatoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImpiccatoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImpiccatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
