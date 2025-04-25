import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ErrorService } from 'src/app/_model/error.model';
import { ConfContablesEntidadesService } from 'src/app/_service/contabilidad-service/conf-contables-entidades.service';
import { GeneralesService } from 'src/app/_service/generales.service';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';

@Component({
  selector: 'app-administracion-conf-contable-entidad',
  templateUrl: './administracion-conf-contable-entidad.component.html',
  styleUrls: ['./administracion-conf-contable-entidad.component.css']
})
export class AdministracionConfContableEntidadComponent implements OnInit {

  form: FormGroup;
  dataSourceTiposCuentas: MatTableDataSource<any>
  displayedColumnsTiposCuentas: string[] = ['consecutivo', 'cuentaContable', 'esCambio', 'medioPago', 'naturaleza', 'tipoOperacion', 'bancoAval', 'codigoPuntoBancoExt', 'codigoTdv', 'tipoTransaccion', 'codigoComision', 'tipoImpuesto', 'acciones'];
  isDominioChecked = false;
  mostrarFormulario = false;
  esEdicion: boolean;
  idCuentaPuc: any;
  selectNaturaleza: any;
  selectEsCambio: any;
  idConfEntity: any;
  bancos: any[] = [];
  tiposCostosCuentas: any[] = [];
  tipoCuentas: any[] = [];
  tipoOperaciones: any[] = [];
  codigosComiciones: any[] = [];
  tiposImpuestos: any[] = [];
  mediosPago: any[] = [];
  bancosExternos: any [] = [];
  transportadoras: any [] = [];
  tipoTransaccion: any [] = [];
  filtroBancoSelect: any;
  //Registros paginados
  @ViewChild(MatSort) sort: MatSort;
  cantidadRegistros: number;
  registros: any[] =[];
  mostrarTabla: boolean = true;

  constructor(
    private readonly generalesService: GeneralesService,
    private readonly confContablesEntidadesService: ConfContablesEntidadesService,
    private readonly dialog: MatDialog
  ) { }

  async ngOnInit(): Promise<void> {
    ManejoFechaToken.manejoFechaToken()
    await this.iniciarDesplegables();
    this.listarConfEntitis();
    this.initForm();
  }

 /**
   * Inicializaion formulario de creacion y edicion
   * @BayronPerez
   */
  initForm(param?: any) {
    this.selectNaturaleza = param != undefined ? param.naturaleza: null;
    this.selectEsCambio = param != undefined ? String(param.esCambio): null;
      this.form = new FormGroup({
        'consecutivo': new FormControl({value: param? param.consecutivo : null, disabled: true}),
        'cuentaContable': new FormControl(param? param.cuentaContable : null, [Validators.required, Validators.pattern('^[0-9]+$')]),
        'esCambio': new FormControl(param? String(param.esCambio) : null),
        'medioPago': new FormControl(param? param.medioPago : null),
        'naturaleza': new FormControl(param? param.naturaleza : null, [Validators.required]),
        'tipoOperacion': new FormControl(param? String(param.tipoOperacion) : null),
        'bancoAval': new FormControl(param? this.selectBancoAval(param) : null, [Validators.required]),
        'bancoExterno': new FormControl(param? this.selectBancoExterno(param) : null),
        'transportadora': new FormControl(param? this.selectTransportadora(param) : null),
        'tipoTransaccion': new FormControl(param? this.tipoTransaccion.find((t) => t === String(param.tipoTransaccion)) : null, [Validators.required]),
        'codigoComision': new FormControl(param? this.codigosComiciones.find((c) => c === String(param.codigoComision)) : null),
        'tipoImpuesto': new FormControl(param? this.tiposImpuestos.find((i) => i === String(param.tipoImpuesto)) : null),
      });
  }

  selectBancoAval(param: any): any {
    for (let i = 0; i < this.bancos.length; i++) {
      const element = this.bancos[i];
      if(element.codigoPunto == param.bancoAval.codigoPunto) {
        return element;
      }
    }
  }

  selectBancoExterno(param: any): any {
    for (let i = 0; i < this.bancosExternos.length; i++) {
      const element = this.bancosExternos[i];
      if(param.codigoPuntoBancoExt != null){
        if(element.codigoPunto == param.codigoPuntoBancoExt.codigoPunto) {
          return element;
        }
      }
    }
  }

  selectTransportadora(param: any): any {
    for (let i = 0; i < this.transportadoras.length; i++) {
      const element = this.transportadoras[i];
      if(param.transportadora != null){
        if(element.codigo == param.transportadora.codigo) {
          return element;
        }
      }
    }
  }

  selectTipoCuentas(param: any): any {
    for (let i = 0; i < this.tipoCuentas.length; i++) {
      const element = this.tipoCuentas[i];
      if(element.tipoCuenta == param.tiposCuentas.tipoCuenta) {
        return element;
      }
    }
  }

  selectTiposCostosCuentas(param: any): any {
    for (let i = 0; i < this.tiposCostosCuentas.length; i++) {
      const element = this.tiposCostosCuentas[i];
      if(element.tipoCentro == param.tiposCentrosCostos.tipoCentro) {
        return element;
      }
    }
  }

