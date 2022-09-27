import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { ErrorService } from 'src/app/_model/error.model';
import { GeneralesService } from 'src/app/_service/generales.service';
import { CentroCostosService } from 'src/app/_service/contabilidad-service/tipo-centro-costos.service';

@Component({
  selector: 'app-administrador-tipo-centro-costos',
  templateUrl: './administrador-tipo-centro-costos.component.html',
  styleUrls: ['./administrador-tipo-centro-costos.component.css']
})
export class AdministradorTipoCentroCostosComponent implements OnInit {

  form: FormGroup;
  dataSourceTiposCuentas: MatTableDataSource<any>
  displayedColumnsTiposCuentas: string[] = ['tipo','nombre'];
  isDominioChecked = false;
  mostrarFormulario = false;
  tablCentros: any[] = [];


  //Rgistros paginados
  @ViewChild(MatSort) sort: MatSort;
  cantidadRegistros: number;

  constructor(
    private centroCostosService: CentroCostosService,
    private generalServices: GeneralesService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.listarCentroCostos();
    this.datosDesplegables();
  }

  /**
    * Se consumen servicios para desplegables
    * @BayronPerez
    */
   async datosDesplegables() {
    const _tablaCentros = await this.generalServices.listarDominioByDominio("TABLA_CENTRO").toPromise();
    this.tablCentros = _tablaCentros.data;
   }

  /**
    * Inicializaion formulario de creacion y edicion
    * @BayronPerez
    */
  initForm(param?: any) {
    this.form = new FormGroup({
      'tipoCentro': new FormControl(param ? param.tipoCentro : null),
      'bancoAval': new FormControl(param ? param.bancoAval : null),
      'nombreCentro': new FormControl(param ? param.nombreCentro : null),
      'codigoCentro': new FormControl(param ? param.codigoCentro : null),
      'tablaCentros': new FormControl(param ? param.tablaCentros : null),
    });
  }

  /**
   * Lista los Tipos centros costos
   * @BayronPerez
   */
  listarCentroCostos(pagina = 0, tamanio = 5) {
    this.centroCostosService.obtenerCentroCostos({
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
    const tiposCentrosCostosDTO = {
      tipoCentro: this.form.value['tipoCentro'],
      bancoAval: {
        codigoPunto: Number(this.form.value['bancoAval'])
      },
      nombreCentro: this.form.value['nombreCentro'],
      codigoCentro: this.form.value['codigoCentro'],
      tablaCentros: this.form.value['tablaCentros'],
    };

    this.centroCostosService.guardarCentroCostos(tiposCentrosCostosDTO).subscribe(response => {
      const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
        width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
        data: {
          msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_CREATE,
          codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
        }
      }); setTimeout(() => { alert.close() }, 3000);
      this.listarCentroCostos();
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
    * Se muestra el formulario para crear CentroCostos
    * @BayronPerez
    */
  crearCentroCostos() {
    this.initForm();
    this.mostrarFormulario = true;
  }

  /**
    * Se muestra el formulario para actualizar CentroCostos
    * @BayronPerez
    */
  actualizarCentroCostos() {
    this.initForm();
    this.mostrarFormulario = true;
  }

}
