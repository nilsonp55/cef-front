import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GeneralesService } from 'src/app/_service/generales.service';
import { PuntosCodigoService } from 'src/app/_service/liquidacion-service/puntos-codigo.service';
import { MatPaginator } from '@angular/material/paginator';
import { GestionPuntosService } from 'src/app/_service/administracion-service/gestionPuntos.service';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-puntos-codigo-tdv',
  templateUrl: './puntos-codigo-tdv.component.html',
  styleUrls: ['./puntos-codigo-tdv.component.css']
})
export class PuntosCodigoTdvComponent implements OnInit {

  form: FormGroup;
  dataSourceCodigoPuntoTdv: MatTableDataSource<any>
  displayedColumnsCodigoPuntoTdv: string[] = ['codigoPunto', 'codigoTdv', 'codigoPropioTdv', 'nombrePunto', 'nombreBanco', 'acciones'];
  isDominioChecked = false;
  mostrarFormulario = false;
  mostrarTabla = true;
  esEdicion: boolean;
  idPuntoCodigo: any;
  bancos: any[] = [];
  puntos: any[] = [];
  transportadoras: any[] = [];
  habilitarBTN: boolean;
  filtroBancoSelect: any;
  filtroTransportaSelect: any;
  filtroCodigoPropio: any;
  selectedTipoPunto = "";
  ciudades: any[] = [];
  numPagina : any;
  cantPagina : any;

  clientes: any[] = [];
  tdvSelect: boolean = false;
  tipoPuntoSelect: boolean = false;
  puntoSelect: boolean = false;
  ciudadSelect: boolean = false;
  clienteSelect: boolean = false;


  //Rgistros paginados
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  cantidadRegistros: number;

  constructor(
    private puntosCodigoService: PuntosCodigoService,
    private gestionPuntosService: GestionPuntosService,
    private dialog: MatDialog,
    private generalesService: GeneralesService
  ) { }

  async ngOnInit(): Promise<void> {
    ManejoFechaToken.manejoFechaToken()
    this.habilitarBTN = false;
    this.iniciarDesplegables();
    this.numPagina = 0;
	this.cantPagina = 10;
    this.listarPuntosCodigo(this.numPagina, this.cantPagina);
    this.iniciarPuntos();
    this.initForm();
  }

  /**
   * Inicializaion formulario de creacion y edicion
   * @BayronPerez
   */
  async initForm(param?: any) {
    let ciudad = null;
    if(param) {
      this.selectedTipoPunto = param.puntosDTO.tipoPunto;
      if(param.puntosDTO.codigoCiudad)
        ciudad = this.ciudades.find((value) => value.codigoDANE == param.puntosDTO.codigoCiudad).codigoDANE;

      await this.filtrarListaPuntos(param.puntosDTO.tipoPunto);
    }
    this.form = new FormGroup({
      'idPuntoCodigo': new FormControl(param ? param.idPuntoCodigoTdv : null),
      'punto': new FormControl(param ? this.puntos.find((value) => value.codigoPunto == param.puntosDTO.codigoPunto) : null),
      'codigoPunto': new FormControl(param ? param.codigoPunto : null),
      'codigoTdv': new FormControl(param ? this.transportadoras.find((value) => value.codigo == param.codigoTDV) : null),
      'codigoPropioTDV': new FormControl(param ? param.codigoPropioTDV : null),
      'banco': new FormControl(param ? this.bancos.find((value) => value.codigoPunto == param.bancosDTO.codigoPunto) : null),
      'estado': new FormControl(param ? this.formatearEstadoListar(param.estado) : null),
      'codigoDANE': new FormControl(ciudad),
      'cliente': new FormControl(param ? param.cliente : null),
      'tipoPunto': new FormControl(param ? param.puntosDTO.tipoPunto : null)
    });
  }

  selectPunto(codigoPunto: any): any {
    this.gestionPuntosService.consultarPuntoCreadoById(codigoPunto).pipe().subscribe({
      next: (response) => {
        this.puntos[0] = response.data;
        return response.data.nombrePunto;
      },
      error: (err) => {
        console.log("selectPunto: " + err);
      }
    });
  }

