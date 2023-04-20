import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { OpConciliadasService } from 'src/app/_service/conciliacion-service/op-conicliadas.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ConciliacionesProgramadasNoConciliadasModel } from 'src/app/_model/consiliacion-model/opera-program-no-conciliadas.model';
import { ConciliacionesCertificadaNoConciliadasModel } from 'src/app/_model/consiliacion-model/opera-certifi-no-conciliadas.model';
import { GeneralesService } from 'src/app/_service/generales.service';
import { ConciliacionesInfoProgramadasNoConciliadasModel } from 'src/app/_model/consiliacion-model/conciliaciones-info-programadas-no-conciliadas.model';
import { DialogInfoCertificadasNoConciliadasComponent } from '../../opearciones-no-conciliadas/dialog-info-certificadas-no-conciliadas/dialog-info-certificadas-no-conciliadas.component';
import * as moment from 'moment';
import { DialogInfoOpProgramadasComponent } from './dialog-info-op-programadas/dialog-info-op-programadas.component';
import { DialogConciliacionManualComponent } from '../../opearciones-no-conciliadas/dialog-conciliacion-manual/dialog-conciliacion-manual.component';


@Component({
  selector: 'app-consulta-opera-fallidas',
  templateUrl: './consulta-opera-fallidas.component.html',
  styleUrls: ['./consulta-opera-fallidas.component.css']
})

/**
 * Clase que lista las operaciones programadas y certificadas con estado fallidas
 * @JuanMazo
 */
export class ConsultaOperaFallidasComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  //Rgistros paginados
  cantidadRegistrosProgram: number;
  cantidadRegistrosCerti: number;

  dataSourceOperacionesProgramadasComplet: ConciliacionesProgramadasNoConciliadasModel[];
  dataSourceOperacionesCertificadasComplet: ConciliacionesCertificadaNoConciliadasModel[];

  dataSourceOperacionesProgramadas: MatTableDataSource<ConciliacionesProgramadasNoConciliadasModel>;
  displayedColumnsOperacionesProgramadas: string[] = ['fechaOrigen', 'tipoOperacion', 'estadoConciliacion', 'valorTotal', 'acciones'];

  dataSourceOperacionesCertificadas: MatTableDataSource<ConciliacionesCertificadaNoConciliadasModel>
  displayedColumnsOperacionesCertificadas: string[] = ['fechaEjecucion', 'codigoPropioTDV', 'tipoOperacion', 'estadoConciliacion', 'valorTotal', 'acciones'];


  constructor(
    private dialog: MatDialog,
    private opConciliadasService: OpConciliadasService) { }


  ngOnInit(): void {
    this.listarOpProgramadasFallidas();
    this.listarOpCertificadasFallidas();
  }

  /**
   * Metodo que llama al dialog de Info de op programadas
   * @JuanMazo
   */
  infoOpProgramadas(element: ConciliacionesInfoProgramadasNoConciliadasModel) {
    this.dialog.open(DialogInfoOpProgramadasComponent, {
      width: 'auto',
      data: element
    })
  }

  /**
   * Metodo que llama al dialog de inforamción de operaciones certificadas
   * @JuanMazo
   */
  infoOpCertificadas(element: ConciliacionesInfoProgramadasNoConciliadasModel) {
    this.dialog.open(DialogInfoCertificadasNoConciliadasComponent, {
      width: 'auto',
      data: element
    })
  }

  /**
   * Metodo que llama al dialog de conciliacion manual
   * @JuanMazo
   */
  conciliacionManual() {
    this.dialog.open(DialogConciliacionManualComponent, {
      width: 'auto',
      data: {
        origen: this.dataSourceOperacionesProgramadas.data,
        destino: this.dataSourceOperacionesCertificadas.data
      }
    })
  }


  /**
   * Lista las operaciones programadas distintas al estado conciliadas
   * @JuanMazo
   */
  listarOpProgramadasFallidas(pagina = 0, tamanio = 500) {
    this.opConciliadasService.obtenerOpProgramadasSinconciliar({
      'estadoConciliacion': ['NO_CONCILIADA', 'FALLIDA', 'FUERA_DE_CONCILIACION', 'POSPUESTA', 'CANCELADA'],
      page: pagina,
      size: tamanio,
    }).subscribe((page: any) => {
      this.dataSourceOperacionesProgramadasComplet = page.data.content;
      this.dataSourceOperacionesProgramadas = new MatTableDataSource(page.data.content);
      this.dataSourceOperacionesProgramadas.sort = this.sort;
      this.cantidadRegistrosProgram = page.data.totalElements;
    },
      (err: any) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: err.error.response.description,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        });
        setTimeout(() => { alert.close() }, 3000);
      });
  }

  /**
  * Metodo para gestionar la paginación de la tabla
  * @BaironPerez
  */
  mostrarMasOpProgramadasFallidas(e: any) {
    this.listarOpProgramadasFallidas(e.pageIndex, e.pageSize);
  }

  /**
   * Lista las operaciones certificadas distintas al estado conciliadas
   * @JuanMazo
   */
  listarOpCertificadasFallidas(pagina = 0, tamanio = 500) {
    this.opConciliadasService.obtenerOpCertificadasSinconciliar({
      'estadoConciliacion': ['NO_CONCILIADA', 'FALLIDA', 'FUERA_DE_CONCILIACION', 'POSPUESTA', 'CANCELADA'],
      conciliable: 'SI',
      page: pagina,
      size: tamanio
    }).subscribe((page: any) => {
      page.fechaEjecucion = moment(page.data.content).format('DD/MM/YYYY')
      this.dataSourceOperacionesCertificadasComplet = page.data.content;
      this.dataSourceOperacionesCertificadas = new MatTableDataSource(page.data.content);
      this.dataSourceOperacionesCertificadas.sort = this.sort;
      this.cantidadRegistrosCerti = page.data.totalElements;
    },
      (err: any) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: err.error.response.description,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        });
        setTimeout(() => { alert.close() }, 3000);
      });
  }

  /**
  * Metodo para gestionar la paginación de la tabla
  * @BaironPerez
  */
  mostrarMasOpCertificadasFallidas(e: any) {
    this.listarOpCertificadasFallidas(e.pageIndex, e.pageSize);
  }

  listarOpProgramadasSinConciliarXBancoOTDV(tdv: string, banco: string, puntoOrigen: string, pagina = 0, tamanio = 500) {
    this.opConciliadasService.obtenerOpProgramadasSinconciliar({
      'estadoConciliacion': ['NO_CONCILIADA', 'FALLIDA', 'FUERA_DE_CONCILIACION', 'POSPUESTA', 'CANCELADA'],
      bancoAVAL: banco,
      tdv: tdv,
      tipoPuntoOrigen: puntoOrigen,
      page: pagina,
      size: tamanio,
    }).subscribe((page: any) => {
      this.dataSourceOperacionesProgramadasComplet = page.data.content;
      this.dataSourceOperacionesProgramadas = new MatTableDataSource(page.data.content);
      this.dataSourceOperacionesProgramadas.sort = this.sort;
      this.cantidadRegistrosProgram = page.data.totalElements;
    },
      (err: any) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: err.error.response.description,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        });
        setTimeout(() => { alert.close() }, 3000);
      });
  }

  listarOpCertificadasSinConciliarXBancoOTDV(tdv: string, banco: string, puntoOrigen: string, pagina = 0, tamanio = 500) {
    this.opConciliadasService.obtenerOpCertificadasSinconciliar({
      'estadoConciliacion': ['NO_CONCILIADA', 'FALLIDA', 'FUERA_DE_CONCILIACION', 'POSPUESTA', 'CANCELADA'],
      conciliable: 'SI',
      bancoAVAL: banco,
      tdv: tdv,
      tipoPuntoOrigen: puntoOrigen,
      page: pagina,
      size: tamanio,
    }).subscribe((page: any) => {
      this.dataSourceOperacionesCertificadasComplet = page.data.content;
      this.dataSourceOperacionesCertificadas = new MatTableDataSource(page.data.content);
      this.dataSourceOperacionesCertificadas.sort = this.sort;
      this.cantidadRegistrosCerti = page.data.totalElements;
    },
      (err: any) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: err.error.response.description,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        });
        setTimeout(() => { alert.close() }, 3000);
      });
  }

  filter(event) {
    if (event.trasportadora !== undefined && event.banco !== undefined && event.tipoPuntoOrigen !== undefined) {
      this.listarOpProgramadasSinConciliarXBancoOTDV(event.trasportadora, event.banco, event.tipoPuntoOrigen)
      this.listarOpCertificadasSinConciliarXBancoOTDV(event.trasportadora, event.banco, event.tipoPuntoOrigen)    }
    if (event.trasportadora == undefined && event.banco == undefined && event.tipoPuntoOrigen == undefined) {
      this.listarOpProgramadasFallidas()
      this.listarOpCertificadasFallidas()    }
    if (event.trasportadora !== undefined && event.banco == undefined && event.tipoPuntoOrigen == undefined) {
      this.listarOpProgramadasSinConciliarXBancoOTDV(event.trasportadora, "", "")
      this.listarOpCertificadasSinConciliarXBancoOTDV(event.trasportadora, "", "")    }
    if (event.trasportadora == undefined && event.banco !== undefined && event.tipoPuntoOrigen == undefined) {
      this.listarOpProgramadasSinConciliarXBancoOTDV("", event.banco, "")
      this.listarOpCertificadasSinConciliarXBancoOTDV("", event.banco, "")    }
    if (event.trasportadora == undefined && event.banco == undefined && event.tipoPuntoOrigen !== undefined) {
      this.listarOpProgramadasSinConciliarXBancoOTDV("", "", event.tipoPuntoOrigen)
      this.listarOpCertificadasSinConciliarXBancoOTDV("", "", event.tipoPuntoOrigen)    }
    if (event.trasportadora == undefined && event.banco == undefined && event.tipoPuntoOrigen == undefined) {
      this.listarOpProgramadasSinConciliarXBancoOTDV("", "", "")
      this.listarOpCertificadasSinConciliarXBancoOTDV("", "", "")    }
    if (event.trasportadora == undefined && event.banco !== undefined && event.tipoPuntoOrigen !== undefined) {
      this.listarOpProgramadasSinConciliarXBancoOTDV("", event.banco, event.tipoPuntoOrigen)
      this.listarOpCertificadasSinConciliarXBancoOTDV("", event.banco, event.tipoPuntoOrigen)    }
    if (event.trasportadora !== undefined && event.banco == undefined && event.tipoPuntoOrigen !== undefined) {
      this.listarOpProgramadasSinConciliarXBancoOTDV(event.trasportadora, "", event.tipoPuntoOrigen)
      this.listarOpCertificadasSinConciliarXBancoOTDV(event.trasportadora, "", event.tipoPuntoOrigen)    }
    if (event.trasportadora !== undefined && event.banco !== undefined && event.tipoPuntoOrigen == undefined) {
      this.listarOpProgramadasSinConciliarXBancoOTDV(event.trasportadora, event.banco, "")
      this.listarOpCertificadasSinConciliarXBancoOTDV(event.trasportadora, event.banco, "")    }
  }

}
