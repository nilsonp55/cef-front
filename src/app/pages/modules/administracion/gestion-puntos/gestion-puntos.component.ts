import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CrearPuntoComponent } from './crear-punto/crear-punto.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GestionPuntosService } from 'src/app/_service/administracion-service/gestionPuntos.service';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';
import { GeneralesService } from 'src/app/_service/generales.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-gestion-puntos',
  templateUrl: './gestion-puntos.component.html',
  styleUrls: ['./gestion-puntos.component.css'],
})
export class GestionPuntosComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;

  tipoPuntoSeleccionado: string;
  puntoSeleccionado: string = '';
  elementoPuntoActualizar: string;
  detallePuntoSeleccionado: any;
  nombrePuntoBusqueda: string;

  //Registros paginados
  cantidadRegistros: number;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  //Variable para activar spinner
  spinnerActive: boolean = false;

  dataSourcePuntoSelect: MatTableDataSource<any>;
  displayedColumnsPuntoSelect: string[] = [
    'codigoPunto',
    'tipoPunto',
    'banco_aval',
    'nombrePunto',
    'codigoCiudad',
    'estado',
    'detalle',
  ];

  listPuntosSelect: any;
  ciudades: any[] = [];
  bancosAval: any[] = [];
  bancoSeleccionado: string = '';
  fondosBancoAVALSeleccionado: number;
  oficinasBancoAVALSeleccionado: number;
  cajerosATMBancoAvalSeleccionado: number;

  constructor(
    private readonly dialog: MatDialog,
    private readonly gestionPuntosService: GestionPuntosService,
    private readonly generalServices: GeneralesService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.spinnerActive = true;
    ManejoFechaToken.manejoFechaToken();
    this.listarTiposPunto();
    this.listarPuntosSeleccionado();
    this.listarCiudades();
    this.listarBancos();
  }

  /**
   * Retorna codigo ciiu y nombre de ciudad
   * @prv_nparra
   */
  getNombreCiudad(codigoCiiu: number) {
    const ciudad = this.ciudades.find((c) => c.codigoDANE === codigoCiiu);
    return ciudad !== undefined ? codigoCiiu + ' - ' + ciudad.nombreCiudad : '';
  }

  /**
   * Retorna nombre banco para puntos que tienen asignado un banco
   * @prv_nparra
   */
  getNombreBanco(punto: any) {
    let codigoBanco: any;
    if (punto.tipoPunto === 'FONDO') {
      codigoBanco = punto.fondos.bancoAVAL;
    }
    if (punto.tipoPunto === 'OFICINA') {
      codigoBanco = punto.oficinas.bancoAVAL;
    }
    if (punto.tipoPunto === 'CAJERO') {
      codigoBanco = punto.cajeroATM.bancoAval;
    }
    const banco = this.bancosAval.find((b) => b.codigoPunto === codigoBanco);
    return banco !== undefined ? banco.nombreBanco : '';
  }

  listarTiposPunto() {
    this.gestionPuntosService
      .listarTiposPuntos({
        'dominioPK.dominio': 'TIPOS_PUNTO',
      })
      .subscribe({
        next: (page: any) => {
          this.listPuntosSelect = page.data;
        },
        error: (err: any) => {
          this.dialog.open(VentanaEmergenteResponseComponent, {
            width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
            data: {
              msn:
                GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_DATA_FILE +
                ' - ' +
                err?.error?.response?.description,
              codigo: GENERALES.CODE_EMERGENT.ERROR,
            },
          });
        },
      });
  }

  /**
   * Listar puntos creados para realizar acciones
   * @BayronPerez
   */
  listarPuntosSeleccionado(pagina = 0, tamanio = 10) {
    this.spinnerActive = true;
    this.gestionPuntosService
      .listarPuntosCreados({
        tipoPunto: this.tipoPuntoSeleccionado ?? '',
        'fondos.bancoAVAL': this.fondosBancoAVALSeleccionado ?? '',
        'oficinas.bancoAVAL': this.oficinasBancoAVALSeleccionado ?? '',
        'cajeroATM.bancoAval': this.cajerosATMBancoAvalSeleccionado ?? '',
        page: pagina,
        size: tamanio,
        busqueda: this.nombrePuntoBusqueda ?? '',
      })
      .subscribe({
        next: (page: any) => {
          this.dataSourcePuntoSelect = new MatTableDataSource(
            page.data.content
          );
          this.dataSourcePuntoSelect.sort = this.sort;
          this.cantidadRegistros = page.data.totalElements;
          this.pageSizeOptions = [5, 10, 25, 100, page.data.totalElements];
          this.spinnerActive = false;
        },
        error: (err: any) => {
          this.dialog.open(VentanaEmergenteResponseComponent, {
            width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
            data: {
              msn:
                GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_DATA_FILE +
                ' - ' +
                err?.error?.response?.description,
              codigo: GENERALES.CODE_EMERGENT.ERROR,
            },
          });
          this.spinnerActive = false;
        },
      });
  }

  /**
   * Peticion al servicio de ciudades
   * @prv_nparra
   */
  async listarCiudades() {
    await lastValueFrom(this.generalServices.listarCiudades()).then(
      (response) => {
        this.ciudades = response.data;
      }
    );
  }

  /**
   * Peticion al servicio de bancos
   * @prv_nparra
   */
  async listarBancos() {
    await lastValueFrom(this.generalServices.listarBancosAval()).then(
      (response) => {
        this.bancosAval = response.data;
      }
    );
  }

  /**
   * Evento que valida la selecciond un tipo de punto
   * @BayronPerez
   */
  selectedTipoPunto(param: any) {
    if (param != undefined) {
      this.tipoPuntoSeleccionado = param;
    }
  }

  eventoTipoPunto(element: any) {
    this.tipoPuntoSeleccionado = element.value;
    this.listarPuntosSeleccionado();
  }

  eventoBanco(element: any) {
    this.fondosBancoAVALSeleccionado = undefined;
    this.oficinasBancoAVALSeleccionado = undefined;
    this.cajerosATMBancoAvalSeleccionado = undefined;

    if (this.tipoPuntoSeleccionado === 'FONDO') {
      this.fondosBancoAVALSeleccionado = element.value;
    }
    if (this.tipoPuntoSeleccionado === 'OFICINA') {
      this.oficinasBancoAVALSeleccionado = element.value;
    }
    if (this.tipoPuntoSeleccionado === 'CAJERO') {
      this.cajerosATMBancoAvalSeleccionado = element.value;
    }
    this.listarPuntosSeleccionado();
  }

  /**
   * Evento que levanta un openDialog para crear un punto segun el tipo de punto
   * @BaironPerez
   */
  async abrirDialogPunto(action: string, element: any) {
    this.dialog.open(CrearPuntoComponent, {
      width: '600PX',
      data: {
        flag: action,
        listPuntos: this.listPuntosSelect,
        element: element,
      },
    }).afterClosed()
    .subscribe((result) => {
      this.listarPuntosSeleccionado();
    });
  }

  /**
   * Evento que valida la selecciond un punto
   * @BayronPerez
   */
  selectedPunto(param: any) {
    if (param != undefined) {
      this.puntoSeleccionado = param;
    }
  }

  mostrarMas(e: any) {
    this.listarPuntosSeleccionado(e.pageIndex, e.pageSize);
  }

  filtrar(event) {
    this.listarPuntosSeleccionado();
  }

  /**
   * @author prv_nparra
   */
  resolverEstado(estado: string): string {
    return estado === "1" ? "Activo" : "Inactivo";
  }
}
