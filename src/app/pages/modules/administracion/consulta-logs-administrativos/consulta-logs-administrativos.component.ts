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
  selector: 'app-consulta-logs-administrativos',
  templateUrl: './consulta-logs-administrativos.component.html',
  styleUrls: ['./consulta-logs-administrativos.component.css']
})
export class ConsultaLogsAdministrativosComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('exporter', { static: false }) exporter: any;
  cantidadRegistros: number;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  paginaActual: number = 0;
  tamanioActual: number = 10;
  dataSourceLogs: MatTableDataSource<any>;
  displayedColumnsLogs: string[] = [
    'ipOrigen',
    'usuario',
    'fechaHora',
    'estadoHttp',
    'opcionMenu',
    'accionHttp',
    'valorNuevo',
    'valorAnterior'
  ];
  exportColumnsLogs: string[] = [
    'ipOrigen',
    'usuario',
    'fechaHora',
    'estadoHttp',
    'opcionMenu',
    'accionHttp',
    'valorAnteriorExport',
    'valorNuevoExport'
  ];
  spinnerActive: boolean = false;
  fechaInicio: any;
  fechaFinal: any;
  ipOrigen: any;
  usuario: any;
  opcionMenu: any;
  opcionMenuSelect: any;
  menuList: any = [];

  constructor(private LogsService: ConsultarLogsService, private readonly dialog: MatDialog, private menuService: RolMenuService) { }

  ngOnInit(): void {
    this.consultarListaMenu();
  }

  mostrarMas(e: any) {
    this.consultarLogs(e.pageIndex, e.pageSize);
  }

  exporterTable() {
    const data = this.dataSourceLogs.data.map((row: any) => ({
      ipOrigen: row.ipOrigen,
      usuario: row.usuario,
      fechaHora: row.fechaHora,
      estadoHttp: row.estadoHttp,
      opcionMenu: row.opcionMenu,
      accionHttp: row.accionHttp,
      valorAnterior: row.valorAnterior,
      valorNuevo: row.valorNuevo
    }));
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Logs');
    XLSX.writeFile(wb, 'logs-administrativos.xlsx');
  }

  consultarLogs(pagina = 0, tamanio = 10) {
    this.spinnerActive = true;
    const params = {
      $page: pagina,
      size: tamanio,
      fechaInicial: this.fechaInicio ? this.formatDate(this.fechaInicio) : null,
      fechaFinal: this.fechaFinal ? this.formatDate(this.fechaFinal) : null,
      usuario: this.usuario,
      ipOrigen: this.ipOrigen,
      opcionMenu: this.opcionMenuSelect?.nombre
    };
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v != null)
    );

    this.LogsService.consultarLogsAuditoria(filteredParams)
      .subscribe({
        next: (page: any) => {
          this.dataSourceLogs = new MatTableDataSource(
            page.content
          );
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

  getTooltip(valorAnterior: string, valorNuevo: string): string {
    try {
      const objAnterior = JSON.parse(valorAnterior ?? '{}');
      const objNuevo = JSON.parse(valorNuevo ?? '{}');

      let diferencias: any = {};

      Object.keys({ ...objAnterior, ...objNuevo }).forEach(key => {
        if (objAnterior[key] !== objNuevo[key]) {
          diferencias[key] = {
            anterior: objAnterior[key],
            nuevo: objNuevo[key]
          };
        }
      });

      // Si no hay diferencias, devolvemos el JSON completo (formateado bonito)
      if (Object.keys(diferencias).length === 0) {
        return JSON.stringify(objNuevo, null, 2);
      }

      return JSON.stringify(diferencias, null, 2);
    } catch (e) {
      return valorNuevo || valorAnterior || '';
    }
  }

  consultarListaMenu() {
    this.menuService.obtenerMenu().subscribe({
      next: (response: any) => {
        this.menuList = response.data.sort((a: any, b: any) => a.nombre.localeCompare(b.nombre));
        this.consultarLogs();
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

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // meses van de 0-11
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  limpiar() {
    this.fechaInicio = null;
    this.fechaFinal = null;
    this.usuario = null;
    this.ipOrigen = null;
    this.opcionMenuSelect = undefined;
    this.consultarLogs()
  }

  clearDate() {
    this.fechaInicio = null
    this.fechaFinal = null
    this.consultarLogs()
  }

}
