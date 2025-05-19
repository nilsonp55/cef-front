import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ClientesCorporativosComponent } from './clientes-corporativos.component';
import { ClientesCorporativosService } from 'src/app/_service/administracion-service/clientes-corporativos.service';
import { GeneralesService } from 'src/app/_service/generales.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { of, throwError } from 'rxjs';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { FormClientesCorpComponent } from './form-clientes-corp/form-clientes-corp.component';
import { MatTableExporterModule } from 'mat-table-exporter';

describe('ClientesCorporativosComponent', () => {
  let component: ClientesCorporativosComponent;
  let fixture: ComponentFixture<ClientesCorporativosComponent>;
  let clientesCorporativosService: jasmine.SpyObj<ClientesCorporativosService>;
  let generalesService: jasmine.SpyObj<GeneralesService>;
  let dialog: jasmine.SpyObj<MatDialog>;

  const mockBancos = [{ codigoPunto: '1', nombreBanco: 'Banco 1' }, { codigoPunto: '2', nombreBanco: 'Banco 2' }];
  const mockClientes = { data: { content: [{ codigoCliente: 1, codigoBancoAval: '1', nombreCliente: 'Cliente 1', tipoId: 'CC', identificacion: '123', tarifaSeparacion: 100, amparado: true }], totalElements: 1 } };

  beforeEach(() => {
    const clientesCorporativosServiceSpy = jasmine.createSpyObj('ClientesCorporativosService', ['listarClientesCorporativos', 'obtenerClienteCorporativo', 'eliminarClientesCorporativos']);
    const generalesServiceSpy = jasmine.createSpyObj('GeneralesService', ['listarBancosAval']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    TestBed.configureTestingModule({
      declarations: [ClientesCorporativosComponent],
      imports: [
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        BrowserAnimationsModule,
        MatProgressSpinnerModule,
        MatIconModule,
        MatButtonModule,
        MatDialogModule,
        MatTableExporterModule
      ],
      providers: [
        { provide: ClientesCorporativosService, useValue: clientesCorporativosServiceSpy },
        { provide: GeneralesService, useValue: generalesServiceSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    clientesCorporativosService = TestBed.inject(ClientesCorporativosService) as jasmine.SpyObj<ClientesCorporativosService>;
    generalesService = TestBed.inject(GeneralesService) as jasmine.SpyObj<GeneralesService>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;

    clientesCorporativosService.listarClientesCorporativos.and.returnValue(of(mockClientes));
    generalesService.listarBancosAval.and.returnValue(of({ data: mockBancos }));

    fixture = TestBed.createComponent(ClientesCorporativosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should load bancos and clientes on init', () => {
    expect(generalesService.listarBancosAval).toHaveBeenCalled();
    expect(clientesCorporativosService.listarClientesCorporativos).toHaveBeenCalled();
    expect(component.bancos).toEqual(mockBancos);
    expect(component.dsClientesCorporativos.data).toEqual(mockClientes.data.content);
    expect(component.totalRegistros).toEqual(mockClientes.data.totalElements);
  });

  xit('getNombreBanco should return the correct bank name', () => {
    const banco = component.getNombreBanco('1');
    expect(banco).toEqual('Banco 1');
  });

  xit('selectBanco should filter clientes by banco', () => {
    const event = { value: { codigoPunto: '2' } };
    component.selectBanco(event);
    expect(component.pCodigoBanco).toEqual('2');
    expect(clientesCorporativosService.listarClientesCorporativos).toHaveBeenCalledWith({
      page: 0,
      size: 10,
      codigoBancoAval: '2',
      busqueda: ''
    });
  });

  xit('busquedaClientes should filter clientes by search term', () => {
    const event = { value: 'Cliente 1', pageIndex: 0, pageSize: 10 };
    component.busquedaClientes(event);
    expect(component.pBusqueda).toEqual('Cliente 1');
    expect(clientesCorporativosService.listarClientesCorporativos).toHaveBeenCalledWith({
      page: 0,
      size: 10,
      codigoBancoAval: '',
      busqueda: 'Cliente 1'
    });
  });

  xit('mostrarMas should update pagination parameters and list clientes', () => {
    const event = { pageIndex: 1, pageSize: 25 };
    component.mostrarMas(event);
    expect(component.pIndex).toEqual(1);
    expect(component.pSize).toEqual(25);
    expect(clientesCorporativosService.listarClientesCorporativos).toHaveBeenCalledWith({
      page: 1,
      size: 25,
      codigoBancoAval: '',
      busqueda: ''
    });
  });

  xit('openFormClienteCorporativo should open the dialog in create mode', () => {
    component.openFormClienteCorporativo(null, 'create');
    expect(dialog.open).toHaveBeenCalledWith(FormClientesCorpComponent, {
      width: '70%',
      height: '90%',
      data: { flag: 'create', row: null, bancos: mockBancos }
    });
  });

  xit('openFormClienteCorporativo should open the dialog in edit mode and fetch cliente data', () => {
    const mockCliente = { codigoCliente: 1, codigoBancoAval: '1', nombreCliente: 'Cliente 1', tipoId: 'CC', identificacion: '123', tarifaSeparacion: 100, amparado: true };
    clientesCorporativosService.obtenerClienteCorporativo.and.returnValue(of({ data: mockCliente }));
    component.openFormClienteCorporativo(mockCliente, 'edit');
    expect(clientesCorporativosService.obtenerClienteCorporativo).toHaveBeenCalledWith(mockCliente.codigoCliente);
    expect(dialog.open).toHaveBeenCalledWith(FormClientesCorpComponent, {
      width: '70%',
      height: '90%',
      data: { flag: 'edit', row: mockCliente, bancos: mockBancos }
    });
  });

  xit('confirmEliminarClienteCorporativo should open the confirmation dialog and call eliminarClienteCorporativo if confirmed', () => {
    dialog.open.and.returnValue({ afterClosed: () => of(true) } as any);
    component.confirmEliminarClienteCorporativo({ codigoCliente: 1 });
    expect(dialog.open).toHaveBeenCalledWith(VentanaEmergenteResponseComponent, {
      width: '50%',
      data: {
        msn: '¿Está seguro que desea eliminar el registro?',
        codigo: 'warning',
        showActions: true
      }
    });
  });

  xit('eliminarClienteCorporativo should delete the cliente and refresh the list', () => {
    clientesCorporativosService.eliminarClientesCorporativos.and.returnValue(of({}));
    dialog.open.and.returnValue({ afterClosed: () => of(true) } as any);
    component.eliminarClienteCorporativo({ codigoCliente: 1 });
    expect(clientesCorporativosService.eliminarClientesCorporativos).toHaveBeenCalledWith(1);
    expect(clientesCorporativosService.listarClientesCorporativos).toHaveBeenCalled();
  });

  xit('should handle error when listing clientes', () => {
    clientesCorporativosService.listarClientesCorporativos.and.returnValue(throwError({ error: { mensaje: 'Error listing clientes' } }));
    component.listarClientesCorporativos();
    expect(dialog.open).toHaveBeenCalledWith(VentanaEmergenteResponseComponent, {
      width: '50%',
      data: {
        msn: 'Error al obtener la data del archivo - Error listing clientes',
        codigo: 'error'
      }
    });
  });

  xit('should handle error when deleting cliente', () => {
    clientesCorporativosService.eliminarClientesCorporativos.and.returnValue(throwError({ error: { mensaje: 'Error deleting cliente' } }));
    dialog.open.and.returnValue({ afterClosed: () => of(true) } as any);
    component.eliminarClienteCorporativo({ codigoCliente: 1 });
    expect(dialog.open).toHaveBeenCalledWith(VentanaEmergenteResponseComponent, {
      width: '50%',
      data: {
        msn: 'Error al eliminar el registro - Error deleting cliente',
        codigo: 'error'
      }
    });
  });

  xit('should handle error when obtaining cliente for edit', () => {
    const mockCliente = { codigoCliente: 1, codigoBancoAval: '1', nombreCliente: 'Cliente 1', tipoId: 'CC', identificacion: '123', tarifaSeparacion: 100, amparado: true };
    clientesCorporativosService.obtenerClienteCorporativo.and.returnValue(throwError({ error: { mensaje: 'Error obtaining cliente' } }));
    component.openFormClienteCorporativo(mockCliente, 'edit');
    expect(dialog.open).toHaveBeenCalledWith(VentanaEmergenteResponseComponent, {
      width: '50%',
      data: {
        msn: 'Error al obtener la data del archivo - Error obtaining cliente',
        codigo: 'error'
      }
    });
  });
});
