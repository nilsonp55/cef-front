import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { OpConciliadasService } from 'src/app/_service/conciliacion-service/op-conciliadas.service';
import { LogProcesoDiarioService } from 'src/app/_service/contabilidad-service/log-proceso-diario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cierre-conciliacion',
  templateUrl: './cierre-conciliacion.component.html',
  styleUrls: ['./cierre-conciliacion.component.css']
})
export class CierreConciliacionComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;

  //Variable para activar spinner
  spinnerActive: boolean = false;

  //Registros paginados
  cantidadRegistros: number;

  //DataSource para pintar tabla de los procesos a ejecutar
  dataSourceInfoProcesos: MatTableDataSource<any>;
  displayedColumnsInfoProcesos: string[] = ['idLogProceso', 'fechaCreacion', 'codigoProceso', 'estadoProceso', 'acciones'];

  constructor(
    private readonly dialog: MatDialog,
    private readonly logProcesoDiarioService: LogProcesoDiarioService,
    private readonly opConciliadasService: OpConciliadasService
  ) {
  }

  ngOnInit(): void {
    this.listarProcesos();
  }

  /**
   * Se realiza consumo de servicio para listr los procesos a ejectar
   * @BaironPerez
   */
  listarProcesos(pagina = 0, tamanio = 5) {
    this.logProcesoDiarioService.obtenerProcesosDiarios({
      page: pagina,
      size: tamanio,
    }).subscribe({
      next: (page: any) => {
        this.dataSourceInfoProcesos = new MatTableDataSource(page.data);
        this.dataSourceInfoProcesos.sort = this.sort;
        this.cantidadRegistros = page.data.totalElements;
      },
      error: (err: any) => {
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CONCILIATION.MESSAGE_CIERRE_CONCILIACION.ERROR_CIERRE_FECHA_CONCILIACION,
            codigo: GENERALES.CODE_EMERGENT.ERROR,
            showResume: true,
            msgDetalles: JSON.stringify(err.error)
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
    this.opConciliadasService.procesar().subscribe({
      next: data => {
        Swal.close();
        this.listarProcesos();
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CONCILIATION.MESSAGE_CIERRE_CONCILIACION.SUCCESFULL_CIERRE_CONCILIACION,
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
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CONCILIATION.MESSAGE_CIERRE_CONCILIACION.ERROR_CIERRE_FECHA_CONCILIACION,
            codigo: GENERALES.CODE_EMERGENT.ERROR,
            showResume: true,
            msgDetalles: JSON.stringify(err.error)
          }
        });
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

  /**
   * Metodo para reabrir un registro de archivo previamente cargado
   * @BaironPerez
   */
  reabrirCargue(nombreArchivo: string, idModeloArchivo: string) {
    this.opConciliadasService.reabrirArchivo({
      'agrupador': "CONCI",
    }).subscribe({
      next: item => {
        this.listarProcesos();
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CIERRE_PROG_DEFINITIVA.REABRIR_CIERRE,
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL,
            showResume: true,
            msgDetalles: JSON.stringify(item)
          }
        });
      },
      error: (err: any) => {
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CONCILIATION.MESSAGE_CIERRE_CONCILIACION.ERROR_CIERRE_FECHA_CONCILIACION,
            codigo: GENERALES.CODE_EMERGENT.ERROR,
            showResume: true,
            msgDetalles: JSON.stringify(err.error)
          }
        });
      }
    })
  }

}
