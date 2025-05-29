import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { ErrorService } from 'src/app/_model/error.model';
import { OpConciliadasService } from 'src/app/_service/conciliacion-service/op-conciliadas.service';
import * as moment from 'moment';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.component.html',
  styleUrls: ['./resumen.component.css']
})

/**
 * Clase que nos permite listar los resumenes de las operaciones y filtrarlos por fechas
 * @MillerO
 */
export class ResumenComponent implements OnInit {

  date: any;
  serializedDate: any;

  public fecha1: Date;
  public fecha2: Date;

  public load:boolean=false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  //Rgistros paginados
  cantidadRegistros: number;

  //DataSource para pintar tabla de resumenes
  dataSourceResumenOp: MatTableDataSource<any>
  displayedColumnsResumenOp: string[] = ['conciliadas', 'programadasNoConciliadas', 'certificadasNoConciliadas', 'conciliacionesFallidas', 'conciliacionesCanceladas', 'conciliacionesPospuestas', 'conciliacionesFueraConciliacion'];

  constructor(
    private dialog: MatDialog,
    private opConciliadasService: OpConciliadasService
  ) { }

  ngOnInit(): void {
    this.date = new FormControl(new Date());
    this.serializedDate = new FormControl(new Date().toISOString());
    this.listaResumenOperacionesDelDia()
  }

  /**
   * Metodo que lista las operaciones desde las ceros horas del dia en curso hasta la hora exacta del dia en curso
   * @JuanMazo
   */
  listaResumenOperacionesDelDia(pagina = 0, tamanio = 5) {
    var fechainicio = new Date();
    var fechafin = new Date();
    var fechaDate1 = moment(fechainicio).format('yyyy-MM-DD' + ' 00:00');
    var fechaDate2 = moment(fechafin).format('yyyy-MM-DD hh:mm');

    const data = {
      fechaConciliacionInicial: fechaDate1,
      fechaConciliacionFinal: fechaDate2
    }

    this.opConciliadasService.obtenerResumen(data).subscribe((page: any) => {
      this.load=true;
      this.dataSourceResumenOp = new MatTableDataSource([page.data]);
      this.dataSourceResumenOp.sort = this.sort;
      this.cantidadRegistros = page.data.totalElements;
    },
      (err: ErrorService) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: 'Error al obtener resumen de operaciones',
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        }); setTimeout(() => { alert.close() }, 3000);
      });
  }

  /**
   * Metodo que permite filtrar por fechas para listar el resumen de operaciones
   * @JuanMazo
   */
  filtroResumenOperacionesPorFecha() {

    var fechaDate1 = moment(this.fecha1).format('yyyy-MM-DD' + ' 00:00');
    var fechaDate2 = moment(this.fecha2).format('yyyy-MM-DD hh:mm');

    const data = {
      fechaConciliacionInicial: fechaDate1,
      fechaConciliacionFinal: fechaDate2
    }
    this.load=false;
    this.opConciliadasService.obtenerResumen(data).subscribe((page: any) => {
      this.load=true;
      this.dataSourceResumenOp = new MatTableDataSource([page.data]);
      this.dataSourceResumenOp.sort = this.sort;
      this.cantidadRegistros = page.data.totalElements;
    },
      (err: ErrorService) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: 'Error al obtener resumen de operaciones',
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        }); setTimeout(() => { alert.close() }, 3000);
      });
  }
  
    /**
  * Metodo para gestionar la paginaci�n de la tabla
  * @BaironPerez
  */
  mostrarMas(e: any) {
    this.listaResumenOperacionesDelDia(e.pageIndex, e.pageSize);
  }

}
