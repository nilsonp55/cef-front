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
import { TransportadoraModel } from 'src/app/_model/transportadora.model';
import { BancoModel } from 'src/app/_model/banco.model';
import { ConciliacionesProgramadasNoConciliadasModel } from 'src/app/_model/consiliacion-model/opera-program-no-conciliadas.model';
import { ConciliacionesCertificadaNoConciliadasModel } from 'src/app/_model/consiliacion-model/opera-certifi-no-conciliadas.model';
import { GeneralesService } from 'src/app/_service/generales.service';
import { ConciliacionesInfoProgramadasNoConciliadasModel } from 'src/app/_model/consiliacion-model/conciliaciones-info-programadas-no-conciliadas.model';
import { DialogInfoProgramadasFallidasComponent } from './dialog-info-programadas-fallidas/dialog-info-programadas-fallidas.component';
import { DialogActualizarOpCertificadasComponent } from './dialog-actualizar-op-certificadas/dialog-actualizar-op-certificadas.component';
import { DialogConciliacionManualComponent } from '../opearciones-no-conciliadas/dialog-conciliacion-manual/dialog-conciliacion-manual.component';

@Component({
  selector: 'app-opearciones-fallidas',
  templateUrl: './opearciones-fallidas.component.html',
  styleUrls: ['./opearciones-fallidas.component.css']
})

/**
 * Clase que nos lista las operaciones programadas y conciliadas en estado de conciliacion fallidas, canceladas, pospuestas o fuera de conciliación,
 * permite modificar su estado y su valor
 * @JuanMazo 
 */
export class OpearcionesFallidasComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  //Rgistros paginados
  cantidadRegistrosOpProgramadasFallidas: number;
  cantidadRegistrosOpCertificadasFallidas: number;

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
  displayedColumnsOperacionesProgramadas: string[] = ['fechaOrigen', 'tipoOperacion', 'valorTotal', 'acciones'];
  dataSourceOperacionesProgramadasComplet: ConciliacionesProgramadasNoConciliadasModel[];
 
  dataSourceOperacionesCertificadas: MatTableDataSource<ConciliacionesCertificadaNoConciliadasModel>
  displayedColumnsOperacionesCertificadas: string[] = ['fechaEjecucion', 'tipoOperacion', 'valorTotal', 'acciones'];
  dataSourceOperacionesCertificadasComplet: ConciliacionesCertificadaNoConciliadasModel[];

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
   * Metodo que llama al dialog de Info de operfaciones programadas
   * @JuanMazo
   */
  infoOpProgramadas(element: ConciliacionesInfoProgramadasNoConciliadasModel) {
    const dialogRef = this.dialog.open(DialogInfoProgramadasFallidasComponent, {
      width: 'auto',
      data: element
    })
    dialogRef.afterClosed().subscribe(result => {
      this.listarOpProgramadasFallidas();
    });
  }

  close(){
   // this.dialogRef.close({event:'Cancel'})
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
      this.listarOpCertificadasFallidas();
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
        }); setTimeout(() => { alert.close() }, 3000);
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
  listarOpProgramadasFallidas(pagina = 0, tamanio = 500) {
    this.opConciliadasService.obtenerOpProgramadasSinconciliar({
      'estadoConciliacion': "NO_CONCILIADA",
      page: pagina,
      size: tamanio,
    }).subscribe((page: any) => {
      this.dataSourceOperacionesProgramadasComplet=page.data.content;
      this.dataSourceOperacionesProgramadas = new MatTableDataSource(page.data.content);
      this.dataSourceOperacionesProgramadas.sort = this.sort;
      this.cantidadRegistrosOpProgramadasFallidas = page.data.totalElements;
    },
      (err: ErrorService) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CONCILIATION.ERROR_OBTENER_PROGRAMADAS,
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
  listarOpCertificadasFallidas(pagina = 0, tamanio = 500) {
    this.opConciliadasService.obtenerOpCertificadasSinconciliar({
      'estadoConciliacion': "NO_CONCILIADA",
      page: pagina,
      size: tamanio,
    }).subscribe((page: any) => {
      this.dataSourceOperacionesCertificadasComplet=page.data.content;
      this.dataSourceOperacionesCertificadas = new MatTableDataSource(page.data.content);
      this.dataSourceOperacionesCertificadas.sort = this.sort;
      this.cantidadRegistrosOpCertificadasFallidas = page.data.totalElements;
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
    this.listarOpProgramadasFallidas(e.pageIndex, e.pageSize);
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
