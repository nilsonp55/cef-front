import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators'
import { MatDialog } from '@angular/material/dialog';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { ErrorService } from 'src/app/_model/error.model';
import { OpConciliadasService } from 'src/app/_service/conciliacion-service/op-conicliadas.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BancoModel } from 'src/app/_model/banco.model';
import { TransportadoraModel } from 'src/app/_model/transportadora.model';
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
  cantidadRegistros: number;

  transportadoraForm = new FormControl();
  bancosForm = new FormControl();

  tranportadoraOptions: TransportadoraModel[]
  filteredOptionsTranportadora: Observable<TransportadoraModel[]>;

  bancoOptions: BancoModel[]
  filteredOptionsBancos: Observable<BancoModel[]>;

  dataSourceOperacionesProgramadas: MatTableDataSource<ConciliacionesProgramadasNoConciliadasModel>;
  displayedColumnsOperacionesProgramadas: string[] = ['fechaOrigen', 'tipoOperacion', 'valorTotal', 'acciones'];

  dataSourceOperacionesCertificadas: MatTableDataSource<ConciliacionesCertificadaNoConciliadasModel>
  displayedColumnsOperacionesCertificadas: string[] = ['fechaEjecucion', 'tipoOperacion', 'valorTotal','acciones'];


  constructor(
    private dialog: MatDialog,
    private generalesService: GeneralesService,
    private opConciliadasService: OpConciliadasService) { }


  ngOnInit(): void {
    this.listarBancos();
    this.listarTransportadoras();
    this.listarOpProgramadasFallidas();
    this.listarOpCertificadasFallidas();

  }

  displayFn(banco: any): string {
    return banco && banco.nombreBanco ? banco.nombreBanco : '';
  }

  displayFnTrans(transPortadora: any): string {
    return transPortadora && transPortadora.nombreTransportadora ? transPortadora.nombreTransportadora : '';
  }

   /**
   * Filtra las TDV para poder pintar en el editext
   * @param name 
   * @JuanMazo
   */
  private _filter(name: string): TransportadoraModel[] {
    const filterValue = name.toLowerCase();
    return this.tranportadoraOptions.filter(option => option.nombreTransportadora.toLowerCase().includes(filterValue));
  }

  /**
   * Filtra los bancos para poder pintar en el editext
   * @JuanMazo
   */
  private filtroBanco(name: string): BancoModel[] {
    const filterValue = name.toLowerCase();
    return this.bancoOptions.filter(bancoOption => bancoOption.nombreBanco.toLowerCase().includes(filterValue));
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
  * Se realiza consumo de servicio para listar los transportadoras
  * @JuanMazo
  */
  listarTransportadoras() {
    this.generalesService.listarTransportadoras().subscribe(data => {
      this.tranportadoraOptions = data.data
      this.filteredOptionsTranportadora = this.transportadoraForm.valueChanges.pipe(
        startWith(''),
        map(value => (typeof value === 'string' ? value : value.name)),
        map(name => (name ? this._filter(name) : this.tranportadoraOptions.slice())),
      );
    },
      (err: ErrorService) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_TRANSPORTE.ERROR_TRANSPORTE,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        });
        setTimeout(() => { alert.close() }, 3000);
      });
  }

  seleccion(filteredOptionsBancos: any) {
  }

  /** 
  * Se realiza consumo de servicio para listar los bancos
  * @JuanMazo
  */
  listarBancos() {
    this.generalesService.listarBancos().subscribe(data => {
      this.bancoOptions = data.data
      this.filteredOptionsBancos = this.bancosForm.valueChanges.pipe(
        startWith(''),
        map(value => (typeof value === 'string' ? value : value.name)),
        map(name => (name ? this.filtroBanco(name) : this.bancoOptions.slice())),
      );
    },
      (err: ErrorService) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_BANCO.ERROR_BANCO,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        });
        setTimeout(() => { alert.close() }, 3000);
      });
  }

  /**
   * Lista las operaciones programadas distintas al estado conciliadas
   * @JuanMazo
   */
  listarOpProgramadasFallidas(pagina = 0, tamanio = 5) {
    this.opConciliadasService.listarOpProgrmadasFallidas({
      page: pagina,
      size: tamanio,
    }).subscribe((page: any) => {
      this.dataSourceOperacionesProgramadas = new MatTableDataSource(page.data.content);
      this.dataSourceOperacionesProgramadas.sort = this.sort;
      this.cantidadRegistros = page.data.totalElements;
    },
      (err: ErrorService) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_DATA_FILE,
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
   listarOpCertificadasFallidas(pagina = 0, tamanio = 5) {
    this.opConciliadasService.listarOpCertificadasFallidas({
        page: pagina,
        size: tamanio
      }).subscribe((page: any) => {
      page.fechaEjecucion = moment(page.data.content).format('DD/MM/YYYY')
      this.dataSourceOperacionesCertificadas = new MatTableDataSource(page.data.content);
      this.dataSourceOperacionesCertificadas.sort = this.sort;
      this.cantidadRegistros = page.data.totalElements;
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
     mostrarMasOpCertificadasFallidas(e: any) {
      this.listarOpCertificadasFallidas(e.pageIndex, e.pageSize);
    }
}
