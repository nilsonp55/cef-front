import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';

import { MatTableDataSource } from '@angular/material/table';
import { OpConciliadasService } from 'src/app/_service/conciliacion-service/op-conciliadas.service';
import { MatDialog } from '@angular/material/dialog';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { MatSort } from '@angular/material/sort';
import { DatePipe } from '@angular/common';
import { GeneralesService } from 'src/app/_service/generales.service';

@Component({
  selector: 'app-consulta-opera-conciliadas',
  templateUrl: './consulta-opera-conciliadas.component.html',
  styleUrls: ['./consulta-opera-conciliadas.component.css']
})

/**
 * Clase que nos permite listar las operaciones conciliadas
 * @JuanMazo
 */
export class ConsultaOperaConciliadasComponent implements OnInit {

  @ViewChild('exporter', { static: false }) exporter: any;

  //Rgistros paginados
  cantidadRegistros: number;
  pageSizeList: number[] = [5, 10, 25, 100];

  public load: boolean = true;
  transportadora: string = "";
  bancoAVAL: string[] = [""];
  tipoPuntoOrigen: string[] = [""];
  tipoPuntoDestino: string[] = [""];
  estadoConciliacion: string[] = [""];
  fechaProceso: Date;
  numPagina: any;
  cantPagina: any

  //DataSource para pintar tabla de conciliados
  dataSourceConciliadas: MatTableDataSource<any>;
  displayedColumnsConciliadas: string[] = ['Banco', 'Transportadora', 'nombreFondoTDV', 'entradaSalida', 'puntoOrigen', 'puntoDestino', 'valorTotal', 'tipoConciliacion', 'fechaEjecucion'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private readonly opConciliadasService: OpConciliadasService,
    private readonly dialog: MatDialog,
    private readonly generalServices: GeneralesService
  ) { }


  ngOnInit(): void {
    let fechaFormat: string;
    this.generalServices.listarParametroByFiltro({
          codigo: "FECHA_DIA_PROCESO"
        }).subscribe(response=>{
          const [day, month, year] = response.data[0].valor.split('/');
          fechaFormat = year + '/' + month + '/' + day
          this.fechaProceso = new Date(fechaFormat);
          this.listarConciliados();
        });
  }
  
  /** 
 * Se realiza consumo de servicio para listar los conciliaciones
 * @JuanMazo
 */
  listarConciliados(pagina = 0, tamanio = 5) {
    this.load = true;
    this.dataSourceConciliadas = new MatTableDataSource();
    this.opConciliadasService.obtenerConciliados({
      estadoConciliacion: this.estadoConciliacion,
      bancoAVAL: this.bancoAVAL,
      fechaOrigen: this.fechaProceso == undefined ? "" : this.getFechaOrigen(this.fechaProceso),
      tdv: this.transportadora,
      tipoPuntoOrigen: this.tipoPuntoOrigen,
      tipoPuntoDestino: this.tipoPuntoDestino,
      page: pagina,
      size: tamanio,
    }).subscribe((page: any) => {
      this.dataSourceConciliadas = new MatTableDataSource(page.data.content);
      this.dataSourceConciliadas.sort = this.sort;
      this.cantidadRegistros = page.data.totalElements;
      this.pageSizeList = [5, 10, 25, 100, page.data.totalElements];
      this.load = false;
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
        this.load = false;
      });
  }

  exporterTable() {
    if (this.exporter && !this.load) {
      this.exporter.exportTable('xlsx', { fileName: 'operaciones_conciliadas' });
    }
  }

  filter(event) {
    this.estadoConciliacion = event.estadoConciliacion ?? '';
    this.transportadora = event.trasportadora ?? "";
    this.tipoPuntoOrigen = event.tipoPuntoOrigen ?? [""];
    this.tipoPuntoDestino = event.tipoPuntoDestino ?? [""];
    this.bancoAVAL = event.banco ?? [""];
    this.fechaProceso = event.fechaSelected;
    this.listarConciliados();
  }

  /**
 * Metodo para gestionar la paginación de la tabla
 * @BaironPerez
 */
  mostrarMas(e: any) {
    this.numPagina = e.pageIndex;
    this.cantPagina = e.pageSize;
    this.listarConciliados(this.numPagina, this.cantPagina);
  }

  
  getFechaOrigen(fecha: Date): string {
    const pipe = new DatePipe('en-US');
    return pipe.transform(fecha, 'yyyy/MM/dd');
  }

}
