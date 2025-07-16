import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { ErrorService } from 'src/app/_model/error.model';
import { TiposCuentasService } from 'src/app/_service/contabilidad-service/tipos-cuentas.service';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-administracion-contabilidad',
  templateUrl: './administracion-contabilidad.component.html',
  styleUrls: ['./administracion-contabilidad.component.css']
})

/**
 * Clase que administra la tabla tipo cuentas
 */
export class AdministracionContabilidadComponent implements OnInit {

  form: FormGroup;
  dataSourceTiposCuentas: MatTableDataSource<any>
  displayedColumnsTiposCuentas: string[] = ['tipoCuenta', 'cuentaAuxiliar', 'tipoId', 'identificador', 'descripcion', 'referencia1', 'referencia2', 'acciones'];
  isDominioChecked = false;
  mostrarFormulario = false;
  esEdicion: boolean;
  idTipoCuenta: any;

  //Registros paginados
  @ViewChild(MatSort) sort: MatSort;
  cantidadRegistros: number;

  constructor(
    private readonly tiposCuentasService: TiposCuentasService,
    private readonly dialog: MatDialog
  ) { }

  ngOnInit(): void {
    ManejoFechaToken.manejoFechaToken()
    this.listarDominios();
    this.initForm();
  }

  /**
    * Inicializaion formulario de creacion y edicion
    * @BayronPerez
    */
  initForm(param?: any) {
    this.form = new FormGroup({
      'tipoCuenta': new FormControl(param ? param.tipoCuenta : null,
        [Validators.required, Validators.minLength(3)]),
      'cuentaAuxiliar': new FormControl(param ? param.cuentaAuxiliar : null),
      'tipoId': new FormControl(param ? param.tipoId : null),
      'identificador': new FormControl(param ? param.identificador : null),
      'descripcion': new FormControl(param ? param.descripcion : null),
      'referencia1': new FormControl(param ? param.referencia1 : null),
      'referencia2': new FormControl(param ? param.referencia2 : null)
    });
  }

