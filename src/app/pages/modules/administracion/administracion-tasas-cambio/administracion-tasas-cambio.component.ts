import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ErrorService } from 'src/app/_model/error.model';
import { TasasCostoService } from 'src/app/_service/administracion-service/tasas-cambio.service';
import { GeneralesService } from 'src/app/_service/generales.service';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';

@Component({
  selector: 'app-administracion-tasas-cambio',
  templateUrl: './administracion-tasas-cambio.component.html',
  styleUrls: ['./administracion-tasas-cambio.component.css']
})
export class AdministracionTasasCambioComponent implements OnInit {

  form: FormGroup;
  dataSourceTiposCuentas: MatTableDataSource<any>
  displayedColumnsTiposCuentas: string[] = ['fecha','espacio1','moneda','espacio2','tasa', 'acciones'];
  isDominioChecked = false;
  mostrarFormulario = false;
  esEdicion: boolean;
  idCuentaPuc: any;
  monedas: any[] = [];

  //Rgistros paginados
  @ViewChild(MatSort) sort: MatSort;
  cantidadRegistros: number;

  constructor(
    private readonly tasasCostoService: TasasCostoService,
    private readonly generalesService: GeneralesService,
    private readonly dialog: MatDialog
  ) { }

  async ngOnInit(): Promise<void> {
    ManejoFechaToken.manejoFechaToken()
    await this.iniciarDesplegables();
    this.listarTasasCambio();
    this.initForm();
  }

 /**
   * Inicializaion formulario de creacion y edicion
   * @BayronPerez
   */
  initForm(param?: any) {
      this.form = new FormGroup({
        'fechaTasa': new FormControl(param? param.tasasCambioPK.fechaTasa : null),
        'codigoMoneda': new FormControl(param? param.tasasCambioPK.codigoMoneda : null, [Validators.required]),
        'tasaCambio': new FormControl(param? param.tasaCambio : null),
      });
  }

  /**
   * Lista los Tasas cambio
   * @BayronPerez
   */
  listarTasasCambio(pagina = 0, tamanio = 5) {
    this.tasasCostoService.listarTasasCosto({
      page: pagina,
      size: tamanio,
    }).subscribe({ next: (page: any) => {
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
    * Se realiza persistencia del formulario de tasas cambio
    * @BayronPerez
    */
   persistir() {
    const tasasCambioPK = {
      fechaTasa: this.form.value['fechaTasa'],
      codigoMoneda: this.form.value['codigoMoneda']
    }
    const tasasCambioDTO = {
      tasasCambioPK: tasasCambioPK,
      tasaCambio: this.form.value['tasaCambio']
    };
      this.tasasCostoService.crearTasasCosto(tasasCambioDTO).subscribe({
        next: response => {
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_CREATE,
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
          }
        }); 
        this.listarTasasCambio()
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

  /**
    * Se muestra el formulario para crear cuetnas puc
    * @BayronPerez
    */
  crearTasasCambio() {
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
  }

  async iniciarDesplegables() {
    const _moneda = await this.generalesService.listarDominioByDominio({
      'dominio':"DIVISAS"
    }).toPromise();
    this.monedas = _moneda.data;
  }

}
