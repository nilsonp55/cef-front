import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { ErrorService } from 'src/app/_model/error.model';
import { CuentasPucService } from 'src/app/_service/contabilidad-service/cuentas-puc.service';
import { GeneralesService } from 'src/app/_service/generales.service'
import { CentroCostosService } from 'src/app/_service/contabilidad-service/tipo-centro-costos.service';
import { TiposCuentasService } from 'src/app/_service/contabilidad-service/tipos-cuentas.service';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';

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

  //Rgistros paginados
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
   * Inicializaion formulario de creacion y edicion
   * @BayronPerez
   */
  initForm(param?: any) {
      this.form = new FormGroup({
        'idCuentasPuc': new FormControl(param? param.idCuentasPuc : null),
        'cuentaContable': new FormControl(param? param.cuentaContable : null),
        'bancoAval': new FormControl(param? this.selectBancoAval(param) : null),
        'nombreCuenta': new FormControl(param? param.nombreCuenta : null),
        'identificador': new FormControl(param? param.identificador : null),
        'tiposCentrosCostos': new FormControl(param? this.selectTiposCostosCuentas(param) : null),
        'tiposCuentas': new FormControl(param? this.selectTipoCuentas(param) : null),
        'estado': new FormControl(param? param.estado : null)
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
  listarCuntasPuc(pagina = 0, tamanio = 5) {
    this.cuentasPucService.obtenerCuentasPuc({
      page: pagina,
      size: tamanio,
    }).subscribe((page: any) => {
      this.dataSourceTiposCuentas = new MatTableDataSource(page.data);
      this.dataSourceTiposCuentas.sort = this.sort;
      this.cantidadRegistros = page.data.totalElements;
    },
      (err: ErrorService) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_ADMIN_CUNTAS_PUC.ERROR_GET_TIPO_ADMIN_CUNTAS_PUC,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        }); setTimeout(() => { alert.close() }, 3000);
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
      estado: Number(this.formatearEstadoPersistir(this.form.value['estado'])),
    };

    if (this.esEdicion) {
      cuentaPuc.idCuentasPuc = this.idCuentaPuc;
      this.cuentasPucService.actualizarCuentaPuc(cuentaPuc).subscribe(response => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_CREATE,
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
          }
        }); setTimeout(() => { alert.close() }, 3000);
        this.listarCuntasPuc()
        this.initForm();
      },
        (err: any) => {
          const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
            width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
            data: {
              msn: err.error.response.description,
              codigo: GENERALES.CODE_EMERGENT.ERROR
            }
          }); setTimeout(() => { alert.close() }, 3000);
        });
    } else {
      this.cuentasPucService.guardarCuentaPuc(cuentaPuc).subscribe(response => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_CREATE,
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
          }
        }); setTimeout(() => { alert.close() }, 3000);
        this.listarCuntasPuc()
        this.initForm();
      },
        (err: any) => {
          const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
            width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
            data: {
              msn: err.error.response.description,
              codigo: GENERALES.CODE_EMERGENT.ERROR
            }
          }); setTimeout(() => { alert.close() }, 3000);
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

    const _tipoCuentas = await this.tiposCuentasService.obtenerTiposCuentas({
      page: 0,
      size: 500,
    }).toPromise();
    this.tipoCuentas = _tipoCuentas.data;

    const _tipoCostosCuentas = await this.centroCostosService.obtenerCentroCostos({
      page: 0,
      size: 500,
    }).toPromise();
    this.tiposCostosCuentas = _tipoCostosCuentas.data;

    const _bancos = await this.generalesService.listarBancosAval().toPromise();
    this.bancos = _bancos.data;

  }

  formatearEstadoPersistir(param: boolean): any {
    if(param==true){
      return true
    }else {
      return false
    }
  }

  formatearEstadoListar(param: any): any {
    if(param==true){
      return true
    }else {
      return false
    }
  }

}
