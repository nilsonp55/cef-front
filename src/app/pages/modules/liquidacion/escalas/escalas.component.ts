import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { GeneralesService } from 'src/app/_service/generales.service';
import { EscalasService } from 'src/app/_service/liquidacion-service/escalas.service';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';

@Component({
  selector: 'app-escalas',
  templateUrl: './escalas.component.html',
  styleUrls: ['./escalas.component.css']
})
export class EscalasComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;

  form: FormGroup;
  dataSourceEscalas: MatTableDataSource<any>
  displayedColumnsEscalas: string[] = ['idEscala', 'banco', 'transportadoraOrigen', 'transportadoraDestino', 'ciudadOrigen', 'ciudadDestino', 'escala', 'estado', 'acciones'];
  isDominioChecked = false;
  mostrarFormulario = false;
  mostrarTabla = true;
  esEdicion: boolean;
  idEscala: any;
  bancos: any[] = [];
  transportadoras: any[] = [];
  ciudades: any[] = [];
  escalas: any[] = [];
  habilitarBTN: boolean;

  filtroBancoSelect: any;
  filtroTransportaOrigSelect: any;
  filtroCiudadOrigSelect: any;
  filtroCiudadDestSelect: any;

  cantidadRegistros: number;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  spinnerActive: boolean = false;
  pIndex: number = 0;
  pSize: number = 10;

  constructor(
    private escalasService: EscalasService,
    private dialog: MatDialog,
    private generalesService: GeneralesService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.spinnerActive = true;
    ManejoFechaToken.manejoFechaToken()
    this.habilitarBTN = false;
    this.iniciarDesplegables();
    this.listarEscalas();
    this.initForm();
  }

  /**
    * Inicializaion formulario de creacion y edicion
    * @BayronPerez
    */
  initForm(param?: any) {
    this.form = new FormGroup({
      'idEscala': new FormControl(param ? param.idEscala : null),
      'banco': new FormControl(param ? this.selectBanco(param) : null),
      'transportadoraOrigen': new FormControl(param ? this.selectTransportadorasOrigen(param) : null),
      'transportadoraDestino': new FormControl(param ? this.selectTransportadorasDestino(param) : null),
      'ciudadOrigen': new FormControl(param ? this.selectCiudadOrigen(param) : null),
      'ciudadDestino': new FormControl(param ? this.selectCiudadDestino(param) : null),
      'escala': new FormControl(param ? param.escala : null),
      'estado': new FormControl(param? this.formatearEstadoListar(param.estado) : null),
    });
  }

  selectBanco(param: any): any {
    for(let i= 0; i < this.bancos.length; i++) {
      const element = this.bancos[i];
      if(element.codigoPunto == param.bancosDTO.codigoPunto) {
        return element;
      }
    }
  }

  selectTransportadorasOrigen(param: any): any {
    for(let i= 0; i < this.transportadoras.length; i++) {
      const element = this.transportadoras[i];
      if(element.codigo == param.transportadoraOrigenDTO.codigo) {
        return element;
      }
    }
  }

  selectTransportadorasDestino(param: any): any {
    for(let i= 0; i < this.transportadoras.length; i++) {
      const element = this.transportadoras[i];
      if(element.codigo == param.transportadoraDestinoDTO.codigo) {
        return element;
      }
    }
  }

  selectCiudadOrigen(param: any): any {
    for(let i= 0; i < this.ciudades.length; i++) {
      const element = this.ciudades[i];
      if(element.codigoDANE == param.ciudadOrigenDTO.codigoDANE) {
        return element;
      }
    }
  }

  selectCiudadDestino(param: any): any {
    for(let i= 0; i < this.ciudades.length; i++) {
      const element = this.ciudades[i];
      if(element.codigoDANE == param.ciudadDestinoDTO.codigoDANE) {
        return element;
      }
    }
  }

  /**
   * Lista los Escalas
   * @BayronPerez
   */
  listarEscalas(pagina = this.pIndex, tamanio = this.pSize) {
    this.spinnerActive = true;
    this.escalasService.obtenerEscalas({
      page: pagina,
      size: tamanio,
      'bancos.codigoPunto': this.filtroBancoSelect == undefined ? '': this.filtroBancoSelect.codigoPunto,
      'transportadoraOrigen.codigo': this.filtroTransportaOrigSelect == undefined ? '': this.filtroTransportaOrigSelect.codigo,
      'ciudadDestino.codigoDANE': this.filtroCiudadDestSelect == undefined ? '': this.filtroCiudadDestSelect.codigoDANE,
      'ciudadOrigen.codigoDANE': this.filtroCiudadOrigSelect== undefined ? '': this.filtroCiudadOrigSelect.codigoDANE
    }).subscribe({next: (page: any) => {
      this.dataSourceEscalas = new MatTableDataSource(page.data.content);
      this.dataSourceEscalas.sort = this.sort;
      this.cantidadRegistros = page.data.totalElements;
      this.pageSizeOptions = [5, 10, 25, 100, page.data.totalElements];
      this.habilitarBTN = true;
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

  /**
    * Se realiza persistencia del formulario de cuentas puc
    * @BayronPerez
    */
  persistir() {
    this.spinnerActive = true;
    let escala = {
      idEscala: 0,
      bancosDTO: {
        codigoPunto: this.form.value['banco'].codigoPunto
      },
      transportadoraOrigenDTO: {
        codigo: this.form.value['transportadoraOrigen'].codigo
      },
      transportadoraDestinoDTO: {
        codigo: this.form.value['transportadoraDestino'].codigo
      },
      ciudadOrigenDTO: {
        codigoDANE: this.form.value['ciudadOrigen'].codigoDANE
      },
      ciudadDestinoDTO: {
        codigoDANE: this.form.value['ciudadDestino'].codigoDANE
      },
      escala: this.form.value['escala'],
      estado: Number(this.formatearEstadoPersistir(this.form.value['estado'])),

    };

    if(this.esEdicion) {
      escala.idEscala = Number(this.idEscala);
      this.escalasService.actualizarEscala(escala).subscribe({ next: (response: any) => {
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_UPDATE,
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
          }
        });
        this.listarEscalas();
        this.spinnerActive = false;
      },
      error: (err: any) => {
          this.dialog.open(VentanaEmergenteResponseComponent, {
            width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
            data: {
              msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_UPDATE + " - " + err.error.response.description,
              codigo: GENERALES.CODE_EMERGENT.ERROR
            }
          });
          this.spinnerActive = false;
        }
      });
      this.mostrarFormulario = false;
      this.mostrarTabla = true;
    }
    else {
      escala.idEscala = this.form.value['idEscala']
      this.escalasService.guardarEscala(escala).subscribe({ next: (response: any) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_CREATE,
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
          }
        });
        this.listarEscalas();
        this.spinnerActive = false;
      },
      error: (err: any) => {
          const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
            width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
            data: {
              msn: err.error.response.description,
              codigo: GENERALES.CODE_EMERGENT.ERROR
            }
          });
          this.spinnerActive = false;
        }
      });
      this.mostrarFormulario = false;
      this.mostrarTabla = true;
    }


  }

  /**
    * Se muestra el formulario para crear escala
    * @BayronPerez
    */
  crearEscala() {
    this.form.get('idEscala').disable();
    this.mostrarFormulario = true;
    this.esEdicion = false;
    this.mostrarTabla = false;
  }

  /**
    * Se muestra el formulario para actualizar escala
    * @BayronPerez
    */
  actualizarEscala(element) {
    this.initForm(element)
    this.mostrarFormulario = true;
    this.idEscala = this.form.get('idEscala').value;
    this.form.get('idEscala').disable();
    this.esEdicion = true;
    this.mostrarTabla = false;
  }

  async iniciarDesplegables() {
    const _bancos = await this.generalesService.listarBancosAval().toPromise();
    this.bancos = _bancos.data;

    const _transportadoras = await this.generalesService.listarTransportadoras().toPromise();
    this.transportadoras = _transportadoras.data;

    const _ciudades = await this.generalesService.listarCiudades().toPromise();
    this.ciudades = _ciudades.data;

    const _escalas = await this.generalesService.listarDominioByDominio({
      'dominio':"ESCALA"
    }).toPromise();
    this.escalas = _escalas.data;

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

  mostrarMas(e: any) {
    this.pIndex = e.pageIndex;
    this.pSize = e.pageSize;
    this.listarEscalas(e.pageIndex, e.pageSize);
  }

  irAtras() {
    window.location.reload();
  }

  filtrar(e: any) {
    this.listarEscalas(e.pageIndex, e.pageSize);
  }

  limpiar(){
    this.filtroBancoSelect = null;
    this.filtroTransportaOrigSelect = null;
    this.filtroCiudadOrigSelect = null;
    this.filtroCiudadDestSelect = null;
  }

}
