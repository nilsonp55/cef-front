import { TestBed } from '@angular/core/testing';

import { GenerarArchivoService } from './generar-archivo.service';

describe('GenerarArchivoService', () => {
  let service: GenerarArchivoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenerarArchivoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
