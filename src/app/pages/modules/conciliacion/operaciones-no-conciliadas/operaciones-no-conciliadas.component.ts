import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { OpConciliadasService } from 'src/app/_service/conciliacion-service/op-conciliadas.service';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { TransportadoraModel } from 'src/app/_model/transportadora.model';
import { Observable } from 'rxjs';
import { BancoModel } from 'src/app/_model/banco.model';
import { ConciliacionesProgramadasNoConciliadasModel } from 'src/app/_model/consiliacion-model/opera-program-no-conciliadas.model';
import { ConciliacionesCertificadaNoConciliadasModel } from 'src/app/_model/consiliacion-model/opera-certifi-no-conciliadas.model';
import { ConciliacionesInfoProgramadasNoConciliadasModel } from 'src/app/_model/consiliacion-model/conciliaciones-info-programadas-no-conciliadas.model';
import { DialogConciliacionManualComponent } from './dialog-conciliacion-manual/dialog-conciliacion-manual.component';
import { DialogInfoCertificadasNoConciliadasComponent } from './dialog-info-certificadas-no-conciliadas/dialog-info-certificadas-no-conciliadas.component';
import { DialogInfoProgramadasNoConciliadasComponent } from './dialog-info-programadas-no-conciliadas/dialog-info-programadas-no-conciliadas.component';

@Component({
  selector: 'app-operaciones-no-conciliadas',
  templateUrl: './operaciones-no-conciliadas.component.html',
  styleUrls: ['./operaciones-no-conciliadas.component.css']
})

/**
 * Clase que nos lista las operaciones en estado no conciliado
 * @JuanMazo
 */
export class OperacionesNoConciliadasComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('sort1') sort1 = new MatSort();
  @ViewChild('sort2') sort2 = new MatSort();

  //Registros paginados
  cantidadRegistrosOpProgramadasSinConciliar: number;
  cantidadRegistrosOpCertificadasSinConciliar: number;

  //Registros paginados
  cantidadRegistrosProgram: number;
  cantidadRegistrosCerti: number;
  loadProg: boolean = true;
  pageSizeListProg: number[] = [5, 10, 25, 100];
  loadCert: boolean = true;
  pageSizeListCert: number[] = [5, 10, 25, 100];
  numPaginaOpPr: any;
  cantPaginaOpPr: any;
  numPaginaOpCer: any;
  cantPaginaOpCer: any;

  idsValue: string;

  transportadoraForm = new FormControl();
  bancosForm = new FormControl();

  tranportadoraOptions: TransportadoraModel[]
  filteredOptionsTranportadora: Observable<TransportadoraModel[]>;

  bancoOptions: BancoModel[]
  filteredOptionsBancos: Observable<BancoModel[]>;

  dataSourceOperacionesProgramadas: MatTableDataSource<ConciliacionesProgramadasNoConciliadasModel>;
  displayedColumnsOperacionesProgramadas: string[] = ['idOperacion', 'tipoOperacion', 'oficina', 'nombrePuntoOrigen', 'nombrePuntoDestino', 'fechaOrigen', 'entradaSalida', 'valorTotal', 'acciones', 'relacion'];
  dataSourceOperacionesProgramadasComplet: ConciliacionesProgramadasNoConciliadasModel[];

  dataSourceOperacionesCertificadas: MatTableDataSource<ConciliacionesCertificadaNoConciliadasModel>
  displayedColumnsOperacionesCertificadas: string[] = ['idCertificacion', 'tipoOperacion', 'oficina', 'nombrePuntoOrigen', 'nombrePuntoDestino', 'fechaEjecucion', 'entradaSalida', 'valorTotal', 'acciones'];
  dataSourceOperacionesCertificadasComplet: ConciliacionesCertificadaNoConciliadasModel[];

  filtroBanco: string = '';
  filtroTrasportadora: string = '';
  filtroTipoPunto: string[] = [""];

  constructor(
    private dialog: MatDialog,
    private opConciliadasService: OpConciliadasService
  ) { }


  ngOnInit(): void {
    this.numPaginaOpPr = 0;
    this.cantPaginaOpPr = 10;
    this.numPaginaOpCer = 0;
    this.cantPaginaOpCer = 10;
    this.listarOpProgramadasSinConciliar("", "", [""]);
    this.listarOpCertificadasSinConciliar("", "", [""]);
  }

  displayFn(banco: any): string {
    return banco && banco.nombreBanco ? banco.nombreBanco : '';
  }

  displayFnTrans(transPortadora: any): string {
    return transPortadora && transPortadora.nombreTransportadora ? transPortadora.nombreTransportadora : '';
  }

  /**
   * Metodo que llama al dialog de Info de op programadas
   * @JuanMazo
   */
  infoOpProgramadas(element: ConciliacionesInfoProgramadasNoConciliadasModel) {
    this.dialog.open(DialogInfoProgramadasNoConciliadasComponent, {
      width: 'auto',
      data: element
    })
  }

  /**
   * Metodo que llama al dialog de Info de op certificadas
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
    this.reset()
    this.dialog.open(DialogConciliacionManualComponent, {
      width: 'auto',
      data: {
        origen: this.dataSourceOperacionesProgramadas.data,
        destino: this.dataSourceOperacionesCertificadas.data
      }
    });
  }

  /**
   * Lista las operaciones programadas sin conciliar
   * @JuanMazo
   */
  listarOpProgramadasSinConciliar(tdv?: string, banco?: string, puntoOrigen?: string[], pagina = 0, tamanio = 10) {
    this.loadProg = true;
    this.dataSourceOperacionesProgramadas = new MatTableDataSource();
    this.opConciliadasService.obtenerOpProgramadasSinconciliar({
      page: pagina,
      size: tamanio,
      estadoConciliacion: 'NO_CONCILIADA',
      bancoAVAL: banco,
      tdv: tdv,
      tipoPuntoOrigen: puntoOrigen,
    }).subscribe({
      next: (page: any) => {
        this.dataSourceOperacionesProgramadasComplet = page.data.content;
        this.dataSourceOperacionesProgramadas = new MatTableDataSource(page.data.content);
        this.dataSourceOperacionesProgramadas.sort = this.sort1;
        this.cantidadRegistrosOpProgramadasSinConciliar = page.data.totalElements;
        this.pageSizeListProg = [5, 10, 25, 100, page.data.totalElements];
        this.loadProg = false;
      },
      error: (err: any) => {
        this.dataSourceOperacionesProgramadas = new MatTableDataSource();
        this.dataSourceOperacionesProgramadas = new MatTableDataSource();
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: err.error.response.description,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        }); setTimeout(() => { alert.close() }, 3000);
        this.loadProg = false;
      }
    });
  }

  /**
   * Lista las operaciones certificadas sin conciliar
   * @JuanMazo
   */
  listarOpCertificadasSinConciliar(tdv?: string, banco?: string, puntoOrigen?: string[], pagina = 0, tamanio = 10) {
    this.loadCert = true;
    this.dataSourceOperacionesCertificadas = new MatTableDataSource();
    this.opConciliadasService.obtenerOpCertificadasSinconciliar({
      'estadoConciliacion': GENERALES.ESTADOS_CONCILIACION.ESTADO_NO_CONCILIADO,
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
        this.cantidadRegistrosOpCertificadasSinConciliar = page.data.totalElements;
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
  mostrarMasOpProgramadasSinConciliar(e: any) {
    this.numPaginaOpPr = e.pageIndex;
    this.cantPaginaOpPr = e.pageSize;
    this.listarOpProgramadasSinConciliar(
      this.filtroTrasportadora == undefined ? "" : this.filtroTrasportadora,
      this.filtroBanco == undefined ? "" : this.filtroBanco,
      this.filtroTipoPunto == undefined ? [""] : this.filtroTipoPunto,
      e.pageIndex, e.pageSize
    );
  }

  /**
  * Metodo para gestionar la paginación de la tabla
  * @BaironPerez
  */
  mostrarMasOpCertificadasSinConciliar(e: any) {
    this.numPaginaOpCer = e.pageIndex;
    this.cantPaginaOpCer = e.pageSize;
    this.listarOpCertificadasSinConciliar(
      this.filtroTrasportadora == undefined ? "" : this.filtroTrasportadora,
      this.filtroBanco == undefined ? "" : this.filtroBanco,
      this.filtroTipoPunto == undefined ? [""] : this.filtroTipoPunto,
      e.pageIndex, e.pageSize
    );
  }

  /**
   * Metodo que captura el id para comparar
   * @param event 
   * @param opeProgramada 
   * @JuanMazo
   */
  getIdCompare(event: any, opeProgramada: any) {
    if (event.target.value != '') {
      opeProgramada.relacion = event.target.value
    }
    if (event.target.value == '') {
      opeProgramada.relacion = undefined
    }
  }

  eventoEnter(event: any, opeProgramada: any) {
    if (event.target.value != '') {
      opeProgramada.relacion = event.target.value
      this.conciliacionManual()
    }
    if (event.target.value == '') {
      opeProgramada.relacion = undefined
    }
  }

  filter(event) {

    this.filtroBanco = event.banco;
    this.filtroTrasportadora = event.trasportadora;
    this.filtroTipoPunto = event.tipoPuntoOrigen;

    this.listarOpProgramadasSinConciliar(
      this.filtroTrasportadora == undefined ? "" : this.filtroTrasportadora,
      this.filtroBanco == undefined ? "" : this.filtroBanco,
      this.filtroTipoPunto == undefined ? [""] : this.filtroTipoPunto,
      this.numPaginaOpPr, this.cantPaginaOpPr
    );
    this.listarOpCertificadasSinConciliar(
      this.filtroTrasportadora == undefined ? "" : this.filtroTrasportadora,
      this.filtroBanco == undefined ? "" : this.filtroBanco,
      this.filtroTipoPunto == undefined ? [""] : this.filtroTipoPunto,
      this.numPaginaOpCer, this.cantPaginaOpCer
    );

  }

  reset() {
    this.idsValue = "";
  }

}
