import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
  form: FormGroup = new FormGroup({
    'tipoPunto': new FormControl(),
    'nombre': new FormControl(),
    'ciudad': new FormControl(),
    'cliente': new FormControl(),
    'transportadora': new FormControl(),
    'codigoOficina': new FormControl(),
    'bancoAval': new FormControl(),
    'tarifaRuteo': new FormControl(),
    'tarifaVerificacion': new FormControl(),
    'codigoCompensacion': new FormControl(),
    'codigoCajero': new FormControl(),
    'identificacion': new FormControl(),
    'abreviatura': new FormControl(),
    'fajado': new FormControl(),
    'refajillado': new FormControl(),
    'esAval': new FormControl(),
    'estado': new FormControl(),
  });
  estado: string;
  ciudades: any[] = [];
  clientes: any[] = [];
  titulo: string;
  dataElement: any = null;
  isDisable: boolean;
  puntoSeleccionado: string = '';
  listPuntosSelect: any;
  bancosAval: any[] = [];
  tdvs: any[] = [];

  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CrearPuntoComponent>,
    private generalServices: GeneralesService,
    private gestionPuntosService: GestionPuntosService,
  ) {}

  async ngOnInit(): Promise<void> {
    ManejoFechaToken.manejoFechaToken();
    await this.datosDesplegables();
    this.dataElement = this.data.element;
    this.listPuntosSelect = this.data.listPuntos;

    if (this.data.flag == "crear") {
      this.titulo = "Crear "
    }

    if (this.data.flag == "modif") {
      this.titulo = "Modificación de "
    }
    await this.initForm(this.dataElement);
  }

  initForm(param?: any) {
    let valCodigoOficina = '';
    let valTarifaRuteo = '';
    let valTarifaVerificacion = '';
    let valBancoAval: number;
    let valFajado: any;

    this.puntoSeleccionado = param ? param?.tipoPunto : null;

    if (param?.tipoPunto === 'CLIENTE') {
      const cliente = this.clientes.find(value => value.codigoCliente === param.sitiosClientes.codigoCliente)
      valBancoAval = cliente.codigoBancoAval;
      valFajado = param?.sitiosClientes?.fajado;
    }

    if(param?.tipoPunto === 'OFICINA') {
      valCodigoOficina = param.oficinas?.codigoOficina;
      valBancoAval = param.oficinas?.bancoAVAL;
      valTarifaRuteo = param.oficinas?.tarifaRuteo;
      valTarifaVerificacion = param.oficinas?.tarifaVerificacion;
      valFajado = param.oficinas?.fajado;
    }

    if(param?.tipoPunto === 'FONDO') {
      valBancoAval = param?.fondos?.bancoAVAL;
    }

    if(param?.tipoPunto === 'CAJERO') {
      valBancoAval = param?.cajeroATM?.bancoAval;
    }

    this.form = new FormGroup({
      'tipoPunto': new FormControl({value: param ? param?.tipoPunto : null, disabled: param ? true : false,}),
      'nombre': new FormControl(param != null ? param.nombrePunto : null),
      'ciudad': new FormControl(param ? this.ciudades.find(value => value.codigoDANE === param.codigoCiudad) : null),
      'cliente': new FormControl(param ? this.clientes.find(value => value.codigoCliente === param?.sitiosClientes?.codigoCliente) : null),
      'transportadora': new FormControl(param ? this.tdvs.find(value => value.codigo === param?.fondos?.tdv) : null),
      'codigoOficina': new FormControl(param ? valCodigoOficina : null),
      'bancoAval': new FormControl(param ? this.bancosAval.find(value => value.codigoPunto === valBancoAval) : null),
      'tarifaRuteo': new FormControl(param ? valTarifaRuteo : null),
      'tarifaVerificacion': new FormControl(param ? valTarifaVerificacion : null),
      'codigoCompensacion': new FormControl(param != undefined ? param != null ? param.codigoCompensacion : null : null),
      'codigoCajero': new FormControl(param ? param.cajeroATM?.codigoATM : null),
      'identificacion': new FormControl(param != undefined ? param != null ? param.numeroNit : null : null),
      'abreviatura': new FormControl(param != undefined ? param != null ? param.abreviatura : null : null),
      'fajado': new FormControl(param?.sitiosClientes?.fajado),
      'refajillado': new FormControl(param != undefined ? param != null ? param.refajillado : null : null),
      'esAval': new FormControl(param != undefined ? param != null ? param.esAVAL : null : null),
      'estado': new FormControl(param?.estado === "1" ? true : false),
    });
  }

  persistir() {
    let cliente = {
      codigoPunto: this.dataElement?.codigoPunto,
      tipoPunto: this.puntoSeleccionado,
      nombrePunto: this.form.value['nombre'],
      codigoDANE: this.form.value['ciudad']?.codigoDANE,
      nombreCiudad: this.form.value['ciudad']?.nombreCiudad,
      codigoCliente: Number(this.form.value['cliente']?.codigoCliente),
      codigoTDV: this.form.value['transportadora']?.codigo,
      codigoPropioTDV: this.form.value['transportadora']?.codigo,
      codigoOficina: Number(this.form.value['codigoOficina']),
      codigoATM: this.form.value['codigoCajero'],
      bancoAval: this.form.value['bancoAval'],
      tarifaRuteo: this.form.value['tarifaRuteo'],
      tarifaVerificacion: this.form.value['tarifaVerificacion'],
      codigoCompensacion: this.form.value['codigoCompensacion'],
      numeroNit: this.form.value['identificacion'],
      abreviatura: this.form.value['abreviatura'],
      estado: Number(this.form.value['estado'] ? 1 : 0),
      fajado: (this.form.value['fajado']),
      refagillado: (this.form.value['refajillado']),
      esAVAL: this.form.value['bancoAval']?.esAVAL,
    };
    this.gestionPuntosService.crearPunto(cliente).subscribe({
      next: (page) => {
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_CREATE + " - " + page.response.description,
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL,
          },
        })
        .afterClosed()
        .subscribe((result) => {
          this.dialogRef.close();
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
