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
import { BancoModel } from 'src/app/_model/banco.model';
import { GeneralesService } from 'src/app/_service/generales.service';
import { TransportadoraModel } from 'src/app/_model/transportadora.model';
import { ConciliacionesProgramadasNoConciliadasModel } from 'src/app/_model/consiliacion-model/opera-program-no-conciliadas.model';


@Component({
  selector: 'app-consulta-opera-programadas',
  templateUrl: './consulta-opera-programadas.component.html',
  styleUrls: ['./consulta-opera-programadas.component.css']
})

/**
 * Clase que nos permite consultar las operaciones programadas no coniliadas
 * @auor JuanE.
 */
export class ConsultaOperaProgramadasComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  //matTableExporter: any;

  //Rgistros paginados
  cantidadRegistros: number;

  public load: boolean = true;
  pageSizeList: number[] = [5, 10, 25, 100];

  transportadoraForm = new FormControl();
  bancosForm = new FormControl();

  tranportadoraOptions: TransportadoraModel[]
  filteredOptionsTranportadora: Observable<TransportadoraModel[]>;

  bancoOptions: BancoModel[]
  filteredOptionsBancos: Observable<BancoModel[]>;

  dataSourceOperacionesProgramadas: MatTableDataSource<ConciliacionesProgramadasNoConciliadasModel>;
  dataConcilicionesComplete: ConciliacionesProgramadasNoConciliadasModel[]
  displayedColumnsOperacionesProgramadas: string[] = ['codigoFondoTDV', 'bancoAVAL', 'tdv', 'nombreFondoTDV', 'tipoOperacion', 'entradaSalida', 'nombrePuntoOrigen', 'nombrePuntoDestino', 'valorTotal', 'fechaProgramacion', 'fechaOrigen', 'fechaDestino', 'tipoServicio'];


  constructor(
    private dialog: MatDialog,
    private opConciliadasService: OpConciliadasService,
    private generalesService: GeneralesService) { }

  ngOnInit(): void {
    this.listarOpProgramadasSinConciliar();
  }



  /**
* Metodo para gestionar la paginación de la tabla
* @BaironPerez
*/
  mostrarMas(e: any) {
    this.listarOpProgramadasSinConciliar(e.pageIndex, e.pageSize);
  }

  /**
   * Lista las operaciones programadas sin conciliar
   * @JuanMazo
   */
  listarOpProgramadasSinConciliar(pagina = 0, tamanio = 10) {
    this.load = true;
    this.dataSourceOperacionesProgramadas = new MatTableDataSource();
    this.opConciliadasService.obtenerOpProgramadasSinconciliar({
      estadoConciliacion: 'NO_CONCILIADA',
      page: pagina,
      size: tamanio,
    }).subscribe({
      next: (page: any) => {
        this.dataConcilicionesComplete = page.data.content;
        this.dataSourceOperacionesProgramadas = new MatTableDataSource(page.data.content);
        this.dataSourceOperacionesProgramadas.sort = this.sort;
        this.cantidadRegistros = page.data.totalElements;
        this.pageSizeList = [5, 10, 25, 100, page.data.totalElements];
        this.load = false;
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
        this.load = false;
      }
    });
  }

  listarOpProgramadasSinConciliarXBancoOTDV(tdv: string, banco: string, puntoOrigen: string, pagina = 0, tamanio = 500) {
    this.load = true;
    this.dataSourceOperacionesProgramadas = new MatTableDataSource();
    this.opConciliadasService.obtenerOpProgramadasSinconciliar({
      estadoConciliacion: 'NO_CONCILIADA',
      bancoAVAL: banco,
      tdv: tdv,
      tipoPuntoOrigen: puntoOrigen,
      page: pagina,
      size: tamanio,
    }).subscribe({
      next: (page: any) => {
        this.dataConcilicionesComplete = page.data.content;
        this.dataSourceOperacionesProgramadas = new MatTableDataSource(page.data.content);
        this.dataSourceOperacionesProgramadas.sort = this.sort;
        this.cantidadRegistros = page.data.totalElements;
        this.pageSizeList = [5, 10, 25, 100, page.data.totalElements];
        this.load = false;
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
        this.load = false;
      }
    });
  }

  filter(event) {
    if (event.trasportadora !== undefined && event.banco !== undefined && event.tipoPuntoOrigen !== undefined) {
      this.listarOpProgramadasSinConciliarXBancoOTDV(event.trasportadora, event.banco, event.tipoPuntoOrigen)    }
    if (event.trasportadora == undefined && event.banco == undefined && event.tipoPuntoOrigen == undefined) {
      this.listarOpProgramadasSinConciliar()    }
    if (event.trasportadora !== undefined && event.banco == undefined && event.tipoPuntoOrigen == undefined) {
      this.listarOpProgramadasSinConciliarXBancoOTDV(event.trasportadora, "", "")    }
    if (event.trasportadora == undefined && event.banco !== undefined && event.tipoPuntoOrigen == undefined) {
      this.listarOpProgramadasSinConciliarXBancoOTDV("", event.banco, "")    }
    if (event.trasportadora == undefined && event.banco == undefined && event.tipoPuntoOrigen !== undefined) {
      this.listarOpProgramadasSinConciliarXBancoOTDV("", "", event.tipoPuntoOrigen)    }
    if (event.trasportadora == undefined && event.banco == undefined && event.tipoPuntoOrigen == undefined) {
      this.listarOpProgramadasSinConciliarXBancoOTDV("", "", "")    }
    if (event.trasportadora == undefined && event.banco !== undefined && event.tipoPuntoOrigen !== undefined) {
      this.listarOpProgramadasSinConciliarXBancoOTDV("", event.banco, event.tipoPuntoOrigen)    }
    if (event.trasportadora !== undefined && event.banco == undefined && event.tipoPuntoOrigen !== undefined) {
      this.listarOpProgramadasSinConciliarXBancoOTDV(event.trasportadora, "", event.tipoPuntoOrigen)    }
    if (event.trasportadora !== undefined && event.banco !== undefined && event.tipoPuntoOrigen == undefined) {
      this.listarOpProgramadasSinConciliarXBancoOTDV(event.trasportadora, event.banco, "")    }
  }

}
