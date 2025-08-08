import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { TarifasOperacionService } from 'src/app/_service/liquidacion-service/tarifas-operacion.service';
import { ErrorService } from 'src/app/_model/error.model';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';

@Component({
  selector: 'app-tarifas-operacion-tabla',
  templateUrl: './tarifas-operacion-tabla.component.html',
  styleUrls: ['./tarifas-operacion.component.css']
})
export class TarifasOperacionTablaComponent implements OnInit {

  @ViewChild('exporter', {static: false}) exporter: any;

  @Input() bancos: any[] = [];
  @Input() transportadoras: any[] = [];
  @Input() tipoOperaciones: any[] = [];
  @Input() tipoServicios: any[] = [];
  @Input() escalas: any[] = [];
  @Input() comisionesAplicar: any[] = [];

  @Output() editarRegistro = new EventEmitter<any>();

  dataSourceTiposCuentas: MatTableDataSource<any>;
  displayedColumnsTiposCuentas: string[] = ['banco','tdv', 'tOperacion', 'tServicio', 'escala', 'tipoPunto', 'comisionAplicar', 'valorTarifa', 'fechaVigenciaFin', 'acciones'];
  habilitarBTN: boolean = false;
  cantidadRegistros: number = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  filtroTipOperacionSelect: any;
  filtroBancoSelect: any;
  filtroTransportaSelect: any;
  filtroEscalaSelect: any;
  filtroTipoServicioSelect: any;
  paginaActual: number = 0;
  tamanoActual: number = 10;
  spinnerActive: boolean = false;

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private tarifasOperacionService: TarifasOperacionService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.spinnerActive = true;
    this.listarTarifaOperacion();
  }

  listarTarifaOperacion(pagina = 0, tamanio = 10) {
    this.paginaActual = pagina;
    this.tamanoActual = tamanio;
    this.tarifasOperacionService.consultarTarifasOperacion({
      page: this.paginaActual,
      size: this.tamanoActual,
      'banco.codigoPunto': this.filtroBancoSelect == undefined ? '': this.filtroBancoSelect.codigoPunto,
      'transportadora.codigo': this.filtroTransportaSelect == undefined ? '': this.filtroTransportaSelect.codigo,
      'tipoOperacion': this.filtroTipOperacionSelect == undefined ? '': this.filtroTipOperacionSelect,
      'escala': this.filtroEscalaSelect == undefined ? '': this.filtroEscalaSelect,
      'tipoServicio': this.filtroTipoServicioSelect == undefined ? '': this.filtroTipoServicioSelect
    }).subscribe({next: (page: any) => {
      this.dataSourceTiposCuentas = new MatTableDataSource(page.data.content);
      this.dataSourceTiposCuentas.sort = this.sort;
      this.cantidadRegistros = page.data.totalElements;
      this.pageSizeOptions = [5, 10, 25, 100, page.data.totalElements];
      this.habilitarBTN = true;
      this.spinnerActive = false;
    },
    error:  (err: ErrorService) => {
      this.spinnerActive = false;
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_ADMIN_CUNTAS_PUC.ERROR_GET_TIPO_ADMIN_CUNTAS_PUC,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        });
      }});
  }

  mostrarMas(e: any) {
    this.spinnerActive = true;
    this.listarTarifaOperacion(e.pageIndex, e.pageSize);
  }

  filtrar(event) {
    this.spinnerActive = true;
    this.listarTarifaOperacion();
  }

  limpiar(){
    this.filtroBancoSelect = null;
    this.filtroTransportaSelect = null;
    this.filtroTipOperacionSelect = null;
    this.filtroEscalaSelect = null;
    this.filtroTipoServicioSelect = null;
  }

  exporterTable(){
    if(this.exporter && !this.spinnerActive){
      this.exporter.exportTable('xlsx', {fileName:'tarifas-operaciones'});
    }
  }
}
