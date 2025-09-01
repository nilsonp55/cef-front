import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GeneralesService } from 'src/app/_service/generales.service';
import { PuntosCodigoService } from 'src/app/_service/administracion-service/puntos-codigo.service';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';
import { lastValueFrom } from 'rxjs';
import { DominioFuncionalService } from 'src/app/_service/administracion-service/dominio-funcional.service';
import { TableCodigoTdvComponent } from './table-codigo-tdv.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-puntos-codigo-tdv',
  templateUrl: './puntos-codigo-tdv.component.html',
  styleUrls: ['./puntos-codigo-tdv.component.css']
})
export class PuntosCodigoTdvComponent implements OnInit {

  @ViewChild(TableCodigoTdvComponent) dotsCodeTable!: TableCodigoTdvComponent;

  displayedColumnsPuntosCodigo: string[] = [
    'idPuntoCodigoTdv',
    'codigoPunto',
    'tipoPunto',
    'codigoTdv',
    'codigoPropioTdv',
    'nombrePunto',
    'nombreBanco',
    'codigoCiudad',
    //'estado', 
    'acciones'];
  mostrarFormulario = false;
  mostrarTabla = true;
  // Properties for <app-form-codigo-tdv>
  bancos: any[] = [];          // For form's @Input and table's filter options @Input
  transportadoras: any[] = []; // For form's @Input and table's filter options @Input
  ciudades: any[] = [];        // For form's @Input and table's filter options @Input (and resolver)
  currentPuntoCodigoData: any | null = null;
  esEdicion: boolean = false;

  // Properties for <app-table-codigo-tdv>
  // Filter options loaded by iniciarDesplegables and passed to table componentAdd commentMore actions
  tiposPuntoParaFiltro: any[] = [];

  // Initial pagination values for the table, can be overridden if table component has its own defaults
  initialTablePageIndex: number = 0;
  initialTablePageSize: number = 10;
  // totalTableRecords is managed by the table component itself.
  // initialTablePageIndex and initialTablePageSize are passed to the table for its initial setup.

  spinnerActive: boolean = false; // Global spinner for page-level actions

  constructor(
    private puntosCodigoService: PuntosCodigoService,
    private dialog: MatDialog,
    private generalesService: GeneralesService,
    private dominioFuncionalService: DominioFuncionalService
  ) { }

  async ngOnInit(): Promise<void> {
    this.spinnerActive = true;
    ManejoFechaToken.manejoFechaToken();
    await this.iniciarDesplegables();
    this.spinnerActive = false;
  }

  /**
   * Handles the form submission from DotsCodeFormComponent.
   * @param puntoCodigo The form data from the child component.
   */
  handleFormSubmit(puntoCodigo: any) {
    this.modalProcesoEjecucion()
    const serviceCall = this.esEdicion
      ? this.puntosCodigoService.actualizarPuntosCodigoTDV(puntoCodigo)
      : this.puntosCodigoService.guardarPuntosCodigoTDV(puntoCodigo);

    serviceCall.subscribe({
      next: response => {
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: this.esEdicion ? GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_UPDATE : GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_CREATE,
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL,
            showResume: true,
            msgDetalles: JSON.stringify(response)
          }
        });
        this.mostrarFormulario = false;
        this.mostrarTabla = true;
        this.currentPuntoCodigoData = null;
        if (this.dotsCodeTable) { // Check if table instance is available
          this.dotsCodeTable.fetchData(); // Refresh table data
        }
        Swal.close()
      },
      error: (err: any) => {
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: this.esEdicion ? GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_UPDATE : GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_CREATE,
            codigo: GENERALES.CODE_EMERGENT.ERROR,
            showResume: true,
            msgDetalles: JSON.stringify(err.error)
          }
        });
        Swal.close()
      }
    });
  }

  handleCancelForm() {
    this.mostrarFormulario = false;
    this.mostrarTabla = true;
    this.currentPuntoCodigoData = null;
    this.esEdicion = false;
  }

  onAddNewPuntoCodigo(): void {
    this.esEdicion = false;
    this.currentPuntoCodigoData = null;
    this.mostrarFormulario = true;
    this.mostrarTabla = false;
  }

  handleEditPuntoCodigo(element: any): void {
    this.esEdicion = !(element === undefined);
    this.currentPuntoCodigoData = element;
    this.mostrarFormulario = true;
    this.mostrarTabla = false;
  }

  async iniciarDesplegables() {
    // This method now primarily fetches data for filter dropdowns to be passed to child componentsAdd commentMore actions
    this.spinnerActive = true;
    try {
      const [ciudadesRes, bancosRes, transportadorasRes, tiposPuntosRes] = await Promise.all([
        lastValueFrom(this.generalesService.listarCiudades()),
        lastValueFrom(this.generalesService.listarBancosAval()),
        lastValueFrom(this.generalesService.listarTransportadoras()),
        lastValueFrom(this.dominioFuncionalService.listarTiposPuntos({ 'dominioPK.dominio': 'TIPOS_PUNTO' }))
      ]);
      this.ciudades = ciudadesRes.data; // For form and table's ciudad resolver + filter
      this.bancos = bancosRes.data;     // For form and table's filter
      this.transportadoras = transportadorasRes.data; // For form and table's filter
      this.tiposPuntoParaFiltro = tiposPuntosRes.data; // For table's tipoPunto filter

    } catch (err) {
      this.dialog.open(VentanaEmergenteResponseComponent, {
        width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
        data: {
          msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_DATA_FILE,
          codigo: GENERALES.CODE_EMERGENT.ERROR,
          showResume: true,
          msgDetalles: JSON.stringify(err)
        },
      });
    } finally {
      this.spinnerActive = false;
    }
  }

  // Table specific methods (e.g., old listarPuntosCodigo, mostrarMas, filtrar, resolverEstado, resolverCiudadFondo)
  // are removed as their responsibilities are now within DotsCodeTableComponent.

  // Event handler for table's export action
  handleTableExport(): void {
    // The actual export is handled by MatTableExporter within DotsCodeTableComponent.
    // This parent handler is here if any additional parent-level logic is needed upon export.
    console.log("Export action noted in parent. Table component handles the export.");
  }

  // Placeholders for other table events if parent needs to react (currently not used):
  // if parent needs to react to them beyond what the table component does internally.Add commentMore actions
  // handleTableFilterChange(filters: any) { ... }
  // handleTablePageChange(pageEvent: PageEvent) { ... }


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
}
