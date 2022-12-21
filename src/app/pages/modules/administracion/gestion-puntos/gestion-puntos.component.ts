import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CrearPuntoComponent } from './crear-punto/crear-punto.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GestionPuntosService } from 'src/app/_service/administracion-service/gestionPuntos.service';
import { InfoDetallesPuntoComponent } from './info-detalles-punto/info-detalles-punto.component';

@Component({
  selector: 'app-gestion-puntos',
  templateUrl: './gestion-puntos.component.html',
  styleUrls: ['./gestion-puntos.component.css']
})
export class GestionPuntosComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;

  isPointChecked = false;
  tipoPuntoSeleccionado: string;
  puntoSeleccionado;
  elementoPuntoActualizar: string;
  detallePuntoSeleccionado: any;

  //Rgistros paginados
  cantidadRegistros: number;

  //Variable para activar spinner
  spinnerActive: boolean = false;

  dataSourcePuntoSelect: MatTableDataSource<any>
  displayedColumnsPuntoSelect: string[] = ['codigo_punto', 'descripcion', 'ciudad', 'detalle'];

  dataSourceTiposPunto: MatTableDataSource<any>
  displayedColumnsTiposPunto: string[] = ['name'];


  constructor(
    private dialog: MatDialog,
    private gestionPuntosService: GestionPuntosService) 
    { }


  ngOnInit(): void {
    //this.listarPuntosCreados();
    this.listarTiposPunto();
  }

  listarTiposPunto() {
    this.spinnerActive = true;
    this.gestionPuntosService.listarTiposPuntos({
      "dominioPK.dominio": "TIPOS_PUNTO"
    }).subscribe(data => {
      console.log("Entro")
      console.log(data.data)
      this.spinnerActive = false;
      this.dataSourceTiposPunto = new MatTableDataSource(data.data);
      this.dataSourceTiposPunto.sort = this.sort;
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
   * Listar puntos creados para realizar acciones
   * @BayronPerez
   */
  listarPuntosSeleccionado(pagina = 0, tamanio = 5) {
    //this.spinnerActive = true;
    this.gestionPuntosService.listarPuntosCreados({
      "tipoPunto": this.tipoPuntoSeleccionado,
      page: pagina,
      size: tamanio
    }).subscribe(data => {
      console.log("Solicito la data")
      console.log(data.data.content)
      //this.spinnerActive = false;
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
    if(param != undefined) {
      this.tipoPuntoSeleccionado = param;
    }
  }

  eventoClick(element: any) {
    this.tipoPuntoSeleccionado = element.valorTexto;
    this.listarPuntosSeleccionado();
  }


  /**
  * Evento que levanta un openDialog para crear un punto segun el tipo de punto
  * @BaironPerez
  */
   crearPunto() {
    if(this.tipoPuntoSeleccionado == GENERALES.TIPO_PUNTOS.BANCO) {
      // TODO: debe aarecer la vetana para crear banco
      this.dialog.open(CrearPuntoComponent, {
        width: '600PX', 
        data: GENERALES.TIPO_PUNTOS.BANCO
      })
    }
    else if (this.tipoPuntoSeleccionado == GENERALES.TIPO_PUNTOS.CAJERO) {
      // TODO: debe aarecer la vetana para crear cajero
      this.dialog.open(CrearPuntoComponent, {
        width: '600PX', 
        data: GENERALES.TIPO_PUNTOS.CAJERO
      })
    }
    else if (this.tipoPuntoSeleccionado == GENERALES.TIPO_PUNTOS.FONDO) {
      // TODO: debe aarecer la vetana para crear fondo
      this.dialog.open(CrearPuntoComponent, {
        width: '600PX', 
        data: GENERALES.TIPO_PUNTOS.FONDO
      })
    }
    else if (this.tipoPuntoSeleccionado == GENERALES.TIPO_PUNTOS.OFICINA) {
      // TODO: debe aarecer la vetana para crear oficina
      this.dialog.open(CrearPuntoComponent, {
        width: '600PX', 
        data: GENERALES.TIPO_PUNTOS.OFICINA
      })
    }
    else if (this.tipoPuntoSeleccionado == GENERALES.TIPO_PUNTOS.CLIENTE) {
      // TODO: debe aarecer la vetana para crear cliente
      this.dialog.open(CrearPuntoComponent, {
        width: '600PX', 
        data: GENERALES.TIPO_PUNTOS.CLIENTE
      })
    }
  }


  /**
   * Evento que valida la selecciond un punto
   * @BayronPerez
   */
   selectedPunto(param: any) {
    if(param != undefined) {
      this.puntoSeleccionado = param;
    }
  }

  eventoSelectionPuntoDetalleClick(element: any) {
    console.log(element)
    this.detallePuntoSeleccionado = element
  }

  infoDetallePunto(element: any) {
    this.dialog.open(InfoDetallesPuntoComponent, {
      width: 'auto', 
      data: element
    })
  }

  modificarDetallePunto(element: any) {
    this.dialog.open(InfoDetallesPuntoComponent, {
      width: 'auto', 
      data: element
    })
  }


  /**
   * Evento que levanta un openDialog para modificar un punto segun el tipo punto
   * @BaironPerez
   */
   modificarPunto() {
    this.gestionPuntosService.consultarPuntoCreadoById(this.puntoSeleccionado).subscribe(data => {
      if(data.tipoPunto == GENERALES.TIPO_PUNTOS.BANCO) {
        // TODO: debe aarecer la vetana para crear banco
        this.dialog.open(CrearPuntoComponent, {
          width: '600PX', 
          data: data
        })
      }
      else if (data.tipoPunto == GENERALES.TIPO_PUNTOS.CAJERO) {
        // TODO: debe aarecer la vetana para crear cajero
        this.dialog.open(CrearPuntoComponent, {
          width: '600PX', 
          data: data
        })
      }
      else if (data.tipoPunto == GENERALES.TIPO_PUNTOS.FONDO) {
        // TODO: debe aarecer la vetana para crear fondo
        this.dialog.open(CrearPuntoComponent, {
          width: '600PX', 
          data: data
        })
      }
      else if (data.tipoPunto == GENERALES.TIPO_PUNTOS.OFICINA) {
        // TODO: debe aarecer la vetana para crear oficina
        this.dialog.open(CrearPuntoComponent, {
          width: '600PX', 
          data: data
        })
      }
      else if (data.tipoPunto == GENERALES.TIPO_PUNTOS.CLIENTE) {
        // TODO: debe aarecer la vetana para crear cliente
        this.dialog.open(CrearPuntoComponent, {
          width: '600PX', 
          data: data
        })
      }
    });
  }

  mostrarMas(e: any) {
    this.listarPuntosSeleccionado(e.pageIndex, e.pageSize);
  }

}
