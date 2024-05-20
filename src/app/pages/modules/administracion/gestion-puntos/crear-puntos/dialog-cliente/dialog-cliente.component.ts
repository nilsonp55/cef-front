import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';
import { GestionPuntosService } from 'src/app/_service/administracion-service/gestionPuntos.service';
import { GeneralesService } from 'src/app/_service/generales.service';

@Component({
  selector: 'app-dialog-cliente',
  templateUrl: './dialog-cliente.component.html',
  styleUrls: ['./dialog-cliente.component.css']
})
export class DialogClienteComponent implements OnInit {

  spinnerActive: boolean = false;
  form: FormGroup;
  estado: string;
  tipoEstado: string[] = ['Punto en uso', 'Punto no esta en uso'];
  esGrupoAval = false;
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
  mostrarFormulario: boolean = false;
  isDisable: boolean;

  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private generalServices: GeneralesService,
    private gestionPuntosService: GestionPuntosService) { }


  async ngOnInit(): Promise<void> {
    ManejoFechaToken.manejoFechaToken()
    this.dataElement = this.data.element;
    this.nombreBTN = "Guardar"
    await this.datosDesplegables();
    this.estadoBTN = true
    this.initForm(this.dataElement);
    if (this.data.flag == "crear") {
      this.titulo = "Crear  "
    }
    if (this.data.flag == "info") {
      this.titulo = "Información "
      this.estadoBTN = false
      this.isDisable = false
      this.form.get('nombre').disable();
      this.form.get('ciudad').disable();
      this.form.get('cliente').disable();
      this.form.get('estado').disable();
      this.form.get('fajado').disable();
    }
    if (this.data.flag == "modif") {
      this.titulo = "Modificación "
      this.nombreBTN = "Actualizar"
      this.esEdicion = true;
    }

  }

  initForm(param?: any) {
    this.form = new FormGroup({
      'nombre': new FormControl(param != null ? param.nombrePunto : null),
      'ciudad': new FormControl(param ? this.selectCiudad(param) : null),
      'cliente': new FormControl(param ? this.selectCliente(param) : null),
      'estado': new FormControl(param?.estado === "1" ? true : false),
      'fajado': new FormControl(param?.sitiosClientes.fajado),
    });
    this.mostrarFormulario = true
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

  persistir() {
    let cliente = {
      nombrePunto: this.form.value['nombre'],
      codigoDANE: this.form.value['ciudad']?.codigoDANE,
      codigoCliente: Number(this.form.value['cliente'].codigoCliente),
      estado: Number(this.formatearEstadoPersistir(this.form.value['estado'])),
      fajado: this.form.value['fajado'],
      codigoCiudad: this.form.value['ciudad']?.codigoDANE,
      nombreCiudad: this.form.value['ciudad']?.nombreCiudad,
      tipoPunto: "CLIENTE",
      codigoPunto: this.esEdicion ? this.dataElement.codigoPunto : null,
      refagillado: null,
      tarifaRuteo: null,
      tarifaVerificacion: null,
      bancoAVAL: null,
      codigoCompensacion: null,
      numeroNit: null,
      abreviatura: null,
      esAVAL: null,
      codigoOficina: null,
      codigoTDV: null,
      codigoPropioTDV: null,
      tdv: null,
      codigoATM: null,
    }
    this.gestionPuntosService.crearPunto(cliente).subscribe(response => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_UPDATE,
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
          }
        }); 
      },
      (err: any) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: err.error.response.description,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        }); 
      });
  }

  async datosDesplegables() {

    const _ciudades = await this.generalServices.listarCiudades().toPromise();
    this.ciudades = _ciudades.data;

    const _clientes = await this.generalServices.listarClientes().toPromise();
    this.clientes = _clientes.data;

  }

  formatearEstadoPersistir(param: boolean): any {
    if (param == true) {
      return 1
    } else {
      return 2
    }
  }


}
