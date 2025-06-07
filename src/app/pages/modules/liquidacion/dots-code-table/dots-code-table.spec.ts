import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DotsCodeTable } from './dots-code-table';

describe('DotsCodeTable', () => {
  let component: DotsCodeTable;
  let fixture: ComponentFixture<DotsCodeTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DotsCodeTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DotsCodeTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
