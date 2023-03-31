import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { OpConciliadasService } from 'src/app/_service/conciliacion-service/op-conicliadas.service';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { TransportadoraModel } from 'src/app/_model/transportadora.model';
import { map, Observable, startWith } from 'rxjs';
import { BancoModel } from 'src/app/_model/banco.model';
import { GeneralesService } from 'src/app/_service/generales.service';
import { ConciliacionesProgramadasNoConciliadasModel } from 'src/app/_model/consiliacion-model/opera-program-no-conciliadas.model';
import { ConciliacionesCertificadaNoConciliadasModel } from 'src/app/_model/consiliacion-model/opera-certifi-no-conciliadas.model';
import { ErrorService } from 'src/app/_model/error.model';
import { ConciliacionesInfoProgramadasNoConciliadasModel } from 'src/app/_model/consiliacion-model/conciliaciones-info-programadas-no-conciliadas.model';
import { DialogConciliacionManualComponent } from './dialog-conciliacion-manual/dialog-conciliacion-manual.component';
import { DialogInfoCertificadasNoConciliadasComponent } from './dialog-info-certificadas-no-conciliadas/dialog-info-certificadas-no-conciliadas.component';
import { DialogInfoProgramadasNoConciliadasComponent } from './dialog-info-programadas-no-conciliadas/dialog-info-programadas-no-conciliadas.component';

@Component({
  selector: 'app-opearciones-no-conciliadas',
  templateUrl: './opearciones-no-conciliadas.component.html',
  styleUrls: ['./opearciones-no-conciliadas.component.css']
})

/**
 * Clase que nos lista las operaciones en estado no conciliado
 * @JuanMazo
 */
export class OpearcionesNoConciliadasComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  //Rgistros paginados
  cantidadRegistrosOpProgramadasSinConciliar: number;
  cantidadRegistrosOpCertificadasSinConciliar: number;

      //Rgistros paginados
      cantidadRegistrosProgram: number;
      cantidadRegistrosCerti: number;

      idsValue: string;

  transportadoraForm = new FormControl();
  bancosForm = new FormControl();

  tranportadoraOptions: TransportadoraModel[]
  filteredOptionsTranportadora: Observable<TransportadoraModel[]>;

  bancoOptions: BancoModel[]
  filteredOptionsBancos: Observable<BancoModel[]>;

  dataSourceOperacionesProgramadas: MatTableDataSource<ConciliacionesProgramadasNoConciliadasModel>;
  displayedColumnsOperacionesProgramadas: string[] = ['nombrePuntoOrigen','nombrePuntoDestino','fechaOrigen', 'entradaSalida', 'valorTotal', 'acciones', 'relacion'];
  dataSourceOperacionesProgramadasComplet: ConciliacionesProgramadasNoConciliadasModel[];
  
  dataSourceOperacionesCertificadas: MatTableDataSource<ConciliacionesCertificadaNoConciliadasModel>
  displayedColumnsOperacionesCertificadas: string[] = ['idCertificacion', 'nombrePuntoOrigen','nombrePuntoDestino', 'fechaEjecucion', 'entradaSalida', 'valorTotal', 'acciones'];
  dataSourceOperacionesCertificadasComplet: ConciliacionesCertificadaNoConciliadasModel[];

  constructor(
    private dialog: MatDialog,
    private opConciliadasService: OpConciliadasService,
    private generalesService: GeneralesService) { }


  ngOnInit(): void {
    this.listarOpProgramadasSinConciliar();
    this.listarOpCertificadasSinConciliar();
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
    const valorConciliacion =  this.dialog.open(DialogConciliacionManualComponent, {
      width: 'auto',
      data: {
        origen: this.dataSourceOperacionesProgramadas.data,
        destino: this.dataSourceOperacionesCertificadas.data
      }
    })
    valorConciliacion.afterClosed().subscribe(result => {
    //  opeProgramada.relacion = null; 
    })
  }

  /**
   * Lista las operaciones programadas sin conciliar
   * @JuanMazo
   */
  listarOpProgramadasSinConciliar(pagina = 0, tamanio = 500) {
    this.opConciliadasService.obtenerOpProgramadasSinconciliar({
      page: pagina,
      size: tamanio,
      estadoConciliacion: 'NO_CONCILIADA',
    }).subscribe((page: any) => {
      this.dataSourceOperacionesProgramadasComplet=page.data.content;
      this.dataSourceOperacionesProgramadas = new MatTableDataSource(page.data.content);
      this.dataSourceOperacionesProgramadas.sort = this.sort;
      this.cantidadRegistrosOpProgramadasSinConciliar = page.data.totalElements;
    },
      (err: any) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: err.error.response.description,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        }); setTimeout(() => { alert.close() }, 3000);
      });
  }

  /**
  * Metodo para gestionar la paginación de la tabla
  * @BaironPerez
  */
   mostrarMasOpProgramadasSinConciliar(e: any) {
    this.listarOpProgramadasSinConciliar(e.pageIndex, e.pageSize);
  }

  /**
   * Lista las operaciones certificadas sin conciliar
   * @JuanMazo
   */
  listarOpCertificadasSinConciliar(pagina = 0, tamanio = 500) {
    this.opConciliadasService.obtenerOpCertificadasSinconciliar({
      'estadoConciliacion': GENERALES.ESTADOS_CONCILIACION.ESTADO_NO_CONCILIADO,
      conciliable:'SI',
      page: pagina,
      size: tamanio,
    }).subscribe((page: any) => {
      this.dataSourceOperacionesCertificadasComplet=page.data.content;
      this.dataSourceOperacionesCertificadas = new MatTableDataSource(page.data.content);
      this.dataSourceOperacionesCertificadas.sort = this.sort;
      this.cantidadRegistrosOpCertificadasSinConciliar = page.data.totalElements;
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
   mostrarMasOpCertificadasSinConciliar(e: any) {
    this.listarOpCertificadasSinConciliar(e.pageIndex, e.pageSize);
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

  listarOpProgramadasSinConciliarXBancoOTDV(tdv: string, banco: string, puntoOrigen: string, pagina = 0, tamanio = 500) {
    this.opConciliadasService.obtenerOpProgramadasSinconciliar({
      estadoConciliacion: 'NO_CONCILIADA',
      bancoAVAL: banco,
      tdv:tdv,
      tipoPuntoOrigen:puntoOrigen,
      page: pagina,
      size: tamanio,
    }).subscribe((page: any) => {
      this.dataSourceOperacionesProgramadasComplet=page.data.content;
      this.dataSourceOperacionesProgramadas = new MatTableDataSource(page.data.content);
      this.dataSourceOperacionesProgramadas.sort = this.sort;
      this.cantidadRegistrosOpProgramadasSinConciliar = page.data.totalElements;
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
      estadoConciliacion: 'NO_CONCILIADA',
      conciliable: 'SI',
      bancoAVAL: banco,
      tdv:tdv,
      tipoPuntoOrigen:puntoOrigen,
      page: pagina,
      size: tamanio,
    }).subscribe((page: any) => {
      this.dataSourceOperacionesCertificadasComplet=page.data.content;
      this.dataSourceOperacionesCertificadas = new MatTableDataSource(page.data.content);
      this.dataSourceOperacionesCertificadas.sort = this.sort;
      this.cantidadRegistrosOpCertificadasSinConciliar = page.data.totalElements;
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
    if (event.trasportadora !== undefined && event.banco !== undefined && event.tipoPuntoOrigen !== undefined) {
      this.listarOpProgramadasSinConciliarXBancoOTDV(event.trasportadora, event.banco, event.tipoPuntoOrigen)
      this.listarOpCertificadasSinConciliarXBancoOTDV(event.trasportadora, event.banco, event.tipoPuntoOrigen)    }
    if (event.trasportadora == undefined && event.banco == undefined && event.tipoPuntoOrigen == undefined) {
      this.listarOpProgramadasSinConciliar()
      this.listarOpCertificadasSinConciliar()   }
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
  
  reset() {
    this.idsValue = "";
  }

}
