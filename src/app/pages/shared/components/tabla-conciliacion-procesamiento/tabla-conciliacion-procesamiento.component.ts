import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConciliacionesModel } from 'src/app/_model/consiliacion-model/conciliacion.model';

@Component({
  selector: 'app-tabla-conciliacion-procesamiento',
  templateUrl: './tabla-conciliacion-procesamiento.component.html',
  styleUrls: ['./tabla-conciliacion-procesamiento.component.css']
})
export class TablaConciliacionProcesamiento implements OnInit, AfterViewInit {

  dataSource: MatTableDataSource<ConciliacionesModel>;
  displayedColumns: string[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @Input() datosTabla: {
    tamanoPagina?: number,
    totalRegistros?: number,
    nombreArchivoExportar?: string,
    fuenteDatosTabla?: any,
    botones?: string[],
    mostrarExportar: boolean,
    tipoTabla: string
  };
  @Output() eventoBoton = new EventEmitter<{ texto: string, items: [] }>();


  pageSizeList: number[] = [5, 10, 25, 100];
  numPagina: any;
  cantPagina: any
  selection = new SelectionModel<ConciliacionesModel>(true, []);
  seleccionadosTabla: any = [];
  seleccionTodo: any = [];

  constructor() { }

  ngOnInit(): void {
    if (this.datosTabla) {
      if(this.datosTabla.tipoTabla === 'eliminados')
        this.displayedColumns = ['select', 'entidad', 'fecha_servicio_transporte', 'identificacion_cliente', 'razon_social', 'codigo_punto_cargo', 'nombre_punto_cargo', 'ciudad_fondo', 'nombre_tipo_servicio', 'moneda_divisa'];
      else if(this.datosTabla.tipoTabla === 'identificadas')
        this.displayedColumns = ['select', 'entidad', 'fecha_servicio_transporte', 'identificacion_cliente', 'razon_social', 'codigo_punto_cargo', 'nombre_punto_cargo', 'ciudad_fondo', 'nombre_tipo_servicio', 'moneda_divisa', 'valor_procesado_billete', 'valor_procesado_billete_tdv', 'valor_procesado_moneda', 'valor_procesado_moneda_tdv', 'valor_total_procesado', 'valor_total_procesado_tdv', 'subtotal', 'subtotalTdv', 'iva_p', 'iva_tdv', 'valor_total', 'valor_total_tdv', 'estado'];
      else
        this.displayedColumns = ['select', 'entidad', 'fecha_servicio_transporte', 'identificacion_cliente', 'razon_social', 'codigo_punto_cargo', 'nombre_punto_cargo', 'ciudad_fondo', 'nombre_tipo_servicio', 'moneda_divisa', 'aplicativo', 'tvd', 'valorProcesadoBilletes', 'valorProcesadoMonedas', 'valorTotalProcesado', 'subTotal', 'iva', 'valorTotal', 'estado'];

      this.dataSource = new MatTableDataSource(this.datosTabla.fuenteDatosTabla.content);
      this.pageSizeList.push(this.datosTabla.fuenteDatosTabla.totalElements);
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    }

    compare(a, b, isAsc) {
      return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    validateTable(tipoCuerpo : number){
      if(tipoCuerpo == 1 && (this.datosTabla.tipoTabla == 'conciliadas'  || this.datosTabla.tipoTabla == 'cobradasTDV' || this.datosTabla.tipoTabla == 'liquidadas'))
        return true;
      else if(tipoCuerpo == 2 && this.datosTabla.tipoTabla == 'identificadas')
        return true;
      else
        return false;
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
    this.eventoBoton.emit({
      texto: event.target.textContent,
      items: this.seleccionadosTabla,
    });
  }
}
