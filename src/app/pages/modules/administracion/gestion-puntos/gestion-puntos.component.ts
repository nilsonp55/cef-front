import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CrearPuntoComponent } from './crear-punto/crear-punto.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GestionPuntosService } from 'src/app/_service/administracion-service/gestionPuntos.service';
import { DialogCajeroComponent } from './crear-puntos/dialog-cajero/dialog-cajero.component';
import { DialogFondoComponent } from './crear-puntos/dialog-fondo/dialog-fondo.component';
import { DialogBancoComponent } from './crear-puntos/dialog-banco/dialog-banco.component';
import { DialogOficinaComponent } from './crear-puntos/dialog-oficina/dialog-oficina.component';
import { DialogClienteComponent } from './crear-puntos/dialog-cliente/dialog-cliente.component';
import { DialogBanRepComponent } from './crear-puntos/dialog-ban-rep/dialog-ban-rep.component';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';

@Component({
  selector: 'app-gestion-puntos',
  templateUrl: './gestion-puntos.component.html',
  styleUrls: ['./gestion-puntos.component.css']
})
export class GestionPuntosComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;

  isPointChecked = false;
  tipoPuntoSeleccionado: string;
  puntoSeleccionado: string = "";
  elementoPuntoActualizar: string;
  detallePuntoSeleccionado: any;
  estadoPuntos: boolean;
  nombrePuntoBusqueda: string;

  //Registros paginados
  cantidadRegistros: number;

  //Variable para activar spinner
  spinnerActive: boolean = false;

  dataSourcePuntoSelect: MatTableDataSource<any>
  displayedColumnsPuntoSelect: string[] = ['codigo_punto', 'tipo_punto', 'descripcion', 'ciudad', 'detalle'];

  listPuntosSelect: any;

  constructor(
    private dialog: MatDialog,
    private gestionPuntosService: GestionPuntosService) { }


  ngOnInit(): void {
    ManejoFechaToken.manejoFechaToken()
    this.estadoPuntos = false;
    this.listarTiposPunto();
    this.listarPuntosSeleccionado();
  }

  listarTiposPunto() {
    this.spinnerActive = true;
    this.gestionPuntosService.listarTiposPuntos({
      "dominioPK.dominio": "TIPOS_PUNTO"
    }).subscribe(response => {     
      this.spinnerActive = false;
      this.listPuntosSelect = response.data;
      this.cantidadRegistros = response.data.totalElements;
    },
      (err: any) => {
        this.spinnerActive = false;
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_DATA_FILE,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        }); setTimeout(() => { alert.close() }, 3500);
      });
  }

  /**
   * Listar puntos creados para realizar acciones
   * @BayronPerez
   */
  listarPuntosSeleccionado(pagina = 0, tamanio = 10) {
    this.spinnerActive = true;
    this.gestionPuntosService.listarPuntosCreados({
      "tipoPunto": this.tipoPuntoSeleccionado === undefined ? "" : this.tipoPuntoSeleccionado,
      page: pagina,
      size: tamanio,
      'busqueda': this.nombrePuntoBusqueda == undefined ? '' : this.nombrePuntoBusqueda
    }).subscribe(data => {
      this.estadoPuntos = true;
      this.spinnerActive = false;
      this.dataSourcePuntoSelect = new MatTableDataSource(data.data.content);
      this.dataSourcePuntoSelect.sort = this.sort;
      this.cantidadRegistros = data.data.totalElements;
    },
      (err: any) => {
        this.spinnerActive = false;
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_DATA_FILE,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        }); setTimeout(() => { alert.close() }, 3500);
      });
  }


  /**
  * Evento que valida la selecciond un tipo de punto
  * @BayronPerez
  */
  selectedTipoPunto(param: any) {
    if (param != undefined) {
      this.tipoPuntoSeleccionado = param;
    }
  }

  eventoClick(element: any) {
    this.tipoPuntoSeleccionado = element.value;
    this.listarPuntosSeleccionado();
  }


  /**
  * Evento que levanta un openDialog para crear un punto segun el tipo de punto
  * @BaironPerez
  */
  crearPunto() {
    this.dialog.open(CrearPuntoComponent, {
      width: '600PX',
      data: { flag: "crear", listPuntos: this.listPuntosSelect }
    });
  }


  /**
   * Evento que valida la selecciond un punto
   * @BayronPerez
   */
  selectedPunto(param: any) {
    if (param != undefined) {
      this.puntoSeleccionado = param;
    }
  }

  eventoSelectionPuntoDetalleClick(element: any) {
    this.detallePuntoSeleccionado = element
  }
  
  modificarDetallePunto(element: any) {
    if (element.tipoPunto == GENERALES.TIPO_PUNTOS.BANCO) {
      this.dialog.open(DialogBancoComponent, {
        width: '600PX',
        data: { element: element, flag: "modif" }
      })
    }
    else if (element.tipoPunto == GENERALES.TIPO_PUNTOS.BAN_REP) {
      this.dialog.open(DialogBanRepComponent, {
        width: '600PX',
        data: { element: element, flag: "modif" }
      })
    }
    else if (element.tipoPunto == GENERALES.TIPO_PUNTOS.CAJERO) {
      this.dialog.open(DialogCajeroComponent, {
        width: '600PX',
        data: { element: element, flag: "modif" }
      })
    }
    else if (element.tipoPunto == GENERALES.TIPO_PUNTOS.FONDO) {
      this.dialog.open(DialogFondoComponent, {
        width: '600PX',
        data: { element: element, flag: "modif" }
      })
    }
    else if (element.tipoPunto == GENERALES.TIPO_PUNTOS.OFICINA) {
      this.dialog.open(DialogOficinaComponent, {
        width: '600PX',
        data: { element: element, flag: "modif" }
      })
    }
    else if (element.tipoPunto == GENERALES.TIPO_PUNTOS.CLIENTE) {
      this.dialog.open(DialogClienteComponent, {
        width: '600PX',
        data: { element: element, flag: "modif" }
      })
    }
  }

  mostrarMas(e: any) {
    this.listarPuntosSeleccionado(e.pageIndex, e.pageSize);
  }

  filtrar(event) {
    this.listarPuntosSeleccionado();
  }

}
