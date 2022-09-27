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

  transportadoraForm = new FormControl();
  bancosForm = new FormControl();

  tranportadoraOptions: TransportadoraModel[]
  filteredOptionsTranportadora: Observable<TransportadoraModel[]>;

  bancoOptions: BancoModel[]
  filteredOptionsBancos: Observable<BancoModel[]>;

  dataSourceOperacionesProgramadas: MatTableDataSource<ConciliacionesProgramadasNoConciliadasModel>;
  displayedColumnsOperacionesProgramadas: string[] = ['fechaOrigen', 'tipoOperacion', 'valorTotal', 'acciones', 'relacion'];
  dataSourceOperacionesProgramadasComplet: ConciliacionesProgramadasNoConciliadasModel[];
  
  dataSourceOperacionesCertificadas: MatTableDataSource<ConciliacionesCertificadaNoConciliadasModel>
  displayedColumnsOperacionesCertificadas: string[] = ['idCertificacion', 'fechaEjecucion', 'tipoOperacion', 'valorTotal', 'acciones'];
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
    this.dialog.open(DialogConciliacionManualComponent, {
      width: 'auto',
      data: {
        origen: this.dataSourceOperacionesProgramadas.data,
        destino: this.dataSourceOperacionesCertificadas.data
      }
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
    }).subscribe((page: any) => {
      this.dataSourceOperacionesProgramadasComplet=page.data.content;
      this.dataSourceOperacionesProgramadas = new MatTableDataSource(page.data.content);
      this.dataSourceOperacionesProgramadas.sort = this.sort;
      this.cantidadRegistrosOpProgramadasSinConciliar = page.data.totalElements;
    },
      (err: ErrorService) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CONCILIATION.ERROR_OBTENER_PROGRAMADAS,
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
      page: pagina,
      size: tamanio,
    }).subscribe((page: any) => {
      this.dataSourceOperacionesCertificadasComplet=page.data.content;
      this.dataSourceOperacionesCertificadas = new MatTableDataSource(page.data.content);
      this.dataSourceOperacionesCertificadas.sort = this.sort;
      this.cantidadRegistrosOpCertificadasSinConciliar = page.data.totalElements;
    },
      (err: ErrorService) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CONCILIATION.ERROR_OBTENER_CERTIFICADAS,
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

  }

  filter(event) {
    if(event.banco !== undefined && event.trasportadora !== undefined){
      var filterData=this.dataSourceOperacionesProgramadasComplet.filter(conciliado=>conciliado.tdv===event.trasportadora && conciliado.bancoAVAL===event.banco);
      this.dataSourceOperacionesProgramadas = new MatTableDataSource(filterData);
      this.dataSourceOperacionesProgramadas.sort = this.sort;
      this.cantidadRegistrosProgram =filterData.length;
      var filterData2=this.dataSourceOperacionesCertificadasComplet.filter(conciliado=>conciliado.tdv===event.trasportadora && conciliado.bancoAVAL===event.banco);
      this.dataSourceOperacionesCertificadas = new MatTableDataSource(filterData2);
      this.dataSourceOperacionesCertificadas.sort = this.sort;
      this.cantidadRegistrosCerti =filterData.length;
    }else if(event.banco == undefined && event.trasportadora !== undefined) {
      var filterData=this.dataSourceOperacionesProgramadasComplet.filter(conciliado=>conciliado.tdv===event.trasportadora);
      this.dataSourceOperacionesProgramadas = new MatTableDataSource(filterData);
      this.dataSourceOperacionesProgramadas.sort = this.sort;
      this.cantidadRegistrosProgram =filterData.length;
      var filterData2=this.dataSourceOperacionesCertificadasComplet.filter(programado=>programado.tdv===event.trasportadora);
      this.dataSourceOperacionesCertificadas = new MatTableDataSource(filterData2);
      this.dataSourceOperacionesCertificadas.sort = this.sort;
      this.cantidadRegistrosCerti =filterData.length;
    }else if(event.trasportadora == undefined && event.banco !== undefined) {
      var filterData=this.dataSourceOperacionesProgramadasComplet.filter(conciliado=>conciliado.bancoAVAL===event.banco);
      this.dataSourceOperacionesProgramadas = new MatTableDataSource(filterData);
      this.dataSourceOperacionesProgramadas.sort = this.sort;
      this.cantidadRegistrosProgram =filterData.length;
      var filterData2=this.dataSourceOperacionesCertificadasComplet.filter(certificado=>certificado.bancoAVAL===event.banco);
      this.dataSourceOperacionesCertificadas = new MatTableDataSource(filterData2);
      this.dataSourceOperacionesCertificadas.sort = this.sort;
      this.cantidadRegistrosCerti =filterData.length;
    }
  }

  filter2(event) {
    if(event.banco !== undefined && event.trasportadora !== undefined){
      var filterData=this.dataSourceOperacionesCertificadasComplet.filter(conciliado=>conciliado.tdv===event.trasportadora && conciliado.bancoAVAL===event.banco);
      this.dataSourceOperacionesCertificadas = new MatTableDataSource(filterData);
      this.dataSourceOperacionesCertificadas.sort = this.sort;
      this.cantidadRegistrosCerti =filterData.length;
    }else if(event.banco == undefined && event.trasportadora !== undefined) {
      var filterData=this.dataSourceOperacionesCertificadasComplet.filter(programado=>programado.tdv===event.trasportadora);
      this.dataSourceOperacionesCertificadas = new MatTableDataSource(filterData);
      this.dataSourceOperacionesCertificadas.sort = this.sort;
      this.cantidadRegistrosCerti =filterData.length;
    }else if(event.trasportadora == undefined && event.banco !== undefined) {
      var filterData=this.dataSourceOperacionesCertificadasComplet.filter(certificado=>certificado.bancoAVAL===event.banco);
      this.dataSourceOperacionesCertificadas = new MatTableDataSource(filterData);
      this.dataSourceOperacionesCertificadas.sort = this.sort;
      this.cantidadRegistrosCerti =filterData.length;
    }
  }

}
