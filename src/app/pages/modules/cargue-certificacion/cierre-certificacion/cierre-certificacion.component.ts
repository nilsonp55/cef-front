import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SpinnerComponent } from 'src/app/pages/shared/components/spinner/spinner.component';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
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

  @ViewChild(MatSort) sort: MatSort;

  //Variable para activar spinner
  spinnerActive: boolean = false;
  idInterval: any;

  //Rgistros paginados
  cantidadRegistros: number;
  fechaSistemaSelect: any;

  //DataSource para pintar tabla de los procesos a ejecutar
  dataSourceInfoProcesos: MatTableDataSource<any>;
  displayedColumnsInfoProcesos: string[] = ['idLogProceso', 'fechaCreacion', 'codigoProceso', 'estadoProceso', 'acciones'];

  constructor(
    private readonly dialog: MatDialog,
    private readonly logProcesoDiarioService: LogProcesoDiarioService,
    private readonly cargueProgramacionPreliminarService: CargueProgramacionPreliminarService,
    private readonly cargueProgramacionCertificadaService: CargueProgramacionCertificadaService,
    private readonly validacionEstadoProcesosService: ValidacionEstadoProcesosService,
    public spinnerComponent: SpinnerComponent,
    private readonly generalServices: GeneralesService
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
    }).subscribe({ next: (page: any) => {
      this.dataSourceInfoProcesos = new MatTableDataSource(page.data);
      this.dataSourceInfoProcesos.sort = this.sort;
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

  intervacierreCertificacion(idArchivo: any) {
    this.spinnerActive = true;
    this.ejecutar(idArchivo);
    this.idInterval = setInterval(() => {
      this.validacionEstadoProceso("CARG_CERTIFICACION");
    }, 10000);
  }

  /**
   * Metodo encargado de validar el estado de un proceso en particular
   */
  validacionEstadoProceso(codigoProceso: any) {
    this.validacionEstadoProcesosService.validarEstadoProceso({
      'codigoProceso': codigoProceso,
      "fechaSistema": this.fechaSistemaSelect
    }).subscribe({
      next: (response: any) => {
        let estadoProceso = GENERALES.CODE_EMERGENT.WARNING;
        if (response.data.estadoProceso == 'PROCESADO')
          estadoProceso = GENERALES.CODE_EMERGENT.SUCCESFULL;
        if (response.data.estadoProceso == 'ERROR')
          estadoProceso = GENERALES.CODE_EMERGENT.ERROR;
        if (response.data.estadoProceso == 'EN PROCESO')
          estadoProceso = GENERALES.CODE_EMERGENT.ESPERAR;
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: response.data.estadoProceso + " - " + response.data.mensaje,
            codigo: estadoProceso
          }
        });
        this.listarProcesos();
        if (response.data.estadoProceso == 'PROCESADO' || response.data.estadoProceso == 'ERROR')
          clearInterval(this.idInterval);
      },
      error: (err: any) => {
        this.spinnerActive = false;
        clearInterval(this.idInterval);
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: err.error.response.description + " - code: " + err.error.response.code,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        });
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
    }).subscribe({ next: data => {
      this.spinnerActive = false;
      this.listarProcesos();
      this.dialog.open(VentanaEmergenteResponseComponent, {
        width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
        data: {
          msn: GENERALES.MESSAGE_ALERT.MESSAGE_CIERRE_PROG_CERTIFICACION.SUCCESFULL_CIERRE_CERTIFICACION,
          codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
        }
      });
    },
    error: (err: any) => {
        this.spinnerActive = false;
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
  * Metodo para reabrir un registro de archivo previamente cargado
  * @BaironPerez
  */
  reabrirCargue(nombreArchivo: string, idModeloArchivo: string) {
    this.cargueProgramacionPreliminarService.reabrirArchivo({
      'agrupador': "CERTI",
    }).subscribe({ next: item => {
      this.listarProcesos();
      this.dialog.open(VentanaEmergenteResponseComponent, {
        width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
        data: {
          msn: GENERALES.MESSAGE_ALERT.MESSAGE_CIERRE_PROG_DEFINITIVA.REABRIR_CIERRE,
          codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
        }
      });
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

}
