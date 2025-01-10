import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { ErrorService } from 'src/app/_model/error.model';
import { GeneralesService } from 'src/app/_service/generales.service';
import { CentroCiudadesService } from 'src/app/_service/contabilidad-service/centro-ciudades.service';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';
import { SpinnerComponent } from 'src/app/pages/shared/components/spinner/spinner.component';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-administracion-centro-ciudades',
  templateUrl: './administracion-centro-ciudades.component.html',
  styleUrls: ['./administracion-centro-ciudades.component.css']
})
export class AdministracionCentroCiudadesComponent implements OnInit {

  form: FormGroup;
  dataSourceTiposCuentas: MatTableDataSource<any>
  displayedColumnsTiposCuentas: string[] = ['banco', ' ', 'ciudad', 'codigoCentro', 'acciones'];
  isDominioChecked = false;
  mostrarFormulario = false;
  bancos: any[] = [];
  ciudades: any[] = [];
  idCentroCiudad: any;
  esEdicion: boolean;
  spinnerActive: boolean = false;

  //Registros paginados
  @ViewChild(MatSort) sort: MatSort;
  cantidadRegistros: number;

  constructor(
    private centroCiudadesService: CentroCiudadesService,
    private generalServices: GeneralesService,
    private dialog: MatDialog,
    public spinnerComponent: SpinnerComponent
  ) { }

  ngOnInit(): void {
    ManejoFechaToken.manejoFechaToken()
    this.datosDesplegables();
    this.listarCentrosCiudades();
  }

  /**
    * Se consumen servicios para desplegables
    * @BayronPerez
    */
  async datosDesplegables() {
    this.spinnerActive = true;
    await lastValueFrom(this.generalServices.listarBancosAval()).then((response) => {
      this.bancos = response.data;
      this.spinnerActive = false;
    });

    lastValueFrom(this.generalServices.listarCiudades()).then((response) => {
      this.ciudades = response.data;
      this.spinnerActive = false;
    });
  }

  /**
    * Inicializaion formulario de creacion y edicion
    * @BayronPerez
    */
  initForm(param?: any) {
    this.form = new FormGroup({
      'idCentroCiudad': new FormControl(param ? param.idCentroCiudad : null),
      'bancoAval': new FormControl(param ? this.bancos.find((value) => value.codigoPunto === param.bancoAval.codigoPunto) : null, [Validators.required]),
      'codigoDane': new FormControl(param ? this.ciudades.find((value) => value.codigoDANE === param.ciudadDane.codigoDANE) : null, [Validators.required]),
      'codigoCentro': new FormControl(param ? param.codigoCentro : null, [Validators.required, Validators.pattern('^[0-9]+$')]),
    });
  }

  /**
   * Lista los Centros ciudades
   * @BayronPerez
   */
  listarCentrosCiudades(pagina = 0, tamanio = 5) {
    this.spinnerActive = true;
    this.centroCiudadesService.obtenerCentrosCiudades({
      page: pagina,
      size: tamanio,
    }).subscribe({
      next: (page: any) => {
        this.dataSourceTiposCuentas = new MatTableDataSource(page.data);
        this.dataSourceTiposCuentas.sort = this.sort;
        this.cantidadRegistros = page.data.totalElements;
        this.spinnerActive = false;
      },
      error: (err: ErrorService) => {
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_ADMIN_CENTRO_CIUDAD.ERROR_GET_TIPO_ADMIN_CENTRO_CIUDAD,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        });
        this.spinnerActive = false;
      }
    });
  }

  /**
    * Se realiza persistencia del formulario de centros ciudades
    * @BayronPerez
    */
  persistir() {
    this.spinnerActive = true;
    const centrociudad = {
      idCentroCiudad: null,
      ciudadDane: {
        codigoDANE: this.form.value['codigoDane'].codigoDANE
      },
      bancoAval: {
        codigoPunto: this.form.value['bancoAval'].codigoPunto
      },
      codigoCentro: this.form.value['codigoCentro'],
    }

    if (this.esEdicion) {
      centrociudad.idCentroCiudad = this.idCentroCiudad;
      this.centroCiudadesService.actualizarCentroCiudade(centrociudad).subscribe({
        next: response => {
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_UPDATE,
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
          }
        });
        this.listarCentrosCiudades()
        this.initForm();
        this.spinnerActive = false;
      },
      error: (err: any) => {
          this.dialog.open(VentanaEmergenteResponseComponent, {
            width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
            data: {
              msn: err.error.response.description,
              codigo: GENERALES.CODE_EMERGENT.ERROR
            }
          });
          this.spinnerActive = false;
        }
      });
    } else {
      this.centroCiudadesService.guardarCentroCiudade(centrociudad).subscribe({
        next: response => {
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_CREATE,
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
          }
        });
        this.listarCentrosCiudades()
        this.initForm();
        this.spinnerActive = false;
      },
      error:  (err: any) => {
          this.dialog.open(VentanaEmergenteResponseComponent, {
            width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
            data: {
              msn: err.error.response.description,
              codigo: GENERALES.CODE_EMERGENT.ERROR
            }
          });
          this.spinnerActive = false;
        }
      });
    }

  }

  /**
    * Se muestra el formulario para crear centro ciudad
    * @BayronPerez
    */
  crearCentroCiudad() {
    this.initForm();
    this.form.get('idCentroCiudad').disable();
    this.mostrarFormulario = true;
    this.esEdicion = false;
  }

  /**
    * Se muestra el formulario para actualizar dentros ciudad
    * @BayronPerez
    */
  actualizarCentroCiudad() {
    this.initForm();
    this.mostrarFormulario = true;
  }

  editar(registro: any) {
    this.initForm(registro);
    this.mostrarFormulario = true;
    this.idCentroCiudad = this.form.get('idCentroCiudad').value;
    this.form.get('idCentroCiudad').disable();
    this.esEdicion = true;
  }

}
