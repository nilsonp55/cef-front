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
  selector: 'app-estado-cargue-certificacion',
  templateUrl: './estado-cargue-certificacion.component.html'
})
export class EstadoCargueCertificacionComponent implements OnInit {
  @ViewChild('sortAceptados') sortAceptados: MatSort;
  @ViewChild('sortFaltantes') sortFaltantes: MatSort;
  @ViewChild('sortSinFondos') sortSinFondos: MatSort;
  @ViewChild('paginatorAceptados', { static: false }) paginatorAceptados: MatPaginator;
  @ViewChild('paginatorFaltantes', { static: false }) paginatorFaltantes: MatPaginator;
  @ViewChild('paginatorSinFondos', { static: false }) paginatorSinFondos: MatPaginator;
  @ViewChild('exporterResumen', { static: false }) exporterResumen: any;
  @ViewChild('exporterAceptados', { static: false }) exporterAceptados: any;
  @ViewChild('exporterFaltantes', { static: false }) exporterFaltantes: any;
  @ViewChild('exporterSinFondos', { static: false }) exporterSinFondos: any;
  spinnerActive: boolean = false;
  mostrarTabla: any = false;

  serializedDate: any;
  fecha1: Date;
  fecha2: Date;

  idFuncion: number = 5;
  idTabSeleccionda: number = 0;

  displayedColumnsTransportadora: string[] = ['transportadora', 'estado', 'bavv', 'bbog', 'bocc', 'bpop'];
  displayedColumnsAceptados: string[] = ['fondo', 'ciudad', 'tdv', 'banco', 'estado', 'nomArch'];
  displayedColumnsFaltantes: string[] = ['archivo'];
  displayedColumnsSinFondos: string[] = ['archivo'];

  dataSourceAceptados: MatTableDataSource<any>;
  dataSourceResumen: MatTableDataSource<any>;
  dataSourceFaltantes: MatTableDataSource<any>;
  dataSourceSinFondos: MatTableDataSource<any>;


  resumenTransportadora: any[] = [];
  archivosAceptados: any[] = [];
  archivosFaltantes: any[] = [];
  archivosSinFondos: any[] = [];

  cantidadRegistrosAceptados: number;
  cantidadRegistrosFaltantes: number;
  cantidadRegistrosSinFondos: number;

  pageSizeOptions: number[] = [5, 10, 25, 100];
  pIndex: number = 0;
  pSize: number = 10;

  fechaProceso: Date;

  constructor(
    private dialog: MatDialog,
    private readonly procedimientosAlmacenadosService: ProcedimientosAlmacenadosService,
    private generalServices: GeneralesService
  ) { }

