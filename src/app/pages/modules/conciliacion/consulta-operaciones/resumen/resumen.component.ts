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
import { DateUtil } from 'src/app/pages/shared/utils/date-utils';

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

  public isLoading: boolean = false;

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
  }

  /**
   * Metodo que lista las operaciones desde las ceros horas del dia en curso hasta la hora exacta del dia en curso
   * @JuanMazo
   */
  listaResumenOperacionesDelDia(pagina = 0, tamanio = 5) {
    this.isLoading = true;
    var fechaDate1 = moment(this.fecha1).format('yyyy-MM-DD' + ' 00:00');
    var fechaDate2 = moment(this.fecha2).format('yyyy-MM-DD hh:mm');

    const data = {
      fechaConciliacionInicial: fechaDate1,
      fechaConciliacionFinal: fechaDate2
    }
    this.opConciliadasService.obtenerResumen(data).subscribe({
      next: (page: any) => {
        this.isLoading = false;
        this.dataSourceResumenOp = new MatTableDataSource([page.data]);
        this.dataSourceResumenOp.sort = this.sort;
        this.cantidadRegistros = page.data.totalElements;
      },
      error: (err: ErrorService) => {
        this.isLoading = false;
        this.onAlert("Error al obtener resumen de operaciones", GENERALES.CODE_EMERGENT.ERROR);
      }
    });
  }

  limpiar() {
    this.fecha1 = null;
    this.fecha2 = null;
  }

  filtroResumenOperacionesPorFecha() {
    const datetest = DateUtil.getDiffDays(this.fecha2, this.fecha1);
    if (datetest == undefined) {
      this.onAlert("Seleccione ambas fechas");
    } else if (datetest < 0) {
      this.onAlert("La fecha de inicio debe ser inferior o igual a la fecha final");
    }
    else {
      this.listaResumenOperacionesDelDia();
    }
  }

  onAlert(mensaje: string, codigo = GENERALES.CODE_EMERGENT.WARNING) {
    this.dialog.open(VentanaEmergenteResponseComponent, {
      width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
      data: {
        msn: mensaje,
        codigo: codigo,
      },
    });
  }

}
