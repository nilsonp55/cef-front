import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { ConciliacionesModel } from 'src/app/_model/consiliacion-model/conciliacion.model';
import { DatePipe } from '@angular/common';
import { OpConciliacionCostosService } from 'src/app/_service/conciliacion-costos-services/op-conciliacion-costos';
import { SelectionModel } from '@angular/cdk/collections';
import Swal from 'sweetalert2';
import { VentanaEmergenteVerDetalleArchivoComponent } from './ventana-emergente-detalle/ventana-emergente-detalle';
import { VentanaEmergenteErrorComponent } from './ventana-emergente-error/ventana-emergente-error.component';
import { VentanaEmergenteEliminarComponent } from './ventana-emergente-eliminar/ventana-emergente-eliminar.component';

@Component({
  selector: 'app-archivos-pendientes-carga',
  templateUrl: './archivos-pendientes-carga.component.html',
  styleUrls: ['./archivos-pendientes-carga.component.css']
})

export class ArchivosPendienteCargaComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  //Registros paginados
  cantidadRegistros: number;
  estado: string[];
  bancoAVAL: string[];
  fechaOrigen: any;
  transportadora: string;
  tipoPuntoOrigen: string[] = [];
  fechaTransferencia: any;
  fechaArchivo: any;
  load: boolean = true;
  pageSizeList: number[] = [5, 10, 25, 100];
  numPagina: any;
  cantPagina: any

  //DataSource para pintar tabla de conciliados
  dataSourceConciliadas: MatTableDataSource<ConciliacionesModel>;
  displayedColumnsConciliadas: string[] = ['select', 'nombreArchivo', 'fechaArchivo', 'Estado', 'Banco', 'Tdv', 'fechaTransferencia', 'tipoArchivo', 'acciones'];

  //selectData para pintar check de seleccion en la tabla
  selection = new SelectionModel<ConciliacionesModel>(true, []);
  listData: any[];
  seleccionadosTabla: any = [];
  seleccionTodo: any = [];
  procesarArchivo: {};
  archivoProcesarList: any = [];
  filtros: { banco: any[]; estado: any[]; tdv: any[]; tipoArchivo: any[]; };
  moment: any = 1;

  constructor(
    private dialog: MatDialog,
    private opConciliacionCostosService: OpConciliacionCostosService) {

  }

  async ngOnInit(): Promise<void> {
    this.numPagina = 0;
    this.cantPagina = 10;
    this.listarArchivosPendienteCarga();
  }

  async listarArchivosPendienteCarga() {
    this.modalProcesoEjecucion()
    this.dataSourceConciliadas = new MatTableDataSource();
    this.opConciliacionCostosService.obtenerListaArchivoPendienteCarga({
      star: 0, end: 0, content: false
    }).subscribe({
      next: (page: any) => {
        this.dataSourceConciliadas = new MatTableDataSource(page.data.content);
        this.listData = page.data.content
        this.dataSourceConciliadas.sort = this.sort;
        this.dataSourceConciliadas.paginator = this.paginator;
        this.cantidadRegistros = page.data.totalElements;
        this.pageSizeList = [5, 10, 25, 100, page.data.totalElements];
        if (this.moment === 1) {
          Swal.close();
        }
      },
      error: (err: any) => {
        this.dataSourceConciliadas = new MatTableDataSource();
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: "err.error.response.description",
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        });
        setTimeout(() => { alert.close() }, 3000);
        Swal.close();
      }
    });
  }

  async filter(event) {
    this.modalProcesoEjecucion();
    var lista = this.listData
    if (event !== undefined) {
      const filters = {
        banco: event.banco === undefined ? [] : [event.banco],
        estado: event.estado === undefined ? [] : [event.estado],
        tdv: event.transportadora === undefined ? [] : [event.transportadora],
        tipoArchivo: event.tipoArchivo === undefined ? [] : [event.tipoArchivo],
      };
      this.filtros = event
      const filtered = lista.filter(obj =>
        Object.entries(filters).every(([key, filterArr]) => (
          filterArr.length === 0 || filterArr.includes(obj[key])
        ))
      )
      let listaFilter = filtered
      if (event.fechaSelectArchivoI !== undefined && event.fechaSelectArchivoF !== undefined && event.fechaSelectTranferI !== undefined && event.fechaSelectTranferF !== undefined) {
        listaFilter = filtered.filter(element => new Date(element.fechaArchivo).setHours(0, 0, 0, 0) >= event.fechaSelectArchivoI && new Date(element.fechaArchivo).setHours(0, 0, 0, 0) <= event.fechaSelectArchivoF && new Date(element.fechaTransferencia).setHours(0, 0, 0, 0) >= event.fechaSelectTranferI && new Date(element.fechaTransferencia).setHours(0, 0, 0, 0) <= event.fechaSelectTranferF)
      } else if (event.fechaSelectArchivoI !== undefined && event.fechaSelectArchivoF !== undefined) {
        listaFilter = filtered.filter(element => new Date(element.fechaArchivo).setHours(0, 0, 0, 0) >= event.fechaSelectArchivoI && new Date(element.fechaArchivo).setHours(0, 0, 0, 0) <= event.fechaSelectArchivoF)
      } else if (event.fechaSelectTranferI !== undefined && event.fechaSelectTranferF !== undefined) {
        listaFilter = filtered.filter(element => new Date(element.fechaTransferencia).setHours(0, 0, 0, 0) >= event.fechaSelectTranferI && new Date(element.fechaTransferencia).setHours(0, 0, 0, 0) <= event.fechaSelectTranferF)
      }
      if (listaFilter.length > 0) {
        this.dataSourceConciliadas = new MatTableDataSource(listaFilter);
      } else {
        this.dataSourceConciliadas = new MatTableDataSource([]);
      }
      this.dataSourceConciliadas.paginator = this.paginator;
      this.dataSourceConciliadas.sort = this.sort;
    }
    this.selection.clear()
    this.seleccionadosTabla = []
    Swal.close();
  }

  getFecha(fecha: string): string {
    const pipe = new DatePipe('en-US');
    return pipe.transform(new Date(fecha), 'yyyy/MM/dd');
  }

  seleccionarTodo() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSourceConciliadas.data.length;
    return numSelected === numRows;
  }

  seleccion() {
    this.seleccionarTodo() ? this.selection.clear() : this.dataSourceConciliadas.data.forEach(row => this.selection.select(row));
    this.seleccionadosTabla = this.selection.selected
  }

  seleccionRow(event, row) {
    if (event.checked === true) {
      this.seleccionadosTabla.push(row)
    } else {
      this.seleccionadosTabla = this.seleccionadosTabla.filter((element) => element.idArchivo !== row.idArchivo)
    }
  }


  verDetalle(event) {
    const alert = this.dialog.open(VentanaEmergenteVerDetalleArchivoComponent, {
      width: "1000px",
      data: {
        msn: event
      }
    });
  }

  verError(event) {
    const alert = this.dialog.open(VentanaEmergenteErrorComponent, {
      width: "1000px",
      data: {
        msn: event
      }
    });
  }

  procesarArchivos() {
    this.modalProcesoEjecucion();
    if (this.seleccionadosTabla.length > 0) {
      let datosArchivo = {}
      this.seleccionadosTabla.forEach(element => {
        datosArchivo = {
          "idArchivo": element.idArchivo,
          "estado": element.estado,
          "banco": element.banco,
          "tdv": element.tdv,
          "fechaTransferencia": element.fechaTransferencia,
          "fechaArchivo": element.fechaArchivo,
          "tipoArchivo": element.tipoArchivo,
          "nombreArchivo": element.nombreArchivo,
          "idMaestroArchivo": element.idMaestroArchivo,
          "nombreArchivoCompleto": element.nombreArchivoCompleto,
          "url": element.url
        }
        this.archivoProcesarList.push(datosArchivo)
      });
      this.procesarArchivo = {
        "validacionArchivo":
          this.archivoProcesarList
      }
    } else {
      Swal.fire({
        title: "Seleccione al menos un registro de la tabla",
        imageUrl: "assets/img/waring.jpg",
        imageWidth: 80,
        imageHeight: 80,
        confirmButtonText: "Aceptar",
        showConfirmButton: true,
        allowOutsideClick: false
      }).then((result) => {
        Swal.close();
      });
    }
    if (this.procesarArchivo !== undefined) {
      this.opConciliacionCostosService.procesarArchivos(
        this.procesarArchivo
      ).subscribe({
        next: (response: any) => {
          this.listData.forEach(elementData => {
            if (response.data.content.length > 0) {
              response.data.content.forEach(elementResponse => {
                if (elementResponse.idArchivo === elementData.idArchivo) {
                  elementData.estado = elementResponse.estado
                  elementData.idArchivoDB = elementResponse.idArchivodb
                }
              });
            }
          });
          Swal.fire({
            title: "Archivo(s) validados correctamente",
            imageUrl: "assets/img/succesfull.png",
            imageWidth: 80,
            imageHeight: 80,
            confirmButtonText: "Aceptar",
            showConfirmButton: true,
            allowOutsideClick: false
          }).then((result) => {
            this.selection.clear()
            this.seleccionadosTabla = []
            Swal.close();
          });
        },
        error: (err: any) => {
          Swal.close();
          const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
            width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
            data: {
              msn: "err.error.response.description",
              codigo: GENERALES.CODE_EMERGENT.ERROR
            }
          });
          setTimeout(() => { alert.close() }, 3000);
        }
      });
    }
    this.archivoProcesarList = []
  }


  modalProximoDesarrollo() {
    const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
      width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
      data: {
        msn: "Este elemento no forma parte del alcance de esta versión.",
        codigo: GENERALES.CODE_EMERGENT.WARNING
      }
    });
  }

  modalProcesoEjecucion() {
    Swal.fire({
      title: "Proceso en ejecución",
      imageUrl: "assets/img/loading.gif",
      imageWidth: 80,
      imageHeight: 80,
      showConfirmButton: false,
      allowOutsideClick: false
    });
  }


  eliminarArchivo() {
    let event: any = ""
    if (this.seleccionadosTabla.length === 0) {
      Swal.fire({
        title: "Seleccione al menos un registro de la tabla",
        imageUrl: "assets/img/waring.jpg",
        imageWidth: 80,
        imageHeight: 80,
        confirmButtonText: "Aceptar",
        showConfirmButton: true,
        allowOutsideClick: false
      }).then((result) => {
        Swal.close();
      });
    } else {
      if (this.seleccionadosTabla.length > 0) {
        event = this.seleccionadosTabla
      }
      const alert = this.dialog.open(VentanaEmergenteEliminarComponent, {
        width: "800px",
        data: {
          msn: event
        },
        disableClose: true,
      });
      alert.afterClosed().subscribe(result => {
        if (result !== "cancelar") {
          this.moment = result
          this.seleccionadosTabla = []
          this.listarArchivosPendienteCarga();
          this.modalProcesoEjecucion();
          setTimeout(() => {
            this.filter(this.filtros)
          }, 2000);
        }
      });
    }
  }
}


