import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { ErrorService } from 'src/app/_model/error.model';
import { GeneralesService } from 'src/app/_service/generales.service';
import { CentroCiudadesService } from 'src/app/_service/contabilidad-service/centro-ciudades.service';

@Component({
  selector: 'app-administracion-centro-ciudades',
  templateUrl: './administracion-centro-ciudades.component.html',
  styleUrls: ['./administracion-centro-ciudades.component.css']
})
export class AdministracionCentroCiudadesComponent implements OnInit {

  form: FormGroup;
  dataSourceTiposCuentas: MatTableDataSource<any>
  displayedColumnsTiposCuentas: string[] = ['ciudad', 'codigoCentro', 'acciones'];
  isDominioChecked = false;
  mostrarFormulario = false;
  bancos: any[] = [];
  ciudades: any[] = [];
  idCentroCiudad: any;
  esEdicion: boolean;

  //Rgistros paginados
  @ViewChild(MatSort) sort: MatSort;
  cantidadRegistros: number;

  constructor(
    private centroCiudadesService: CentroCiudadesService,
    private generalServices: GeneralesService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.datosDesplegables();
    this.listarCentrosCiudades();
  }

  /**
    * Se consumen servicios para desplegables
    * @BayronPerez
    */
  async datosDesplegables() {
    const _bancos = await this.generalServices.listarBancosAval().toPromise();
    this.bancos = _bancos.data;

    const _ciudades = await this.generalServices.listarCiudades().toPromise();
    this.ciudades = _ciudades.data;
  }

  /**
    * Inicializaion formulario de creacion y edicion
    * @BayronPerez
    */
  initForm(param?: any) {
    this.form = new FormGroup({
      'idCentroCiudad': new FormControl(param ? param.idCentroCiudad : null),
      'bancoAval': new FormControl(param ? this.selectBancoAval(param) : null),
      'codigoDane': new FormControl(param ? param.codigoDane : null),
      'codigoCentro': new FormControl(param ? param.codigoCentro : null),
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
   * Lista los Centros ciudades
   * @BayronPerez
   */
  listarCentrosCiudades(pagina = 0, tamanio = 5) {
    this.centroCiudadesService.obtenerCentrosCiudades({
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
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_ADMIN_CENTRO_CIUDAD.ERROR_GET_TIPO_ADMIN_CENTRO_CIUDAD,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        }); setTimeout(() => { alert.close() }, 3000);
      });
  }

  /**
    * Se realiza persistencia del formulario de centros ciudades
    * @BayronPerez
    */
  persistir() {
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
      this.centroCiudadesService.actualizarCentroCiudade(centrociudad).subscribe(response => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_CREATE,
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
          }
        }); setTimeout(() => { alert.close() }, 3000);
        this.listarCentrosCiudades()
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
      this.centroCiudadesService.guardarCentroCiudade(centrociudad).subscribe(response => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_CREATE,
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
          }
        }); setTimeout(() => { alert.close() }, 3000);
        this.listarCentrosCiudades()
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
    * Se muestra el formulario para crear centro ciudad
    * @BayronPerez
    */
  crearCentroCiudad() {
    this.initForm();
    this.form.get('idCentroCiudad').disable();
    this.mostrarFormulario = true;
    this.esEdicion = true;
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