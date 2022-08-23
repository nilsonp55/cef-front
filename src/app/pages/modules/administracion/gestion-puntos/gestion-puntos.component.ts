import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CrearPuntoComponent } from './crear-punto/crear-punto.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GestionPuntosService } from 'src/app/_service/gestion-puntos-service/gestionPuntos.service';

@Component({
  selector: 'app-gestion-puntos',
  templateUrl: './gestion-puntos.component.html',
  styleUrls: ['./gestion-puntos.component.css']
})
export class GestionPuntosComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;

  isPointChecked = false;
  tipoPuntoSeleccionado;
  puntoSeleccionado;

  //Rgistros paginados
  cantidadRegistros: number;

  //Variable para activar spinner
  spinnerActive: boolean = false;

  displayedColumns: string[] = ['name'];
  dataSource = ELEMENT_DATA;
  clickedRows = new Set<PeriodicElement>();

  displayedColumnsIdent: string[] = ['codigo_punto', 'descripcion', 'ciudad'];
  dataSourceEdent = IDENT_DATA;
  clickedRowsIdent = new Set<Identificadores>();

  dataSourceOperacionesDominios: MatTableDataSource<any>
  displayedColumnsDominios: string[] = ['name'];


  constructor(
    private dialog: MatDialog,
    private gestionPuntosService: GestionPuntosService) 
    { }


  ngOnInit(): void {

  }

  /**
   * Listar puntos creados para realizar acciones
   * @BayronPerez
   */
  listarPuntosCreados() {
    this.spinnerActive = true;
    this.gestionPuntosService.listarPuntosCreados({
      "tipoPunto": this.tipoPuntoSeleccionado
    }).subscribe(data => {
      this.spinnerActive = false;
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

}


export interface PeriodicElement {
  name: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'BANCO' },
  { name: 'BAN_REP' },
  { name: 'CAJERO' },
  { name: 'CLIENTE' },
  { name: 'FONDO' },
  { name: 'OFICINA' }
];

export interface Identificadores {
  codigo_punto: string;
  descripcion: string;
  ciudad: string;
}

const IDENT_DATA: Identificadores[] = [
  { codigo_punto: '123', descripcion: 'Solicitud de dindero sencillo', ciudad: 'Medellin' },
  { codigo_punto: '123', descripcion: 'Solicitud de dindero sencillo', ciudad: 'Bucaramanga' },
  { codigo_punto: '123', descripcion: 'Solicitud de dindero sencillo', ciudad: 'Medellin' },
  { codigo_punto: '123', descripcion: 'Solicitud de dindero sencillo', ciudad: 'Medellin' },
  { codigo_punto: '123', descripcion: 'Solicitud de dindero sencillo', ciudad: 'Medellin' },
  { codigo_punto: '123', descripcion: 'Solicitud de dindero sencillo', ciudad: 'Medellin' },
  { codigo_punto: '123', descripcion: 'Solicitud de dindero sencillo', ciudad: 'Medellin' },
  { codigo_punto: '123', descripcion: 'Solicitud de dindero sencillo', ciudad: 'Medellin' }
];