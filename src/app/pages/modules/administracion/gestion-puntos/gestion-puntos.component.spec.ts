import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { GestionPuntosComponent } from './gestion-puntos.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { GeneralesService } from 'src/app/_service/generales.service';
import { DominioFuncionalService } from 'src/app/_service/administracion-service/dominio-funcional.service';
import { ClientesCorporativosService } from 'src/app/_service/administracion-service/clientes-corporativos.service';
import { GestionPuntosService } from 'src/app/_service/administracion-service/gestionPuntos.service';
import { of, throwError } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

describe('GestionPuntosComponent', () => {
  let component: GestionPuntosComponent;
  let fixture: ComponentFixture<GestionPuntosComponent>;

  // Mocks de servicios
  const mockGestionPuntosService = jasmine.createSpyObj('GestionPuntosService', ['listarPuntosCreados']);
  const mockGeneralesService = jasmine.createSpyObj('GeneralesService', ['listarCiudades', 'listarBancosAval']);
  const mockDominioService = jasmine.createSpyObj('DominioFuncionalService', ['listarTiposPuntos']);
  const mockClientesService = jasmine.createSpyObj('ClientesCorporativosService', ['listarClientesCorporativos']);
  const mockDialog = jasmine.createSpyObj('MatDialog', ['open']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionPuntosComponent ],
      imports: [
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        MatPaginatorModule,
        MatTableModule,
        BrowserAnimationsModule,
        FormsModule,
        MatTableExporterModule,
        MatProgressSpinnerModule
      ],
      providers: [
        { provide: GestionPuntosService, useValue: mockGestionPuntosService },
        { provide: GeneralesService, useValue: mockGeneralesService },
        { provide: DominioFuncionalService, useValue: mockDominioService },
        { provide: ClientesCorporativosService, useValue: mockClientesService },
        { provide: MatDialog, useValue: mockDialog }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GestionPuntosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('debería cargar datos iniciales en el ngOnInit', fakeAsync(() => {
    // Configurar mocks
    mockDominioService.listarTiposPuntos.and.returnValue(of({data: [{valorTexto: 'FONDO'}]}));
    mockGestionPuntosService.listarPuntosCreados.and.returnValue(of({data: {content: [], totalElements: 0}}));
    mockGeneralesService.listarCiudades.and.returnValue(of({data: []}));
    mockGeneralesService.listarBancosAval.and.returnValue(of({data: []}));
    mockClientesService.listarClientesCorporativos.and.returnValue(of({data: {content: []}}));

    fixture.detectChanges();
    tick();

    expect(component.listPuntosSelect.length).toBeGreaterThan(0);
    expect(mockGestionPuntosService.listarPuntosCreados).toHaveBeenCalled();
  }));

  

  it('debería filtrar por tipo de punto', () => {
    component.tipoPuntoSeleccionado = 'FONDO';
    component.listarPuntosSeleccionado();

    expect(mockGestionPuntosService.listarPuntosCreados)
      .toHaveBeenCalledWith(jasmine.objectContaining({tipoPunto: 'FONDO'}));
  });

  xit('debería abrir diálogo de creación', () => {
    component.abrirDialogPunto('crear', null);
    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('debería resolver correctamente el estado', () => {
    expect(component.resolverEstado('1')).toBe('Activo');
    expect(component.resolverEstado('0')).toBe('Inactivo');
  });
});
