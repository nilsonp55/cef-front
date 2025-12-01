import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ArchivoCargadoModel } from 'src/app/_model/cargue-preliminar-model/archivo-cargado.model';
import { ValidacionArchivo } from 'src/app/_model/cargue-preliminar-model/validacion-archivo.model';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { DialogValidarArchivoComponent } from 'src/app/pages/shared/components/program-preliminar/archivos-cargados/dialog-validar-archivo/dialog-validar-archivo.component';
import { CargueProgramacionDefinitivaService } from 'src/app/_service/programacion-definitiva-service/programacion-definitiva-service';
import { DialogVerArchivoComponent } from 'src/app/pages/shared/components/program-preliminar/archivos-cargados/dialog-ver-archivo/dialog-ver-archivo.component';
import { DialogResultValidacionComponent } from 'src/app/pages/shared/components/program-preliminar/archivos-cargados/dialog-result-validacion/dialog-result-validacion.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-archivos-cargados-definitivo',
  templateUrl: './archivos-cargados-definitivo.component.html',
  styleUrls: ['./archivos-cargados-definitivo.component.css']
})
export class ArchivosCargadosDefinitivoComponent implements OnInit {

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @Output() onArchivoProcesado = new EventEmitter<void>();

  //Registros paginados
  cantidadRegistros: number;

  //Variable para activar spinner
  spinnerActive: boolean = false;

  //DataSource para pintar tabla de archivos cargados
  dataSourceInfoArchivo: MatTableDataSource<ArchivoCargadoModel>;
  displayedColumnsInfoArchivo: string[] = ['nombreArchivo', 'fechaArchivo', 'estado', 'acciones'];

  pageSizeOptions: number[] = [5, 10, 25, 100, 500];

  constructor(
    private readonly dialog: MatDialog,
    private readonly cargueProgramacionDefinitivaService: CargueProgramacionDefinitivaService
  ) { }


  //Ejecución inicial
  ngOnInit(): void {
    this.listarArchivosCargados();
  }

  /**
  * Metodo encargado de realizar consumo de servicio para listar los archivos cargados definitivos
  * @param: pagina, tamanio
  * @BaironPerez
  */
  listarArchivosCargados(pagina = 0, tamanio = 5) {
    this.cargueProgramacionDefinitivaService.consultarArchivosCargaDefinitiva({
      'estado': GENERALES.ESTADO_PENDIENTE,
      'idModeloArchivo': GENERALES.CARGUE_DEFINITIVO_PROGRAMACION_SERVICIOS,
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
            msn: err.error.response.description,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        });
      }
    });
  }

  /**
  * Metodo encargado de validar un archivo seleccionado y visualizar su resultado en log emergente
  * @param: Archivo seleccionado
  * @BaironPerez*
  */
  validarArchivo(archivo: any) {
    //ventana de confirmacion
    const validateArchivo = this.dialog.open(DialogValidarArchivoComponent, {
      width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
      data: { nombreArchivo: archivo.nombreArchivo }
    });
    validateArchivo.afterClosed().subscribe(result => {
      if (result) {
        this.modalProcesoEjecucion();
        this.cargueProgramacionDefinitivaService.validarArchivo({
          'idMaestroDefinicion': archivo.idModeloArchivo,
          'nombreArchivo': archivo.nombreArchivo
        }).subscribe({
          next: (data: ValidacionArchivo) => {
            this.listarArchivosCargados();
            Swal.close();
            this.dialog.open(DialogResultValidacionComponent, {
              width: '90%', height: 'auto', maxHeight: '80%', data: { id: archivo.idModeloArchivo, data },
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
    this.cargueProgramacionDefinitivaService.procesarArchivo({
      'idMaestroDefinicion': archivo.idModeloArchivo,
      'nombreArchivo': archivo.nombreArchivo
    }).subscribe({
      next: (data: any) => {
        this.listarArchivosCargados();
        Swal.close();
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_LOAD_FILE.SUCCESFULL_PROCESS_FILE,
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
          }
        });
        this.onArchivoProcesado.emit();
      },
      error: (err: any) => {
        Swal.close();
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
  downloadFile(archivo: ArchivoCargadoModel): void {
    this.dialog.open(DialogVerArchivoComponent, {
      height: '90%', width: '90%', data: archivo
    });
  }

  /**
  * Metodo para eliminar un registro de archivo previamente cargado
  * @BaironPerez
  */
  eliminarArchivo(nombreArchivo: string, idModeloArchivo: string) {
    this.modalProcesoEjecucion();
    this.cargueProgramacionDefinitivaService.deleteArchivo({
      'nombreArchivo': nombreArchivo,
      'idModeloArchivo': idModeloArchivo
    }).subscribe({
      next: item => {
        this.listarArchivosCargados();
        Swal.close();
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_LOAD_FILE.SUCCESFULL_DELETE_FILE,
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
          }
        });
      },
      error: (err: any) => {
        Swal.close();
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: err.error.response.description,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        });
      }
    })
  }

  /**
  * Metodo para reabrir un registro de archivo previamente cargado
  * @BaironPerez
  */
  reabrirCargue(nombreArchivo: string, idModeloArchivo: string) {
    this.cargueProgramacionDefinitivaService.reabrirArchivo({
      'nombreArchivo': nombreArchivo,
      'idModeloArchivo': idModeloArchivo
    }).subscribe({
      next: item => {
        this.listarArchivosCargados();
        let messageResponse: string = item.data
        let messageValidate = messageResponse.indexOf('Error')
        if (messageValidate == 1) {
          this.dialog.open(VentanaEmergenteResponseComponent, {
            width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
            data: {
              msn: GENERALES.MESSAGE_ALERT.MESSAGE_CIERRE_PROG_DEFINITIVA.REABRIR_CIERRE,
              codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
            }
          });
        } else {
          this.dialog.open(VentanaEmergenteResponseComponent, {
            width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
            data: {
              msn: messageResponse,
              codigo: GENERALES.CODE_EMERGENT.ERROR
            }
          });
        }

      },
      error: (err: any) => {
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: err.error.response.description,
            codigo: GENERALES.CODE_EMERGENT.ERROR
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
}
