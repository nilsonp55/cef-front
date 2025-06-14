import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { OpConciliacionCostosService } from 'src/app/_service/conciliacion-costos-services/op-conciliacion-costos';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { VentanaEmergenteAceptarRechazarIdentificadasConDifComponent } from './ventana-emergente-aceptar-rechazar/ventana-emergente-aceptar-rechazar.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-identificadas-con-diferencia',
  templateUrl: './identificadas-con-diferencia.component.html',
  styleUrls: ['./identificadas-con-diferencia.component.css']
})
export class IdentificadasConDiferenciaComponent implements OnInit {

  dataSource: MatTableDataSource<"">;
  displayedColumnsConciliadas: string[] = ['select', 'entidad', 'fecha_servicio_transporte', 'identificacion_cliente', 'razon_social', 'codigo_punto_cargo', 'nombre_punto_cargo', 'ciudad_fondo', 'nombre_tipo_servicio', 'moneda_divisa', 'aplicativoTipoPedido', 'tvdTipoPedido', 'aplicativoEscala', 'tvdEscala', 'aplicativoTransportadoBilletePesos', 'tvdTransportadoBilletePesos', 'aplicativoTransportadoMonedaPesos', 'tvdTransportadoMonedaPesos', 'aplicativoTotalTransportado', 'tvdTotalTransportado', 'aplicativoNumeroFajos', 'tvdNumeroFajos', 'aplicativoNumeroBolsasMoneda', 'tvdNumeroBolsasMoneda', 'aplicativoCostoFijo', 'tvdCostoFijo', 'aplicativoCostoMilaje', 'tvdCostoMilaje', 'aplicativoCostoBolsa', 'tvdCostoBolsa', 'aplicativoCostoFletes', 'tvdCostoFletes', 'aplicativoOtros1', 'tvdOtros1', 'aplicativoOtros2', 'tvdOtros2', 'aplicativoOtros3', 'tvdOtros3', 'aplicativoOtros4', 'tvdOtros4', 'aplicativoOtros5', 'tvdOtros5', 'aplicativoSubTotal', 'tvdSubTotal', 'aplicativoIva', 'tvdIva', 'aplicativoValorTotal', 'tvdValorTotal', 'estado'];


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
    this.datosTabla.nombreArchivoExportar = 'Identificadas-Con-Diferencia-Transporte';
    this.datosTabla.botones = ['Aceptar', 'Rechazar'];
  }

  ngOnInit(): void {
    this.datosTabla.fuenteDatosTabla = []
    this.datosTabla.botones = ['Aceptar', 'Rechazar'];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.filtro && changes.hasOwnProperty("filtro") && this.idTab == 3) {
      let filtroProcesado = this.filtro;
      for (const key in filtroProcesado) {
        if (filtroProcesado[key] == undefined) {
          delete filtroProcesado[key]
        }
      }
      this.ConsultarDatosConciliadas(filtroProcesado, 0, 0);
    }
  }

  async ConsultarDatosConciliadas(filtroProcesado, pagina, tamanio) {
    this.seleccionadosTabla = [];
    this.load = true;
    filtroProcesado["page"] = pagina
    filtroProcesado["size"] = tamanio
    this.opConciliadasService.obtenerIdentificadasConDiferenciaTransporte(
      filtroProcesado
    ).subscribe({
      next: (page: any) => {
        if (page.data.content.length !== 0) {
          this.dataSource = new MatTableDataSource(page.data.content);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.pageSizeList = [5, 10, 25, 100, page.data.totalElements];
          this.datosTabla.totalRegistros = page.data.totalElements;
          this.datosTabla.botones = ['Aceptar', 'Rechazar'];
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
            allowOutsideClick: false
          }).then((result) => {
            this.datosTabla.botones = ['Aceptar', 'Rechazar'];
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

  validateEquity(value1, value2){
    return value1 != value2 ? 'text-no-equity': '';
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
        allowOutsideClick: false
      }).then((result) => {
        Swal.close();
      });
    } else {
      if (event.target.textContent === "Aceptar" || event.target.textContent === "Rechazar") {
        const alert = this.dialog.open(VentanaEmergenteAceptarRechazarIdentificadasConDifComponent, {
          width: "800px",
          data: {
            msn: event.target.textContent,
            lista: this.seleccionadosTabla
          },
          disableClose: true,
        });
        alert.afterClosed().subscribe(result => {
          if (result !== "cancelar") {
            this.ConsultarDatosConciliadas(this.filtro, 0, 0);
          }
        });
      }
    }

  }

}
