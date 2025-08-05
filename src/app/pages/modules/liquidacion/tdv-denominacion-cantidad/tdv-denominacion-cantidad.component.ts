import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GeneralesService } from 'src/app/_service/generales.service';
import { DenominacionCantidadService } from 'src/app/_service/liquidacion-service/denominacion-cantidad.service';
import { MatPaginator } from '@angular/material/paginator';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';

@Component({
  selector: 'app-tdv-denominacion-cantidad',
  templateUrl: './tdv-denominacion-cantidad.component.html',
  styleUrls: ['./tdv-denominacion-cantidad.component.css']
})
export class TdvDenominacionCantidadComponent implements OnInit {

  form: FormGroup;
  dataSourceDenominacion: MatTableDataSource<any>
  displayedColumnsDenominacion: string[] = ['idTdvDenCant', 'transportadora', 'moneda', 'denominacion', 'familia', 'cantidadPorDenom', 'acciones']; //agregar campo estado si es requerido
  isDominioChecked = false;
  mostrarFormulario = false;
  mostrarTabla = true;
  esEdicion: boolean;
  idTdvDenCant: any;
  bancos: any[] = [];
  transportadoras: any[] = [];
  ciudades: any[] = [];
  monedas: any[] = [];
  denominaciones: any[] = [];
  familias: any[] = [];
  habilitarBTN: boolean;
  spinnerActive: boolean = false;

  //Rgistros paginados
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  cantidadRegistros: number;
  pageSizeOptions: number[] = [5, 10, 25, 100, 500];

  constructor(
    private denominacionCantidadService: DenominacionCantidadService,
    private dialog: MatDialog,
    private generalesService: GeneralesService
  ) { }

  ngOnInit(): void {
    this.spinnerActive = true;
    ManejoFechaToken.manejoFechaToken()
    this.habilitarBTN = false;
    this.iniciarDesplegables();
    this.listarDenominacion();
    this.initForm();
  }

  /**
    * Inicializaion formulario de creacion y edicion
    * @BayronPerez
    */
  initForm(param?: any) {
    this.form = new FormGroup({
      'idTdvDenCant': new FormControl(param ? param.idTdvDenCant : null),
      'transportadora': new FormControl(param ? this.selectTransportadorasOrigen(param) : null),
      'moneda': new FormControl(param ? param.moneda : null),
      'denominacion': new FormControl(param ? String(param.denominacion) : null),
      'familia': new FormControl(param ? param.familia : null),
      'cantidadPorDenom': new FormControl(param ? param.cantidadPorDenom : null),
      'estado': new FormControl(param? this.formatearEstadoListar(param.estado) : null),
    });
  }

  selectTransportadorasOrigen(param: any): any {
    for(let i= 0; i < this.transportadoras.length; i++) {
      const element = this.transportadoras[i];
      if(element.codigo == param.transportadoraDTO.codigo) {
        return element;
      }
    }
  }
  
  /**
   * Lista los Escalas
   * @BayronPerez
   */
  listarDenominacion(pagina = 0, tamanio = 5) {
    this.spinnerActive = true;
    debugger
    this.denominacionCantidadService.obtenerDenominacionCantidad({
      page: pagina,
      size: tamanio,
    }).subscribe((page: any) => {
      this.dataSourceDenominacion = new MatTableDataSource(page.data);
      this.dataSourceDenominacion.paginator = this.paginator;
      this.dataSourceDenominacion.sort = this.sort;
      this.cantidadRegistros = page.data.totalElements;
      this.habilitarBTN = true;
      debugger
      this.spinnerActive = false;
    },
      (err: any) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: err.error.response.description,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        }); 
        setTimeout(() => { alert.close() }, 3000);
        this.spinnerActive = false;
      });
  }

  /**
    * Se realiza persistencia del formulario de tdv denominacion
    * @BayronPerez
    */
  persistir(param?: any) {
    this.spinnerActive = true;
    let denominacionCantidad = {
      idTdvDenCant: 0,
      transportadoraDTO: {
        codigo: this.form.value['transportadora'].codigo
      },
      moneda: this.form.value['moneda'],
      denominacion: Number(this.form.value['denominacion']),
      familia: this.form.value['familia'],
      cantidadPorDenom: this.form.value['cantidadPorDenom'],
      estado: Number(this.form.value['estado']),
    };

    const serviceCall = this.esEdicion 
      ? this.denominacionCantidadService.actualizarDenominacionCantidad(denominacionCantidad) : 
      this.denominacionCantidadService.guardarDenominacionCantidad(denominacionCantidad);

      denominacionCantidad.idTdvDenCant = Number(this.idTdvDenCant);
      serviceCall.subscribe({next: response => {
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: this.esEdicion ? GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_UPDATE : GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_CREATE,
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL,
            showResume: true,
            msgDetalles: JSON.stringify(response.response)
          }
        });
        this.listarDenominacion();
        this.initForm();
        this.spinnerActive = false;
      },
      error:  (err: any) => {
          this.dialog.open(VentanaEmergenteResponseComponent, {
            width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
            data: {
              msn: this.esEdicion ? GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_UPDATE : GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_CREATE,
              codigo: GENERALES.CODE_EMERGENT.ERROR,
              showResume: true,
              msgDetalles: JSON.stringify(err.error.response)
            }
          });
        }});
        this.mostrarFormulario = false;
        this.mostrarTabla = true;
        this.spinnerActive = false;
  }

  /**
    * Se muestra el formulario para crear escala
    * @BayronPerez
    */
   crearDenominacionCantidad() {
    this.form.get('idTdvDenCant').disable();
    this.mostrarFormulario = true;
    this.esEdicion = false;
    this.mostrarTabla = false;
  }

  /**
    * Se muestra el formulario para actualizar escala
    * @BayronPerez
    */
  actualizarDenominacionCantidad(element) {
    this.initForm(element)
    this.mostrarFormulario = true;
    this.idTdvDenCant = this.form.get('idTdvDenCant').value;
    this.form.get('idTdvDenCant').disable();
    this.esEdicion = true;
    this.mostrarTabla = false;
  }

  async iniciarDesplegables() {
    this.spinnerActive = true;
    const _bancos = await this.generalesService.listarBancosAval().toPromise();
    this.bancos = _bancos.data;

    const _transportadoras = await this.generalesService.listarTransportadoras().toPromise();
    this.transportadoras = _transportadoras.data;

    const _ciudades = await this.generalesService.listarCiudades().toPromise();
    this.ciudades = _ciudades.data;

    const _monedas = await this.generalesService.listarDominioByDominio({
      'dominio':"TIPO_MONEDA"
    }).toPromise();
    this.monedas = _monedas.data;

    const _denominaciones = await this.generalesService.listarDominioByDominio({
      'dominio':"DENOMINACION"
    }).toPromise();
    this.denominaciones = _denominaciones.data;

    const _familias = await this.generalesService.listarDominioByDominio({
      'dominio':"FAMILIAS"
    }).toPromise();
    this.familias = _familias.data;
    this.spinnerActive = false;
  }

  irAtras() {
    window.location.reload();
  }

  /**
  * Metodo para gestionar la paginación de la tabla
  * @BaironPerez
  */
   mostrarMas(e: any) {
    this.listarDenominacion(e.pageIndex, e.pageSize);
  }

  formatearEstadoPersistir(param: boolean): any {
    if(param==true){
      return 1
    }else {
      return 2
    }
  }

  formatearEstadoListar(param: any): any {
    if(param==1){
      return true
    }else {
      return false
    }
  }

  onKeypressEvent(event: any):  any {
    if(event.charCode < 48 || event.charCode > 57) return false;
  }
}
