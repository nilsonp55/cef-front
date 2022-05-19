import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ErrorService } from 'src/app/_model/error.model';
import { saveAs } from 'file-saver';
import { VentanaEmergenteResponseComponent } from '../../ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from '../../../constantes';
import { DialogResultValidacionComponent } from './dialog-result-validacion/dialog-result-validacion.component';
import { DialogValidarArchivoComponent } from './dialog-validar-archivo/dialog-validar-archivo.component';
import { ArchivoCargadoModel } from 'src/app/_model/cargue-preliminar-model/archivo-cargado.model';
import { CargueProgramacionPreliminarService } from 'src/app/_service/programacion-preliminar-service/cargue-programacion-preliminar.service';
import { ValidacionArchivo } from 'src/app/_model/cargue-preliminar-model/validacion-archivo.model';
import { CargueArchivosService } from 'src/app/_service/cargue-archivos-service/cargue-archivo.service';
import { SpinnerComponent } from '../../spinner/spinner.component';


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
    private cargueProgramacionPreliminarService: CargueProgramacionPreliminarService,
    private cargueArchivosService: CargueArchivosService,
    public spinnerComponent: SpinnerComponent
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
      'idMaestroDefinicion': GENERALES.CARGUE_PRELIMINAR_PROGRAMACION_SERVICIOS,
      'estado': GENERALES.ESTADO_PENDIENTE
    }).subscribe((page: any) => {
      this.dataSourceInfoArchivo = new MatTableDataSource(page.data);
      this.dataSourceInfoArchivo.sort = this.sort;
      this.cantidadRegistros = page.data.totalElements;
    },
      (err: ErrorService) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_DATA_FILE,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        }); setTimeout(() => { alert.close() }, 3000);
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
      width: '750px',
    });
    validateArchivo.afterClosed().subscribe(result => {
      //Si presiona click en aceptar
      if (result) {
        this.spinnerActive = true;
        this.spinnerComponent.dateToString(true);
        this.cargueProgramacionPreliminarService.validarArchivo({
          'idMaestroDefinicion': GENERALES.CARGUE_PRELIMINAR_PROGRAMACION_SERVICIOS,
          'nombreArchivo': archivo.nombreArchivo
        }).subscribe((data: ValidacionArchivo) => {
          this.spinnerActive = false;
          this.dialog.open(DialogResultValidacionComponent, {
            width: '750', height: '400', data: data
          });
        },
          (err: any) => {
            this.spinnerActive = false;
            const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
              width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
              data: {
                msn: err.error.response.description, codigo: GENERALES.CODE_EMERGENT.ERROR
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
    this.cargueProgramacionPreliminarService.procesarArchivo({
      'idMaestroDefinicion': GENERALES.CARGUE_PRELIMINAR_PROGRAMACION_SERVICIOS,
      'nombreArchivo': archivo.nombreArchivo
    }).subscribe((data: any) => {
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
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_LOAD_FILE.ERROR_PROCESS_FILE,
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
    this.cargueArchivosService.visializarArchivo1(archivo.idArchivo).subscribe(blob => {
      saveAs(blob, archivo.nombreArchivo);
    });
  }

  /** 
  * Metodo para eliminar un registro de archivo previamente cargado
  * @BaironPerez
  */
  eliminarArchivo(param: any) {
    this.cargueProgramacionPreliminarService.deleteArchivo({
      'id': param
    }).subscribe(item => {
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

}
