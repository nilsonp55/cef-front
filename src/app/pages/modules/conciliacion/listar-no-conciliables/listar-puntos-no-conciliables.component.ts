import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { DatePipe } from '@angular/common';
import { ProcedimientosAlmacenadosService } from 'src/app/_service/administracion-service/procedimientos-almacenados.service';
import { DateUtil } from 'src/app/pages/shared/utils/date-utils';
import { MatPaginator } from '@angular/material/paginator';
import { GeneralesService } from 'src/app/_service/generales.service';

@Component({
  selector: 'app-listar-puntos-no-conciliables',
  templateUrl: './listar-puntos-no-conciliables.component.html'
})
export class ListarPuntosNoConcialiablesComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('exporter', { static: false }) exporter: any;

  spinnerActive: boolean = false;

  serializedDate: any;
  fecha1: Date;
  fecha2: Date;

  idFuncion: number = 7;

  displayedColumnsNoConciliables: string[] = ['fondo', 'punto', 'origen', 'codigoPropioTdv', 'entradaSalida', 'fechaEjec', 'tipoServicio', 'valor', 'codigoServicio'];

  dataSourceNoConciliables: MatTableDataSource<any>;
  noConciliables: any[] = [];

  cantidadNoConciliables: number;

  pageSizeOptions: number[] = [5, 10, 25, 100];
  pIndex: number = 0;
  pSize: number = 10;

  fechaProceso: Date;

  constructor(
    private readonly dialog: MatDialog,
    private readonly procedimientosAlmacenadosService: ProcedimientosAlmacenadosService,
    private readonly generalServices: GeneralesService
  ) { }

  ngOnInit(): void {
    this.serializedDate = new FormControl(new Date().toISOString());
    this.getFechaSistema();
  }

  getFechaSistema() {
    this.generalServices.listarParametroByFiltro({
      codigo: "FECHA_DIA_PROCESO"
    }).subscribe((rs) => {
      this.fechaProceso = DateUtil.stringToDate(rs.data[0].valor);
    });
  }

  buscar() {
    const datetest = DateUtil.getDiffDays(this.fecha2, this.fecha1);
    if (datetest == undefined) {
      this.onAlert("Seleccione ambas fechas")
    } else if (datetest > 7) {
      this.onAlert("El rango de fechas debe ser inferior a 8 días")
    } else if (datetest < 0) {
      this.onAlert("La fecha inicial debe ser inferior a la fecha final")
    } else if (DateUtil.getDiffDays(this.fechaProceso, this.fecha2) < 0) {
      this.onAlert("La fecha final debe ser inferior o igual a la fecha de proceso")
    }
    else {
      this.limpiarData()
      this.ejecutar();
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

  limpiar() {
    this.fecha1 = null;
    this.fecha2 = null;
  }

  ejecutar() {
    const body = {
      "idFuncion": this.idFuncion,
      "parametros": DateUtil.dateToString(this.fecha1, GENERALES.FECHA_PATTERN3) + ',' + DateUtil.dateToString(this.fecha2, GENERALES.FECHA_PATTERN3)
    }
    this.spinnerActive = true;
    this.procedimientosAlmacenadosService.guardarProcedimientos(body).subscribe({
      next: data => {
        if (data.data.length == 0) {
          this.onAlert("No se encontró resultados para el rango de fecha");
        } else {
          this.procesarRespuesta(data);
        }
        this.spinnerActive = false;
      },
      error: (err: any) => {
        this.spinnerActive = false;
        this.onAlert("Error al ejecutar el procedimiento almacenado", GENERALES.CODE_EMERGENT.ERROR);
      }
    })

  }

  recrearTabla(resp: any) {
    if (resp.length == 9) {
      const object = {
        fondo: resp[0],
        punto: resp[1],
        origen: resp[2],
        codigoPropioTdv: resp[3],
        entradaSalida: resp[4],
        fechaEjec: resp[5],
        tipoServicio: resp[6],
        valor: resp[7],
        codigoServicio: resp[8]
      }
      this.noConciliables.push(object);
    }

  }

  procesarRespuesta(data: any) {
    let i = 4;
    while (data.data.length - 1 >= i) {
      try {
        let resp = data.data[i].split(',');
        this.recrearTabla(resp);
      } catch (error) {
        this.onAlert("Error procesando data de respuesta", GENERALES.CODE_EMERGENT.ERROR)
      }
      i++;
    }
    this.asignarDatosTablas();
  }

  limpiarData() {
    this.noConciliables = [];
    this.asignarDatosTablas();
  }

  asignarDatosTablas() {
    this.dataSourceNoConciliables = new MatTableDataSource(this.noConciliables);
    this.cantidadNoConciliables = this.noConciliables.length;
    this.dataSourceNoConciliables.paginator = this.paginator;
    this.dataSourceNoConciliables.sort = this.sort;

  }

  getFechaOrigen(fecha: Date): string {
    const pipe = new DatePipe('en-US');
    return pipe.transform(fecha, 'dd/MM/yyyy');
  }

  getPageOptionPerTable(cantidadRegistros: number): number[] {
    return [...this.pageSizeOptions, cantidadRegistros]
  }

  exporterTable(name: string) {
    if (name == 'no_conciliables' && this.exporter && !this.spinnerActive) {
      this.exporter.exportTable('xlsx', { fileName: name });
    }
  }

}
