import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ErrorService } from 'src/app/_model/error.model';
import { saveAs } from 'file-saver';
import { ArchivoCargadoModel } from 'src/app/_model/cargue-preliminar-model/archivo-cargado.model';
import { ValidacionArchivo } from 'src/app/_model/cargue-preliminar-model/validacion-archivo.model';
import { CargueArchivosService } from 'src/app/_service/cargue-archivos-service/cargue-archivo.service';
import { SpinnerComponent } from 'src/app/pages/shared/components/spinner/spinner.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { DialogValidarArchivoComponent } from 'src/app/pages/shared/components/program-preliminar/archivos-cargados/dialog-validar-archivo/dialog-validar-archivo.component';
import { CargueProgramacionDefinitivaService } from 'src/app/_service/programacion-definitiva-service/programacion-definitiva-service';
import { DialogResultValidacionCertificacionComponent } from './result-validacion-certificacion/result-validacion.component';

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
    private cargueProgramacionDefinitivaService: CargueProgramacionDefinitivaService,
    private cargueArchivosService: CargueArchivosService,
    public spinnerComponent: SpinnerComponent
  ) { }


  //Ejecución inicial
  ngOnInit(): void {debugger
    this.listarArchivosCargados();
  }

  /** 
  * Metodo encargado de realizar consumo de servicio para listar los archivos cargados definitivos
  * @param: pagina, tamanio
  * @BaironPerez
  */
  listarArchivosCargados(pagina = 0, tamanio = 5) {debugger
    this.cargueProgramacionDefinitivaService.consultarArchivosCargaDefinitiva({
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
  * @BaironPerez*
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
        this.cargueProgramacionDefinitivaService.validarArchivo({
          'idMaestroDefinicion': GENERALES.CARGUE_PRELIMINAR_PROGRAMACION_SERVICIOS,
          'nombreArchivo': archivo.nombreArchivo
        }).subscribe((data: ValidacionArchivo) => {
          this.spinnerActive = false;
          this.dialog.open(DialogResultValidacionCertificacionComponent, {
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
    this.cargueProgramacionDefinitivaService.procesarArchivo({
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
    this.cargueProgramacionDefinitivaService.deleteArchivo({
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
