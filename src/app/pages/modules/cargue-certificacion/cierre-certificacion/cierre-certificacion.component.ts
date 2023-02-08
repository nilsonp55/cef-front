import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SpinnerComponent } from 'src/app/pages/shared/components/spinner/spinner.component';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { ErrorService } from 'src/app/_model/error.model';
import { LogProcesoDiarioService } from 'src/app/_service/contabilidad-service/log-proceso-diario.service';
import { CargueProgramacionCertificadaService } from 'src/app/_service/programacion-certificada.service/programacion-certificada-service';
import { CargueProgramacionPreliminarService } from 'src/app/_service/programacion-preliminar-service/cargue-programacion-preliminar.service';
import { ValidacionEstadoProcesosService } from 'src/app/_service/valida-estado-proceso.service';
import { GeneralesService } from 'src/app/_service/generales.service';

@Component({
  selector: 'app-cierre-certificacion',
  templateUrl: './cierre-certificacion.component.html',
  styleUrls: ['./cierre-certificacion.component.css']
})
export class CierreCertificacionComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  //Variable para activar spinner
  spinnerActive: boolean = false;

  //Rgistros paginados
  cantidadRegistros: number;
  fechaSistemaSelect: any;

  //DataSource para pintar tabla de los procesos a ejecutar
  dataSourceInfoProcesos: MatTableDataSource<any>;
  displayedColumnsInfoProcesos: string[] = ['idLogProceso', 'fechaProceso', 'actividad', 'estado', 'acciones'];

  constructor(
    private dialog: MatDialog,
    private logProcesoDiarioService: LogProcesoDiarioService,
    private cargueProgramacionPreliminarService: CargueProgramacionPreliminarService,
    private cargueProgramacionCertificadaService: CargueProgramacionCertificadaService,
    private validacionEstadoProcesosService: ValidacionEstadoProcesosService,
    public spinnerComponent: SpinnerComponent,
    private generalServices: GeneralesService
  ) { }

  ngOnInit(): void {
    this.cargarDatosDesplegables();
    this.listarProcesos();
  }

   /**
 * Se cargan datos para el inicio de la pantalla
 * @BaironPerez
 */
async cargarDatosDesplegables() {
  const _fecha = await this.generalServices.listarParametroByFiltro({
    codigo: "FECHA_DIA_PROCESO"
  }).toPromise();
  this.fechaSistemaSelect = _fecha.data[0].valor;
}

  /**
  * Se realiza consumo de servicio para listr los procesos a ejectar
  * @BaironPerez
  */
  listarProcesos(pagina = 0, tamanio = 5) {
    this.logProcesoDiarioService.obtenerProcesosDiarios({
      page: pagina,
      size: tamanio,
    }).subscribe((page: any) => {
      this.dataSourceInfoProcesos = new MatTableDataSource(page.data);
      this.dataSourceInfoProcesos.sort = this.sort;
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

  intervacierreCertificacion(idArchivo: any) {
    this.spinnerActive = true;
    this.ejecutar(idArchivo);
    let identificadorIntervaloDeTiempo;
    setInterval(() => { 
      this.validacionEstadoProceso();
    }, 10000);
  }

  /**
   * Metodo encargado de validar el estado de un proceso en particular
   */
  validacionEstadoProceso() {
    this.validacionEstadoProcesosService.validarEstadoProceso({
      'codigoProceso': "codigoProcesoDuvan",
      "fechaSIstema": this.fechaSistemaSelect
    }).subscribe((data: any) => {
      if(data.estado == "CERRADO"){
        this.spinnerActive = false;
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: "Se generó la contabilidad AM exitosamente",
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
          }
        }); setTimeout(() => { alert.close() }, 3000);
      }
      if(data.estado == "ERROR"){
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: data.mensaje,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        }); setTimeout(() => { alert.close() }, 3000);
      }
    });
  }

  /**
   * Metodo encargado de ejecutar el servicio de contabilidad para los 
   * procesos activos
   * @BaironPerez
   */
  ejecutar(idArchivo) {
    this.spinnerActive = true;
    this.cargueProgramacionCertificadaService.procesar({
        'agrupador': GENERALES.CARGUE_CERTIFICACION_PROGRAMACION_SERVICIOS
      }).subscribe(data => {
      this.spinnerActive = false;
      this.listarProcesos();
      const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
        width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
        data: {
          msn: GENERALES.MESSAGE_ALERT.MESSAGE_CIERRE_PROG_CERTIFICACION.SUCCESFULL_CIERRE_CERTIFICACION,
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
      });
  }

  /**
  * Metodo para gestionar la paginación de la tabla
  * @BaironPerez
  */
  mostrarMas(e: any) {
    this.listarProcesos(e.pageIndex, e.pageSize);
  }

  /** 
  * Metodo para reabrir un registro de archivo previamente cargado
  * @BaironPerez
  */
 reabrirCargue(nombreArchivo: string, idModeloArchivo: string) {
  this.cargueProgramacionPreliminarService.reabrirArchivo({
    'agrupador': "CERTI",
  }).subscribe(item => {
    this.listarProcesos();
    const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
      width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
      data: {
        msn: GENERALES.MESSAGE_ALERT.MESSAGE_CIERRE_PROG_DEFINITIVA.REABRIR_CIERRE,
        codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
      }
    });
    setTimeout(() => { alert.close() }, 3000);
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
