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
import { DialogInfoProgramadasFallidasComponent } from './dialog-info-programadas-fallidas/dialog-info-programadas-fallidas.component';
import { DialogActualizarOpCertificadasComponent } from './dialog-actualizar-op-certificadas/dialog-actualizar-op-certificadas.component';
import { DialogConciliacionManualComponent } from '../operaciones-no-conciliadas/dialog-conciliacion-manual/dialog-conciliacion-manual.component';
import { SelectionModel } from '@angular/cdk/collections';
import { DialogUpdateEstadoOperacionesComponent } from './dialog-update-estado-operaciones/dialog-update-estado-operaciones.component';
import { ExcelExportService } from 'src/app/_service/excel-export-service';

@Component({
  selector: 'app-operaciones-fallidas',
  templateUrl: './operaciones-fallidas.component.html',
  styleUrls: ['./operaciones-fallidas.component.css']
})

/**
 * Clase que nos lista las operaciones programadas y conciliadas en estado de conciliacion fallidas, canceladas, pospuestas o fuera de conciliación,
 * permite modificar su estado y su valor
 * @JuanMazo
 */
export class OperacionesFallidasComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild('sort1') sort1 = new MatSort();
  @ViewChild('sort2') sort2 = new MatSort();
  @ViewChild('exporterProgramadas', { static: false }) exporterProgramadas: any;
  @ViewChild('exporterCertificadas', { static: false }) exporterCertificadas: any;
  @ViewChild('tableProgramadas') tableProgramadas: MatTable<any>;
  @ViewChild('tableCertificadas') tableCertificadas: MatTable<any>;

  //Registros paginados
  cantidadRegistrosOpProgramadasFallidas: number;
  cantidadRegistrosOpCertificadasFallidas: number;

  nameXlsxProgramadas = 'operaciones_programadas_sin_conciliar';
  nameXlsxCertificadas = 'operaciones_certificadas_sin_conciliar';

  //Registros paginados
  numPaginaOpPr: any;
  cantPaginaOpPr: any;
  numPaginaOpCer: any;
  cantPaginaOpCer: any;

  loadProg: boolean = true;
  pageSizeListProg: number[] = [5, 10, 25, 100];
  loadCert: boolean = true;
  pageSizeListCert: number[] = [5, 10, 25, 100];
  bancoAVAL: string;
  transportadora: string;
  tipoPuntoOrigen: string[] = [];
  estadoConciliacionInicial: any[] = ['NO_CONCILIADA', 'FALLIDA', 'FUERA_DE_CONCILIACION', 'POSPUESTA', 'CANCELADA'];

  dataSourceOperacionesProgramadas: MatTableDataSource<ConciliacionesProgramadasNoConciliadasModel>;
  displayedColumnsOperacionesProgramadas: string[] = ['select', 'nombreFondoTDV', 'fechaOrigen', 'tipoOperacion', 'entradaSalida', 'estadoConciliacion', 'valorTotal', 'acciones'];
  dataSourceOperacionesProgramadasComplet: ConciliacionesProgramadasNoConciliadasModel[];

  dataSourceOperacionesCertificadas: MatTableDataSource<ConciliacionesCertificadaNoConciliadasModel>
  displayedColumnsOperacionesCertificadas: string[] = ['select', 'idCertificacion', 'nombreFondoTDV', 'fechaEjecucion', 'tipoOperacion', 'entradaSalida', 'estadoConciliacion', 'valorTotal', 'acciones'];
  dataSourceOperacionesCertificadasComplet: ConciliacionesCertificadaNoConciliadasModel[];

  // Selection
  selectionProgramadas = new SelectionModel<ConciliacionesProgramadasNoConciliadasModel>(true, []);
  seleccionadosProgramadasTabla: any = [];

  selectionCertificadas = new SelectionModel<ConciliacionesCertificadaNoConciliadasModel>(true, []);
  seleccionadosCertificadasTabla: any = [];

  constructor(
    private dialog: MatDialog,
    private opConciliadasService: OpConciliadasService,
    private readonly excelExportService: ExcelExportService
  ) { }


  ngOnInit(): void {
    this.numPaginaOpPr = 0;
    this.cantPaginaOpPr = 10;
    this.numPaginaOpCer = 0;
    this.cantPaginaOpCer = 10;
    this.listarOpProgramadasFallidas("", "", [""], this.estadoConciliacionInicial);
    this.listarOpCertificadasFallidas("", "", [""], this.estadoConciliacionInicial);

  }

  /**
   * Metodo que llama al dialog de Info de operfaciones programadas
   * @JuanMazo
   */
  infoOpProgramadas(element: ConciliacionesInfoProgramadasNoConciliadasModel) {
    const dialogRef = this.dialog.open(DialogInfoProgramadasFallidasComponent, {
      width: 'auto',
      data: element
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.data.response.code === 'S000') {
        this.filterTables();
      }
    });
  }

  /**
   * Metodo que llama al dialog de Info de operaciones certificadas
   * @JuanMazo
   */
  infoOpCertificadas(element: ConciliacionesInfoProgramadasNoConciliadasModel) {
    const dialogRef = this.dialog.open(DialogActualizarOpCertificadasComponent, {
      width: 'auto',
      data: element
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.data.response.code === 'S000') {
        this.filterTables();
      }
    });
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
        this.cantidadRegistrosOpProgramadasFallidas = page.data.totalElements;
        this.pageSizeListProg = [5, 10, 25, 100, page.data.totalElements];
        this.loadProg = false;
      },
      error: (err: any) => {
        this.dataSourceOperacionesProgramadas = new MatTableDataSource();
        this.onAlert(err.error.response.description, GENERALES.CODE_EMERGENT.ERROR);
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
      conciliable: 'SI',
      bancoAVAL: banco,
      tdv: tdv,
      tipoPuntoOrigen: puntoOrigen,
      page: pagina,
      size: tamanio,
    }).subscribe({
      next: (page: any) => {
        this.dataSourceOperacionesCertificadasComplet = page.data.content;
        this.dataSourceOperacionesCertificadas = new MatTableDataSource(page.data.content);
        this.dataSourceOperacionesCertificadas.sort = this.sort2;
        this.cantidadRegistrosOpCertificadasFallidas = page.data.totalElements;
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

  /**
  * Metodo para gestionar la paginación de la tabla
  * @BaironPerez
  */
  mostrarMasOpProgramadasFallidas(e: any) {

    this.numPaginaOpPr = e.pageIndex;
    this.cantPaginaOpPr = e.pageSize;
    this.listarOpProgramadasFallidas(
      this.transportadora == undefined ? "" : this.transportadora,
      this.bancoAVAL == undefined ? "" : this.bancoAVAL,
      this.tipoPuntoOrigen == undefined ? [""] : this.tipoPuntoOrigen,
      this.estadoConciliacionInicial == undefined ? [""] : this.estadoConciliacionInicial,
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
      this.transportadora == undefined ? "" : this.transportadora,
      this.bancoAVAL == undefined ? "" : this.bancoAVAL,
      this.tipoPuntoOrigen == undefined ? [""] : this.tipoPuntoOrigen,
      this.estadoConciliacionInicial == undefined ? [""] : this.estadoConciliacionInicial,
      e.pageIndex, e.pageSize
    );
  }
  /**
   * Captura del id para crear una relación
   * @JuanMazo
   */
  getIdCompare(event: any, opeProgramada: any) {
    if (event.target.value != '') {
      opeProgramada.relacion = event.target.value
    }
  }

  filter(event) {
    this.transportadora = event.trasportadora;
    this.bancoAVAL = event.banco;
    this.tipoPuntoOrigen = event.tipoPuntoOrigen;
    this.estadoConciliacionInicial = event.estadoConciliacion;

    this.filterTables();
  }

  filterTables() {
    this.listarOpProgramadasFallidas(
      this.transportadora == undefined ? "" : this.transportadora,
      this.bancoAVAL == undefined ? "" : this.bancoAVAL,
      this.tipoPuntoOrigen == undefined ? [""] : this.tipoPuntoOrigen,
      this.estadoConciliacionInicial == undefined ? [""] : this.estadoConciliacionInicial,
      this.numPaginaOpPr, this.cantPaginaOpPr
    );
    this.listarOpCertificadasFallidas(
      this.transportadora == undefined ? "" : this.transportadora,
      this.bancoAVAL == undefined ? "" : this.bancoAVAL,
      this.tipoPuntoOrigen == undefined ? [""] : this.tipoPuntoOrigen,
      this.estadoConciliacionInicial == undefined ? [""] : this.estadoConciliacionInicial,
      this.numPaginaOpCer, this.cantPaginaOpCer
    );
  }

  /**
   * Logica para marcar registros de Programadas como seleccionados
   * @author prv_nparra
   */
  seleccionarProgramadasTodo() {
    const numSelected = this.selectionProgramadas.selected.length;
    const numRows = this.dataSourceOperacionesProgramadas.data.length;
    return numSelected === numRows;
  }

  /**
   * Logica para marcar registros de Programadas como seleccionados
   * @author prv_nparra
   */
  seleccionProgramadas() {
    this.seleccionarProgramadasTodo()
      ? this.selectionProgramadas.clear()
      : this.dataSourceOperacionesProgramadas.data.forEach((row) =>
        this.selectionProgramadas.select(row)
      );
    this.seleccionadosProgramadasTabla = this.selectionProgramadas.selected;
  }

  /**
   * Logica para marcar registros de Programadas como seleccionados
   * @author prv_nparra
   */
  seleccionProgramadasRow(event, row) {
    if (event.checked === true) {
      this.seleccionadosProgramadasTabla.push(row);
    } else {
      this.seleccionadosProgramadasTabla =
        this.seleccionadosProgramadasTabla.filter(
          (element) => element.idOperacion !== row.idOperacion
        );
    }
  }

  /**
   * Logica para marcar registros de Certificadas como seleccionados
   * @author prv_nparra
   */
  seleccionarCertificadasTodo() {
    const numSelected = this.selectionCertificadas.selected.length;
    const numRows = this.dataSourceOperacionesCertificadas.data.length;
    return numSelected === numRows;
  }

  exporterTable(tableName: string) {
    if (tableName === this.nameXlsxProgramadas
      && this.exporterProgramadas && !this.loadProg && this.dataSourceOperacionesProgramadas.data.length !== 0) {
      this.callToServiceExport(tableName, this.tableProgramadas, this.displayedColumnsOperacionesProgramadas);
    }
    else if (tableName === this.nameXlsxCertificadas
      && this.exporterCertificadas && !this.loadCert && this.dataSourceOperacionesCertificadas.data.length !== 0) {
      this.callToServiceExport(tableName, this.tableCertificadas, this.displayedColumnsOperacionesCertificadas);
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
   * Logica para marcar registros de Certificadas como seleccionados
   * @author prv_nparra
   */
  seleccionCertificadas() {
    this.seleccionarCertificadasTodo()
      ? this.selectionCertificadas.clear()
      : this.dataSourceOperacionesCertificadas.data.forEach((row) =>
        this.selectionCertificadas.select(row)
      );
    this.seleccionadosCertificadasTabla = this.selectionCertificadas.selected;
  }

  /**
   * Logica para marcar registros de Certificadas como seleccionados
   * @author prv_nparra
   */
  seleccionCertificadasRow(event, row) {
    if (event.checked === true) {
      this.seleccionadosCertificadasTabla.push(row);
    } else {
      this.seleccionadosCertificadasTabla =
        this.seleccionadosCertificadasTabla.filter(
          (element) => element.idCertificacion !== row.idCertificacion
        );
    }
  }

  /**
   * Dialog para actualizar estado de operaciones programadas, de acuerdo
   * a los registros seleccionados con el checkbox
   * @param operacion P para Programadas, C para Certificadas
   * @author prv_nparra
   */
  openDialogUpdateEstadoOperaciones(operacion: string) {
    this.dialog.open(DialogUpdateEstadoOperacionesComponent, {
      width: '480px',
      height: '280px',
      data: {
        listOperaciones: operacion === 'P' ? this.seleccionadosProgramadasTabla : this.seleccionadosCertificadasTabla,
        operacion: operacion
      }
    }).afterClosed().subscribe(result => {
      if (result && result.data.response.code === 'S000') {
        this.seleccionadosProgramadasTabla = [];
        this.seleccionadosCertificadasTabla = [];
        this.selectionCertificadas.clear();
        this.selectionProgramadas.clear()
        this.filterTables();
      }
    });

  }

}
