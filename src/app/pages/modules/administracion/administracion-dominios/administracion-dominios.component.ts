import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConciliacionesCertificadaNoConciliadasModel } from 'src/app/_model/consiliacion-model/opera-certifi-no-conciliadas.model';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { ErrorService } from 'src/app/_model/error.model';
import { DialogTablaDominioComponent } from './dialog-tabla-dominio/dialog-tabla-dominio.component';
import { DialogIdentificadorDominioComponent } from './dialog-identificador-dominio/dialog-identificador-dominio.component';
import { DialogEliminarIdentificadorComponent } from './dialog-eliminar-identificador/dialog-eliminar-identificador.component';
import { DominioMaestroService } from 'src/app/_service/administracion-service/dominios-maestro.service';
import { GeneralesService } from 'src/app/_service/generales.service';

@Component({
  selector: 'app-administracion-dominios',
  templateUrl: './administracion-dominios.component.html',
  styleUrls: ['./administracion-dominios.component.css']
})
export class AdministracionDominiosComponent implements OnInit {

  btnEstado = true;
  isIdentChecked = true;
  isDominioChecked = true;
  btnActualizar = false;
  mostrarTablaCodigos = false;
  mostrarBtnDescripcionCodigo = false;
  mostrarBtnEliminarCodigo = false;
  elementoDominioActualizar: any;
  elementoCodigo: any;
  valorEstado: any;
  @ViewChild(MatSort) sort: MatSort;

  //Rgistros paginados
  cantidadRegistros: number;

  displayedColumns: string[] = ['name'];
  dataSource = ELEMENT_DATA;
  clickedRows = new Set<any>();

  displayedColumnsIdent: string[] = ['identificador', 'descripcion'];
  dataSourceCodigo = IDENT_DATA;
  clickedRowsIdent = new Set<Identificadores>();

  constructor(
    private dominioMaestroService: DominioMaestroService,
    private generalesService: GeneralesService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    //this.listarDominiosMaestroTrue();
    this.listarDominios();

  }

  dataSourceCodigos: MatTableDataSource<any>


  dataSourceDominios: MatTableDataSource<any>
  displayedColumnsDominios: string[] = ['name'];

  /**
* Metodo para gestionar la paginación de la tabla
* @JuanMazo
*/
  mostrarMas(e: any) {
    //this.listarArchivosCargados(e.pageIndex, e.pageSize);
  }

  define() {
    this.listarDominios()
  }


  defineCodigo(){
    console.log(this.isIdentChecked)
    this.listarCodigosDominio()
  }

  interpretaCheckBox(){
    if(this.isIdentChecked==true){
      this.valorEstado = "1"
    }
    if(this.isIdentChecked==false){
      this.valorEstado = ""
    }
    return this.valorEstado
  }

