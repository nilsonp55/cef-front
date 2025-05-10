import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ArchivoCargadoModel } from 'src/app/_model/cargue-preliminar-model/archivo-cargado.model';
import { ValidacionArchivo } from 'src/app/_model/cargue-preliminar-model/validacion-archivo.model';
import { SpinnerComponent } from 'src/app/pages/shared/components/spinner/spinner.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { DialogValidarArchivoComponent } from 'src/app/pages/shared/components/program-preliminar/archivos-cargados/dialog-validar-archivo/dialog-validar-archivo.component';
import { DialogResultValidacionCertificacionComponent } from './result-validacion-certificacion/result-validacion.component';
import { CargueProgramacionCertificadaService } from 'src/app/_service/programacion-certificada.service/programacion-certificada-service';
import { DialogVerArchivoComponent } from 'src/app/pages/shared/components/program-preliminar/archivos-cargados/dialog-ver-archivo/dialog-ver-archivo.component';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';

@Component({
  selector: 'app-archi-carga-certificacion',
  templateUrl: './archi-carga-certificacion.component.html',
  styleUrls: ['./archi-carga-certificacion.component.css']
})

/**
 *Clase encargada de gestionar los archivos cargados certificados pendientes
 *@BaironPerez
 */
export class ArchiCargaCertificacionComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  //Rgistros paginados
  cantidadRegistros: number;

  //Variable para activar spinner
  spinnerActive: boolean = false;

  //DataSource para pintar tabla de archivos cargados
  dataSourceInfoArchivo: MatTableDataSource<ArchivoCargadoModel>;
  displayedColumnsInfoArchivo: string[] = ['nombreArchivo', 'fechaInicioCargue', 'estado', 'acciones'];


  constructor(private http: HttpClient,
    private dialog: MatDialog,
    private cargueProgramacionCertificadaService: CargueProgramacionCertificadaService,
    public spinnerComponent: SpinnerComponent
  ) { }


  //Ejecución inicial
  ngOnInit(): void {
    ManejoFechaToken.manejoFechaToken();
    this.listarArchivosCargados();
  }

  /**
  * Metodo encargado de realizar consumo de servicio para listar los archivos cargados definitivos
  * @param: pagina, tamanio
  * @BaironPerez
  */
  listarArchivosCargados(pagina = 0, tamanio = 5) {
    this.cargueProgramacionCertificadaService.consultarArchivosCargaCertificacion({
      'idMaestroDefinicion': GENERALES.CARGUE_CERTIFICACION_PROGRAMACION_SERVICIOS,
      'estado': GENERALES.ESTADO_PENDIENTE,
      page: pagina,
      size: tamanio,
    }).subscribe((page: any) => {
      this.dataSourceInfoArchivo = new MatTableDataSource(page.data);
      this.dataSourceInfoArchivo.sort = this.sort;
      this.cantidadRegistros = page.data.totalElements;
    },
      (err: any) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: err.error.response? err.error.response.description : err.error.error,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        }); setTimeout(() => { alert.close() }, 3000);
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
      width: '750px',
      data: { nombreArchivo: archivo.nombreArchivo }
    });
    validateArchivo.afterClosed().subscribe(result => {
      //Si presiona click en aceptar
      if (result) {
        this.spinnerActive = true;
        this.spinnerComponent.dateToString(true);
        this.cargueProgramacionCertificadaService.validarArchivo({
          'idMaestroDefinicion': archivo.idModeloArchivo,
          'nombreArchivo': archivo.nombreArchivo
        }).subscribe((data: ValidacionArchivo) => {
          this.spinnerActive = false;
          this.dialog.open(DialogResultValidacionCertificacionComponent, {
            width: '950px', height: '60%', data: { id: archivo.idModeloArchivo, data },
          });
        },
          (err: any) => {
            this.spinnerActive = false;
            const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
              width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
              data: {
                msn: err.error.response.description,
              }
            }); setTimeout(() => { alert.close() }, 3500);
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
    this.spinnerActive = true;
    this.spinnerComponent.dateToString(true);
    this.cargueProgramacionCertificadaService.procesarArchivo({
      'idMaestroDefinicion': archivo.idModeloArchivo,
      'nombreArchivo': archivo.nombreArchivo
    }).subscribe((data: any) => {
      this.listarArchivosCargados();
      this.spinnerActive = false;
      const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
        width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
        data: {
          msn: GENERALES.MESSAGE_ALERT.MESSAGE_LOAD_FILE.SUCCESFULL_PROCESS_FILE,
          codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
        }
      }); setTimeout(() => { alert.close() }, 3500);
    },
      (err: any) => {
        this.spinnerActive = false;
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: err.error.response.description,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        }); setTimeout(() => { alert.close() }, 3500);
      })
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
    const verArchivo = this.dialog.open(DialogVerArchivoComponent, {
      height: '90%', width: '90%', data: archivo
    });
  }

  /**
  * Metodo para eliminar un registro de archivo previamente cargado
  * @BaironPerez
  */
  eliminarArchivo(nombreArchivo: string, idModeloArchivo: string) {
    this.cargueProgramacionCertificadaService.deleteArchivo({
      'nombreArchivo': nombreArchivo,
      'idModeloArchivo': idModeloArchivo
    }).subscribe(item => {
      this.listarArchivosCargados();
      const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
        width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
        data: {
          msn: GENERALES.MESSAGE_ALERT.MESSAGE_LOAD_FILE.SUCCESFULL_DELETE_FILE,
          codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
        }
      });
      setTimeout(() => { alert.close() }, 3000);
    })
  }

  /**
  * Metodo para reabrir un registro de archivo previamente cargado
  * @BaironPerez
  */
  reabrirCargue(nombreArchivo: string, idModeloArchivo: string) {
    this.cargueProgramacionCertificadaService.reabrirArchivo({
      'nombreArchivo': nombreArchivo,
      'idModeloArchivo': idModeloArchivo
    }).subscribe(item => {
      this.listarArchivosCargados();
      let messageResponse: string = item.data
      let messageValidate = messageResponse.indexOf('Error')
      if (messageValidate == 1) {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CIERRE_PROG_DEFINITIVA.REABRIR_CIERRE,
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
          }
        });
        setTimeout(() => { alert.close() }, 3000);
      } else {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: messageResponse,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        });
        setTimeout(() => { alert.close() }, 3000);
      }
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
