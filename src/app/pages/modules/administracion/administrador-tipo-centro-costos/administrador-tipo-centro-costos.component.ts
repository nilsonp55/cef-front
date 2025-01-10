import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { ErrorService } from 'src/app/_model/error.model';
import { GeneralesService } from 'src/app/_service/generales.service';
import { CentroCostosService } from 'src/app/_service/contabilidad-service/tipo-centro-costos.service';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';

@Component({
  selector: 'app-administrador-tipo-centro-costos',
  templateUrl: './administrador-tipo-centro-costos.component.html',
  styleUrls: ['./administrador-tipo-centro-costos.component.css']
})
export class AdministradorTipoCentroCostosComponent implements OnInit {

  form: FormGroup;
  dataSourceTiposCuentas: MatTableDataSource<any>
  displayedColumnsTiposCuentas: string[] = ['banco','tipo','nombre', 'acciones'];
  isDominioChecked = false;
  mostrarFormulario = false;
  tablCentros: any[] = [];
  bancos: any[] = [];
  esEdicion: boolean;
  idTipoCentro: any;

  //Rgistros paginados
  @ViewChild(MatSort) sort: MatSort;
  cantidadRegistros: number;

  constructor(
    private centroCostosService: CentroCostosService,
    public generalServices: GeneralesService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    ManejoFechaToken.manejoFechaToken()
    this.datosDesplegables();
    this.listarCentroCostos();
  }

  /**
    * Se consumen servicios para desplegables
    * @BayronPerez
    */
   async datosDesplegables() {
    const _tablaCentros = await this.generalServices.listarDominioByDominio({
      'dominio':"TABLA_CENTRO"
    }).toPromise();
    this.tablCentros = _tablaCentros.data;

    const _bancos = await this.generalServices.listarBancosAval().toPromise();
    this.bancos = _bancos.data;
   }

  /**
    * Inicializaion formulario de creacion y edicion
    * @BayronPerez
    */
  initForm(param?: any) {
    this.form = new FormGroup({
      'tipoCentro': new FormControl(param ? param.tipoCentro : null, [Validators.min(3), Validators.required]),
      'bancoAval': new FormControl(param ? this.selectBancoAval(param) : null, [Validators.required]),
      'nombreCentro': new FormControl(param ? param.nombreCentro : null, [Validators.required]),
      'codigoCentro': new FormControl(param ? param.codigoCentro : null),
      'tablaCentros': new FormControl(param ? param.tablaCentros : null),
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
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_ADMIN_CUNTAS_PUC.ERROR_GET_TIPO_ADMIN_CUNTAS_PUC,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        });
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
        codigoPunto: Number(this.form.value['bancoAval'].codigoPunto)
      },
      nombreCentro: this.form.value['nombreCentro'],
      codigoCentro: this.form.value['codigoCentro'],
      tablaCentros: this.form.value['tablaCentros'],
    };

    if (this.esEdicion) {
      tiposCentrosCostosDTO.tipoCentro = this.idTipoCentro;
      this.centroCostosService.actualizarCentroCostos(tiposCentrosCostosDTO).subscribe(response => {
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_UPDATE,
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
          }
        });
        this.listarCentroCostos()
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
      this.centroCostosService.guardarCentroCostos(tiposCentrosCostosDTO).subscribe(response => {
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_CREATE,
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
          }
        });
        this.listarCentroCostos()
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
    }
  }

  /**
    * Se muestra el formulario para crear CentroCostos
    * @BayronPerez
    */
  crearCentroCostos() {
    this.initForm();
    this.mostrarFormulario = true;
    this.esEdicion = false;
  }

  /**
    * Se muestra el formulario para actualizar CentroCostos
    * @BayronPerez
    */
  actualizarCentroCostos() {
    this.initForm();
    this.mostrarFormulario = true;
  }

  editar(registro: any) {
    this.initForm(registro);
    this.mostrarFormulario = true;
    this.idTipoCentro = this.form.get('tipoCentro').value;
    this.form.get('tipoCentro').disable();
    this.esEdicion = true;
  }

}
