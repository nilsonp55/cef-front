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
  displayedColumnsTiposCuentas: string[] = ['tipoId', 'name', 'acciones'];
  isDominioChecked = false;
  mostrarFormulario = false;
  esEdicion: boolean;
  idTipoCuenta: any;

  //Registros paginados
  @ViewChild(MatSort) sort: MatSort;
  cantidadRegistros: number;

  constructor(
    private tiposCuentasService: TiposCuentasService,
    private dialog: MatDialog
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

}
