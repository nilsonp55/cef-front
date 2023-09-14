import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { OpConciliadasService } from 'src/app/_service/conciliacion-service/op-conciliadas.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TransportadoraModel } from 'src/app/_model/transportadora.model';
import { BancoModel } from 'src/app/_model/banco.model';
import { ConciliacionesCertificadaNoConciliadasModel } from 'src/app/_model/consiliacion-model/opera-certifi-no-conciliadas.model';

@Component({
  selector: 'app-consulta-opera-certificadas',
  templateUrl: './consulta-opera-certificadas.component.html',
  styleUrls: ['./consulta-opera-certificadas.component.css']
})

/**
 * Clease que muestra las operaciones certificadas no conciliadas
 */
export class ConsultaOperaCertificadasComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  //Rgistros paginados
  cantidadRegistros: number;
  load: boolean = true;
  bancoAVAL: string;
  transportadora: string;
  tipoPuntoOrigen: string[] = [];
  pageSizeList: number[] = [5, 10, 25, 100];

  transportadoraForm = new FormControl();
  bancosForm = new FormControl();

  tranportadoraOptions: TransportadoraModel[]
  filteredOptionsTranportadora: Observable<TransportadoraModel[]>;
  dataSourceOperacionesCertificadasComplet: ConciliacionesCertificadaNoConciliadasModel[];

  bancoOptions: BancoModel[]
  filteredOptionsBancos: Observable<BancoModel[]>;

  dataSourceOperacionesCertificadas: MatTableDataSource<ConciliacionesCertificadaNoConciliadasModel>
  displayedColumnsOperacionesCertificadas: string[] = ['codigoFondoTDV', 'bancoAVAL', 'tdv', 'nombreFondoTDV', 'codigoPropioTDV', 'tipoOperacion', 'entradaSalida', 'nombrePuntoOrigen', 'nombrePuntoDestino', 'valorTotal', 'valorFaltante', 'valorSobrante', 'fechaEjecucion', 'estadoConciliacion', 'fallidaOficina'];

  constructor(
    private dialog: MatDialog,
    private opConciliadasService: OpConciliadasService,
    ) { }

  ngOnInit(): void {
    this.listarOpCertificadasSinConciliar("", "", [""]);
  }

  displayFn(banco: any): string {
    return banco && banco.nombreBanco ? banco.nombreBanco : '';
  }

  displayFnTrans(transPortadora: any): string {
    return transPortadora && transPortadora.nombreTransportadora ? transPortadora.nombreTransportadora : '';
  }

  /**
  * Metodo para gestionar la paginación de la tabla
  * @JuanMazo
  */
  mostrarMas(e: any) {
    this.listarOpCertificadasSinConciliar(
      this.transportadora == undefined ? "" : this.transportadora,
      this.bancoAVAL == undefined ? "" : this.bancoAVAL,
      this.tipoPuntoOrigen == undefined ? [""] : this.tipoPuntoOrigen,
      e.pageIndex, e.pageSize);
  }

  /**
   * Lista las operaciones certificadas sin conciliar
   * @JuanMazo
   */
  listarOpCertificadasSinConciliar(tdv?: string, banco?: string, puntoOrigen?: string[], pagina = 0, tamanio = 10) {
    this.load = true;
    this.dataSourceOperacionesCertificadas = new MatTableDataSource();
    this.opConciliadasService.obtenerOpCertificadasSinconciliar({
      estadoConciliacion: GENERALES.ESTADOS_CONCILIACION.ESTADO_NO_CONCILIADO,
      conciliable: 'SI',
      bancoAVAL: banco,
      tdv:tdv,
      tipoPuntoOrigen:puntoOrigen,
      page: pagina,
      size: tamanio,
    }).subscribe({
      next: (page: any) => {
        this.dataSourceOperacionesCertificadasComplet=page.data.content;
        this.dataSourceOperacionesCertificadas = new MatTableDataSource(page.data.content);
        this.dataSourceOperacionesCertificadas.sort = this.sort;
        this.cantidadRegistros = page.data.totalElements;
        this.pageSizeList = [5, 10, 25, 100, page.data.totalElements];
        this.load = false;
      },
      error: (err: any) => {
        this.dataSourceOperacionesCertificadas = new MatTableDataSource();
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: err.error.response.description,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        }); setTimeout(() => { alert.close() }, 3000);
        this.load = false;
      }
    });
  }

  filter(event) {
    this.transportadora = event.trasportadora;
    this.bancoAVAL = event.banco;
    this.tipoPuntoOrigen = event.tipoPuntoOrigen;
    this.listarOpCertificadasSinConciliar(
      this.transportadora == undefined ? "" : this.transportadora,
      this.bancoAVAL == undefined ? "" : this.bancoAVAL,
      this.tipoPuntoOrigen == undefined ? [""] : this.tipoPuntoOrigen
    );
  }

}
