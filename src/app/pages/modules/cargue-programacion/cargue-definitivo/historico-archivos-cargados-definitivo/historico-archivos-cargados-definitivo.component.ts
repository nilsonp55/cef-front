import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { ArchivoCargadoModel } from 'src/app/_model/cargue-preliminar-model/archivo-cargado.model';
import { CargueArchivosService } from 'src/app/_service/cargue-archivos-service/cargue-archivo.service';
import { CargueProgramacionDefinitivaService } from 'src/app/_service/programacion-definitiva-service/programacion-definitiva-service';
import { LogArchivoCargadoDefinitivoComponent } from './log-archivo-cargado-definitivo/log-archivo-cargado.component';

@Component({
  selector: 'app-historico-archivos-cargados-definitivo',
  templateUrl: './historico-archivos-cargados-definitivo.component.html',
  styleUrls: ['./historico-archivos-cargados-definitivo.component.css']
})

/**
 * Componente para gestionar el historico de los cargues preliminares
 * @BaironPerez
*/
export class HistoricoArchivosCargadosDefinitivoComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  //Rgistros paginados
  cantidadRegistros: number;
  idModeloArch: string;
  idArchivo: any;

  //DataSource para pintar tabla de archivos cargados
  dataSourceInfoArchivo: MatTableDataSource<ArchivoCargadoModel>;
  displayedColumnsInfoArchivo: string[] = ['nombreArchivo', 'fechaInicioCargue', 'numeroRegistros', 'estado', 'acciones'];

  constructor(
    private readonly dialog: MatDialog,
    private readonly cargueProgramacionDefinitivoService: CargueProgramacionDefinitivaService,
    private readonly cargueArchivosService: CargueArchivosService
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
      'agrupador': GENERALES.CARGUE_DEFINITIVO_PROGRAMACION_SERVICIOS,
      page: pagina,
      size: tamanio,
    }).subscribe({next: (page: any) => {
      this.dataSourceInfoArchivo = new MatTableDataSource(page.data.content);
      this.dataSourceInfoArchivo.sort = this.sort;
      this.cantidadRegistros = page.data.totalElements;
    },
    error:  (err: any) => {
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: err.error.response.description,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        });
      }});
  }

  /**
   * Metodo encargado de mosrar la ventana emergente con el log de carga
   * @BaironPerez
   */
  verLog(idArchivoCargado, idModeloArchivo) {
    this.cargueProgramacionDefinitivoService.verDetalleArchivo({
      'idArchivoCargado': idArchivoCargado
    }).subscribe({next: data => {
      this.idArchivo = idArchivoCargado;
      this.idModeloArch = idModeloArchivo;
      this.dialog.open(LogArchivoCargadoDefinitivoComponent, {
        width: '950px', height: 'auto', data: {id: this.idArchivo, idModArch: this.idModeloArch, data}
      });
    },
    error:  (err: any) => {
      this.dialog.open(VentanaEmergenteResponseComponent, {
        width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
        data: {
          msn: err.error.response.description,
          codigo: GENERALES.CODE_EMERGENT.ERROR
        }
      });
    }
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
