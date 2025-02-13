import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GeneralesService } from 'src/app/_service/generales.service';
import { PuntosCodigoService } from 'src/app/_service/liquidacion-service/puntos-codigo.service';
import { GestionPuntosService } from 'src/app/_service/administracion-service/gestionPuntos.service';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-puntos-codigo-tdv',
  templateUrl: './puntos-codigo-tdv.component.html',
  styleUrls: ['./puntos-codigo-tdv.component.css']
})
export class PuntosCodigoTdvComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;

  form: FormGroup = new FormGroup({});
  dataSourceCodigoPuntoTdv: MatTableDataSource<any>
  displayedColumnsCodigoPuntoTdv: string[] = ['idPuntoCodigoTdv', 'codigoPunto', 'tipoPunto', 'codigoTdv', 'codigoPropioTdv', 'nombrePunto', 'nombreBanco', 'codigoCiudad', 'estado', 'acciones'];
  isDominioChecked = false;
  mostrarFormulario = false;
  mostrarTabla = true;
  esEdicion: boolean;
  idPuntoCodigo: any;
  bancos: any[] = [];
  puntos: any[] = [];
  transportadoras: any[] = [];
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
  listPuntosSelect: any;
  puntoSeleccionado: any;
  listCiudadSelect: any;

  //Registros paginados
  cantidadRegistros: number;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  spinnerActive: boolean = false;

  constructor(
    private puntosCodigoService: PuntosCodigoService,
    private puntosService: GestionPuntosService,
    private dialog: MatDialog,
    private generalesService: GeneralesService
  ) { }

  async ngOnInit(): Promise<void> {
    this.spinnerActive = true;
    ManejoFechaToken.manejoFechaToken();
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
    let ciudad = '';
    if(param) {
      this.selectedTipoPunto = param.puntosDTO.tipoPunto;
      if(param.ciudadFondo)
        ciudad = this.ciudades.find((value) => value.codigoDANE == param.ciudadFondo)?.codigoDANE;

      await this.filtrarListaPuntos(param);
    }
    const puntoValueForm = this.puntos.find((value) => value.codigoPunto == param.puntosDTO.codigoPunto);
    const clienteValueForm = this.clientes.find((value) => value.codigoCliente == param.puntosDTO.sitiosClientes.codigoCliente);
    this.form = new FormGroup({
      'idPuntoCodigo': new FormControl(param ? param.idPuntoCodigoTdv : null),
      'punto': new FormControl(param ? puntoValueForm : null),
      'codigoPunto': new FormControl(param ? param.codigoPunto : null, [Validators.required]),
      'codigoTdv': new FormControl(param ? this.transportadoras.find((value) => value.codigo == param.codigoTDV) : null, [Validators.required]),
      'codigoPropioTDV': new FormControl(param ? param.codigoPropioTDV : null, [Validators.required]),
      'banco': new FormControl(param ? this.bancos.find((value) => value.codigoPunto == param.bancosDTO.codigoPunto) : null, [Validators.required]),
      'estado': new FormControl(param ? param.estado === 1 : true),
      'codigoDANE': new FormControl(ciudad ? ciudad : "0"),
      'cliente': new FormControl(param ? clienteValueForm : null),
      'tipoPunto': new FormControl(param ? param.puntosDTO.tipoPunto : null,  [Validators.required])
    }); 
  }

  /**
   * Lista los puntos codigo TDV
   * @BayronPerez
   */
  listarPuntosCodigo(pagina = 0, tamanio = 10) {
    this.spinnerActive = true;
    this.puntosCodigoService.obtenerPuntosCodigoTDV({
      page: pagina,
      size: tamanio,
      'bancos.codigoPunto': this.filtroBancoSelect == undefined ? '': this.filtroBancoSelect.codigoPunto,
      'codigoTDV': this.filtroTransportaSelect == undefined ? '': this.filtroTransportaSelect.codigo,
      'busqueda': this.filtroCodigoPropio == undefined ? '': this.filtroCodigoPropio,
      'puntos.tipoPunto': this.puntoSeleccionado == undefined ? '' : this.puntoSeleccionado.valorTexto,
      'ciudadFondo': this.listCiudadSelect == undefined ? '' : this.listCiudadSelect.codigoDANE
    }).subscribe({
      next: (page: any) => {
        this.dataSourceCodigoPuntoTdv = new MatTableDataSource(page.data.content);
        this.dataSourceCodigoPuntoTdv.sort = this.sort;
        this.cantidadRegistros = page.data.totalElements;
        this.pageSizeOptions = [5, 10, 25, 100, page.data.totalElements];
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

  /**
   * Se realiza persistencia del formulario de punto codigo
   * @BayronPerez
   */
  persistir() {
    this.spinnerActive = true;
    const puntoCodigo = {
      idPuntoCodigoTdv: this.form.value['idPuntoCodigo'],
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
      estado: Number(this.form.value['estado'] ? 1 : 2),

    };

    if(this.esEdicion) {
      this.puntosCodigoService.actualizarPuntosCodigoTDV(puntoCodigo).subscribe({
        next: response => {
          this.dialog.open(VentanaEmergenteResponseComponent, {
            width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
            data: {
              msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_UPDATE,
              codigo: GENERALES.CODE_EMERGENT.SUCCESFULL,
              showResume: true,
              msgDetalles: JSON.stringify(response)
            }
          });
          this.listarPuntosCodigo(this.numPagina, this.cantPagina);
          this.spinnerActive = false;
        },
        error: (err: any) => {
          this.dialog.open(VentanaEmergenteResponseComponent, {
            width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
            data: {
              msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_UPDATE,
              codigo: GENERALES.CODE_EMERGENT.ERROR,
              showResume: true,
              msgDetalles: JSON.stringify(err.error)
            }
          });
          this.spinnerActive = false;
        }
      });
    }
    else {
      this.puntosCodigoService.guardarPuntosCodigoTDV(puntoCodigo).subscribe({
        next: response => {
          this.dialog.open(VentanaEmergenteResponseComponent, {
            width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
            data: {
              msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_CREATE,
              codigo: GENERALES.CODE_EMERGENT.SUCCESFULL,
              showResume: true,
              msgDetalles: JSON.stringify(response)
            }
          });
          this.listarPuntosCodigo(this.numPagina, this.cantPagina);
          this.form.controls['idPuntoCodigo'].setValue(response.data.idPuntoCodigoTdv);
          this.spinnerActive = false;
        },
        error: (err: any) => {
          this.dialog.open(VentanaEmergenteResponseComponent, {
            width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
            data: {
              msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_CREATE,
              codigo: GENERALES.CODE_EMERGENT.ERROR,
              showResume: true,
              msgDetalles: JSON.stringify(err.error)
            }
          });
          this.spinnerActive = false;
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

    this.puntosService
      .listarTiposPuntos({'dominioPK.dominio': 'TIPOS_PUNTO'})
      .subscribe({next: (page: any) => {
          this.listPuntosSelect = page.data;
        },
        error: (err: any) => { this.dialog.open(VentanaEmergenteResponseComponent, {
            width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
            data: {
              msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_DATA_FILE,
              codigo: GENERALES.CODE_EMERGENT.ERROR,
              showResume: true,
              msgDetalles: JSON.stringify(err.error)
            },
          });
        },
      });

  }

  async iniciarPuntos() {

    await lastValueFrom(this.puntosService.listarPuntosCreados()).then((response) => {
      this.puntos = response.content;
    });

  }

  selectedBanco(event) {
    this.tdvSelect = true;
  }

  selectedTdv(event) {
    this.tipoPuntoSelect = true;
  }

  async filtrarListaPuntos(paramn) {

    let params;
    let tipoPunto1 = paramn.puntosDTO.tipoPunto;
    this.ciudadSelect = false;
    this.clienteSelect = false;
    if(tipoPunto1 == "BAN_REP"){
      this.puntoSelect = true;
      this.ciudadSelect = true;
      params = {
        tipoPunto: this.selectedTipoPunto,
        page: 0,
        size: 5000
      };
      await this.listarPuntos(params);
    }
    if(tipoPunto1 == "BANCO"){
      this.puntoSelect = true;
      params = {
        tipoPunto: this.selectedTipoPunto,
        page: 0,
        size: 5000
      };
      await this.listarPuntos(params);
    }
    if(tipoPunto1 == "FONDO"){
      this.puntoSelect = true;
      params = {
        'fondos.bancoAVAL': Number(paramn.bancosDTO.codigoPunto),
        tipoPunto: this.selectedTipoPunto,
        page: 0,
        size: 5000
      };
      await this.listarPuntos(params);
    }
    if(tipoPunto1 == "OFICINA"){
      this.puntoSelect = true;
      params = {
        'oficinas.bancoAVAL': Number(paramn.bancosDTO.codigoPunto),
        tipoPunto: this.selectedTipoPunto,
        page: 0,
        size: 5000
      };
      await this.listarPuntos(params);
    }
    if(tipoPunto1 == "CAJERO"){
      this.puntoSelect = true;
      params = {
        tipoPunto: this.selectedTipoPunto,
        'cajerosAtm.codBancoAval': Number(paramn.bancosDTO.codigoPunto),
        page: 0,
        size: 5000
      };
      await this.listarPuntos(params);
    }
    if(tipoPunto1 == "CLIENTE"){
      this.puntoSelect = true;
      this.ciudadSelect = true;
      this.clienteSelect = true;
      params = {
        'fondos.bancoAVAL': Number(paramn.bancosDTO.codigoPunto),
        page: 0,
        size: 5000
      };
      await this.listarClientes(params);

      let paramPuntos = {
        tipoPunto: this.selectedTipoPunto,
        cliente: paramn.puntosDTO.sitiosClientes.codigoCliente,
        page: 0,
        size: 5000
      };
      await this.listarPuntos(paramPuntos);
    }

  }

  async changeTipoPunto(event: any) {

    let params;
    this.ciudadSelect = false;
    this.clienteSelect = false;
    let tipoPunto1 = event.value;

    if(tipoPunto1 == "BAN_REP"){
      this.puntoSelect = true;
      this.ciudadSelect = true;
      params = {
        tipoPunto: this.selectedTipoPunto,
        page: 0,
        size: 5000
      };
      await this.listarPuntos(params);
    }
    if(tipoPunto1 == "BANCO"){
      this.puntoSelect = true;
      params = {
        tipoPunto: this.selectedTipoPunto,
        page: 0,
        size: 5000
      };
      await this.listarPuntos(params);
    }
    if(tipoPunto1 == "FONDO"){
      this.puntoSelect = true;
      params = {
        'fondos.bancoAVAL': Number(this.form.value['banco'].codigoPunto),
        tipoPunto: this.selectedTipoPunto,
        page: 0,
        size: 5000
      };
      await this.listarPuntos(params);
    }
    if(tipoPunto1 == "OFICINA"){
      this.puntoSelect = true;
      params = {
        'oficinas.bancoAVAL': Number(this.form.value['banco'].codigoPunto),
        tipoPunto: this.selectedTipoPunto,
        page: 0,
        size: 5000
      };
      await this.listarPuntos(params);
    }
    if(tipoPunto1 == "CAJERO"){
      this.puntoSelect = true;
      params = {
        tipoPunto: this.selectedTipoPunto,
        'cajerosAtm.codBancoAval': Number(this.form.value['banco'].codigoPunto),
        page: 0,
        size: 5000
      };
      await this.listarPuntos(params);
    }
    if(tipoPunto1 == "CLIENTE"){
      this.puntoSelect = false;
      this.clienteSelect = true;
      params = {
        'fondos.bancoAVAL': Number(this.form.value['banco'].codigoPunto),
        page: 0,
        size: 5000
      };
      await this.listarClientes(params);
    }

    this.form.controls['codigoPunto'].setValue('');
  }

  async listarClientes(params: any){
    this.spinnerActive = true;
    this.generalesService.listarClientes(params).subscribe({
      next: response => {
        this.clientes = response.data;
        this.spinnerActive = false;
      },
      error: err => {
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn:  GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_DATA_FILE,
            codigo: GENERALES.CODE_EMERGENT.ERROR,
            showResume: true,
            msgDetalles: JSON.stringify(err.error)
          }
        });
        this.spinnerActive = false;
      }
    });
  }


  async listarPuntos(params?: any) {
    this.spinnerActive = true;
    await lastValueFrom(this.puntosService.listarPuntosCreados(params)).then(
      (response) => {
        this.puntos = response.data.content;
        this.spinnerActive = false;
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
    debugger;
    this.spinnerActive = true;
    this.form.controls['codigoPunto'].setValue(event.value.codigoPunto);

    if(this.form.controls['tipoPunto'].value === 'BAN_REP') {
      this.form.controls['codigoDANE'].setValue(event.value.codigoCiudad);
    } else {
      this.form.controls['codigoDANE'].setValue('0');
    }
    
    this.spinnerActive = false;
  }

  filtrar(event) {
    this.listarPuntosCodigo(this.numPagina, this.cantPagina);
  }

  /**
   * @author prv_nparra
   */
  resolverEstado(estado: boolean): string {
    return estado ? "Activo" : "Inactivo";
  }

  /**
   * @author prv_nparra
   */
  resolverCiudadFondo(ciiuFondo: any) {
    const nombreCiudad = this.ciudades.find((value) => value.codigoDANE == ciiuFondo);
    return nombreCiudad ? nombreCiudad.nombreCiudad : "";
  }

}
