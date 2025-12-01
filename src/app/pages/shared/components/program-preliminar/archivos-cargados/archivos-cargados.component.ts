import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { VentanaEmergenteResponseComponent } from '../../ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from '../../../constantes';
import { DialogResultValidacionComponent } from './dialog-result-validacion/dialog-result-validacion.component';
import { DialogValidarArchivoComponent } from './dialog-validar-archivo/dialog-validar-archivo.component';
import { ArchivoCargadoModel } from 'src/app/_model/cargue-preliminar-model/archivo-cargado.model';
import { CargueProgramacionPreliminarService } from 'src/app/_service/programacion-preliminar-service/cargue-programacion-preliminar.service';
import { ValidacionArchivo } from 'src/app/_model/cargue-preliminar-model/validacion-archivo.model';
import { CargueArchivosService } from 'src/app/_service/cargue-archivos-service/cargue-archivo.service';
import { DialogVerArchivoComponent } from './dialog-ver-archivo/dialog-ver-archivo.component';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-archivos-cargados',
  templateUrl: './archivos-cargados.component.html',
  styleUrls: ['./archivos-cargados.component.css']
})

/**
 * Componente para gestionar los cargues de programación preliminar
 * @BaironPerez
*/
export class ArchivosCargadosComponent implements OnInit {

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @Output() onArchivoProcesado = new EventEmitter<void>();

  //Registros paginados
  cantidadRegistros: number;

  fechaDatoIni: Date;

  pageSizeOptions: number[] = [5, 10, 25, 100, 500];

  //Variable para activar spinner
  spinnerActive: boolean = false;

  //DataSource para pintar tabla de archivos cargados
  dataSourceInfoArchivo: MatTableDataSource<ArchivoCargadoModel>;
  displayedColumnsInfoArchivo: string[] = ['nombreArchivo', 'fechaArchivo', 'estado', 'acciones'];


  constructor(
    private readonly dialog: MatDialog,
    private readonly cargueProgramacionPreliminarService: CargueProgramacionPreliminarService,
    private readonly cargueArchivosService: CargueArchivosService
  ) { }


  //Ejecución inicial
  ngOnInit(): void {
    this.listarArchivosCargados();
  }

