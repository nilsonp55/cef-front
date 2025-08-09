import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SpinnerComponent } from 'src/app/pages/shared/components/spinner/spinner.component';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { LogProcesoDiarioService } from 'src/app/_service/contabilidad-service/log-proceso-diario.service';
import { OperacionesProgramadasService } from 'src/app/_service/operaciones-programadas.service';
import { CargueProgramacionPreliminarService } from 'src/app/_service/programacion-preliminar-service/cargue-programacion-preliminar.service';
import { ValidacionEstadoProcesosService } from 'src/app/_service/valida-estado-proceso.service';
import { GeneralesService } from 'src/app/_service/generales.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cierre-programacion-definitiva',
  templateUrl: './cierre-programacion-definitiva.component.html',
  styleUrls: ['./cierre-programacion-definitiva.component.css']
})
export class CierreProgramacionDefinitivaComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;

  //Variable para activar spinner
  spinnerActive: boolean = false;

  //Registros paginados
  cantidadRegistros: number;
  fechaSistemaSelect: any;

  //DataSource para pintar tabla de los procesos a ejecutar
  dataSourceInfoProcesos: MatTableDataSource<any>;
  displayedColumnsInfoProcesos: string[] = ['idLogProceso', 'fechaCreacion', 'codigoProceso', 'estadoProceso', 'acciones'];

  constructor(
    private readonly dialog: MatDialog,
    private readonly validacionEstadoProcesosService: ValidacionEstadoProcesosService,
    private readonly logProcesoDiarioService: LogProcesoDiarioService,
    private readonly cargueProgramacionPreliminarService: CargueProgramacionPreliminarService,
    private readonly operacionesProgramadasService: OperacionesProgramadasService,
    public spinnerComponent: SpinnerComponent,
    private readonly generalServices: GeneralesService,
  ) { }

  ngOnInit(): void {
    this.listarProcesos();
  }

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
    this.spinnerActive = true;
    this.logProcesoDiarioService.obtenerProcesosDiarios({
      page: pagina,
      size: tamanio,
    }).subscribe({
      next: (page: any) => {
        this.dataSourceInfoProcesos = new MatTableDataSource(page.data);
        this.dataSourceInfoProcesos.sort = this.sort;
        this.cantidadRegistros = page.data.totalElements;
        this.spinnerActive = false;
      },
      error: (err: any) => {
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CIERRE_PROG_DEFINITIVA.ERROR_CIERRE_FECHA_DEFINITIVA,
            codigo: GENERALES.CODE_EMERGENT.ERROR,
            showResume: true,
            msgDetalles: JSON.stringify(err.error),
          }
        });
        this.spinnerActive = false;
      }
    });
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

  intervalCierreDefinitivo() {
    this.ejecutar();
    setInterval(() => {
      this.validacionEstadoProceso();
    }, 10000);
  }

  /**
   * Metodo encargado de validar el estado de un proceso en particular
   */
  validacionEstadoProceso() {
    var fechaFormat1 = this.fechaSistemaSelect.split("/");
    let fec = fechaFormat1[2] + "-" + fechaFormat1[1] + "-" + fechaFormat1[0]
    var fecha = Date.parse(fec);
    var fecha2 = new Date(fecha);
    this.validacionEstadoProcesosService.validarEstadoProceso({
      'codigoProceso': "CARG_DEFINITIVO",
      "fechaSIstema": fecha2
    }).subscribe((data: any) => {
      if (data.estado == "PROCESADO") {
        this.spinnerActive = false;
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: "Se generó la contabilidad AM exitosamente",
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
          }
        });
      }
      if (data.estado == "ERROR") {
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: data.mensaje,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        });
      }
      if (data.estado == "PENDIENTE") {
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: "Error al generar el cierre definitivo",
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
  ejecutar() {
    this.modalProcesoEjecucion() 
    this.operacionesProgramadasService.procesar({
      'agrupador': GENERALES.CARGUE_DEFINITIVO_PROGRAMACION_SERVICIOS
    }).subscribe({
      next: data => {
        Swal.close();
        this.listarProcesos();
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CIERRE_PROG_DEFINITIVA.SUCCESFULL_CIERRE_DEFINITIVA,
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL,
            showResume: true,
            msgDetalles: JSON.stringify(data)
          }
        });
      },
      error: (err: any) => {
        Swal.close();
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CIERRE_PROG_DEFINITIVA.ERROR_CIERRE_FECHA_DEFINITIVA,
            codigo: GENERALES.CODE_EMERGENT.ERROR,
            showResume: true,
            msgDetalles: JSON.stringify(err.error),
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
      'agrupador': "DEFIN",
    }).subscribe({
      next: item => {
        this.listarProcesos();
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CIERRE_PROG_DEFINITIVA.REABRIR_CIERRE,
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL,
            showResume: true,
            msgDetalles: JSON.stringify(item.data),
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
            msgDetalles: JSON.stringify(err.error),
          }
        });
      }
    })
  }

}
