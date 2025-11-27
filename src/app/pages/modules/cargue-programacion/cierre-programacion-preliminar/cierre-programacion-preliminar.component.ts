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
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cierre-programacion-preliminar',
  templateUrl: './cierre-programacion-preliminar.component.html',
  styleUrls: ['./cierre-programacion-preliminar.component.css']
})
export class CierreProgramacionPreliminarComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;

  //Variable para activar spinner
  spinnerActive: boolean = false;

  //Registros paginados
  cantidadRegistros: number;

  //DataSource para pintar tabla de los procesos a ejecutar
  dataSourceInfoProcesos: MatTableDataSource<any>;
  displayedColumnsInfoProcesos: string[] = ['idLogProceso', 'fechaCreacion', 'codigoProceso', 'estadoProceso', 'acciones'];

  constructor(
    private dialog: MatDialog,
    private logProcesoDiarioService: LogProcesoDiarioService,
    private cargueProgramacionPreliminarService: CargueProgramacionPreliminarService,
    private operacionesProgramadasService: OperacionesProgramadasService,
    public spinnerComponent: SpinnerComponent
  ) { }

  ngOnInit(): void {
    this.listarProcesos();
  }

  /**
   * Se realiza consumo de servicio para listr los procesos a ejectar
   * @BaironPerez
   */
  listarProcesos(pagina = 0, tamanio = 10) {
    this.spinnerActive = true;
    this.logProcesoDiarioService.obtenerProcesosDiarios({
      page: pagina,
      size: tamanio,
    }).subscribe({ next: (page: any) => {
        this.dataSourceInfoProcesos = new MatTableDataSource(page.data);
        this.dataSourceInfoProcesos.sort = this.sort;
        this.cantidadRegistros = page.data.totalElements;
        this.spinnerActive = false;
      },
      error: (err: any) => {
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CIERRE_PROG_PRELIMINAR.ERROR_CIERRE_FECHA_PRELIMINAR,
            codigo: GENERALES.CODE_EMERGENT.ERROR,
            showResume: true,
            msgDetalles: JSON.stringify(err.error),
          }
        });
        this.spinnerActive = false;
      }});
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
   * Metodo encargado de ejecutar el servicio de contabilidad para los
   * procesos activos
   * @BaironPerez
   */
  ejecutar() {
    this.modalProcesoEjecucion();
    this.operacionesProgramadasService.procesar({
      'agrupador': GENERALES.CARGUE_PRELIMINAR_PROGRAMACION_SERVICIOS_IPP
    }).subscribe({ next: data => {
        Swal.close();
        this.listarProcesos();
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CIERRE_PROG_PRELIMINAR.SUCCESFULL_CIERRE_PRELIMINAR,
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
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CIERRE_PROG_PRELIMINAR.ERROR_CIERRE_FECHA_PRELIMINAR,
            codigo: GENERALES.CODE_EMERGENT.ERROR,
            showResume: true,
            msgDetalles: JSON.stringify(err.error),
          }
        });
      }});
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
    this.modalProcesoEjecucion();
    this.cargueProgramacionPreliminarService.reabrirArchivo({
      'agrupador': "IPP",
    }).subscribe({next: item => {
        this.listarProcesos();
        Swal.close();
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CIERRE_PROG_PRELIMINAR.SUCCESFULL_CIERRE_PRELIMINAR,
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL,
            showResume: true,
            msgDetalles: JSON.stringify(item.data),
          }
        });
      },
      error: (err: any) => {
        Swal.close();
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CIERRE_PROG_PRELIMINAR.ERROR_CIERRE_FECHA_PRELIMINAR,
            codigo: GENERALES.CODE_EMERGENT.ERROR,
            showResume: true,
            msgDetalles: JSON.stringify(err.error),
          }
        });
      }})
  }

}

