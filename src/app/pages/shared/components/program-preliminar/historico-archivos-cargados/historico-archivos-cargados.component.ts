import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ArchivoCargadoModel } from 'src/app/_model/cargue-preliminar-model/archivo-cargado.model';
import { ErrorService } from 'src/app/_model/error.model';
import { CargueArchivosService } from 'src/app/_service/cargue-archivos-service/cargue-archivo.service';
import { CargueProgramacionPreliminarService } from 'src/app/_service/programacion-preliminar-service/cargue-programacion-preliminar.service';
import { GENERALES } from '../../../constantes';
import { VentanaEmergenteResponseComponent } from '../../ventana-emergente-response/ventana-emergente-response.component';
import { LogArchivosCargadosComponent } from './log-archivos-cargados/log-archivos-cargados.component';

@Component({
  selector: 'app-historico-archivos-cargados',
  templateUrl: './historico-archivos-cargados.component.html',
  styleUrls: ['./historico-archivos-cargados.component.css']
})

/**
 * Componente para gestionar el historico de los cargues preliminares
 * @BaironPerez
*/
export class HistoricoArchivosCargadosComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  idArchivo: any;

  //Rgistros paginados
  cantidadRegistros: number;

  //DataSource para pintar tabla de archivos cargados
  dataSourceInfoArchivo: MatTableDataSource<ArchivoCargadoModel>;
  displayedColumnsInfoArchivo: string[] = ['nombreArchivo', 'fechaInicioCargue', 'numeroRegistros', 'estado', 'acciones'];

  constructor(
    private dialog: MatDialog,
    private cargueProgramacionPreliminarService: CargueProgramacionPreliminarService,
    private cargueArchivosService: CargueArchivosService
  ) { }

  ngOnInit(): void {
    this.listarArchivosCargados();
  }

  /**
  * Se realiza consumo de servicio para listr los archivos cargados
  * @BaironPerez
  */
  listarArchivosCargados(pagina = 0, tamanio = 5) {
    this.cargueArchivosService.obtenerArchivosCargados({
      'agrupador': GENERALES.CARGUE_PRELIMINAR_PROGRAMACION_SERVICIOS_IPP,
      page: pagina,
      size: tamanio,
    }).subscribe((page: any) => {
      this.dataSourceInfoArchivo = new MatTableDataSource(page.data.content);
      this.dataSourceInfoArchivo.sort = this.sort;
      this.cantidadRegistros = page.data.totalElements;
    },
      (err: ErrorService) => {
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: 'Error al obtener archivos de historial',
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        });   
      });
  }

  /**
   * Metodo encargado de mosrar la ventana emergente con el log de carga
   * @BaironPerez
   */
  verLog(idArchivoCargado) {
    this.cargueProgramacionPreliminarService.verDetalleArchivo({
      'idArchivoCargado': idArchivoCargado
    }).subscribe(data => {
      this.idArchivo = idArchivoCargado
      this.dialog.open(LogArchivosCargadosComponent, {
        width: '950px', height: '400px', data: {id: this.idArchivo, data},
      });
    });
  }

  /**
  * Metodo para gestionar la paginación de la tabla
  * @BaironPerez
  */
  mostrarMas(e: any) {
    this.listarArchivosCargados(e.pageIndex, e.pageSize);
  }

}