  /**
   * Lista los dominios
   * @BayronPerez
   */
  listarDominios(pagina = 0, tamanio = 5) {
    this.tiposCuentasService.obtenerTiposCuentas({
      page: pagina,
      size: tamanio,
    }).subscribe({next: (page: any) => {
      this.dataSourceTiposCuentas = new MatTableDataSource(page.data);
      this.dataSourceTiposCuentas.sort = this.sort;
      this.cantidadRegistros = page.data.totalElements;
    },
    error:  (err: ErrorService) => {
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_ADMIN_TIPO_CUNTAS.ERROR_GET_TIPO_ADMIN_CUNTAS,
            codigo: GENERALES.CODE_EMERGENT.ERROR,
            showResume: true,
            msgDetalles: JSON.stringify(err)
          }
        });
      }
    });
  }

  /**
    * Se realiza persistencia del formulario de tipos cuentas
    * @BayronPerez
    */
  persistir() {
    const tipoCuentas = {
      tipoCuenta: this.form.value['tipoCuenta'],
      cuentaAuxiliar: this.form.value['cuentaAuxiliar'],
      tipoId: this.form.value['tipoId'],
      identificador: this.form.value['identificador'],
      descripcion: this.form.value['descripcion'],
      referencia1: this.form.value['referencia1'],
      referencia2: this.form.value['referencia2'],
    };
    if (this.esEdicion) {
      tipoCuentas.tipoCuenta = this.idTipoCuenta;
      this.tiposCuentasService.actualizarTiposCuentas(tipoCuentas).subscribe({next: response => {
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_UPDATE,
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL,
            showResume: true,
            msgDetalles: JSON.stringify(response)
          }
        });
        this.listarDominios();
        this.initForm();
      },
      error:  (err: any) => {
          this.dialog.open(VentanaEmergenteResponseComponent, {
            width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
            data: {
              msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_UPDATE,
              codigo: GENERALES.CODE_EMERGENT.ERROR,
              showResume: true,
              msgDetalle: JSON.stringify(err.error.response.description)
            }
          });
        }
      });
    } else {
      this.tiposCuentasService.guardarTiposCuentas(tipoCuentas).subscribe(response => {
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_CREATE,
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL,
            msgDetalles: JSON.stringify(response)
          }
        });
        this.listarDominios();
        this.initForm();
      },
        (err: any) => {
          this.dialog.open(VentanaEmergenteResponseComponent, {
            width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
            data: {
              msn: JSON.stringify(err.error.response.description),
              codigo: GENERALES.CODE_EMERGENT.ERROR
            }
          });
        });
    }

  }
  /**
    * Se muestra el formulario para crear tipos cuetnas
    * @BayronPerez
    */
  crearTiposCuentas() {
    this.mostrarFormulario = true;
    this.esEdicion = false;
  }

  /**
    * Se muestra el formulario para actualizar tipos cuetnas
    * @BayronPerez
    */
  actualizarTiposCuentas() {
    this.mostrarFormulario = true;
  }

  editar(registro: any) {
    this.initForm(registro);
    this.mostrarFormulario = true;
    this.idTipoCuenta = this.form.get('tipoCuenta').value;
    this.form.get('tipoCuenta').disable();
    this.esEdicion = true;
  }

  showHelpField(field?: string) {
    let ayudaHtml = '';
    switch (field) {
      case 'Tipo Id':
        ayudaHtml = "<p style='text-align: left;'> <b>BCOEX:</b> significa que se debe colocar el tipo de id, la identificación y el nombre (en el campo tercero) del banco "+
		                "del código punto banco externo de la transacción interna.<br>" +
                    "<br><b>MISMO:</b> significa que en el campo nobre tercero se debe colocar el nombre del Banco Aval de la operación.<br>"+
                    "<br><b>MISoBEX:</b>  significa que si existe Banco externo en la transación interna se lleva tipoid, id tercero y nombre tercero del Banco externo,"+
			              "si no existe o existe y BanRep se llevan los datos del mismo Banco dueño del fondo. </p>";
        break;
      case 'Cuenta Auxiliar':
        ayudaHtml = "<p style='text-align: left; font-size: 0.75em'>"+
        "Numero de cuenta auxiliar, o la etiqueta "+
        "<b>{NOBR-00129}</b> si es un egreso diferente a la comisión Banco República lleva el valor 00129."+
        "</p>";
        break;
      case 'Identificador':
        ayudaHtml = "<p style='text-align: left;'> <b>{Consec1}</b> Consecutivo que inicia en 1 y va aumentando de a 1  por cada nueva operación id que lleve este consecutivo.<br>" +
                    "<br><b>{CENTROCIUDAD}</b> Ciudad del centro contable.<br>"+
                    "<br><b>{YYYYMMDD}</b> fecha del día de la operación, en este formato.</p>";
        break;
      case 'Descripción':
        ayudaHtml = "<p style='text-align: left; font-size: 0.75em'>"+
        "<b>{Comision} :</b> si el campo código comisión de la transacción interna es diferente de nulo colocar palabra COMISION."+
        "<br><b>{Impuesto} :</b> si el campo código impuesto de la transacción es diferente de nulo colocar palabra IVA."+
        "<br><b>{TipoOp} :</b> colocar tipo operación de la transacción interna."+
        "<br><b>{Ciudad} :</b> colocar nombre de la ciudad del campo código ciudad de la transacción interna "+
        "<br><b>{Tasa} :</b> Colocar valor del campo tasa negociación de la transacción interna, si es diferente de nulo o cero."+
        "<br><b>{BancoExt} :</b> si el campo código punto banco externo de la transacción interna es diferente de nulo colocar nombre del Banco"+
        "<br><b>{TDV} :</b> nombre de la transportadora del campo código_tdv en la transacción interna si no es nulo"+
        "<br><b>{TDVTr} :</b> nombre de la transportadora del campo código_tdv en la transacción interna si no es nulo y solo para TRASLADOS"+
        "<br><b>{DDMMYYYY} :</b> fecha del día de la operación, en este formato."+
        "<br><b>{ComFondo} :</b> configuracion particular para TRASLADOS e INTERCAMBIOS. que consta de "+
        "    VR COMP FONDOS {TDV1} {Ciudad1} {DDMMYYYY} {TipoOp} NO REALIZADO"+
        "<br><b>  {TDV1} :</b> Nombre transportadora origen para entradas (crédito) y trasportadora destino en salidas (débito)"+
        "<br><b>  {Ciudad1] :</b> Ciudad origen para entradas (crédito) y ciudad destino en salidas (débito)"+
        "  Este rótulo solo puede ir al final d ela cadena de configuración e implica que reemplaza la definición "+
        "  que está antes de este rótulo"+
        "<br><b>{NomComision} :</b> Nombre de la comisión correspondiente al campo código comisión"+
        "<br><b>{EoS} :</b>  Cuando corresponde a una tipo de Operación intercambio lleva la palabra ENTRADA si es un débito y "+
        "      la palabra SALIDA si es un crédito a la cuenta.   "+
        "</p>";
        break;
      default:
        break;
    }

    Swal.fire({
      title: "Campo: " + field,
      width: '80%',
      
      html: ayudaHtml,
    });
  }

}
