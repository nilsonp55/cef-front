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
import { VentanaEmergenteDetalleGestionComponent } from './ventana-emergente-detalle-gestion/ventana-emergente-detalle-gestion';
import { VentanaEmergenteEliminarGestionComponent } from './ventana-emergente-eliminar-gestion/ventana-emergente-eliminar-gestion.component';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-gestion-archivos',
  templateUrl: './gestion-archivos.component.html',
  styleUrls: ['./gestion-archivos.component.css']
})

export class GestionArchivosComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  //Registros paginados
  cantidadRegistros: number = 0;
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
  displayedColumnsConciliadas: string[] = ['select', 'nombreArchivo', 'fechaArchivo', 'estado', 'banco', 'tdv', 'fechaTransferencia', 'tipoArchivo', 'acciones'];

  //selectData para pintar check de seleccion en la tabla
  selection = new SelectionModel<ConciliacionesModel>(true, []);
  datosServicio: any[];
  seleccionadosTabla: any = [];
  seleccionTodo: any = [];
  procesarArchivo: {};
  filtros: { banco: any[]; estado: any[]; tdv: any[]; tipoArchivo: any[]; };

  constructor(
    private dialog: MatDialog,
    private opConciliacionCostosService: OpConciliacionCostosService) {
  }

  async ngOnInit(): Promise<void> {
    this.numPagina = 0;
    this.cantPagina = 5;
    this.listarArchivosPendienteCarga(this.numPagina, this.cantPagina);
  }

  listarArchivosPendienteCarga(numPagina = 0, cantPagina = 5) {
    this.modalProcesoEjecucion()
    this.dataSourceConciliadas = new MatTableDataSource();
    this.opConciliacionCostosService.obtenerRegistrosGestionArchivos({
      agrupador: GENERALES.PARAMETRO_GESTION,
      page: numPagina,
      size: cantPagina
    }).subscribe({
      next: (page: any) => {
        this.dataSourceConciliadas = new MatTableDataSource(page.data.content);
        this.datosServicio = page.data.content;
        this.cantidadRegistros = page.data.totalElements;
        this.pageSizeList = [5, 10, 25, 100, page.data.totalElements];
        this.dataSourceConciliadas.sort = this.sort;
        Swal.close();
      },
      error: (err: any) => {
        this.dataSourceConciliadas = new MatTableDataSource();
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: err.error.response.description,
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
    var lista: any = this.datosServicio;
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
        this.selection.clear()
        this.seleccionadosTabla = []
        Swal.close();
      } else {
        this.dataSourceConciliadas = new MatTableDataSource([]);
        Swal.fire({
          title: "No existen registros que coincidan con los filtros seleccionados",
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
      this.pageSizeList = [5, 10, 25, 100, listaFilter.length];
      this.dataSourceConciliadas.paginator = this.paginator;
      this.dataSourceConciliadas.sort = this.sort;
    }
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
    const alert = this.dialog.open(VentanaEmergenteDetalleGestionComponent, {
      width: "1000px",
      data: {
        msn: event
      }
    });
  }

  descargarArchivos() {
    this.modalProcesoEjecucion();
    if (this.seleccionadosTabla.length == 0) {
      Swal.fire({
        title: "Seleccione al menos un registro de la tabla",
        imageUrl: "assets/img/waring.jpg",
        imageWidth: 80,
        imageHeight: 80,
        confirmButtonText: "Aceptar",
        showConfirmButton: true,
        allowOutsideClick: false,
        customClass: { popup: "custom-alert-swal-text" }
      }).then((result) => {
        Swal.close();
      });
      return
    }

    let idArchivos = this.seleccionadosTabla.map(archivo => archivo.idArchivo);

    this.opConciliacionCostosService.descargarGestionArchivos(
      { idArchivos }
    ).subscribe({
      next: (response: any) => {
        const blobFile = this.base64toBlob(response.file, response.id ? 'text/plain' : 'application/zip')
        if (blobFile)
          saveAs(blobFile, response.name);
        Swal.close();
      },
      error: (err: any) => {
        Swal.close();
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: err.error.response.description,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        });
        setTimeout(() => { alert.close() }, 3000);
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
      allowOutsideClick: false,
      customClass: { popup: "custom-alert-swal-text" }
    });
  }

  base64toBlob(b64Data, contentType, sliceSize = 512) {
    try {
      const byteCharacters = atob(b64Data);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
        const byteNumbers = new Array(slice.length);

        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: contentType });
      return blob;
    } catch (error) {
      console.error('base64toBlob', error);
      return null;
    }
  }

  cerrarArchivos() {
    if (this.seleccionadosTabla.length === 0) {
      Swal.fire({
        title: "Seleccione al menos un registro de la tabla",
        imageUrl: "assets/img/waring.jpg",
        imageWidth: 80,
        imageHeight: 80,
        confirmButtonText: "Aceptar",
        showConfirmButton: true,
        allowOutsideClick: false,
        customClass: { popup: "custom-alert-swal-text" }
      }).then((result) => {
        Swal.close();
      });
      return;
    }
    let registrosNoProcesados = false;
    let validacionArchivo = this.seleccionadosTabla.map(registro => {
      if (registro.estado == 'ERROR') registrosNoProcesados = true;
      return { "idArchivo": registro.idArchivo }
    });
    Swal.fire({
      title: "¿Desea cerrar la conciliación de estos " + this.seleccionadosTabla.length + " archivos?",
      imageUrl: "assets/img/waring.jpg",
      imageWidth: 80,
      imageHeight: 80,
      confirmButtonText: "Aceptar",
      showConfirmButton: true,
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      allowOutsideClick: false,
      customClass: { popup: "custom-alert-swal-text" }
    }).then((result) => {
      if (result.isConfirmed) {
        this.opConciliacionCostosService.cerrarGestionArchivos({ validacionArchivo }).
          subscribe({
            next: (response: any) => {
              if (response.response.description == "Success") {
                let mensaje = 'Se proceso correctamente el cierre de conciliación.';
                mensaje = registrosNoProcesados ? mensaje + '\n\n Los registros seleccionados error  automático no han sido procesados.' : mensaje;
                registrosNoProcesados = response.data.content.some(reg => reg.estado == "NO CONCILIADO");
                mensaje = registrosNoProcesados ? mensaje + '\n\n La operación solicitada no pudo completarse con algunos registros.' : mensaje;
                this.procesoExitoso(mensaje);
              }

            },
            error: (err: any) => {
              Swal.close();
              const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
                width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
                data: {
                  msn: err.error.response.description,
                  codigo: GENERALES.CODE_EMERGENT.ERROR
                }
              });
              setTimeout(() => { alert.close(); }, 3000);
            }
          });
      }
      Swal.close();
    })
  }

  procesoExitoso(message: string) {
    Swal.fire({
      title: message,
      imageUrl: "assets/img/succesfull.png",
      imageWidth: 80,
      imageHeight: 80,
      confirmButtonText: "Aceptar",
      showConfirmButton: true,
      allowOutsideClick: false
    }).then((result) => {
      Swal.close();
      this.listarArchivosPendienteCarga();
    });
  }

  mostrarMasArchivosPendienteCarga(event: any){
    this.numPagina = event.pageIndex;
    this.cantPagina = event.pageSize;
    this.listarArchivosPendienteCarga(this.numPagina, this.cantPagina);
  }
}
