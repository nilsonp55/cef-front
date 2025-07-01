import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionPuntosComponent } from './gestion-puntos.component';

describe('GestionPuntosComponent', () => {
  let component: GestionPuntosComponent;
  let fixture: ComponentFixture<GestionPuntosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionPuntosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionPuntosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