  listarCodigosDominio(){
    this.generalesService.listarDominioXDominio({
      'dominioPK.dominio':this.elementoDominioActualizar.dominio,
      'estado': this.interpretaCheckBox()
    }).subscribe((page: any) => {
      this.dataSourceCodigos = new MatTableDataSource(page.data);
      this.dataSourceCodigos.sort = this.sort;
      this.cantidadRegistros = page.data.totalElements;
    },
      (err: any) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: err.error.response.description,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        }); setTimeout(() => { alert.close() }, 3000);
      })
  }
  /**
   * Lista los dominios en estado true (Activos)
   * @JuanMazo
   */
  listarDominiosMaestroTrue() {
    console.log("No incluye Dominioos inactivos")
    console.log(this.isDominioChecked)
    this.dominioMaestroService.listarDominiosTrue({
      'estado': true
    }).subscribe((page: any) => {
      this.dataSourceDominios = new MatTableDataSource(page.data);
      this.dataSourceDominios.sort = this.sort;
      this.cantidadRegistros = page.data.totalElements;
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

  listarDominios() {
    if (this.isDominioChecked == true) {
      this.listarDominiosMaestroTrue()
    } else {
      console.log("Tiene dominios activos e inactivos")
      console.log(this.isDominioChecked)
      this.dominioMaestroService.listarDominios().subscribe((page: any) => {
        this.dataSourceDominios = new MatTableDataSource(page.data);
        this.dataSourceDominios.sort = this.sort;
        this.cantidadRegistros = page.data.totalElements;
      },
        (err: any) => {
          const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
            width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
            data: {
              msn: err.error.response.description,
              codigo: GENERALES.CODE_EMERGENT.ERROR
            }
          }); setTimeout(() => { alert.close() }, 3000);
        })
    }
  }

  listarCodigoSeleccionado() {
    this.generalesService.listarDominioXDominio({
      'dominioPK.dominio':this.elementoDominioActualizar.dominio
    }).subscribe((page: any) => {
      this.dataSourceCodigos = new MatTableDataSource(page.data);
      this.dataSourceCodigos.sort = this.sort;
      this.cantidadRegistros = page.data.totalElements;
    },
      (err: any) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: err.error.response.description,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        }); setTimeout(() => { alert.close() }, 3000);
      })
  }

  /**
  * Evento que levanta un openDialog para crear una tabla de dominio
  * @JuanMazo
  */
  crearTablaDominio() {
    const _dialogRef = this.dialog.open(DialogTablaDominioComponent, {
      width: '700px',
      data: { titulo: "Crear " }
    })
    _dialogRef.afterClosed().subscribe(result => {
      this.isDominioChecked = true
      this.listarDominios();
    })
  }


  eventoClick(element: any) {
    this.btnEstado = false;
    this.mostrarTablaCodigos = true
    this.elementoDominioActualizar = element;
    this.listarCodigoSeleccionado()
    console.log(this.elementoDominioActualizar)
  }


  eventoClickCodigo(element: any) {
    console.log(element)
    this.mostrarBtnDescripcionCodigo = true;
    this.mostrarBtnEliminarCodigo = true;
    this.elementoCodigo = element;
  }


  /**
 * Evento que levanta un openDialog para actualizar una tabla de dominio
 * @JuanMazo
 */
  actualizarTablaDominio() {
    const _dialogRef = this.dialog.open(DialogTablaDominioComponent, {
      width: '700PX',
      data: { data: this.elementoDominioActualizar, titulo: "Actualizar " }
    })
    _dialogRef.afterClosed().subscribe(result => {
      this.listarDominios();
    })
  }

  /**
* Evento que levanta un openDialog para crear un identificador segun el id de un dominio
* @JuanMazo
*/
  crearCodigo() {
    this.dialog.open(DialogIdentificadorDominioComponent, {
      width: '700PX'
    })
  }

  /**
* Evento que levanta un openDialog para modificar un identificador segun el id de un dominio
* @JuanMazo
*/
  modificarIdentificador() {
    this.dialog.open(DialogIdentificadorDominioComponent, {
      width: '700PX'
    })
  }

  /**
* Evento que levanta un openDialog para eliminar un identificador segun el id de un dominio
* @JuanMazo
*/
  eliminarIdentificador() {
    this.dialog.open(DialogEliminarIdentificadorComponent, {
      width: '700PX'
    })
  }

}


export interface PeriodicElement {
  name: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'Bancos Aval' },
  { name: 'Bancos del Pais' },
  { name: 'Calidades Efectivo' },
  { name: 'Ciudades' },
  { name: 'Estado Operación' },
  { name: 'Familias de Efectivo' },
  { name: 'Monedas' },
  { name: 'Tipos de Puntos' },
  { name: 'Tipos de Efectivo' },
  { name: 'Tipos de Servicio' },
  { name: 'Tipos de Movimiento' },
  { name: 'Inactivo - Dominio prueba' }
];

export interface Identificadores {
  identificador: string;
  descripcion: string;
}

const IDENT_DATA: Identificadores[] = [
  { identificador: 'Cambio', descripcion: 'Solicitud de dindero sencillo' },
  { identificador: 'Cambio', descripcion: 'Solicitud de dindero sencillo' },
  { identificador: 'Cambio', descripcion: 'Solicitud de dindero sencillo' },
  { identificador: 'Cambio', descripcion: 'Solicitud de dindero sencillo' },
  { identificador: 'Cambio', descripcion: 'Solicitud de dindero sencillo' },
  { identificador: 'Cambio', descripcion: 'Solicitud de dindero sencillo' },
  { identificador: 'Cambio', descripcion: 'Solicitud de dindero sencillo' },
  { identificador: 'Cambio', descripcion: 'Solicitud de dindero sencillo' },
  { identificador: 'Cambio', descripcion: 'Solicitud de dindero sencillo' },
  { identificador: 'Cambio', descripcion: 'Solicitud de dindero sencillo' }
];