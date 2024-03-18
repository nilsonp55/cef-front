import { Component, Inject, OnInit, ViewChild } from '@angular/core';
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
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CargueArchivosService } from 'src/app/_service/cargue-archivos-service/cargue-archivo.service';
import Swal from 'sweetalert2';

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
        Swal.close();
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

  filter(event) {
    this.modalProcesoEjecucion();
    var lista = this.listData
    const filters = {
      banco: event.banco === undefined ? [] : [event.banco],
      estado: event.estado === undefined ? [] : [event.estado],
      tdv: event.transportadora === undefined ? [] : [event.transportadora],
      tipoArchivo: event.tipoArchivo === undefined ? [] : [event.tipoArchivo],
    };
    const filtered = lista.filter(obj =>
      Object.entries(filters).every(([key, filterArr]) => (
        filterArr.length === 0 || filterArr.includes(obj[key])
      ))
    );
    if (filtered.length === 0) {
      let listaFilter = []
      if (event.fechaSelectArchivoI !== undefined && event.fechaSelectArchivoF !== undefined) {
        listaFilter = this.listData.filter(element => new Date(element.fechaArchivo) >= event.fechaSelectArchivoI && new Date(element.fechaArchivo) <= event.fechaSelectArchivoF)
      }
      if (event.fechaSelectTranferI !== undefined && event.fechaSelectTranferF !== undefined) {
        listaFilter = this.listData.filter(element => new Date(element.fechaTransferencia) >= event.fechaSelectTranferI && new Date(element.fechaTransferencia) <= event.fechaSelectTranferF)
      }
      if (listaFilter.length > 0) {
        this.dataSourceConciliadas = new MatTableDataSource(listaFilter);
        this.dataSourceConciliadas.paginator = this.paginator;
      } else {
        this.dataSourceConciliadas = new MatTableDataSource([]);
        this.dataSourceConciliadas.paginator = this.paginator;
      }
    } else {
      let listaFilter = []
      if (event.fechaSelectArchivoI !== undefined && event.fechaSelectArchivoF !== undefined) {
        listaFilter = filtered.filter(element => new Date(element.fechaArchivo) >= event.fechaSelectArchivoI && new Date(element.fechaArchivo) <= event.fechaSelectArchivoF)
      }
      if (event.fechaSelectTranferI !== undefined && event.fechaSelectTranferF !== undefined) {
        listaFilter = filtered.filter(element => new Date(element.fechaTransferencia) >= event.fechaSelectTranferI && new Date(element.fechaTransferencia) <= event.fechaSelectTranferF)
      }
      if (listaFilter.length > 0) {
        this.dataSourceConciliadas = new MatTableDataSource(listaFilter);
        this.dataSourceConciliadas.paginator = this.paginator;
      } else {
        this.dataSourceConciliadas = new MatTableDataSource(filtered);
        this.dataSourceConciliadas.paginator = this.paginator;
      }
    }
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
    this.seleccionTodo = this.selection.selected
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
      width: "800px",
      data: {
        msn: event
      }
    });
  }

  procesarArchivos() {
    this.modalProcesoEjecucion();
    if (this.seleccionTodo.length > 0) {
      let datosArchivo = {}
      this.seleccionTodo.forEach(element => {
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
          "nombreArchivoCompleto": element.nombreArchivoCompleto
        }
        this.archivoProcesarList.push(datosArchivo)
      });
      this.procesarArchivo = {
        "validacionArchivo":
          this.archivoProcesarList
      }
    } else {
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
      }
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
                }
              });
            }
          });
          Swal.close();
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
}

// Componente modal visualizacion y descarga archivo 
@Component({
  selector: 'verDetalleArchivo',
  templateUrl: 'verDetalleArchivo.html',
})
export class VentanaEmergenteVerDetalleArchivoComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog,
    private cargueArchivosService: CargueArchivosService, private opConciliacionCostosService: OpConciliacionCostosService) { }

  ngOnInit() {
    this.consultarContenArchivo()
  }

  consultarContenArchivo() {
    this.modalProcesoEjecucion()
    this.opConciliacionCostosService.obtenerListaArchivoPendienteCarga({
      star: 0, end: 0, content: true, fileName: this.data.msn.nombreArchivo
    }).subscribe({
      next: (page: any) => {
        this.data.msn.contenidoArchivo = page.data.content[0].contenidoArchivo
        Swal.close();
      },
      error: (err: any) => {
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

  descargarArchivo(data) {
    this.cargueArchivosService.visializarArchivo3({
      'nombreArchivo': data.msn.nombreArchivoCompleto,
      'idMaestroArchivo': data.msn.idMaestroArchivo,
    }).subscribe(blob => {
      blob.saveFile();
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

}
