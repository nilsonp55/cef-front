import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EjecutarProcedimientoComponent } from './ejecutar-procedimiento.component';

describe('EjecutarProcedimientoComponent', () => {
  let component: EjecutarProcedimientoComponent;
  let fixture: ComponentFixture<EjecutarProcedimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EjecutarProcedimientoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EjecutarProcedimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
