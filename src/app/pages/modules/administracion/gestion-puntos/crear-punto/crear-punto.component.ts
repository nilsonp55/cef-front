import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';
import { GestionPuntosService } from 'src/app/_service/administracion-service/gestionPuntos.service';
import { GeneralesService } from 'src/app/_service/generales.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-crear-punto',
  templateUrl: './crear-punto.component.html',
  styleUrls: ['./crear-punto.component.css'],
})
export class CrearPuntoComponent implements OnInit {
  spinnerActive: boolean = false;
  form: FormGroup;
  estado: string;
  tipoEstado: string[] = ['Punto en uso', 'Punto no esta en uso'];
  ciudades: any[] = [];
  clientes: any[] = [];
  titulo: string;
  mosrarFormBanco = false;
  mosrarFormCliente = false;
  mosrarFormOficina = false;
  mosrarFormCajero = false;
  mosrarFormFondo = false;
  estadoBTN: boolean;
  nombreBTN: string;
  esEdicion: boolean;
  dataElement: any = null;
  isDisable: boolean;
  puntoSeleccionado: string = '';
  listPuntosSelect: any;
  bancosAval: any[] = [];
  tdvs: any[] = [];

  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private generalServices: GeneralesService,
    private gestionPuntosService: GestionPuntosService
  ) {}

  async ngOnInit(): Promise<void> {
    ManejoFechaToken.manejoFechaToken();
    this.dataElement = this.data.element;
    this.nombreBTN = 'Guardar';
    await this.datosDesplegables();
    this.estadoBTN = true;
    this.initForm(this.dataElement);
    this.listPuntosSelect = this.data.listPuntos;

    if (this.data.flag == 'crear') {
      this.titulo = 'Crear  ';
    }

    if (this.data.flag == 'modif') {
      this.titulo = 'Modificación ';
      this.nombreBTN = 'Actualizar';
      this.esEdicion = true;
    }
  }

  initForm(param?: any) {
    this.form = new FormGroup({
      tipoPunto: new FormControl(param ? param : null),
      nombre: new FormControl(param != null ? param.nombrePunto : null),
      ciudad: new FormControl(param ? this.selectCiudad(param) : null),
      cliente: new FormControl(param ? this.selectCliente(param) : null),
      transportadora: new FormControl(
        param ? this.selectTransportadorasOrigen(param) : null
      ),
      codigoOficina: new FormControl(
        param != undefined ? (param != null ? param.codigoOficina : null) : null
      ),
      codigoCajero: new FormControl(
        param != undefined ? (param != null ? param.codigoATM : null) : null
      ),
      bancoAval: new FormControl(param ? this.selectBanco(param) : null),
      tarifaRuteo: new FormControl(
        param != undefined ? (param != null ? param.tarifaRuteo : null) : null
      ),
      tarifaVerificacion: new FormControl(
        param != undefined
          ? param != null
            ? param.tarifaVerificacion
            : null
          : null
      ),
      codigoCompensacion: new FormControl(
        param != undefined
          ? param != null
            ? param.codigoCompensacion
            : null
          : null
      ),
      identificacion: new FormControl(
        param != undefined ? (param != null ? param.numeroNit : null) : null
      ),
      abreviatura: new FormControl(
        param != undefined ? (param != null ? param.abreviatura : null) : null
      ),
      estado: new FormControl(param != null ? param.estado : null),
      fajado: new FormControl(param != null ? param.fajado : null),
      refajillado: new FormControl(
        param != undefined ? (param != null ? param.refajillado : null) : null
      ),
      esAval: new FormControl(
        param != undefined ? (param != null ? param.esAVAL : null) : null
      ),
    });
  }

  selectCiudad(param: any): any {
    for (let i = 0; i < this.ciudades.length; i++) {
      const element = this.ciudades[i];
      if (element.codigoDANE == param.codigoCiudad) {
        return element;
      }
    }
  }
  selectCliente(param: any): any {
    if (param.sitiosClientes !== undefined) {
      for (let i = 0; i < this.clientes.length; i++) {
        const element = this.clientes[i];
        if (element.codigoCliente == param.sitiosClientes.codigoCliente) {
          return element;
        }
      }
    }
  }
  selectTransportadorasOrigen(param: any): any {
    if (param.fondos !== undefined) {
      for (let i = 0; i < this.tdvs.length; i++) {
        const element = this.tdvs[i];
        if (element.codigo == param.fondos.tdv) {
          return element;
        }
      }
    }
  }

  selectBanco(param: any): any {
    if (param.fondos !== undefined) {
      for (let i = 0; i < this.bancosAval.length; i++) {
        const element = this.bancosAval[i];
        if (element.codigoPunto == param.fondos.bancoAVAL) {
          return element;
        }
      }
    }
  }

  persistir() {
    let cliente = {
      tipoPunto: this.form.value['tipoPunto'],
      nombrePunto: this.form.value['nombre'],
      codigoDANE: this.form.value['ciudad']?.codigoDANE,
      nombreCiudad: this.form.value['ciudad']?.nombreCiudad,
      codigoCliente: this.form.value['cliente']
        ? Number(this.form.value['cliente']?.codigoCliente)
        : '',
      codigoTDV: this.form.value['transportadora']
        ? this.form.value['transportadora']?.codigo
        : '',
      codigoPropioTDV: this.form.value['transportadora']
        ? this.form.value['transportadora']?.codigo
        : '',
      codigoOficina: Number(this.form.value['codigoOficina']),
      codigoATM: this.form.value['codigoCajero'],
      bancoAval: this.form.value['bancoAval'],
      tarifaRuteo: this.form.value['tarifaRuteo'],
      tarifaVerificacion: this.form.value['tarifaVerificacion'],
      codigoCompensacion: this.form.value['codigoCompensacion'],
      identificacion: this.form.value['identificacion'],
      abreviatura: this.form.value['abreviatura'],
      estado: Number(this.form.value['estado'] ? 1 : 2),
      fajado: this.form.value['fajado'],
      refagillado: this.form.value['refajillado'] === 'refajillado',
      codigoPunto: this.esEdicion ? this.dataElement.codigoPunto : null,
      esAVAL: this.form.value['bancoAval']
        ? this.form.value['bancoAval']?.esAVAL
        : '',
    };
    this.gestionPuntosService.crearPunto(cliente).subscribe({
      next: (page) => {
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_CREATE + " - " + page.response.description,
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL,
          },
        });
      },
      error: (err: any) => {
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_CREATE + " - " + err?.error?.response?.description,
            codigo: GENERALES.CODE_EMERGENT.ERROR,
          },
        });
      }
    });
  }

  async datosDesplegables() {
    await lastValueFrom(this.generalServices.listarCiudades()).then(
      (response) => {
        this.ciudades = response.data;
      }
    );

    await lastValueFrom(this.generalServices.listarClientes()).then(
      (response) => {
        this.clientes = response.data;
      }
    );

    await lastValueFrom(this.generalServices.listarBancosAval()).then(
      (response) => {
        this.bancosAval = response.data;
      }
    );

    await lastValueFrom(this.generalServices.listarTransportadoras()).then(
      (response) => {
        this.tdvs = response.data;
      }
    );
  }

  changeTipoPunto(element: any) {
    this.puntoSeleccionado = element.value;
  }
}