  /**
   * Lista los puntos codigo TDV
   * @BayronPerez
   */
  listarPuntosCodigo(pagina = 0, tamanio = 10) {
    this.puntosCodigoService.obtenerPuntosCodigoTDV({
      page: pagina,
      size: tamanio,
      'bancos.codigoPunto': this.filtroBancoSelect == undefined ? '': this.filtroBancoSelect.codigoPunto,
      'codigoTDV': this.filtroTransportaSelect == undefined ? '': this.filtroTransportaSelect.codigo,
      'busqueda': this.filtroCodigoPropio == undefined ? '': this.filtroCodigoPropio

    }).subscribe({
      next: (page: any) => {
        this.dataSourceCodigoPuntoTdv = new MatTableDataSource(page.data.content);
        this.dataSourceCodigoPuntoTdv.sort = this.sort;
        this.cantidadRegistros = page.data.totalElements;
        this.habilitarBTN = true;
      },
      error: (err: any) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: err.error.response.description,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        }); setTimeout(() => { alert.close() }, 3000);
      }
    });
  }

  /**
   * Se realiza persistencia del formulario de punto codigo
   * @BayronPerez
   */
  persistir() {
    const puntoCodigo = {
      idPuntoCodigoTdv: null,
      codigoTDV: this.form.value['codigoTdv'].codigo,
      codigoPunto: this.form.value['codigoPunto'],
      codigoPropioTDV: this.form.value['codigoPropioTDV'],
      ciudadFondo: this.form.value['codigoDANE'],
      bancosDTO: {
        codigoPunto: Number(this.form.value['banco'].codigoPunto)
      },
      puntosDTO: {
        codigoPunto: Number(this.form.value['punto'].codigoPunto)
      },
      estado: Number(this.formatearEstadoPersistir(this.form.value['estado'])),

    };

    if(this.esEdicion) {
      puntoCodigo.idPuntoCodigoTdv = this.form.value['idPuntoCodigo'];
      this.puntosCodigoService.actualizarPuntosCodigoTDV(puntoCodigo).subscribe({
        next: response => {
          const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
            width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
            data: {
              msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_CREATE,
              codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
            }
          }); setTimeout(() => { alert.close() }, 4000);
          this.listarPuntosCodigo(this.numPagina, this.cantPagina);
          this.initForm();
        },
        error: (err: any) => {
          const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
            width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
            data: {
              msn: err.error.response.description,
              codigo: GENERALES.CODE_EMERGENT.ERROR
            }
          }); setTimeout(() => { alert.close() }, 3000);
        }
      });
    }
    else {
      this.puntosCodigoService.guardarPuntosCodigoTDV(puntoCodigo).subscribe({
        next: response => {
          const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
            width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
            data: {
              msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_CREATE,
              codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
            }
          }); setTimeout(() => { alert.close() }, 4000);
          this.listarPuntosCodigo(this.numPagina, this.cantPagina);
          this.initForm();
        },
        error: (err: any) => {
          const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
            width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
            data: {
              msn: err.error.response.description,
              codigo: GENERALES.CODE_EMERGENT.ERROR
            }
          }); setTimeout(() => { alert.close() }, 3000);
        }
      });
    }

  }

  /**
   * Se muestra el formulario para crear punto codigo
   * @BayronPerez
   */
  crearPuntoCodigo() {
    this.mostrarFormulario = true;
    this.form.get('idPuntoCodigo').disable();
    this.esEdicion = false;
    this.mostrarTabla = false;
  }

  /**
   * Se muestra el formulario para actualizar punto codigo
   * @BayronPerez
   */
  actualizarPuntoCodigo(element) {
    this.initForm(element)
    this.mostrarFormulario = true;
    this.idPuntoCodigo = this.form.value['idPuntoCodigo'];
    this.form.get('idPuntoCodigo').disable();
    this.esEdicion = true;
    this.mostrarTabla = false;
  }

  async iniciarDesplegables() {

    await lastValueFrom(this.generalesService.listarCiudades()).then((response) => {
      this.ciudades = response.data;
    });
    await lastValueFrom(this.generalesService.listarBancosAval()).then((response) => {
      this.bancos = response.data;
    });
    await lastValueFrom(this.generalesService.listarTransportadoras()).then((response) => {
      this.transportadoras = response.data;
    });

  }

  async iniciarPuntos() {

    await lastValueFrom(this.gestionPuntosService.listarPuntosCreados()).then((response) => {
      this.puntos = response.content;
    });

  }

  selectedBanco(event) {
    this.tdvSelect = true;
  }

  selectedTdv(event) {
    this.tipoPuntoSelect = true;
  }

  async filtrarPuntos(event: any) {
    this.filtrarListaPuntos(event.value);
  }

  async filtrarListaPuntos(tipoPunto1) {
    let params;
    this.ciudadSelect = false;
    this.clienteSelect = false;
    if(tipoPunto1 == "BAN_REP"){
      this.puntoSelect = true;
      this.ciudadSelect = true;
      params = {
        tipoPunto: this.selectedTipoPunto,
        page: 0,
        size: 80
      };
      await this.listarPuntos(params);
    }
    if(tipoPunto1 == "BANCO"){
      this.puntoSelect = true;
      params = {
        tipoPunto: this.selectedTipoPunto,
        page: 0,
        size: 80
      };
      await this.listarPuntos(params);
    }
    if(tipoPunto1 == "FONDO"){
      this.puntoSelect = true;
      params = {
        'fondos.bancoAVAL': Number(this.form.value['banco'].codigoPunto),
        tipoPunto: this.selectedTipoPunto,
        page: 0,
        size: 140
      };
      await this.listarPuntos(params);
    }
    if(tipoPunto1 == "OFICINA"){
      this.puntoSelect = true;
      params = {
        'oficinas.bancoAVAL': Number(this.form.value['banco'].codigoPunto),
        tipoPunto: this.selectedTipoPunto,
        page: 0,
        size: 1000
      };
      await this.listarPuntos(params);
    }
    if(tipoPunto1 == "CAJERO"){
      this.puntoSelect = true;
      params = {
        tipoPunto: this.selectedTipoPunto,
        'cajerosAtm.codBancoAval': Number(this.form.value['banco'].codigoPunto),
        page: 0,
        size: 1500
      };
      await this.listarPuntos(params);
    }
    if(tipoPunto1 == "CLIENTE"){
      this.puntoSelect = false;
      this.clienteSelect = true;
      params = {
        'fondos.bancoAVAL': Number(this.form.value['banco'].codigoPunto),
        page: 0,
        size: 1000
      };
      this.listarClientes(params);
    }

  }

  listarClientes(params: any){
    this.generalesService.listarClientes(params).subscribe({
      next: response => {
        this.clientes = response.data;
      },
      error: err => {
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


  async listarPuntos(params?: any) {
    await lastValueFrom(this.gestionPuntosService.listarPuntosCreados(params)).then(
      (response) => {
        this.puntos = response.data.content;
      }
    );
  }

  filtrarPuntosCliente(event: any) {
    this.puntoSelect = true;
    this.ciudadSelect = true;
    let params = {
      tipoPunto: this.selectedTipoPunto,
      cliente: this.form.value['cliente'].codigo,
    };
    this.listarPuntos(params);
  }

  /**
   * Metodo para gestionar la paginación de la tabla
   * @BaironPerez
   */
  mostrarMas(e: any) {
    this.numPagina = e.pageIndex;
	this.cantPagina = e.pageSize;
	this.listarPuntosCodigo(this.numPagina, this.cantPagina );
  }

  irAtras() {
    window.location.reload();
  }

  changePunto(event) {
    this.form.controls['codigoPunto'].setValue(event.value.codigoPunto);
    this.generalesService.listarCiudadesByParams({'codigoDANE':event.value.codigoCiudad}).subscribe(
      response => {
        this.form.controls['codigoDANE'].setValue(response.data[0].codigoDANE);
        //this.form.controls['codigoDANE'].disable();
      });
  }

  formatearEstadoPersistir(param: boolean): any {
    if(param==true){
      return 1
    }else {
      return 2
    }
  }

  formatearEstadoListar(param: any): any {
    return param == 1;
  }

  filtrar(event) {
    this.filtroBancoSelect;
    this.filtroTransportaSelect;
    this.listarPuntosCodigo(this.numPagina, this.cantPagina);
  }
}
