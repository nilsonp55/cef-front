import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DotsCodeForm } from './dots-code-form';

describe('DotsCodeForm', () => {
  let component: DotsCodeForm;
  let fixture: ComponentFixture<DotsCodeForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DotsCodeForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DotsCodeForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
