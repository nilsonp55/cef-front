import { TestBed } from '@angular/core/testing';

import { ClientesCorporativosService } from './clientes-corporativos.service';

describe('ClientesCorporativosService', () => {
  let service: ClientesCorporativosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientesCorporativosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