  async ngOnInit(): Promise<void> {
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
    } else if (DateUtil.getDiffDays(this.fechaProceso, this.fecha2)<0){
      this.onAlert("La fecha final debe ser inferior o igual a la fecha del sistema")
    }
    else {
      this.limpiarData()
      this.ejecutar();
    }
  }

  onAlert(mensaje: string) {
    const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
      width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
      data: {
        msn: mensaje,
        codigo: GENERALES.CODE_EMERGENT.WARNING,
      },
    });
  }

  limpiar() {
    this.fecha1 = null;
    this.fecha2 = null;
  }

  ejecutar() {
    this.fecha1
    this.fecha2
    const body = {
      "idFuncion": this.idFuncion,
      "parametros": DateUtil.dateToString(this.fecha1, GENERALES.FECHA_PATTERN3) + ',' + DateUtil.dateToString(this.fecha2, GENERALES.FECHA_PATTERN3)
    }
    this.spinnerActive = true;
    this.mostrarTabla = false;
    this.procedimientosAlmacenadosService.guardarProcedimientos(body).subscribe({
      next: data => {
        if (data.data.length == 0) {
          this.onAlert("No se encontró resultados para el rango de fecha")
        } else {
          this.procesarRespuesta(data)
        }
        this.spinnerActive = false;
        this.mostrarTabla = true;
      },
      error: (err: any) => {
        this.spinnerActive = false;
        this.mostrarTabla = true;
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: 'Error al ejecutar el procedimiento almacenado',
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        });
      }
    })

  }

  procesarRespuesta(data: any) {
    this.spinnerActive = false;
    let i = 4;
    let notPassNextBlob = true;
    while (notPassNextBlob) {
      let resp = data.data[i].split(',');
      if (resp[0] == 'FONDO') {
        notPassNextBlob = false;
      }
      if (notPassNextBlob && resp.length == 6) {
        const object = {
          transportadora: resp[0],
          estado: resp[1],
          bavv: resp[2],
          bbog: resp[3],
          bocc: resp[4],
          bpop: resp[5]
        }
        this.resumenTransportadora.push(object);
      }
      i++;
    }

    notPassNextBlob = true;
    while (notPassNextBlob) {
      let resp = data.data[i].split(',');
      if (resp[0] == 'Archivos que esán faltando después de cerrada la carga') {
        notPassNextBlob = false;
      }
      if (notPassNextBlob && resp.length == 6) {
        const object = {
          fondo: resp[0],
          ciudad: resp[1],
          tdv: resp[2],
          banco: resp[3],
          estado: resp[4],
          nomArch: resp[5]
        }
        this.archivosAceptados.push(object);
      }
      i++;
    }
    notPassNextBlob = true;
    while (notPassNextBlob) {
      let resp = data.data[i].split(',');
      if (resp[0] == 'Archivos que no se encuentran en fondos activos') {
        notPassNextBlob = false;
        this.archivosFaltantes.pop();
      }
      if (notPassNextBlob && resp.length == 1) {
        const object = {
          archivo: resp[0],
        }
        this.archivosFaltantes.push(object);
      }
      i++;
    }
    notPassNextBlob = true;
    while (notPassNextBlob && data.data.length - 1 >= i) {
      let resp = data.data[i].split(',');
      if (notPassNextBlob && resp.length == 1) {
        const object = {
          archivo: resp[0],
        }
        this.archivosSinFondos.push(object);
      }
      i++;
    }
    this.asignarDatosTablas();
    this.mostrarTabla = true;
    this.spinnerActive = false;
  }

  limpiarData() {
    this.resumenTransportadora = [];
    this.archivosAceptados = [];
    this.archivosFaltantes = [];
    this.archivosSinFondos = [];
    this.asignarDatosTablas();
  }

  asignarDatosTablas() {
    this.dataSourceResumen = new MatTableDataSource(this.resumenTransportadora);
    this.dataSourceAceptados = new MatTableDataSource(this.archivosAceptados);
    this.dataSourceFaltantes = new MatTableDataSource(this.archivosFaltantes);
    this.dataSourceSinFondos = new MatTableDataSource(this.archivosSinFondos);
    this.cantidadRegistrosAceptados = this.archivosAceptados.length;
    this.cantidadRegistrosFaltantes = this.archivosFaltantes.length;
    this.cantidadRegistrosSinFondos = this.archivosSinFondos.length;
    this.dataSourceAceptados.paginator = this.paginatorAceptados;
    this.dataSourceFaltantes.paginator = this.paginatorFaltantes;
    this.dataSourceSinFondos.paginator = this.paginatorSinFondos;
    this.dataSourceAceptados.sort = this.sortAceptados;
    this.dataSourceFaltantes.sort = this.sortFaltantes;
    this.dataSourceSinFondos.sort = this.sortSinFondos;
  }

  changeTab(event: number) {
    this.idTabSeleccionda = event;
  }

  getFechaOrigen(fecha: Date): string {
    const pipe = new DatePipe('en-US');
    return pipe.transform(fecha, 'dd/MM/yyyy');
  }

  getPageOptionPerTable(cantidadRegistros: number): number[] {
    return [...this.pageSizeOptions, cantidadRegistros]
  }

  exporterTable(name: string) {
    if (name == 'resumen_estado_cargue' && this.exporterResumen && !this.spinnerActive) {
      this.exporterResumen.exportTable('xlsx', { fileName: name });
    }
    else if (name == 'archivos_aceptados' && this.exporterAceptados && !this.spinnerActive) {
      this.exporterAceptados.exportTable('xlsx', { fileName: name });
    }
    else if (name == 'archivos_faltantes' && this.exporterFaltantes && !this.spinnerActive) {
      this.exporterFaltantes.exportTable('xlsx', { fileName: name });
    }
    else if (name == 'archivos_sin_fondos' && this.exporterSinFondos && !this.spinnerActive) {
      this.exporterSinFondos.exportTable('xlsx', { fileName: name });
    }
  }

}
