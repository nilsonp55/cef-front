import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormClientesCorpComponent } from './form-clientes-corp.component';

describe('FormClientesCorpComponent', () => {
  let component: FormClientesCorpComponent;
  let fixture: ComponentFixture<FormClientesCorpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormClientesCorpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormClientesCorpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
