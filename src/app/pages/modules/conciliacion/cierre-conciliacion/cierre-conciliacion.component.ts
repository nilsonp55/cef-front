import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SpinnerComponent } from 'src/app/pages/shared/components/spinner/spinner.component';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { ErrorService } from 'src/app/_model/error.model';
import { OpConciliadasService } from 'src/app/_service/conciliacion-service/op-conciliadas.service';
import { LogProcesoDiarioService } from 'src/app/_service/contabilidad-service/log-proceso-diario.service';
import { OperacionesProgramadasService } from 'src/app/_service/operaciones-programadas.service';

@Component({
  selector: 'app-cierre-conciliacion',
  templateUrl: './cierre-conciliacion.component.html',
  styleUrls: ['./cierre-conciliacion.component.css']
})
export class CierreConciliacionComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  //Variable para activar spinner
  spinnerActive: boolean = false;

  //Rgistros paginados
  cantidadRegistros: number;

  //DataSource para pintar tabla de los procesos a ejecutar
  dataSourceInfoProcesos: MatTableDataSource<any>;
  displayedColumnsInfoProcesos: string[] = ['idLogProceso', 'fechaProceso', 'actividad', 'estado', 'acciones'];

  constructor(
    private dialog: MatDialog,
    private logProcesoDiarioService: LogProcesoDiarioService,
    private opConciliadasService: OpConciliadasService,
    public spinnerComponent: SpinnerComponent
  ) { }

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
    }).subscribe((page: any) => {
      this.dataSourceInfoProcesos = new MatTableDataSource(page.data);
      this.dataSourceInfoProcesos.sort = this.sort;
      this.cantidadRegistros = page.data.totalElements;
    },
      (err: ErrorService) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: 'Error al obtener los procesos de contabilidad a ejecutar',
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        }); setTimeout(() => { alert.close() }, 3000);
      });
  }

  /**
   * Metodo encargado de ejecutar el servicio de contabilidad para los 
   * procesos activos
   * @BaironPerez
   */
  ejecutar() {
    this.spinnerActive = true;
    this.opConciliadasService.procesar().subscribe(data => {
      this.spinnerActive = false;
      this.listarProcesos();
      const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
        width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
        data: {
          msn: GENERALES.MESSAGE_ALERT.MESSAGE_CONCILIATION.MESSAGE_CIERRE_CONCILIACION.SUCCESFULL_CIERRE_CONCILIACION,
          codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
        }
      }); setTimeout(() => { alert.close() }, 3500);
    },
      (err: any) => {
        this.spinnerActive = false;
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CONCILIATION.MESSAGE_CIERRE_CONCILIACION.ERROR_CIERRE_FECHA_CONCILIACION,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        }); setTimeout(() => { alert.close() }, 3500);
      });
  }


  /** 
  * Metodo para reabrir un registro de archivo previamente cargado
  * @BaironPerez
  */
 reabrirCargue(nombreArchivo: string, idModeloArchivo: string) {
  this.opConciliadasService.reabrirArchivo({
    'agrupador': "CONCI",
  }).subscribe(item => {
    this.listarProcesos();
    let messageResponse: string = item.data
    let messageValidate = messageResponse.indexOf('Error')
      if(messageValidate == 1) {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CIERRE_PROG_DEFINITIVA.REABRIR_CIERRE,
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
          }
        });
        setTimeout(() => { alert.close() }, 3000);
      }else {
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
  /**
  * Metodo para gestionar la paginación de la tabla
  * @BaironPerez
  */
  mostrarMas(e: any) {
    this.listarProcesos(e.pageIndex, e.pageSize);
  }

}
