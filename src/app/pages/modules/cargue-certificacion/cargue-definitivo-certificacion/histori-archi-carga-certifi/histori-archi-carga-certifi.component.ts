import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LogArchivosCargadosComponent } from 'src/app/pages/shared/components/program-preliminar/historico-archivos-cargados/log-archivos-cargados/log-archivos-cargados.component';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { ArchivoCargadoModel } from 'src/app/_model/cargue-preliminar-model/archivo-cargado.model';
import { CargueArchivosService } from 'src/app/_service/cargue-archivos-service/cargue-archivo.service';
import { CargueProgramacionDefinitivaService } from 'src/app/_service/programacion-definitiva-service/programacion-definitiva-service';

/**
 * Componente para gestionar el historico de los cargues preliminares
 * @BaironPerez
*/
@Component({
  selector: 'app-histori-archi-carga-certifi',
  templateUrl: './histori-archi-carga-certifi.component.html',
  styleUrls: ['./histori-archi-carga-certifi.component.css']
})
export class HistoriArchiCargaCertifiComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  //Registros paginados
  cantidadRegistros: number;

  idArchivo: any;

  //DataSource para pintar tabla de archivos cargados
  dataSourceInfoArchivo: MatTableDataSource<ArchivoCargadoModel>;
  displayedColumnsInfoArchivo: string[] = ['nombreArchivo', 'fechaArchivo', 'fechaInicioCargue', 'numeroRegistros', 'estadoCargue', 'acciones'];

  constructor(
    private dialog: MatDialog,
    private cargueProgramacionDefinitivoService: CargueProgramacionDefinitivaService,
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
      'agrupador': GENERALES.CARGUE_CERTIFICACION_PROGRAMACION_SERVICIOS,
      page: pagina,
      size: tamanio,
    }).subscribe({ next: (page: any) => {
      this.dataSourceInfoArchivo = new MatTableDataSource(page.data.content);
      this.dataSourceInfoArchivo.sort = this.sort;
      this.cantidadRegistros = page.data.totalElements;
    },
    error: (err: any) => {
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: err.error.response.description,
            codigo: GENERALES.MESSAGE_ALERT.MESSAGE_LOAD_FILE.ERROR_PROCESS_FILE,
            showResume: true,
            msgDetalles: JSON.stringify(err.error)
          }
        });
      }
    });
  }

  /**
   * Metodo encargado de mosrar la ventana emergente con el log de carga
   * @BaironPerez
   */
  verLog(idArchivoCargado) {
    this.cargueProgramacionDefinitivoService.verDetalleArchivo({
      'idArchivoCargado': idArchivoCargado
    }).subscribe(data => {
      this.idArchivo = idArchivoCargado
      this.dialog.open(LogArchivosCargadosComponent, {
        width: '80%', height: 'auto', maxHeight: '80%', data: {id: this.idArchivo, data},
      });
    });
  }//

  /**
  * Metodo para gestionar la paginación de la tabla
  * @BaironPerez
  */
  mostrarMas(e: any) {
    this.listarArchivosCargados(e.pageIndex, e.pageSize);
  }
}
