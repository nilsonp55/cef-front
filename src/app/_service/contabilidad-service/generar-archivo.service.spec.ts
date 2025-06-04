import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { GenerarArchivoService } from './generar-archivo.service';
import { environment } from 'src/environments/environment';
import { URLs } from 'src/app/pages/shared/constantes';

describe('GenerarArchivoService', () => {
  let service: GenerarArchivoService;
  let httpMock: HttpTestingController;
  const url: string = `${environment.HOST}${URLs.STAGE}${URLs.GENERAR_ARCHIVO}${URLs.GENERAR}`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GenerarArchivoService]
    });
    service = TestBed.inject(GenerarArchivoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('generarArchivo debe realizar una solicitud GET y retornar un blob', () => {
    const mockParam = { fecha: '2024-01-01' };
    const mockBlob = new Blob(['test content'], { type: 'text/plain' });

    service.generarArchivo(mockParam).subscribe(response => {
      expect(response.body).toEqual(mockBlob);
      expect(response.status).toEqual(200);
      expect(response.headers.get('Content-Type')).toEqual('text/plain');
    });

    const req = httpMock.expectOne(`${url}?fecha=2024-01-01`);
    expect(req.request.method).toBe('GET');
    req.request.params.has('fecha');
    expect(req.request.responseType).toEqual('blob');
    req.flush(mockBlob, {
      status: 200,
      statusText: 'OK',
      headers: { 'Content-Type': 'text/plain' }
    });
  });

  it('generarArchivo debe manejar errores', () => {
    const mockParam = { fecha: '2024-01-01' };
    const status = 500;
    const statusText = 'Internal Server Error';
    const errorEvent = new ErrorEvent('Network error');

    service.generarArchivo(mockParam).subscribe(
      () => {
        fail('La solicitud debería haber fallado');
      },
      error => {
        expect(error.status).toEqual(status);
        expect(error.statusText).toEqual(statusText);
        expect(error.error).toEqual(errorEvent);
      }
    );

    const req = httpMock.expectOne(`${url}?fecha=2024-01-01`);
    expect(req.request.method).toBe('GET');
    req.error(errorEvent, { status: status, statusText: statusText });
  });
});
