import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';
import { GestionPuntosService } from 'src/app/_service/administracion-service/gestionPuntos.service';
import { GeneralesService }  from 'src/app/_service/generales.service';
import { lastValueFrom, Observable, of } from 'rxjs';
import { startWith, map, catchError, debounceTime, distinctUntilChanged, switchMap, finalize } from 'rxjs/operators';
import { ClientesCorporativosService } from 'src/app/_service/administracion-service/clientes-corporativos.service';

@Component({
  selector: 'app-crear-punto',
  templateUrl: './crear-punto.component.html',
  styleUrls: ['./crear-punto.component.css'],
})
export class CrearPuntoComponent implements OnInit {
  spinnerActive: boolean = false;
  ciudadControl = new FormControl();
  ciudadesFiltradas: Observable<any[]>;
  clientesControl = new FormControl();
  clientesFiltrados: Observable<any[]>;
  form: FormGroup = new FormGroup({
    'tipoPunto': new FormControl(),
    'nombrePunto': new FormControl(),
    'ciudad': this.ciudadControl,
    'cliente': this.clientesControl,
    'transportadora': new FormControl(),
    'codigoOficina': new FormControl(),
    'bancoAval': new FormControl(),
    'tarifaRuteo': new FormControl(),
    'tarifaVerificacion': new FormControl(),
    'codigoCompensacion': new FormControl(),
    'codigoCajero': new FormControl(),
    'identificadorCliente': new FormControl(),
    'identificacion': new FormControl(),
    'abreviatura': new FormControl(),
    'fajado': new FormControl(),
    'refajillado': new FormControl(),
    'esAval': new FormControl(),
    'estado': new FormControl(),
  });
  estado: string;
  ciudades: any[] = [];
  clientes: any[] = [];
  titulo: string;
  dataElement: any = null;
  isDisable: boolean;
  puntoSeleccionado: string = '';
  listPuntosSelect: any;
  bancosAval: any[] = [];
  tdvs: any[] = []; 

  constructor(
    private readonly dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CrearPuntoComponent>,
    private readonly generalServices: GeneralesService,
    private readonly gestionPuntosService: GestionPuntosService,
    private readonly clientesService: ClientesCorporativosService
  ) {}

