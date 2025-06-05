import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ClientesCorporativosService } from './clientes-corporativos.service';
import { environment } from 'src/environments/environment';
import { URLs } from 'src/app/pages/shared/constantes';

describe('ClientesCorporativosService', () => {
  let service: ClientesCorporativosService;
  let httpMock: HttpTestingController;
  const url: string = `${environment.HOST}${URLs.STAGE}${URLs.CLIENTE}/`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ClientesCorporativosService]
    });
    service = TestBed.inject(ClientesCorporativosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no haya solicitudes pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('listarClientesCorporativos debe realizar una solicitud GET', () => {
    const mockResponse = [{ id: 1, nombre: 'Cliente 1' }, { id: 2, nombre: 'Cliente 2' }];

    service.listarClientesCorporativos().subscribe(clientes => {
      expect(clientes).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('obtenerClienteCorporativo debe realizar una solicitud GET con el código del cliente', () => {
    const codigoCliente = 123;
    const mockResponse = { id: codigoCliente, nombre: 'Cliente específico' };

    service.obtenerClienteCorporativo(codigoCliente).subscribe(cliente => {
      expect(cliente).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${url}${codigoCliente}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('guardarClientesCorporativos debe realizar una solicitud POST', () => {
    const mockCliente = { nombre: 'Nuevo Cliente' };
    const mockResponse = { id: 456, ...mockCliente };

    service.guardarClientesCorporativos(mockCliente).subscribe(cliente => {
      expect(cliente).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('actualizarClientesCorporativos debe realizar una solicitud PUT', async () => {
    const mockCliente = { id: 456, nombre: 'Cliente Actualizado' };
    const mockResponse = mockCliente;

    service.actualizarClientesCorporativos(mockCliente).subscribe(cliente => {
      expect(cliente).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);
  });

  it('eliminarClientesCorporativos debe realizar una solicitud DELETE con el código del cliente', () => {
    const codigoCliente = 789;
    const mockResponse = null;

    service.eliminarClientesCorporativos(codigoCliente).subscribe(() => {
      // No esperamos un valor de retorno, solo que la solicitud se complete
    });

    const req = httpMock.expectOne(`${url}${codigoCliente}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });
});
