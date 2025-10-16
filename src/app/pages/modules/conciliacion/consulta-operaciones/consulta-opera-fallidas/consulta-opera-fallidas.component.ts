import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { OpConciliadasService } from 'src/app/_service/conciliacion-service/op-conciliadas.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ConciliacionesProgramadasNoConciliadasModel } from 'src/app/_model/consiliacion-model/opera-program-no-conciliadas.model';
import { ConciliacionesCertificadaNoConciliadasModel } from 'src/app/_model/consiliacion-model/opera-certifi-no-conciliadas.model';
import { ConciliacionesInfoProgramadasNoConciliadasModel } from 'src/app/_model/consiliacion-model/conciliaciones-info-programadas-no-conciliadas.model';
import { DialogInfoCertificadasNoConciliadasComponent } from '../../operaciones-no-conciliadas/dialog-info-certificadas-no-conciliadas/dialog-info-certificadas-no-conciliadas.component';
import * as moment from 'moment';
import { DialogInfoOpProgramadasComponent } from './dialog-info-op-programadas/dialog-info-op-programadas.component';
import { DialogConciliacionManualComponent } from '../../operaciones-no-conciliadas/dialog-conciliacion-manual/dialog-conciliacion-manual.component';
import { ExcelExportService } from 'src/app/_service/excel-export-service';


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
  @ViewChild('sort1') sort1 = new MatSort();
  @ViewChild('sort2') sort2 = new MatSort();
  @ViewChild('exporterOpProgSinConciliar', {static: false}) exporterOpProgSinConciliar: any;
  @ViewChild('exporterOpCertSinConciliar', {static: false}) exporterOpCertSinConciliar: any;
  @ViewChild('operacionesProgSinConciliarTb') operacionesProgSinConciliarTb: MatTable<any>;
  @ViewChild('operacionesCertSinConciliarTb') operacionesCertSinConciliarTb: MatTable<any>;

  xlsxOperacionesProgSinConciliar = 'operaciones_prog_sin_conciliar';
  xlsxOperacionesCertSinConciliar = 'operaciones_cert_sin_conciliar';

  //Rgistros paginados
  cantidadRegistrosProgram: number;
  cantidadRegistrosCerti: number;
  loadProg: boolean = true;
  pageSizeListProg: number[] = [5, 10, 25, 100];
  loadCert: boolean = true;
  pageSizeListCert: number[] = [5, 10, 25, 100];
  bancoAVAL: string;
  transportadora: string;
  tipoPuntoOrigen: string[] = [];
  numPaginaOpPr: any;
  cantPaginaOpPr: any;
  numPaginaOpCer: any;
  cantPaginaOpCer: any;

  dataSourceOperacionesProgramadasComplet: ConciliacionesProgramadasNoConciliadasModel[];
  dataSourceOperacionesCertificadasComplet: ConciliacionesCertificadaNoConciliadasModel[];

  dataSourceOperacionesProgramadas: MatTableDataSource<ConciliacionesProgramadasNoConciliadasModel>;
  displayedColumnsOperacionesProgramadas: string[] = ['fechaOrigen', 'nombreFondoTDV', 'tipoOperacion', 'entradaSalida', 'estadoConciliacion', 'valorTotal', 'acciones'];

  dataSourceOperacionesCertificadas: MatTableDataSource<ConciliacionesCertificadaNoConciliadasModel>
  displayedColumnsOperacionesCertificadas: string[] = ['fechaEjecucion', 'codigoPropioTDV', 'nombreFondoTDV', 'tipoOperacion', 'entradaSalida', 'estadoConciliacion', 'valorTotal', 'acciones'];

  estadoConciliacionInicial: any[] = ['NO_CONCILIADA', 'FALLIDA', 'FUERA_DE_CONCILIACION', 'POSPUESTA', 'CANCELADA'];

  constructor(
    private readonly dialog: MatDialog,
    private readonly opConciliadasService: OpConciliadasService,
    private readonly excelExportService: ExcelExportService) { }


  ngOnInit(): void {
    this.numPaginaOpPr = 0;
    this.cantPaginaOpPr = 10;
    this.numPaginaOpCer = 0;
    this.cantPaginaOpCer = 10;
    this.listarOpProgramadasFallidas("", "", [""], this.estadoConciliacionInicial);
    this.listarOpCertificadasFallidas("", "", [""], this.estadoConciliacionInicial);
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
  listarOpProgramadasFallidas(tdv?: string, banco?: string, puntoOrigen?: string[], estadoConciliacion?: any[], pagina = 0, tamanio = 10) {
    this.loadProg = true;
    this.dataSourceOperacionesProgramadas = new MatTableDataSource();
    this.opConciliadasService.obtenerOpProgramadasSinconciliar({
      estadoConciliacion: estadoConciliacion,
      bancoAVAL: banco,
      tdv: tdv,
      tipoPuntoOrigen: puntoOrigen,
      page: pagina,
      size: tamanio,
    }).subscribe({
      next: (page: any) => {
        this.dataSourceOperacionesProgramadasComplet = page.data.content;
        this.dataSourceOperacionesProgramadas = new MatTableDataSource(page.data.content);
        this.dataSourceOperacionesProgramadas.sort = this.sort1;
        this.cantidadRegistrosProgram = page.data.totalElements;
        this.pageSizeListProg = [5, 10, 25, 100, page.data.totalElements];
        this.loadProg = false;
      },
      error: (err: any) => {
        this.onAlert(err.error.response.description, GENERALES.CODE_EMERGENT.ERROR)
        this.loadProg = false;
      }
    });
  }

  /**
   * Lista las operaciones certificadas distintas al estado conciliadas
   * @JuanMazo
   */
  listarOpCertificadasFallidas(tdv?: string, banco?: string, puntoOrigen?: string[], estadoConciliacion?: any[], pagina = 0, tamanio = 10) {
    this.loadCert = true;
    this.dataSourceOperacionesCertificadas = new MatTableDataSource();
    this.opConciliadasService.obtenerOpCertificadasSinconciliar({
      estadoConciliacion: estadoConciliacion,
      bancoAVAL: banco,
      tdv: tdv,
      tipoPuntoOrigen: puntoOrigen,
      conciliable: 'SI',
      page: pagina,
      size: tamanio
    }).subscribe({
      next: (page: any) => {
        page.fechaEjecucion = moment(page.data.content).format('DD/MM/YYYY')
        this.dataSourceOperacionesCertificadasComplet = page.data.content;
        this.dataSourceOperacionesCertificadas = new MatTableDataSource(page.data.content);
        this.dataSourceOperacionesCertificadas.sort = this.sort2;
        this.cantidadRegistrosCerti = page.data.totalElements;
        this.pageSizeListCert = [5, 10, 25, 100, page.data.totalElements];
        this.loadCert = false;
      },
      error: (err: any) => {
        this.dataSourceOperacionesCertificadas = new MatTableDataSource();
        this.onAlert(err.error.response.description, GENERALES.CODE_EMERGENT.ERROR);
        this.loadCert = false;
      }
    });
  }

  onAlert(mensaje: string, codigo = GENERALES.CODE_EMERGENT.WARNING) {
    this.dialog.open(VentanaEmergenteResponseComponent, {
      width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
      data: {
        msn: mensaje,
        codigo: codigo,
      },
    });
  }

  /**
  * Metodo para gestionar la paginación de la tabla
  * @BaironPerez
  */
  mostrarMasOpProgramadasFallidas(e: any) {
    this.numPaginaOpPr = e.pageIndex;
    this.cantPaginaOpPr = e.pageSize;
    this.listarOpProgramadasFallidas(
      this.transportadora ?? "",
      this.bancoAVAL ?? "",
      this.tipoPuntoOrigen ?? [""],
      this.estadoConciliacionInicial ?? [""],
      e.pageIndex, e.pageSize
    );
  }

  /**
  * Metodo para gestionar la paginación de la tabla
  * @BaironPerez
  */
  mostrarMasOpCertificadasFallidas(e: any) {
    this.numPaginaOpCer = e.pageIndex;
    this.cantPaginaOpCer = e.pageSize;
    this.listarOpCertificadasFallidas(
      this.transportadora ?? "",
      this.bancoAVAL ?? "",
      this.tipoPuntoOrigen ?? [""],
      this.estadoConciliacionInicial ?? [""],
      e.pageIndex, e.pageSize
    );
  }

  filter(event) {
    this.transportadora = event.trasportadora;
    this.bancoAVAL = event.banco;
    this.tipoPuntoOrigen = event.tipoPuntoOrigen;
    this.estadoConciliacionInicial = event.estadoConciliacion;

    this.listarOpProgramadasFallidas(
      this.transportadora ?? "",
      this.bancoAVAL ?? "",
      this.tipoPuntoOrigen ?? [""],
      this.estadoConciliacionInicial ?? [""],
      this.numPaginaOpPr, this.cantPaginaOpPr
    );

    this.listarOpCertificadasFallidas(
      this.transportadora ?? "",
      this.bancoAVAL ?? "",
      this.tipoPuntoOrigen ?? [""],
      this.estadoConciliacionInicial ?? [""],
      this.numPaginaOpCer, this.cantPaginaOpCer
    );
  }

  exporterTable(tableName: string) {
    if (tableName === this.xlsxOperacionesProgSinConciliar
      && this.exporterOpProgSinConciliar && !this.loadProg && this.dataSourceOperacionesProgramadas.data.length !== 0) {
      this.callToServiceExport(tableName, this.operacionesProgSinConciliarTb, this.displayedColumnsOperacionesProgramadas);
    }
    else if (tableName === this.xlsxOperacionesCertSinConciliar
      && this.exporterOpCertSinConciliar && !this.loadCert && this.dataSourceOperacionesCertificadas.data.length !== 0) {
      this.callToServiceExport(tableName, this.operacionesCertSinConciliarTb, this.displayedColumnsOperacionesCertificadas);
    } 
    else {
      this.onAlert(GENERALES.MESSAGE_ALERT.EXPORTER.NO_DATA);
    }
  }

  callToServiceExport(tableName: string, data: MatTable<any>, columns: string[]) {
    this.excelExportService.exportToExcel({
      fileName: tableName,
      data: data,
      columns: columns,
      numericColumns: [
        { columnName: 'valorTotal', format: GENERALES.FORMATS_EXCEL.NUMBERS.FORMAT1 }
      ]
    });
  }

}