  async ngOnInit(): Promise<void> {
    this.spinnerActive = true;
    ManejoFechaToken.manejoFechaToken();
    await this.datosDesplegables();
    this.dataElement = this.data.element;
    this.listPuntosSelect = this.data.listPuntos;

    if (this.data.flag == "crear") {
      this.titulo = "Crear "
    }

    if (this.data.flag == "modif") {
      this.titulo = "Modificación de "
    }
    this.initForm(this.dataElement);
    this.spinnerActive = false;

    this.ciudadesFiltradas = this.ciudadControl.valueChanges.pipe(
      startWith(''),
      map(v => (typeof v === 'string' ? v : v.nombreCiudad)),
      map(n => (n ? this._filterCiudad(n) : this.ciudades.slice()))
    );

    this.clientesFiltrados = this.clientesControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => {
        const searchTerm = typeof value === 'string' ? value : value?.identificacion;
        return searchTerm ? this._filterCliente(searchTerm) : of([])
      })
    );
  }

  async initForm(param?: any) {
    let valCodigoOficina: any;
    let valTarifaRuteo: any;
    let valTarifaVerificacion: any;
    let valBancoAval: any;
    let valFajado: any;

    this.puntoSeleccionado = param ? param?.tipoPunto : null;

    if (param?.tipoPunto === 'CLIENTE') {
      valBancoAval = param?.sitiosClientes?.codigoCliente?.codigoBancoAval;
      valFajado = param?.sitiosClientes?.fajado;
    }

    if(param?.tipoPunto === 'OFICINA') {
      valCodigoOficina = param.oficinas?.codigoOficina;
      valBancoAval = param.oficinas?.bancoAVAL;
      valTarifaRuteo = param.oficinas?.tarifaRuteo;
      valTarifaVerificacion = param.oficinas?.tarifaVerificacion;
      valFajado = param.oficinas?.fajado;
    }

    if(param?.tipoPunto === 'FONDO') {
      valBancoAval = param?.fondos?.bancoAVAL;
    }

    if(param?.tipoPunto === 'CAJERO') {
      valBancoAval = param?.cajeroATM?.bancoAval;
      valTarifaRuteo = param.cajeroATM?.tarifaRuteo;
      valTarifaVerificacion = param.cajeroATM?.tarifaVerificacion;
    }

    this.ciudadControl = new FormControl(param ? this.ciudades.find(value => value.codigoDANE === param.codigoCiudad) : null);
    this.clientesControl = new FormControl(param?.sitiosClientes?.codigoCliente, [Validators.required]);
    this.form = new FormGroup({
      'tipoPunto': new FormControl({value: param ? param?.tipoPunto : null, disabled: param}, [Validators.required]),
      'nombrePunto': new FormControl(param != null ? param.nombrePunto : null, [Validators.required]),
      'ciudad': this.ciudadControl,
      'cliente': this.clientesControl,
      'identificadorCliente': new FormControl(param ? param.sitiosClientes?.identificadorCliente : null, Validators.maxLength(50)),
      'transportadora': new FormControl(param ? this.tdvs.find(value => value.codigo === param?.fondos?.tdv) : null, [Validators.required]),
      'codigoOficina': new FormControl(param ? valCodigoOficina : null, [Validators.required]),
      'bancoAval': new FormControl(param ? this.bancosAval.find(value => value.codigoPunto === valBancoAval) : null, [Validators.required]),
      'tarifaRuteo': new FormControl(param ? valTarifaRuteo : 0),
      'tarifaVerificacion': new FormControl(param ? valTarifaVerificacion : 0),
      'codigoCompensacion': new FormControl(param ? param.bancos?.codigoCompensacion : null),
      'codigoCajero': new FormControl(param ? param.cajeroATM?.codigoATM : null, [Validators.required]),
      'identificacion': new FormControl(param ? param.bancos?.numeroNit : null),
      'abreviatura': new FormControl(param ? param.bancos?.abreviatura : null),
      'fajado': new FormControl(param ? valFajado : null),
      'refajillado': new FormControl(param ? param.refajillado : null),
      'esAval': new FormControl(param ? param.esAVAL : null),
      'estado': new FormControl(param? param.estado === "1" : true),
    });

    if (param) {
      this.changeTipoPunto({value: param?.tipoPunto});
    }
  }

  persistir() {
    this.spinnerActive = true;
    let cliente = {
      codigoPunto: this.dataElement?.codigoPunto,
      tipoPunto: this.puntoSeleccionado,
      nombrePunto: this.form.value['nombrePunto'],
      codigoDANE: this.form.value['ciudad']?.codigoDANE,
      nombreCiudad: this.form.value['ciudad']?.nombreCiudad,
      codigoCliente: Number(this.form.value['cliente']?.codigoCliente),
      identificadorCliente: this.form.value['identificadorCliente'],
      codigoTDV: this.form.value['transportadora']?.codigo,
      codigoPropioTDV: this.form.value['transportadora']?.codigo,
      codigoOficina: Number(this.form.value['codigoOficina']),
      codigoATM: this.form.value['codigoCajero'],
      bancoAVAL: this.form.value['bancoAval']?.codigoPunto,
      tarifaRuteo: this.form.value['tarifaRuteo'],
      tarifaVerificacion: this.form.value['tarifaVerificacion'],
      codigoCompensacion: this.form.value['codigoCompensacion'],
      numeroNit: this.form.value['identificacion'],
      abreviatura: this.form.value['abreviatura'],
      estado: Number(this.form.value['estado'] ? 1 : 0),
      fajado: (this.form.value['fajado']),
      refagillado: (this.form.value['refajillado']),
      esAVAL: this.form.value['bancoAval']?.esAVAL,
    };
    let messagePersistirSuccesful = GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_CREATE;
    let messagePersistirError = GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_CREATE;

    if(this.data.flag === "modif") {
      messagePersistirSuccesful = GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_UPDATE;
      messagePersistirError = GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_UPDATE;
    }

    const serviceCall = this.data.flag === "modif" 
      ? this.gestionPuntosService.actualizarPunto(cliente) 
      : this.gestionPuntosService.crearPunto(cliente);

    serviceCall.subscribe({
      next: (page) => {
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: messagePersistirSuccesful,
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL,
            showResume: true,
            msgDetalles: JSON.stringify(page.response)
          },
        })
        .afterClosed()
        .subscribe((result) => {
          this.dialogRef.close();
        });
      },
      error: (err: any) => {
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: messagePersistirError,
            codigo: GENERALES.CODE_EMERGENT.ERROR,
            showResume: true,
            msgDetalles: JSON.stringify(err.error)
          },
        });
        this.spinnerActive = false;
      }
    });
  }

  async datosDesplegables() {
    await lastValueFrom(this.generalServices.listarCiudades()).then(
      (response) => {
        this.ciudades = response.data;
      }
    );

    await lastValueFrom(this.generalServices.listarBancosAval()).then(
      (response) => {
        this.bancosAval = response.data;
      }
    );

    await lastValueFrom(this.generalServices.listarTransportadoras()).then(
      (response) => {
        this.tdvs = response.data;
      }
    );
  }

  changeTipoPunto(element: any) {
    this.puntoSeleccionado = element.value;

    const controlesConfig: { [key: string]: { required: string[], noRequired: string[] } } = {
      'CLIENTE': {
        required: ['cliente'],
        noRequired: ['codigoOficina', 'transportadora', 'codigoCajero']
      },
      'FONDO': {
        required: ['transportadora'],
        noRequired: ['codigoOficina', 'codigoCajero', 'cliente', 'identificadorCliente']
      },
      'BAN_REP': {
        required: [],
        noRequired: ['codigoOficina', 'transportadora', 'codigoCajero', 'cliente', 'identificadorCliente', 'bancoAval']
      },
      'OFICINA': {
        required: ['codigoOficina'],
        noRequired: ['codigoCajero', 'transportadora', 'cliente', 'identificadorCliente']
      },
      'CAJERO': {
        required: ['codigoCajero'],
        noRequired: ['codigoOficina', 'transportadora', 'cliente', 'identificadorCliente']
      },
      'BANCO': {
        required: [],
        noRequired: ['codigoOficina', 'transportadora', 'codigoCajero', 'cliente', 'bancoAval', 'identificadorCliente']
      }
    };

    const config = controlesConfig[this.puntoSeleccionado] || { required: [], noRequired: [] };

    // Remover validadores de controles no requeridos
    config.noRequired.forEach(controlName => {
        this.form.get(controlName)?.removeValidators(Validators.required);
        this.form.get(controlName)?.updateValueAndValidity();
    });

    // Agregar validadores a controles requeridos
    config.required.forEach(controlName => {
        this.form.get(controlName)?.addValidators(Validators.required);
        this.form.get(controlName)?.updateValueAndValidity();
    });

    if (['BAN_REP', 'BANCO'].includes(this.puntoSeleccionado)) {
        this.form.get('bancoAval')?.removeValidators(Validators.required);
        this.form.get('bancoAval')?.updateValueAndValidity();
    }

  }
  
  /**
   * Realiza la peticion al servicio de Clientes Corporativos con 
   * parametros para filtrar resultados
   * @param params 
   * @author prv_nparra
   */
  async getClientes(params: any) {

    await lastValueFrom(this.clientesService.listarClientesCorporativos(params)).then(
      (response) => {
        this.clientes = response.data.content;
      }
    );

  }

  /**
   * Evento lanzado por cambio en valor de combo de Bancos y Transportadoras
   * @param element 
   * @author prv_nparra
   */
  changeBancoTrans(element: any) {
    
    if(this.puntoSeleccionado === "FONDO") {
      this.concatenarNombrePuntoFondo();
    }

    if(this.puntoSeleccionado == "CLIENTE") {
      this.form.get('cliente').setValue('');
    }
  }

  /**
   * @author prv_nparra
   */
  private _filterCiudad(name: string): any[] {
    return this.ciudades.filter(c => c.nombreCiudad.toLowerCase().includes(name.toLowerCase()));
  }

  /**
   * @author prv_nparra
   */
  displayCiudad(c: any): string {
    return c?.nombreCiudad ? c.nombreCiudad : '';
  }

  /**
   * @author prv_nparra
   */
  private _filterCliente(value: string): Observable<any[]> {
    
    if (value.length < 1) return of([]);

    this.spinnerActive = true;
    const param = {
      busqueda: value,
      codigoBancoAval: this.form.get('bancoAval').value.codigoPunto,
      size: 100,
      page: 0
    };

    return this.clientesService.listarClientesCorporativos(param).pipe(
      map(response => response.data.content),
      catchError(error => {
        console.error('Error filtrando clientes: ', error);
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_DATA_FILE,
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL,
            showResume: true,
            msgDetalles: JSON.stringify(error)
          },
        });
        return of([]);
      }),
      finalize(() => this.spinnerActive = false)
    );
  }

  /**
   * @author prv_nparra
   */
  displayCliente(c: any): string {
    return c?.identificacion ? c.identificacion + ' - ' + c.nombreCliente : '';
  }

  /**
   * Para tipo fondo se concatena la abreviatura de banco, nombre ciudad y codigo transportadora
   * @param field 
   * @author prv_nparra
   */
  concatenarNombrePuntoFondo() {

    const bancoAbreviatura = this.form.controls['bancoAval'].value?.abreviatura ?? '';
    const nombreCiudad = this.form.controls['ciudad'].value?.nombreCiudad ?? ''; 
    const codigoTdv = this.form.controls['transportadora'].value?.codigo ?? '';

    this.form.controls['nombrePunto'].setValue(bancoAbreviatura + '-' + nombreCiudad + '-' + codigoTdv);
  }

  changeCiudad(value: any) {
    if(this.puntoSeleccionado === "FONDO") {
      this.concatenarNombrePuntoFondo();
    }

    if(this.puntoSeleccionado === "BAN_REP") {
      this.concatenarNombreBanrep();
    }
  }

  concatenarNombreBanrep() {
    const nombreCiudad = this.form.controls['ciudad'].value?.nombreCiudad ?? ''; 
    this.form.controls['nombrePunto'].setValue(GENERALES.NOMBRE_TIPO_BANREP + nombreCiudad);
  }
}
