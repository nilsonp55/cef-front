import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormClientesCorpComponent } from './form-clientes-corp.component';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ClientesCorporativosService } from 'src/app/_service/administracion-service/clientes-corporativos.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { By } from '@angular/platform-browser';

describe('FormClientesCorpComponent', () => {
  let component: FormClientesCorpComponent;
  let fixture: ComponentFixture<FormClientesCorpComponent>;
  let mockDialogRef: any;
  let mockClientesCorporativosService: any;
  let mockDialog: any;

  const mockData = {
    flag: 'create',
    row: null,
    bancos: [{ codigoPunto: '1', nombreBanco: 'Banco 1' }, { codigoPunto: '2', nombreBanco: 'Banco 2' }]
  };

  beforeEach(() => {
    mockDialogRef = {
      close: jasmine.createSpy()
    };

    mockClientesCorporativosService = {
      guardarClientesCorporativos: jasmine.createSpy().and.returnValue(of({ response: { description: 'Success' } })),
      actualizarClientesCorporativos: jasmine.createSpy().and.returnValue(Promise.resolve(of({ response: { description: 'Success' } })))
    };

    mockDialog = {
      open: jasmine.createSpy().and.returnValue({
        afterClosed: () => of(true)
      })
    };

    TestBed.configureTestingModule({
      declarations: [FormClientesCorpComponent],
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatCheckboxModule,
        BrowserAnimationsModule,
        MatProgressSpinnerModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockData },
        { provide: ClientesCorporativosService, useValue: mockClientesCorporativosService },
        { provide: MatDialog, useValue: mockDialog }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormClientesCorpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should initialize the form with data', () => {
    expect(component.form.get('codigoCliente')).toBeDefined();
    expect(component.form.get('codigoBancoAval')).toBeDefined();
    expect(component.form.get('nombreCliente')).toBeDefined();
    expect(component.form.get('tipoId')).toBeDefined();
    expect(component.form.get('identificacion')).toBeDefined();
    expect(component.form.get('tarifaSeparacion')).toBeDefined();
    expect(component.form.get('amparado')).toBeDefined();
  });

  xit('should mark all fields as touched when form is invalid and saveClienteCorporativo is called', () => {
    component.form.get('nombreCliente').setValue('');
    component.saveClienteCorporativo();
    expect(component.form.get('nombreCliente').touched).toBeTruthy();
  });

  xit('should call guardarClientesCorporativos when flag is "create" and form is valid', () => {
    component.form.setValue({
      codigoCliente: null,
      codigoBancoAval: { codigoPunto: '1' },
      nombreCliente: 'Test Cliente',
      tipoId: 'CC',
      identificacion: '123456789',
      tarifaSeparacion: 100,
      amparado: true
    });
    component.saveClienteCorporativo();
    expect(mockClientesCorporativosService.guardarClientesCorporativos).toHaveBeenCalled();
  });

  xit('should call actualizarClientesCorporativos when flag is "edit" and form is valid', fakeAsync(() => {
    component.data = { ...mockData, flag: 'edit', row: { codigoCliente: 1 } };
    component.ngOnInit();
    component.form.setValue({
      codigoCliente: 1,
      codigoBancoAval: { codigoPunto: '1' },
      nombreCliente: 'Test Cliente',
      tipoId: 'CC',
      identificacion: '123456789',
      tarifaSeparacion: 100,
      amparado: true
    });
    component.saveClienteCorporativo();
    tick();
    expect(mockClientesCorporativosService.actualizarClientesCorporativos).toHaveBeenCalled();
  }));

  xit('should open success dialog and close dialogRef after successful save', fakeAsync(() => {
    component.form.setValue({
      codigoCliente: null,
      codigoBancoAval: { codigoPunto: '1' },
      nombreCliente: 'Test Cliente',
      tipoId: 'CC',
      identificacion: '123456789',
      tarifaSeparacion: 100,
      amparado: true
    });
    component.saveClienteCorporativo();
    tick();
    expect(mockDialog.open).toHaveBeenCalledWith(VentanaEmergenteResponseComponent, {
      width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
      data: {
        msn:
          GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_CREATE +
          ' - ' +
          'Success',
        codigo: GENERALES.CODE_EMERGENT.SUCCESFULL,
      },
    });
    expect(mockDialogRef.close).toHaveBeenCalled();
  }));

  xit('should open error dialog when guardarClientesCorporativos fails', () => {
    mockClientesCorporativosService.guardarClientesCorporativos.and.returnValue(throwError({ mensaje: 'Error' }));
    component.form.setValue({
      codigoCliente: null,
      codigoBancoAval: { codigoPunto: '1' },
      nombreCliente: 'Test Cliente',
      tipoId: 'CC',
      identificacion: '123456789',
      tarifaSeparacion: 100,
      amparado: true
    });
    component.saveClienteCorporativo();
    expect(mockDialog.open).toHaveBeenCalledWith(VentanaEmergenteResponseComponent, {
      width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
      data: {
        msn:
          GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_CREATE +
          ' - ' +
          'Error',
        codigo: GENERALES.CODE_EMERGENT.ERROR,
      },
    });
  });

  xit('should open error dialog when actualizarClientesCorporativos fails', fakeAsync(() => {
    mockClientesCorporativosService.actualizarClientesCorporativos.and.returnValue(Promise.resolve(throwError({ mensaje: 'Error' })));
    component.data = { ...mockData, flag: 'edit', row: { codigoCliente: 1 } };
    component.ngOnInit();
    component.form.setValue({
      codigoCliente: 1,
      codigoBancoAval: { codigoPunto: '1' },
      nombreCliente: 'Test Cliente',
      tipoId: 'CC',
      identificacion: '123456789',
      tarifaSeparacion: 100,
      amparado: true
    });
    component.saveClienteCorporativo();
    tick();
    expect(mockDialog.open).toHaveBeenCalledWith(VentanaEmergenteResponseComponent, {
      width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
      data: {
        msn:
          GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_UPDATE +
          ' - ' +
          'Error',
        codigo: GENERALES.CODE_EMERGENT.ERROR,
      },
    });
  }));

  xit('should close the dialog when onCancel is called', () => {
    component.onCancel();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });
});
