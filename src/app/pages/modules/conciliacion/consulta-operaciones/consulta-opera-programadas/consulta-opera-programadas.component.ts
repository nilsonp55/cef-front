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
import { GeneralesService } from 'src/app/_service/generales.service';
import { TransportadoraModel } from 'src/app/_model/transportadora.model';
import { ConciliacionesProgramadasNoConciliadasModel } from 'src/app/_model/consiliacion-model/opera-program-no-conciliadas.model';
import { ConciliacionesInfoProgramadasNoConciliadasModel } from 'src/app/_model/consiliacion-model/conciliaciones-info-programadas-no-conciliadas.model';
import { DialogInfoProgramadasNoConciliadasComponent } from '../../opearciones-no-conciliadas/dialog-info-programadas-no-conciliadas/dialog-info-programadas-no-conciliadas.component';

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

  //Rgistros paginados
  cantidadRegistros: number;

  transportadoraForm = new FormControl();
  bancosForm = new FormControl();

  tranportadoraOptions: TransportadoraModel[]
  filteredOptionsTranportadora: Observable<TransportadoraModel[]>;

  bancoOptions: BancoModel[]
  filteredOptionsBancos: Observable<BancoModel[]>;

  constructor(
    private dialog: MatDialog,
    private opConciliadasService: OpConciliadasService,
    private generalesService: GeneralesService) { }

  ngOnInit(): void {
    this.listarBancos();
    this.listarTransportadoras();
    this.listarOpProgramadasSinConciliar();

  }

  dataSourceOperacionesProgramadas: MatTableDataSource<ConciliacionesProgramadasNoConciliadasModel>;
  displayedColumnsOperacionesProgramadas: string[] = ['codigoFondoTDV','entradaSalida', 'tipoPuntoOrigen', 'codigoPuntoOrigen', 'tipoPuntoDestino', 'codigoPuntoDestino', 'fechaProgramacion','fechaOrigen','fechaDestino', 'tipoOperacion', 'tipoTransporte', 'valorTotal', 'estadoOperacion', 'idNegociacion', 'tasaNegociacion', 'estadoConciliacion', 'idOperacionRelac', 'tipoServicio'];

  /**
* Metodo para gestionar la paginación de la tabla
* @BaironPerez
*/
  mostrarMas(e: any) {
    //this.listarArchivosCargados(e.pageIndex, e.pageSize);
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
   * @param name 
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
    this.dialog.open(DialogInfoProgramadasNoConciliadasComponent, {
      width: 'auto',
      data: element
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
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_DATA_FILE,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        });
        setTimeout(() => { alert.close() }, 3000);
      });
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
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_DATA_FILE,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        });
        setTimeout(() => { alert.close() }, 3000);
      });
  }

  /**
   * Lista las operaciones programadas sin conciliar
   * @JuanMazo
   */
  listarOpProgramadasSinConciliar() {
    this.opConciliadasService.obtenerOpProgramadasSinconciliar().subscribe((page: any) => {
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

}
