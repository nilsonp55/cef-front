import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { PageEvent } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { PuntosCodigoService } from "src/app/_service/administracion-service/puntos-codigo.service";
import { VentanaEmergenteResponseComponent } from "src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component";
import { GENERALES } from "src/app/pages/shared/constantes";


@Component({
    selector: 'app-table-codigo-tdv',
    templateUrl: './table-codigo-tdv.component.html',
    styleUrls: ['./puntos-codigo-tdv.component.css']
})
export class TableCodigoTdvComponent implements OnInit, AfterViewInit {

    // initialData is removed as the table fetches its own data via fetchData() in ngOnInitAdd commentMore actions
    @Input() displayedColumns: string[] = [];

    // Options for filter dropdowns
    @Input() tiposPuntoOptions: any[] = [];
    @Input() bancosOptions: any[] = []; // Used for filter
    @Input() transportadorasOptions: any[] = []; // Used for filter
    @Input() ciudadesOptions: any[] = []; // Used for filter and resolveCiudadNombre

    // totalRecords is now an internal property, updated by fetchData()
    // Remove @Input() totalRecords: number = 0;
    totalRecords: number = 0;
    @Input() initialPageSize: number = 10;
    @Input() initialPageIndex: number = 0;

    // Outputs for parent component interaction
    @Output() editItem = new EventEmitter<any>();
    // Outputting raw PageEvent and Sort events allows parent to have full control if needed,
    // but for now, data fetching is internal. These can also trigger internal data reloads.
    @Output() pageChangeInternal = new EventEmitter<PageEvent>();
    @Output() filterChangeInternal = new EventEmitter<any>(); // Emits current filter state
    @Output() sortChangeInternal = new EventEmitter<Sort>();   // Emits current sort state
    @Output() exportAction = new EventEmitter<void>();

    dataSource: MatTableDataSource<any>;

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('exporter') exporter: any; // For MatTableExporter

    // Filter models
    puntoSeleccionado: any;
    filtroBancoSelect: any;
    filtroTransportaSelect: any;
    listCiudadSelect: any; // Model for ciudad filter
    filtroCodigoPropio: string;

    // Pagination properties
    numPagina: number;
    cantPagina: number;
    pageSizeOptions: number[] = [5, 10, 25, 100];

    spinnerActive: boolean = false;

    constructor(
        private puntosCodigoService: PuntosCodigoService,
        private dialog: MatDialog
    ) {
        this.dataSource = new MatTableDataSource([]);
    }

    ngOnInit(): void {
        // this.dataSource.data = this.initialData; // initialData input removed
        this.numPagina = this.initialPageIndex;
        this.cantPagina = this.initialPageSize;
        // pageSizeOptions will be updated in fetchData after totalRecords is known
        this.fetchData();
    }

    ngAfterViewInit(): void {
        if (this.sort) {
            this.dataSource.sort = this.sort; // For client-side sorting by header click
            this.sort.sortChange.subscribe((sortEvent: Sort) => {
                this.sortChangeInternal.emit(sortEvent);
                // If server-side sorting is implemented, fetchData would be called here.
                // this.numPagina = 0; // Reset to first page
                // this.fetchData();
            });
        }
    }

    // ngOnChanges is removed as initialData and totalRecords are no longer direct inputs influencing this.
    // If other inputs needed specific reactions, ngOnChanges would be kept.

    fetchData(): void {
        this.spinnerActive = true;
        const params = {
            page: this.numPagina,
            size: this.cantPagina,
            'bancos.codigoPunto': this.filtroBancoSelect?.codigoPunto ?? '',
            'codigoTDV': this.filtroTransportaSelect?.codigo ?? '',
            'busqueda': this.filtroCodigoPropio ?? '',
            'puntos.tipoPunto': this.puntoSeleccionado?.valorTexto ?? '',
            'ciudadFondo': this.listCiudadSelect?.codigoDANE ?? '',
            // Example for server-side sorting (if sort object is available and has active direction)
            // sort: (this.sort && this.sort.active && this.sort.direction) ? `${this.sort.active},${this.sort.direction}` : ''
        };

        this.puntosCodigoService.obtenerPuntosCodigoTDV(params).subscribe({
            next: (page: any) => {
                this.dataSource.data = page.data.content;
                this.totalRecords = page.data.totalElements;
                this.updatePageSizeOptions(); // Update pageSizeOptions based on new totalRecords
                this.spinnerActive = false;
            },
            error: (err: any) => {
                this.dialog.open(VentanaEmergenteResponseComponent, {
                    width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
                    data: {
                        msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_DATA_FILE,
                        codigo: GENERALES.CODE_EMERGENT.ERROR,
                        showResume: true,
                        msgDetalles: JSON.stringify(err.error)
                    }
                });
                this.spinnerActive = false;
            }
        });
    }

