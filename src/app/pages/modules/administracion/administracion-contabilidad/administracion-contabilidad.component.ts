import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { ErrorService } from 'src/app/_model/error.model';
import { TiposCuentasService } from 'src/app/_service/contabilidad-service/tipos-cuentas.service';

@Component({
  selector: 'app-administracion-contabilidad',
  templateUrl: './administracion-contabilidad.component.html',
  styleUrls: ['./administracion-contabilidad.component.css']
})

export class AdministracionContabilidadComponent implements OnInit {

  form: FormGroup;
  dataSourceTiposCuentas: MatTableDataSource<any>
  displayedColumnsTiposCuentas: string[] = ['name'];
  isDominioChecked = false;
  mostrarFormulario = false;

  //Rgistros paginados
  @ViewChild(MatSort) sort: MatSort;
  cantidadRegistros: number;

  constructor(
    private tiposCuentasService: TiposCuentasService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.listarDominios();
    this.initForm();
  }

 /**
   * Inicializaion formulario de creacion y edicion
   * @BayronPerez
   */
  initForm(param?: any) { 
      this.form = new FormGroup({
        'tipoCuenta': new FormControl(param? param.tipoCuenta : null),
        'cuentaAuxiliar': new FormControl(param? param.cuentaAuxiliar : null),
        'tipoId': new FormControl(param? param.tipoId : null),
        'identificador': new FormControl(param? param.identificador : null),
        'descripcion': new FormControl(param? param.descripcion : null),
        'referencia1': new FormControl(param? param.referencia1 : null),
        'referencia2': new FormControl(param? param.referencia2 : null)
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
    }).subscribe((page: any) => {debugger
      this.dataSourceTiposCuentas = new MatTableDataSource(page.data);
      this.dataSourceTiposCuentas.sort = this.sort;
      this.cantidadRegistros = page.data.totalElements;
    },
      (err: ErrorService) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_ADMIN_TIPO_CUNTAS.ERROR_GET_TIPO_ADMIN_CUNTAS,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        }); setTimeout(() => { alert.close() }, 3000);
      });
  }

  /**
    * Se realiza persistencia del formulario de tipos cuentas
    * @BayronPerez
    */
   persistir() {
    const paciente = {
      tipoCuenta: this.form.value['tipoCuenta'],
      cuentaAuxiliar: this.form.value['cuentaAuxiliar'],
      tipoId: this.form.value['tipoId'],
      identificador: this.form.value['identificador'],
      descripcion: this.form.value['descripcion'],
      referencia1: this.form.value['referencia1'],
      referencia2: this.form.value['referencia2'],
    };

    this.tiposCuentasService.guardarTiposCuentas(paciente).subscribe(response => {
      const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
        width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
        data: {
          msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_CREATE,
          codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
        }
      }); setTimeout(() => { alert.close() }, 3000);
      this.listarDominios();
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
    * Se muestra el formulario para crear tipos cuetnas
    * @BayronPerez
    */
  crearTiposCuentas() {
    this.mostrarFormulario = true;
  }

  /**
    * Se muestra el formulario para actualizar tipos cuetnas
    * @BayronPerez
    */
  actualizarTiposCuentas(){
    this.mostrarFormulario = true;
  }

}