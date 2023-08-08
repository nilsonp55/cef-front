import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
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

  @ViewChild('tablaProg') sortProg = new MatSort();
  @ViewChild('tablaCerti') sortCert = new MatSort();

  //Registros paginados
  cantidadRegistrosOpProgramadasFallidas: number;
  cantidadRegistrosOpCertificadasFallidas: number;

  //Registros paginados
  cantidadRegistrosProgram: number;
  cantidadRegistrosCerti: number;
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
  displayedColumnsOperacionesProgramadas: string[] = ['nombreFondoTDV', 'fechaOrigen', 'tipoOperacion', 'entradaSalida', 'estadoConciliacion', 'valorTotal', 'acciones'];
  dataSourceOperacionesProgramadasComplet: ConciliacionesProgramadasNoConciliadasModel[];

  dataSourceOperacionesCertificadas: MatTableDataSource<ConciliacionesCertificadaNoConciliadasModel>
  displayedColumnsOperacionesCertificadas: string[] = ['nombreFondoTDV', 'fechaEjecucion', 'tipoOperacion', 'entradaSalida', 'estadoConciliacion', 'valorTotal', 'acciones'];
  dataSourceOperacionesCertificadasComplet: ConciliacionesCertificadaNoConciliadasModel[];

  constructor(
    private dialog: MatDialog,
    private opConciliadasService: OpConciliadasService) { }

  ngAfterViewInit() {
    this.dataSourceOperacionesProgramadas.sort = this.sortProg;
    this.dataSourceOperacionesCertificadas.sort = this.sortCert;
  }

  ngOnInit(): void {
    this.numPaginaOpPr = 0;
    this.cantPaginaOpPr = 10;
    this.numPaginaOpCer = 0;
    this.cantPaginaOpCer = 10;
    this.listarOpProgramadasFallidas("", "", [""], this.estadoConciliacionInicial);
    this.listarOpCertificadasFallidas("", "", [""], this.estadoConciliacionInicial);

  }

  displayFn(banco: any): string {
    return banco && banco.nombreBanco ? banco.nombreBanco : '';
  }

  displayFnTrans(transPortadora: any): string {
    return transPortadora && transPortadora.nombreTransportadora ? transPortadora.nombreTransportadora : '';
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
      if (result.data.listar) {
        //No debe de listar
      } else {
        this.ngOnInit()
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
      if (result.data.listar != 'N') {
        this.ngOnInit()
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
        this.cantidadRegistrosOpProgramadasFallidas = page.data.totalElements;
        this.pageSizeListProg = [5, 10, 25, 100, page.data.totalElements];
        this.loadProg = false;
      },
      error: (err: any) => {
        this.dataSourceOperacionesProgramadas = new MatTableDataSource();
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: err.error.response.description,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        });
        setTimeout(() => { alert.close() }, 3000);
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
        this.cantidadRegistrosOpCertificadasFallidas = page.data.totalElements;
        this.pageSizeListCert = [5, 10, 25, 100, page.data.totalElements];
        this.loadCert = false;
      },
      error: (err: any) => {
        this.dataSourceOperacionesCertificadas = new MatTableDataSource();
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: err.error.response.description,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        });
        setTimeout(() => { alert.close() }, 3000);
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

}