    private updatePageSizeOptions(): void {
        const defaultOptions = [5, 10, 25, 100];
        if (this.totalRecords > 0) {
            if (!defaultOptions.includes(this.totalRecords) && this.totalRecords > defaultOptions[defaultOptions.length - 1]) {
                this.pageSizeOptions = [...defaultOptions, this.totalRecords];
            } else {
                this.pageSizeOptions = defaultOptions.filter(size => size <= this.totalRecords || defaultOptions.indexOf(size) === 0);
                if (this.totalRecords > 0 && !this.pageSizeOptions.includes(this.totalRecords)) {
                    this.pageSizeOptions.push(this.totalRecords)
                }
                this.pageSizeOptions.sort((a, b) => a - b);
                if (this.pageSizeOptions.length === 0 && this.totalRecords > 0) this.pageSizeOptions.push(this.totalRecords)
                else if (this.pageSizeOptions.length === 0 && this.totalRecords === 0) this.pageSizeOptions = [5]


            }
        } else {
            this.pageSizeOptions = defaultOptions;
        }
        // Ensure cantPagina is valid for new pageSizeOptions
        if (!this.pageSizeOptions.includes(this.cantPagina)) {
            this.cantPagina = this.pageSizeOptions[0] || this.initialPageSize; // Fallback
        }
    }

    onFilterChange(): void {
        this.numPagina = 0; // Reset to first page on filter change
        // Emit filter state if parent is to handle it
        const currentFilters = {
            banco: this.filtroBancoSelect,
            transportadora: this.filtroTransportaSelect,
            tipoPunto: this.puntoSeleccionado,
            ciudad: this.listCiudadSelect,
            codigoPropio: this.filtroCodigoPropio
        };
        this.filterChangeInternal.emit(currentFilters);
        this.fetchData(); // Reload data with new filters
    }

    limpiar(){
        this.filtroBancoSelect = null;
        this.filtroTransportaSelect = null;
        this.puntoSeleccionado = null;
        this.listCiudadSelect = null;
        this.filtroCodigoPropio = null;
    }

    onPageChange(event: PageEvent): void {
        this.numPagina = event.pageIndex;
        this.cantPagina = event.pageSize;
        this.pageChangeInternal.emit(event);
        this.fetchData(); // Reload data for new page
    }

    onSortChange(sortState: Sort): void {
        // MatTableDataSource handles client-side sorting automatically when sort is bound.
        // If server-side sorting is needed, this method would call fetchData with sort parameters.
        // For now, this is mostly for completeness or if server-side becomes a requirement.
        this.sortChangeInternal.emit(sortState);
        // Example for server-side:
        // this.numPagina = 0; // Reset to first page
        // this.fetchData(); // fetchData would need to be aware of this.sort.active and this.sort.direction
    }

    onExportTable(): void {
        if (this.exporter) {
            this.exporter.exportTable('xlsx', { fileName: 'puntos-codigo-tdv-export' });
        }
        this.exportAction.emit(); // Emit general action if parent needs to know
    }

    resolveEstado(estado: number): string {
        return estado === 1 ? "Activo" : "Inactivo";
    }

    resolveCiudadNombre(codigoDane: any): string {
        if (!codigoDane || !this.ciudadesOptions || this.ciudadesOptions.length === 0) {
            return "";
        }
        const ciudad = this.ciudadesOptions.find(c => c.codigoDANE === codigoDane);
        return ciudad ? ciudad.nombreCiudad : "";
    }

}