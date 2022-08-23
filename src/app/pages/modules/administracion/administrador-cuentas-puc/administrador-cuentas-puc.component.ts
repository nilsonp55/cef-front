import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { ErrorService } from 'src/app/_model/error.model';
import { CuentasPucService } from 'src/app/_service/contabilidad-service/cuentas-puc.service';

@Component({
  selector: 'app-administrador-cuentas-puc',
  templateUrl: './administrador-cuentas-puc.component.html',
  styleUrls: ['./administrador-cuentas-puc.component.css']
})
export class AdministradorCuentasPucComponent implements OnInit {

  form: FormGroup;
  dataSourceTiposCuentas: MatTableDataSource<any>
  displayedColumnsTiposCuentas: string[] = ['identi','name'];
  isDominioChecked = false;
  mostrarFormulario = false;

  //Rgistros paginados
  @ViewChild(MatSort) sort: MatSort;
  cantidadRegistros: number;

  constructor(
    private cuentasPucService: CuentasPucService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
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
        'bancoAval': new FormControl(param? param.bancoAval : null),
        'nombreCuenta': new FormControl(param? param.nombreCuenta : null),
        'identificador': new FormControl(param? param.identificador : null),
        'tiposCentrosCostos': new FormControl(param? param.tiposCentrosCostos : null),
        'tiposCuentas': new FormControl(param? param.tiposCuentas : null),
        'estado': new FormControl(param? param.estado : null)
      });
  }

  /**
   * Lista los Cuentas puc
   * @BayronPerez
   */
  listarCuntasPuc(pagina = 0, tamanio = 5) {debugger
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
    const paciente = {
      idCuentasPuc: this.form.value['idCuentasPuc'],
      cuentaContable: {
        consecutivo: this.form.value['cuentaContable']
      },
      tipoId: this.form.value['tipoId'],
      bancoAval: {
        codigoPunto: this.form.value['bancoAval']
      },
      nombreCuenta: this.form.value['nombreCuenta'],
      identificador: this.form.value['identificador'],
      tiposCentrosCostos: {
        tipoCentro: this.form.value['tiposCentrosCostos']
      },
      tiposCuentas: {
        tipoCuenta: this.form.value['tiposCuentas']
      },
      estado: this.form.value['estado']
    };

    this.cuentasPucService.guardarCuentaPuc(paciente).subscribe(response => {
      const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
        width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
        data: {
          msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_CREATE,
          codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
        }
      }); setTimeout(() => { alert.close() }, 3000);
      this.listarCuntasPuc();
      this.initForm();
    },
    (err: ErrorService) => {
      const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
        width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
        data: {
          msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_CREATE,
          codigo: GENERALES.CODE_EMERGENT.ERROR
        }
      }); setTimeout(() => { alert.close() }, 3000);
    });
   }

  /**
    * Se muestra el formulario para crear cuetnas puc
    * @BayronPerez
    */
  crearCuentasPuc() {
    this.mostrarFormulario = true;
  }

  /**
    * Se muestra el formulario para actualizar cuetnas puc
    * @BayronPerez
    */
  actualizarCuentasPuc(){
    this.mostrarFormulario = true;
  }

}

const ELEMENT_DATA: any[] = [
  { name: 'Bancos Aval' },
  { name: 'Bancos del Pais' },
  { name: 'Calidades Efectivo' },
  { name: 'Ciudades' },
  { name: 'Estado Operación' },
  { name: 'Familias de Efectivo' },
  { name: 'Monedas' },
  { name: 'Tipos de Puntos' },
  { name: 'Tipos de Efectivo' },
];