  /**
  * Metodo encargado de realizar consumo de servicio para listar los archivos cargados
  * @param: pagina, tamanio
  * @BaironPerez
  */
  listarArchivosCargados(pagina = 0, tamanio = 5) {
    this.cargueArchivosService.obtenerArchivosSubidosPendientesCarga({
      'idModeloArchivo': GENERALES.CARGUE_PRELIMINAR_PROGRAMACION_SERVICIOS_IPP,
      'estado': GENERALES.ESTADO_PENDIENTE
    }).subscribe({
      next: (page: any) => {
        this.dataSourceInfoArchivo = new MatTableDataSource(page.data);
        this.dataSourceInfoArchivo.paginator = this.paginator
        this.dataSourceInfoArchivo.sort = this.sort;
        this.cantidadRegistros = page.data.totalElements;
      },
      error: (err: any) => {
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_DATA_FILE,
            codigo: GENERALES.CODE_EMERGENT.ERROR,
            showResume: true,
            msgDetalle: err.error.error + " - status: " + err.error.status
          }
        });
      }
    });
  }

  /**
  * Metodo encargado de validar un archivo seleccionado y visualizar su resultado en log emergente
  * @param: Archivo seleccionado
  * @BaironPerez
  */
  validarArchivo(archivo: any) {
    //ventana de confirmacion
    const validateArchivo = this.dialog.open(DialogValidarArchivoComponent, {
      width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
      data: { nombreArchivo: archivo.nombreArchivo },
    });
    validateArchivo.afterClosed().subscribe(result => {
      if (result) {
        this.modalProcesoEjecucion();
        this.cargueProgramacionPreliminarService.validarArchivo({
          'idMaestroDefinicion': GENERALES.CARGUE_PRELIMINAR_PROGRAMACION_SERVICIOS,
          'nombreArchivo': archivo.nombreArchivo
        }).subscribe({
          next: (data: ValidacionArchivo) => {
            this.listarArchivosCargados();
            Swal.close();
            this.dialog.open(DialogResultValidacionComponent, {
              height: 'autos', width: '90%', maxHeight: '90%', data: { id: archivo.idModeloArchivo, data }
            });
          },
          error: (err: any) => {
            Swal.close();
            this.dialog.open(VentanaEmergenteResponseComponent, {
              width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
              data: {
                msn: GENERALES.MESSAGE_ALERT.MESSAGE_LOAD_FILE.ERROR_VALIDATED_FILE,
                codigo: GENERALES.CODE_EMERGENT.ERROR,
                showResume: true,
                msgDetalles: JSON.stringify(err.error),
              }
            });
          }
        })
      }
    })
  }

  /**
  * Metodo encargado de procesar un archivo seleccionado y visualizar su resultado
  * @param: Archivo seleccionado
  * @BaironPerez
  */
  procesarArchivo(archivo: any) {
    this.modalProcesoEjecucion();
    this.cargueProgramacionPreliminarService.procesarArchivo({
      'idMaestroDefinicion': GENERALES.CARGUE_PRELIMINAR_PROGRAMACION_SERVICIOS,
      'nombreArchivo': archivo.nombreArchivo
    }).subscribe({
      next: (data: any) => {
        this.listarArchivosCargados();
        Swal.close();
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_LOAD_FILE.SUCCESFULL_PROCESS_FILE,
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL,
            showResume: true,
            msgDetalle: JSON.stringify(data.data)
          }
        });
        this.onArchivoProcesado.emit();
      },
      error: (err: any) => {
        Swal.close();
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_LOAD_FILE.ERROR_PROCESS_FILE,
            codigo: GENERALES.CODE_EMERGENT.ERROR,
            showResume: true,
            msgDetalle: JSON.stringify(err.error.response),
          }
        });
      }
    });
  }

  confirmEliminar(nombreArchivo: string, idModeloArchivo: string) {
    this.dialog.open(VentanaEmergenteResponseComponent, {
      width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
      data: {
        msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.MSG_DELETE_ROW + "\n\n" + nombreArchivo,
        codigo: GENERALES.CODE_EMERGENT.WARNING,
        showActions: true
      }
    }).afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.eliminarArchivo(nombreArchivo, idModeloArchivo);
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

  /**
  * Metodo para descargar y visualizar un archivo
  * @BaironPerez
  */
  downloadFile(archivo: any): void {
    this.dialog.open(DialogVerArchivoComponent, {
      height: '95%', width: '99%',
      data: archivo
    });

  }

  /**
  * Metodo para eliminar un registro de archivo previamente cargado
  * @BaironPerez
  */
  eliminarArchivo(nombreArchivo: string, idModeloArchivo: string) {
    this.modalProcesoEjecucion();
    this.cargueProgramacionPreliminarService.deleteArchivo({
      'nombreArchivo': nombreArchivo,
      'idMaestroArchivo': idModeloArchivo
    }).subscribe({
      next: item => {
        Swal.close();
        this.listarArchivosCargados();
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_LOAD_FILE.SUCCESFULL_DELETE_FILE,
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL,
            showResume: true,
            msgDetalle: JSON.stringify(item.response),
          }
        });
      },
      error: (err: any) => {
        Swal.close();
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_LOAD_FILE.ERROR_PROCESS_FILE,
            codigo: GENERALES.CODE_EMERGENT.ERROR,
            showResume: true,
            msgDetalle: JSON.stringify(err.error),
          }
        });
      }
    })
  }

  modalProcesoEjecucion() {
    Swal.fire({
      title: "Proceso en ejecución",
      imageUrl: "assets/img/loading.gif",
      imageWidth: 80,
      imageHeight: 80,
      showConfirmButton: false,
      allowOutsideClick: false,
      customClass: { popup: "custom-alert-swal-text" }
    });
  }

  /**
  * Metodo para reabrir un registro de archivo previamente cargado
  * @BaironPerez
  */
  reabrirCargue(nombreArchivo: string, idModeloArchivo: string) {
    this.cargueProgramacionPreliminarService.reabrirArchivo({
      'nombreArchivo': nombreArchivo,
      'idModeloArchivo': idModeloArchivo
    }).subscribe({
      next: item => {
        this.listarArchivosCargados();
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CIERRE_PROG_DEFINITIVA.REABRIR_CIERRE,
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL,
            showResume: true,
            msgDetalle: JSON.stringify(item.response)
          }
        });
      },
      error: (err: any) => {
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CIERRE_PROG_DEFINITIVA.ERROR_REABRIR_CIERRE,
            codigo: GENERALES.CODE_EMERGENT.ERROR,
            showResume: true,
            msgDetalle: JSON.stringify(err.error),
          }
        });
      }
    })
  }

}
