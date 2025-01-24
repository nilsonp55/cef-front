import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
    this.spinnerActive = true;
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
    this.spinnerActive = false;
  }

  initForm(param?: any) {
    let valCodigoOficina: any;
    let valTarifaRuteo: any;
    let valTarifaVerificacion: any;
    let valBancoAval: any;
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
      'tipoPunto': new FormControl({value: param ? param?.tipoPunto : null, disabled: param ? true : false,}, [Validators.required]),
      'nombre': new FormControl(param != null ? param.nombrePunto : null, [Validators.required]),
      'ciudad': new FormControl(param ? this.ciudades.find(value => value.codigoDANE === param.codigoCiudad) : null),
      'cliente': new FormControl(param ? this.clientes.find(value => value.codigoCliente === param?.sitiosClientes?.codigoCliente) : null, [Validators.required]),
      'transportadora': new FormControl(param ? this.tdvs.find(value => value.codigo === param?.fondos?.tdv) : null, [Validators.required]),
      'codigoOficina': new FormControl(param ? valCodigoOficina : null, [Validators.required]),
      'bancoAval': new FormControl(param ? this.bancosAval.find(value => value.codigoPunto === valBancoAval) : null, [Validators.required]),
      'tarifaRuteo': new FormControl(param ? valTarifaRuteo : 0),
      'tarifaVerificacion': new FormControl(param ? valTarifaVerificacion : 0),
      'codigoCompensacion': new FormControl(param ? param.codigoCompensacion : null, [Validators.required]),
      'codigoCajero': new FormControl(param ? param.cajeroATM?.codigoATM : null, [Validators.required]),
      'identificacion': new FormControl(param ? param.numeroNit : null, [Validators.required]),
      'abreviatura': new FormControl(param ? param.abreviatura : null, [Validators.required]),
      'fajado': new FormControl(param ? valFajado : null),
      'refajillado': new FormControl(param ? param.refajillado : null),
      'esAval': new FormControl(param ? param.esAVAL : null),
      'estado': new FormControl(param? param.estado === "1" : true),
    });

    if (param) {
      this.changeTipoPunto({value: param?.tipoPunto});
    }
  }

  persistir() {
    this.spinnerActive = true;
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
      bancoAVAL: this.form.value['bancoAval']?.codigoPunto,
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
    let messagePersistirSuccesful = GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_CREATE;
    let messagePersistirError = GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_CREATE;

    if(this.data.flag == "modif") {
      messagePersistirSuccesful = GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_UPDATE;
      messagePersistirError = GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_UPDATE;
    }

    this.gestionPuntosService.crearPunto(cliente).subscribe({
      next: (page) => {
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: messagePersistirSuccesful,
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL,
            showResume: true,
            msgDetalles: JSON.stringify(page.response)
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
            msn: messagePersistirError,
            codigo: GENERALES.CODE_EMERGENT.ERROR,
            showResume: true,
            msgDetalles: JSON.stringify(err.error)
          },
        });
        this.spinnerActive = false;
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

    this.form.controls['codigoOficina'].setValidators(Validators.required);
    this.form.controls['transportadora'].setValidators(Validators.required);
    this.form.controls['codigoCompensacion'].setValidators(Validators.required);
    this.form.controls['codigoCajero'].setValidators(Validators.required);
    this.form.controls['identificacion'].setValidators(Validators.required);
    this.form.controls['abreviatura'].setValidators(Validators.required);
    this.form.controls['bancoAval'].setValidators(Validators.required);
    this.form.controls['cliente'].setValidators(Validators.required);

    if (element.value === 'CLIENTE' || element.value === 'FONDO' || element.value === 'BAN_REP' 
      || element.value === 'CAJERO' || element.value === 'BANCO') {
      this.form.controls['codigoOficina'].removeValidators(Validators.required);
    }

    if (element.value === 'CLIENTE' || element.value === 'BAN_REP' || element.value === 'OFICINA'
      || element.value === 'CAJERO' || element.value === 'BANCO') {
        this.form.controls['transportadora'].removeValidators(Validators.required);
    }

    if (element.value === 'CLIENTE' || element.value === 'FONDO' || element.value === 'BAN_REP' 
      || element.value === 'OFICINA' || element.value === 'CAJERO') {
        this.form.controls['codigoCompensacion'].removeValidators(Validators.required);
        this.form.controls['identificacion'].removeValidators(Validators.required);
        this.form.controls['abreviatura'].removeValidators(Validators.required);
    }

    if (element.value === 'CLIENTE' || element.value === 'FONDO' || element.value === 'BAN_REP' 
      || element.value === 'OFICINA' || element.value === 'BANCO') {
        this.form.controls['codigoCajero'].removeValidators(Validators.required);
    }

    if (element.value === 'FONDO' || element.value === 'BAN_REP' || element.value === 'OFICINA'
      || element.value === 'CAJERO' || element.value === 'BANCO') {   
        this.form.controls['cliente'].removeValidators(Validators.required);
    }

    if (element.value === 'BAN_REP' || element.value === 'BANCO') {
      this.form.controls['bancoAval'].removeValidators(Validators.required);
    }

    this.form.controls['codigoOficina'].updateValueAndValidity();
    this.form.controls['transportadora'].updateValueAndValidity();
    this.form.controls['codigoCompensacion'].updateValueAndValidity();
    this.form.controls['codigoCajero'].updateValueAndValidity();
    this.form.controls['identificacion'].updateValueAndValidity();
    this.form.controls['abreviatura'].updateValueAndValidity();
    this.form.controls['bancoAval'].updateValueAndValidity();
    this.form.controls['cliente'].updateValueAndValidity();

  }
}
