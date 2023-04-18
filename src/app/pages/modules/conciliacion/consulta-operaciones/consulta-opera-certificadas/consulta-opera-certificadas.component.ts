import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { ErrorService } from 'src/app/_model/error.model';
import { OpConciliadasService } from 'src/app/_service/conciliacion-service/op-conicliadas.service';
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

  transportadoraForm = new FormControl();
  bancosForm = new FormControl();

  tranportadoraOptions: TransportadoraModel[]
  filteredOptionsTranportadora: Observable<TransportadoraModel[]>;
  dataSourceOperacionesCertificadasComplet: ConciliacionesCertificadaNoConciliadasModel[];

  bancoOptions: BancoModel[]
  filteredOptionsBancos: Observable<BancoModel[]>;

  dataSourceOperacionesCertificadas: MatTableDataSource<ConciliacionesCertificadaNoConciliadasModel>
  displayedColumnsOperacionesCertificadas: string[] = ['nombreFondoTDV', 'nombrePuntoOrigen', 'nombrePuntoDestino', 'fechaEjecucion', 'entradaSalida', 'estadoConciliacion', 'valorTotal', 'valorFaltante', 'valorSobrante', 'fallidaOficina'];

  constructor(
    private dialog: MatDialog,
    private opConciliadasService: OpConciliadasService,
    //private generalesService: GeneralesService
    ) { }

  ngOnInit(): void {
    this.listarOpCertificadasSinConciliar();
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
    this.listarOpCertificadasSinConciliar(e.pageIndex, e.pageSize);
  }

  /**
   * Lista las operaciones certificadas sin conciliar
   * @JuanMazo
   */
  listarOpCertificadasSinConciliar(pagina = 0, tamanio = 500) {
    this.opConciliadasService.obtenerOpCertificadasSinconciliar({
    'estadoConciliacion': GENERALES.ESTADOS_CONCILIACION.ESTADO_NO_CONCILIADO,
    'conciliable':'SI',
      page: pagina,
      size: tamanio,
    }).subscribe((page: any) => {
      this.dataSourceOperacionesCertificadasComplet=page.data.content;
      this.dataSourceOperacionesCertificadas = new MatTableDataSource(page.data.content);
      this.dataSourceOperacionesCertificadas.sort = this.sort;
      this.cantidadRegistros = page.data.totalElements;
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
      this.cantidadRegistros = page.data.totalElements;
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
      this.listarOpCertificadasSinConciliarXBancoOTDV(event.trasportadora, event.banco, event.tipoPuntoOrigen)    }
    if (event.trasportadora == undefined && event.banco == undefined && event.tipoPuntoOrigen == undefined) {
      this.listarOpCertificadasSinConciliar()   }
    if (event.trasportadora !== undefined && event.banco == undefined && event.tipoPuntoOrigen == undefined) {
      this.listarOpCertificadasSinConciliarXBancoOTDV(event.trasportadora, "", "")    }
    if (event.trasportadora == undefined && event.banco !== undefined && event.tipoPuntoOrigen == undefined) {
      this.listarOpCertificadasSinConciliarXBancoOTDV("", event.banco, "")    }
    if (event.trasportadora == undefined && event.banco == undefined && event.tipoPuntoOrigen !== undefined) {
      this.listarOpCertificadasSinConciliarXBancoOTDV("", "", event.tipoPuntoOrigen)    }
    if (event.trasportadora == undefined && event.banco == undefined && event.tipoPuntoOrigen == undefined) {
      this.listarOpCertificadasSinConciliarXBancoOTDV("", "", "")    }
    if (event.trasportadora == undefined && event.banco !== undefined && event.tipoPuntoOrigen !== undefined) {
      this.listarOpCertificadasSinConciliarXBancoOTDV("", event.banco, event.tipoPuntoOrigen)    }
    if (event.trasportadora !== undefined && event.banco == undefined && event.tipoPuntoOrigen !== undefined) {
      this.listarOpCertificadasSinConciliarXBancoOTDV(event.trasportadora, "", event.tipoPuntoOrigen)    }
    if (event.trasportadora !== undefined && event.banco !== undefined && event.tipoPuntoOrigen == undefined) {
      this.listarOpCertificadasSinConciliarXBancoOTDV(event.trasportadora, event.banco, "")    }
  }
    
}