import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { OpConciliacionCostosService } from 'src/app/_service/conciliacion-costos-services/op-conciliacion-costos';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import Swal from 'sweetalert2';
import { VentanaEmergenteReintegrarRegistrosComponent } from './ventana-emergente-reintegrar-registros/ventana-emergente-reintegrar-registros.component';

@Component({
  selector: 'app-registros-eliminados',
  templateUrl: './registros-eliminados.component.html',
  styleUrls: ['./registros-eliminados.component.css']
})
export class RegistrosEliminadosComponent implements OnInit {

  dataSource: MatTableDataSource<"">;
  displayedColumnsRegistrosEliminados: string[] = ['select', 'entidad', 'fecha_servicio_transporte', 'identificacion_cliente', 'razon_social', 'codigo_punto_cargo', 'nombre_punto_cargo', 'ciudad_fondo', 'nombre_tipo_servicio', 'moneda_divisa'];


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  load: boolean = false;
  @Input() filtro;
  @Input() idTab;
  datosTabla: {
    tamanoPagina?: number,
    totalRegistros?: number,
    nombreArchivoExportar?: string,
    fuenteDatosTabla?: any,
    botones?: string[]
  } = {};

  pageSizeList: number[] = [5, 10, 25, 100];
  numPagina: any;
  cantPagina: any
  selection = new SelectionModel<"">(true, []);
  seleccionadosTabla: any = [];
  seleccionTodo: any = [];

  constructor(private dialog: MatDialog,
    private opConciliadasService: OpConciliacionCostosService,) {
    this.datosTabla.nombreArchivoExportar = 'Eliminadas-Transporte';
    this.datosTabla.botones = ['Reintegrar Registros'];
  }

  ngOnInit(): void {
    this.datosTabla.fuenteDatosTabla = []
    this.datosTabla.botones = ['Reintegrar Registros'];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.filtro && changes.hasOwnProperty("filtro") && this.idTab == 4) {
      let filtroProcesado = this.filtro;
      for (const key in filtroProcesado) {
        if (filtroProcesado[key] == undefined) {
          delete filtroProcesado[key]
        }
      }
      this.ConsultarDatosRegistrosEliminados(filtroProcesado, 0, 0);
    }
  }

  async ConsultarDatosRegistrosEliminados(filtroProcesado, pagina, tamanio) {
    this.load = true;
    filtroProcesado["page"] = pagina
    filtroProcesado["size"] = tamanio
    this.opConciliadasService.obtenerRegistrosEliminadosTransporte(
      filtroProcesado
    ).subscribe({
      next: (page: any) => {
        if (page.data.content.length !== 0) {
          this.dataSource = new MatTableDataSource(page.data.content);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.pageSizeList = [5, 10, 25, 100, page.data.totalElements];
          this.datosTabla.totalRegistros = page.data.totalElements;
          this.datosTabla.botones = ['Reintegrar Registros'];
          this.load = false;
        } else {
          this.dataSource = new MatTableDataSource([]);
          this.datosTabla.totalRegistros = 0;
          this.datosTabla.fuenteDatosTabla = [];
          Swal.fire({
            title: "No existen registros que coincidan con los filtros seleccionados",
            imageUrl: "assets/img/waring.jpg",
            imageWidth: 80,
            imageHeight: 80,
            confirmButtonText: "Aceptar",
            showConfirmButton: true,
            allowOutsideClick: false,
            customClass: { popup: "custom-alert-swal-text" }
          }).then((result) => {
            this.datosTabla.botones = ['Reintegrar Registros'];
            this.load = false;
            Swal.close();
          });
        }
      },
      error: (err: any) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: err.error.response.description,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        });
        setTimeout(() => { alert.close() }, 3000);
        this.load = false;
      }
    });
  }

  /**Metodos Generales */
  seleccionarTodo() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  seleccion() {
    this.seleccionarTodo() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
    this.seleccionadosTabla = this.selection.selected
  }

  seleccionRow(event, row) {
    if (event.checked === true) {
      this.seleccionadosTabla.push(row)
    } else {
      this.seleccionadosTabla = this.seleccionadosTabla.filter((element) => element.consecutivo_registro !== row.consecutivo_registro)
    }
  }

  emitirEvento(event) {
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
    } else {
      const alert = this.dialog.open(VentanaEmergenteReintegrarRegistrosComponent, {
        width: "800px",
        data: {
          msn: "Reintegrar",
          lista: this.seleccionadosTabla
        },
        disableClose: true,
      });
      alert.afterClosed().subscribe(result => {
        if (result !== "cancelar") {
          //this.moment = result
          this.seleccionadosTabla = [];
          this.ConsultarDatosRegistrosEliminados(this.filtro, 0, 0);
        }
      });

    }

  }

}