  /**
   * Lista los Cuentas puc
   * @BayronPerez
   */
   listarConfEntitis(pagina = 0, tamanio = 5) {
    this.confContablesEntidadesService.obtenerConfContablesEntidades({
      page: pagina,
      size: tamanio,
    }).subscribe({ next: (page: any) => {
      this.registros = page.data;
      this.dataSourceTiposCuentas = new MatTableDataSource(page.data);
      this.dataSourceTiposCuentas.sort = this.sort;
      this.cantidadRegistros = page.data.totalElements;
      this.mostrarTabla = true;
      this.mostrarFormulario = false;
    },
    error: (err: ErrorService) => {
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_ADMIN_CUNTAS_PUC.ERROR_GET_TIPO_ADMIN_CUNTAS_PUC,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        });
      }
    });
  }

  /**
    * Se realiza persistencia del formulario de cuentas puc
    * @BayronPerez
    */
   persistir() {
    const confEntity = {
      consecutivo: this.form.value['consecutivo'],
      bancoAval: {
        codigoPunto: this.form.value['bancoAval'].codigoPunto
      },
      tipoTransaccion: Number(this.form.value['tipoTransaccion']),
      tipoOperacion: this.form.value['tipoOperacion'],
      codigoComision: Number(this.form.value['codigoComision']),
      tipoImpuesto: Number(this.form.value['tipoImpuesto']),
      medioPago: this.form.value['medioPago'],
      codigoPuntoBancoExt: {
        codigoPunto: this.form.value['bancoExterno'].codigoPunto
      },
      transportadora: {
        codigo: this.form.value['transportadora'].codigo
      },
      naturaleza: this.selectNaturaleza,
      cuentaContable: this.form.value['numeroCuenta'],
    };

    if (this.esEdicion) {
      confEntity.consecutivo = this.idConfEntity;
      this.confContablesEntidadesService.actualizarConfContablesEntidades(confEntity).subscribe(response => {
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_CREATE,
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
          }
        });
        this.listarConfEntitis()
        this.initForm();
      },
        (err: any) => {
          this.dialog.open(VentanaEmergenteResponseComponent, {
            width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
            data: {
              msn: err.error.response.description,
              codigo: GENERALES.CODE_EMERGENT.ERROR
            }
          });
        });
    } else {
      this.confContablesEntidadesService.guardarConfContablesEntidades(confEntity).subscribe({
        next: response => {
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_CREATE,
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
          }
        });
        this.listarConfEntitis()
        this.initForm();
      },
      error: (err: any) => {
          this.dialog.open(VentanaEmergenteResponseComponent, {
            width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
            data: {
              msn: err.error.response.description,
              codigo: GENERALES.CODE_EMERGENT.ERROR
            }
          });
        }
      });
    }
    this.ngOnInit();
   }

  async iniciarDesplegables() {

    const _bancos = await this.generalesService.listarBancosAval().toPromise();
    this.bancos = _bancos.data;

    const _tipoTransacciones = await this.generalesService.listarDominioByDominio({
      'dominio':"TIPO_TRANSACCION"
    }).toPromise();
    this.tipoTransaccion = _tipoTransacciones.data;

    const _tipoOperaciones = await this.generalesService.listarDominioByDominio({
      'dominio':"TIPO_OPERACION"
    }).toPromise();
    this.tipoOperaciones = _tipoOperaciones.data;

    const _comisiones = await this.generalesService.listarDominioByDominio({
      'dominio':"COMISION"
    }).toPromise();
    this.codigosComiciones = _comisiones.data;

    const _impuestos = await this.generalesService.listarDominioByDominio({
      'dominio':"IMPUESTOS"
    }).toPromise();
    this.tiposImpuestos = _impuestos.data;

    const _mediosPago = await this.generalesService.listarDominioByDominio({
      'dominio':"MEDIOS_PAGO"
    }).toPromise();
    this.mediosPago = _mediosPago.data;

    const _bancosTodos = await this.generalesService.listarBancos().toPromise();
    const _bancosExterno1: any[] = _bancosTodos.data;
    const _bancosExternos = _bancosExterno1.filter(item=>
      item.codigoPunto != 297 && item.codigoPunto != 298 && item.codigoPunto != 299 && item.codigoPunto != 300
    )
    this.bancosExternos = _bancosExternos;

    const _transportadoras = await this.generalesService.listarTransportadoras().toPromise();
    this.transportadoras = _transportadoras.data;

  }

  crearConfEntity() {
    this.mostrarTabla = false;
    this.mostrarFormulario = true;
    this.esEdicion = false;
    this.form.get('consecutivo').disable();
  }

  actualizarConfEntity() {
    this.mostrarFormulario = true;
  }

  editar(registro: any) {
    this.initForm(registro);
    this.mostrarFormulario = true;
    this.idConfEntity = this.form.get('consecutivo').value;
    this.form.get('consecutivo').disable();
    this.esEdicion = true;
  }

  filtrar(event) {
    let registrosFiltrados: any[] = [];
    this.registros.forEach(item => {
      if(item.bancoAval.abreviatura == this.filtroBancoSelect.abreviatura) {
        registrosFiltrados.push(item);
      }
    });
    this.dataSourceTiposCuentas = new MatTableDataSource(registrosFiltrados);
      this.dataSourceTiposCuentas.sort = this.sort;
      this.cantidadRegistros = registrosFiltrados.length;
  }

  limpiar() {
    this.filtroBancoSelect = null;
    this.listarConfEntitis();
  }

}
