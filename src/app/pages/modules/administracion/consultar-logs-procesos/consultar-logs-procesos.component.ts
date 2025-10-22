import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConsultarLogsService } from 'src/app/_service/administracion-service/consultar-logs.service';
import { RolMenuService } from 'src/app/_service/roles-usuarios-service/roles-usuarios.service';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-consultar-logs-procesos',
  templateUrl: './consultar-logs-procesos.component.html',
  styleUrls: ['./consultar-logs-procesos.component.css']
})
export class ConsultarLogsProcesosComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('exporter', { static: false }) exporter: any;
  cantidadRegistros: number;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  paginaActual: number = 0;
  tamanioActual: number = 10;
  dataSourceLogs: MatTableDataSource<any>;
  displayedColumnsLogs: string[] = [
    'nombreProcesoProc',
    'ipOrigenProc',
    'fechaHoraProc',
    'estadoHttpProc',
    'usuarioProc',
    'mensajeRespuestaProc',
    'accionHttpProc',
    'estadoOperacionProc',
    'peticionProc'
  ];
  exportColumnsLogs: string[] = [
    'nombreProcesoProc',
    'ipOrigenProc',
    'fechaHoraProc',
    'estadoHttpProc',
    'usuarioProc',
    'mensajeRespuestaProc',
    'accionHttpProc',
    'estadoOperacionProc',
    'peticionProc',
    'peticionProcExport'
  ];
  spinnerActive: boolean = false;
  fechaInicio: any;
  fechaFinal: any;
  ipOrigen: any;
  usuario: any;
  opcionMenu: any;
  codigoProcesoSelect: any;
  estadoSelect: any;
  menuList: any = [];
  estadoList: any = [];
  codigoProcesoList: any = [];
  fullDataLogs: any[] = [];

  constructor(private LogsService: ConsultarLogsService, private readonly dialog: MatDialog, private menuService: RolMenuService) { }

  ngOnInit(): void {
    this.consultarListaMenu()
  }

  mostrarMas(e: any) {
    this.consultarLogsProcesos(e.pageIndex, e.pageSize);
  }

  consultarLogsProcesos(pagina = 0, tamanio = 10) {
    this.spinnerActive = true;
    console.log(this.codigoProcesoSelect)
    const params = {
      page: pagina,
      size: tamanio,
      fechaInicial: this.fechaInicio ? this.formatDate(this.fechaInicio) : null,
      fechaFinal: this.fechaFinal ? this.formatDate(this.fechaFinal) : null,
      usuario: this.usuario,
      ipOrigen: this.ipOrigen,
      nombreProceso: this.codigoProcesoSelect?.nombre,
      estadoHttp: this.estadoSelect
    };
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v != null)
    );

    this.LogsService.consultarLogsProcesos(filteredParams)
      .subscribe({
        next: (page: any) => {
          this.dataSourceLogs = new MatTableDataSource(
            page.content
          );
          this.fullDataLogs = [...this.fullDataLogs, ...page.content];
          this.estadoList = [
            ...new Set(this.fullDataLogs.map((log: any) => log.estadoHttpProc))
          ];
          this.dataSourceLogs.sort = this.sort;
          this.cantidadRegistros = page.totalElements;
          this.pageSizeOptions = [5, 10, 25, 100, page.totalElements];
          this.spinnerActive = false;
        },
        error: (err: any) => {
          this.dialog.open(VentanaEmergenteResponseComponent, {
            width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
            data: {
              msn:
                GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_DATA_FILE +
                ' - ' +
                err?.error?.response?.description,
              codigo: GENERALES.CODE_EMERGENT.ERROR,
            },
          });
          this.spinnerActive = false;
        },
      });
  }

  exporterTable() {
    const data = this.dataSourceLogs.data.map((row: any) => ({
      nombreProceso: row.nombreProcesoProc,
      ipOrigen: row.ipOrigenProc,
      fechaHora: row.fechaHoraProc,
      estadoHttp: row.estadoHttpProc,
      usuario: row.usuarioProc,
      mensajeRespuesta: row.mensajeRespuestaProc,
      accionHttp: row.accionHttpProc,
      estadoOperacion: row.estadoOperacionProc,
      peticionProc: row.peticionProc
    }));
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Logs');
    XLSX.writeFile(wb, 'logs-procesos.xlsx');
  }

  limpiar() {
    this.fechaInicio = null;
    this.fechaFinal = null;
    this.usuario = null;
    this.ipOrigen = null;
    this.codigoProcesoSelect = undefined;
    this.estadoSelect = undefined;
    this.consultarLogsProcesos()
  }

  clearDate() {
    this.fechaInicio = null
    this.fechaFinal = null
    this.consultarLogsProcesos()
  }

  getTooltip(valor: string): string {
    try {
      const obj = JSON.parse(valor ?? '{}');
      return JSON.stringify(obj, null, 2);
    } catch (e) {
      return valor || '';
    }
  }


  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // meses van de 0-11
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


  consultarListaMenu() {
    this.menuService.obtenerMenu().subscribe({
      next: (response: any) => {
        this.consultarLogsProcesos()
        this.codigoProcesoList = response.data.filter((item: any) => item.esProceso === true).sort
        ((a: any, b: any) => a.nombre.localeCompare(b.nombre)); 
      }, error: (err: any) => {
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn:
              GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_DATA_FILE +
              ' - ' +
              err?.error?.response?.description,
            codigo: GENERALES.CODE_EMERGENT.ERROR,
          },
        });
        this.spinnerActive = false;
      }
    })
  }

}
