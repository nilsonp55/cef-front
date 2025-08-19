import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CrearPuntoComponent } from './crear-punto/crear-punto.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GestionPuntosService } from 'src/app/_service/administracion-service/gestionPuntos.service';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';
import { GeneralesService } from 'src/app/_service/generales.service';
import { lastValueFrom } from 'rxjs';
import { DominioFuncionalService } from 'src/app/_service/administracion-service/dominio-funcional.service';
import { ClientesCorporativosService } from 'src/app/_service/administracion-service/clientes-corporativos.service';

@Component({
  selector: 'app-gestion-puntos',
  templateUrl: './gestion-puntos.component.html'
})
export class GestionPuntosComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('exporter', {static: false}) exporter: any;

  tipoPuntoSeleccionado: string;
  elementoPuntoActualizar: string;
  detallePuntoSeleccionado: any;
  nombrePuntoBusqueda: string;

  //Registros paginados
  cantidadRegistros: number;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  paginaActual: number = 0;
  tamanioActual: number = 10;

  //Variable para activar spinner
  spinnerActive: boolean = false;

  dataSourcePuntoSelect: MatTableDataSource<any>;
  displayedColumnsPuntoSelect: string[] = [
    'codigoPunto',
    'tipoPunto',
    'banco_aval',
    'nombrePunto',
    'codigoCiudad',
    // 'estado',
    'detalle',
  ];

  listPuntosSelect: any;
  ciudades: any[] = [];
  bancosAval: any[] = [];
  bancoSeleccionado: string = '';
  fondosBancoAVALSeleccionado: number;
  oficinasBancoAVALSeleccionado: number;
  cajerosATMBancoAvalSeleccionado: number;
  clienteBancoAvalSeleccionado: number;
  clientes: any[] = [];

  DIALOG_CONFIG = {
      width: '90vw',
      maxWidth:'780px',
      height: 'auto',
      maxHeight: '80vh',
      autoFocus: false,
      disableClose: false,
  } as MatDialogConfig

  constructor(
    private readonly dialog: MatDialog,
    private readonly gestionPuntosService: GestionPuntosService,
    private readonly generalServices: GeneralesService,
    private readonly dominioFuncionalService: DominioFuncionalService,
    private readonly clientesCorporativosService: ClientesCorporativosService
  ) {}

  async ngOnInit(): Promise<void> {
    this.spinnerActive = true;
    ManejoFechaToken.manejoFechaToken();
    await this.listarTiposPunto();
    await this.listarPuntosSeleccionado();
    await this.listarCiudades();
    await this.listarBancos();
    await this.listarClientes();
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
    if (punto.tipoPunto === 'CLIENTE') {
      codigoBanco = this.clientes.find((v) => v.codigoCliente === punto.sitiosClientes?.codigoCliente)?.codigoBancoAval;
    }

    const banco = this.bancosAval.find((b) => b.codigoPunto === codigoBanco);
    return banco !== undefined ? banco.nombreBanco : '';
  }

  listarTiposPunto() {
    this.dominioFuncionalService
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
    this.paginaActual = pagina;
    this.tamanioActual = tamanio;
    this.spinnerActive = true;
    this.gestionPuntosService
      .listarPuntosCreados({
        tipoPunto: this.tipoPuntoSeleccionado ?? '',
        'fondos.bancoAVAL': this.fondosBancoAVALSeleccionado ?? '',
        'oficinas.bancoAVAL': this.oficinasBancoAVALSeleccionado ?? '',
        'cajeroATM.bancoAval': this.cajerosATMBancoAvalSeleccionado ?? '',
        'sitiosClientes.codigoCliente.codigoBancoAval': this.clienteBancoAvalSeleccionado ?? '',
        page: this.paginaActual,
        size: this.tamanioActual,
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

  async listarClientes() {
    await lastValueFrom(this.clientesCorporativosService.listarClientesCorporativos({page: 0, size: 5000})).then(
      (response) => {
        this.clientes = response.data.content;
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

  eventoBanco(element: any) {
    this.fondosBancoAVALSeleccionado = undefined;
    this.oficinasBancoAVALSeleccionado = undefined;
    this.cajerosATMBancoAvalSeleccionado = undefined;
    this.clienteBancoAvalSeleccionado = undefined;

    if (this.tipoPuntoSeleccionado === 'FONDO') {
      this.fondosBancoAVALSeleccionado = element.value;
    }
    if (this.tipoPuntoSeleccionado === 'OFICINA') {
      this.oficinasBancoAVALSeleccionado = element.value;
    }
    if (this.tipoPuntoSeleccionado === 'CAJERO') {
      this.cajerosATMBancoAvalSeleccionado = element.value;
    }
    if (this.tipoPuntoSeleccionado == 'CLIENTE') {
      this.clienteBancoAvalSeleccionado = element.value;
    }
  }

  /**
   * Evento que levanta un openDialog para crear un punto segun el tipo de punto
   * @BaironPerez
   */
  async abrirDialogPunto(action: string, element: any) {
    this.dialog.open(CrearPuntoComponent, {
      ...this.DIALOG_CONFIG,
      data: {
        flag: action,
        listPuntos: this.listPuntosSelect,
        element: element,
      },
    }).afterClosed()
    .subscribe((result) => {
      if(result == undefined){
        this.listarPuntosSeleccionado(this.paginaActual, this.tamanioActual);
      }
    });
  }


  mostrarMas(e: any) {
    this.listarPuntosSeleccionado(e.pageIndex, e.pageSize);
  }

  filtrar(e: any) {
    this.listarPuntosSeleccionado(e.pageIndex, e.pageSize);
  }

  limpiar(){
    this.tipoPuntoSeleccionado = null;
    this.bancoSeleccionado = null;
    this.nombrePuntoBusqueda = null;
  }

  /**
   * @author prv_nparra
   */
  resolverEstado(estado: string): string {
    return estado === "1" ? "Activo" : "Inactivo";
  }

  exporterTable(){
    if(this.exporter && !this.spinnerActive){
      this.exporter.exportTable('xlsx', {fileName:'gestion-puntos'});
    }
  }
}
