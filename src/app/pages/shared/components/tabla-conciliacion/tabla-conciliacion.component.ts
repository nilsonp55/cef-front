import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConciliacionesModel } from 'src/app/_model/consiliacion-model/conciliacion.model';


@Component({
  selector: 'app-tabla-conciliacion',
  templateUrl: './tabla-conciliacion.component.html',
  styleUrls: ['./tabla-conciliacion.component.css']
})
export class TablaConciliacion implements OnInit, AfterViewInit {

  dataSource: MatTableDataSource<any>;
  displayedColumnsConciliadas: string[] = ['select', 'entidad', 'fecha_servicio_transporte', 'identificacion_cliente', 'razon_social', 'codigo_punto_cargo', 'nombre_punto_cargo', 'ciudad_fondo', 'nombre_tipo_servicio', 'moneda_divisa', 'aplicativo', 'tvd', 'tipoPedido', 'escala', 'valorTransportadoBilletes', 'valorTransportadoMonedas', 'valorTotalTransportado', 'numeroFajos', 'numeroBolsas', 'costoFijo', 'costoPorMilaje', 'costoPorBolsa', 'costoFletes', 'costoEmisarios', 'otros_1', 'otros_2', 'otros_3', 'otros_4', 'otros_5', 'subTotal', 'iva', 'valorTotal', 'estado'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() datosTabla: {
    tamanoPagina?: number,
    totalRegistros?: number,
    nombreArchivoExportar?: string,
    fuenteDatosTabla?: any,
    botones?: string[]
  };

  @Output() eventoBoton = new EventEmitter<{ texto: string, items: [] }>();
  @Output() eventoPaginado = new EventEmitter<{ numPagina: string, cantPagina: string }>();

  pageSizeList: number[] = [5, 10, 25, 100];
  numPagina: any;
  cantPagina: any
  selection = new SelectionModel<ConciliacionesModel>(true, []);
  seleccionadosTabla: any = [];
  seleccionTodo: any = [];

  constructor() { }

  ngOnInit(): void {
    if (this.datosTabla) {
      this.dataSource = new MatTableDataSource(this.datosTabla.fuenteDatosTabla.content);
      this.pageSizeList.push(this.datosTabla.fuenteDatosTabla.totalElements)
      this.datosTabla.botones.shift();
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
    this.eventoBoton.emit({
      texto: event.target.textContent.trim(),
      items: this.seleccionadosTabla,
    });
  }
}
