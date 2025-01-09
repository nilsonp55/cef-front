import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { ErrorService } from 'src/app/_model/error.model';
import { CuentasPucService } from 'src/app/_service/contabilidad-service/cuentas-puc.service';
import { GeneralesService } from 'src/app/_service/generales.service'
import { CentroCostosService } from 'src/app/_service/contabilidad-service/tipo-centro-costos.service';
import { TiposCuentasService } from 'src/app/_service/contabilidad-service/tipos-cuentas.service';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-administrador-cuentas-puc',
  templateUrl: './administrador-cuentas-puc.component.html',
  styleUrls: ['./administrador-cuentas-puc.component.css']
})
export class AdministradorCuentasPucComponent implements OnInit {

  form: FormGroup;
  dataSourceTiposCuentas: MatTableDataSource<any>
  displayedColumnsTiposCuentas: string[] = ['identi','numeroCuenta','name', 'tipoCuenta','acciones'];
  isDominioChecked = false;
  mostrarFormulario = false;
  esEdicion: boolean;
  idCuentaPuc: any;
  bancos: any[] = [];
  tiposCostosCuentas: any[] = [];
  tipoCuentas: any[] = [];

  //Registros paginados
  @ViewChild(MatSort) sort: MatSort;
  cantidadRegistros: number;

  constructor(
    private cuentasPucService: CuentasPucService,
    private generalesService: GeneralesService,
    private tiposCuentasService: TiposCuentasService,
    private centroCostosService: CentroCostosService,
    private dialog: MatDialog
  ) { }

  async ngOnInit(): Promise<void> {
    ManejoFechaToken.manejoFechaToken()
    await this.iniciarDesplegables();
    this.listarCuntasPuc();
    this.initForm();
  }

 /**
   * Inicializacion formulario de creacion y edicion
   * @BayronPerez
   */
  initForm(param?: any) {
      this.form = new FormGroup({
        'idCuentasPuc': new FormControl(param? param.idCuentasPuc : null, [Validators.required]),
        'cuentaContable': new FormControl(param? param.cuentaContable : null, [Validators.required]),
        'bancoAval': new FormControl(param? this.bancos.find((value) => value.codigoPunto === param.bancoAval.codigoPunto) : null, [Validators.required]),
        'nombreCuenta': new FormControl(param? param.nombreCuenta : null, [Validators.required]),
        'identificador': new FormControl(param? param.identificador : null, [Validators.required]),
        'tiposCentrosCostos': new FormControl(param? this.tiposCostosCuentas.find((value) => value.tipoCentro === param.tiposCentrosCostos.tipoCentro) : null, [Validators.required]),
        'tiposCuentas': new FormControl(param? this.tipoCuentas.find((value) => value.tipoCuenta === param.tiposCuentas.tipoCuenta) : null, [Validators.required]),
        'estado': new FormControl(param? param.estado : null, [Validators.required])
      });
  }

  /**
   * Lista los Cuentas puc
   * @BayronPerez
   */
  listarCuntasPuc(pagina = 0, tamanio = 5) {
    this.cuentasPucService.obtenerCuentasPuc({
      page: pagina,
      size: tamanio,
    }).subscribe({
      next: (page: any) => {
      this.dataSourceTiposCuentas = new MatTableDataSource(page.data);
      this.dataSourceTiposCuentas.sort = this.sort;
      this.cantidadRegistros = page.data.totalElements;
      },
      error:  (err: ErrorService) => {
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
    const cuentaPuc = {
      idCuentasPuc: this.form.value['idCuentasPuc'],
      cuentaContable: this.form.value['cuentaContable'],
      bancoAval: {
        codigoPunto: this.form.value['bancoAval'].codigoPunto
      },
      nombreCuenta: this.form.value['nombreCuenta'],
      identificador: this.form.value['identificador'],
      tiposCentrosCostos: {
        tipoCentro: this.form.value['tiposCentrosCostos'].tipoCentro
      },
      tiposCuentas: {
        tipoCuenta: this.form.value['tiposCuentas'].tipoCuenta
      },
      estado: Number(this.form.value['estado']),
    };

    if (this.esEdicion) {
      cuentaPuc.idCuentasPuc = this.idCuentaPuc;
      this.cuentasPucService.actualizarCuentaPuc(cuentaPuc).subscribe({
        next: (response) => {
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_UPDATE,
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
          }
        });
        this.listarCuntasPuc()
        this.initForm();
      },
      error:  (err: any) => {
          this.dialog.open(VentanaEmergenteResponseComponent, {
            width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
            data: {
              msn: err.error.response.description,
              codigo: GENERALES.CODE_EMERGENT.ERROR
            }
          });
        }
      });
    } else {
      this.cuentasPucService.guardarCuentaPuc(cuentaPuc).subscribe({
        next: (response) => {
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_CREATE,
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
          }
        });
        this.listarCuntasPuc()
        this.initForm();
      },
      error:  (err: any) => {
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
   }

  /**
    * Se muestra el formulario para crear cuetnas puc
    * @BayronPerez
    */
  crearCuentasPuc() {
    this.mostrarFormulario = true;
    this.esEdicion = false;
  }

  /**
    * Se muestra el formulario para actualizar cuetnas puc
    * @BayronPerez
    */
  actualizarCuentasPuc(){
    this.mostrarFormulario = true;
  }

  editar(registro: any) {
    this.initForm(registro);
    this.mostrarFormulario = true;
    this.idCuentaPuc = this.form.get('idCuentasPuc').value;
    this.form.get('idCuentasPuc').disable();
    this.esEdicion = true;
  }

  async iniciarDesplegables() {

    await lastValueFrom(this.tiposCuentasService.obtenerTiposCuentas({
      page: 0,
      size: 500,
    })).then((response) => {
      this.tipoCuentas = response.data;
    });

    await lastValueFrom(this.centroCostosService.obtenerCentroCostos({
      page: 0,
      size: 500,
    })).then((response) => {
      this.tiposCostosCuentas = response.data;
    });

    await lastValueFrom(this.generalesService.listarBancosAval()).then((response) => {
      this.bancos = response.data;
    });

  }

}
