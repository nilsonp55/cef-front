import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConciliacionesCertificadaNoConciliadasModel } from 'src/app/_model/consiliacion-model/opera-certifi-no-conciliadas.model';
import { OpConciliadasService } from 'src/app/_service/conciliacion-service/op-conicliadas.service';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { ErrorService } from 'src/app/_model/error.model';
import { DialogTablaDominioComponent } from './dialog-tabla-dominio/dialog-tabla-dominio.component';
import { DialogIdentificadorDominioComponent } from './dialog-identificador-dominio/dialog-identificador-dominio.component';
import { DialogEliminarIdentificadorComponent } from './dialog-eliminar-identificador/dialog-eliminar-identificador.component';

@Component({
  selector: 'app-administracion-dominios',
  templateUrl: './administracion-dominios.component.html',
  styleUrls: ['./administracion-dominios.component.css']
})
export class AdministracionDominiosComponent implements OnInit {

  isIdentChecked = true;
  isDominioChecked = true;
  @ViewChild(MatSort) sort: MatSort;

  //Rgistros paginados
  cantidadRegistros: number;

  displayedColumns: string[] = ['name'];
  dataSource = ELEMENT_DATA;
  clickedRows = new Set<PeriodicElement>();

  displayedColumnsIdent: string[] = ['identificador', 'descripcion'];
  dataSourceEdent = IDENT_DATA;
  clickedRowsIdent = new Set<Identificadores>();

  constructor(
    private opConciliadasService: OpConciliadasService,
    private dialog: MatDialog) { }

  ngOnInit(): void {

  }

  dataSourceOperacionesDominios: MatTableDataSource<ConciliacionesCertificadaNoConciliadasModel>
  displayedColumnsDominios: string[] = ['name'];

  /**
* Metodo para gestionar la paginación de la tabla
* @JuanMazo
*/
  mostrarMas(e: any) {
    //this.listarArchivosCargados(e.pageIndex, e.pageSize);
  }

  /**
   * Lista los dominios
   * @JuanMazo
   */
  listarDominios() {
    this.opConciliadasService.obtenerOpCertificadasSinconciliar({
      'estadoConciliacion': GENERALES.ESTADOS_CONCILIACION.ESTADO_NO_CONCILIADO
    }).subscribe((page: any) => {
      this.dataSourceOperacionesDominios = new MatTableDataSource(page.data.content);
      this.dataSourceOperacionesDominios.sort = this.sort;
      this.cantidadRegistros = page.data.totalElements;
    },
      (err: ErrorService) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CONCILIATION.ERROR_OBTENER_CERTIFICADAS,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        }); setTimeout(() => { alert.close() }, 3000);
      });
  }

  /**
  * Evento que levanta un openDialog para crear una tabla de dominio
  * @JuanMazo
  */
  crearTablaDominio() {
    this.dialog.open(DialogTablaDominioComponent, {
      width: '700px'
    })
  }

  /**
 * Evento que levanta un openDialog para actualizar una tabla de dominio
 * @JuanMazo
 */
  actualizarTablaDominio() {
    this.dialog.open(DialogTablaDominioComponent, {
      width: '700PX'
    })
  }

  /**
* Evento que levanta un openDialog para crear un identificador segun el id de un dominio
* @JuanMazo
*/
  crearIdentificador() {
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