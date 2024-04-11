import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientesCorporativosComponent } from './clientes-corporativos.component';

describe('ClientesCorporativosComponent', () => {
  let component: ClientesCorporativosComponent;
  let fixture: ComponentFixture<ClientesCorporativosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientesCorporativosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientesCorporativosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
