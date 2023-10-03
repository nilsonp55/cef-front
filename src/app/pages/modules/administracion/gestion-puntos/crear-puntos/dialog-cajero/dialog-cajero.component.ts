import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';
import { GestionPuntosService } from 'src/app/_service/administracion-service/gestionPuntos.service';
import { GeneralesService } from 'src/app/_service/generales.service';

@Component({
  selector: 'app-dialog-cajero',
  templateUrl: './dialog-cajero.component.html',
  styleUrls: ['./dialog-cajero.component.css']
})
export class DialogCajeroComponent implements OnInit {


  form: FormGroup;
  estado: string;
  tipoEstado: string[] = ['Punto en uso', 'Punto no esta en uso'];
  esGrupoAval = false;
  ciudades: any[] = [];
  bancosAval: any[] = [];
  mosrarFormBanco = false;
  mosrarFormCliente = false;
  mosrarFormOficina = false;
  mosrarFormCajero = false;
  mosrarFormFondo = false;
  nombreBTN: string;
  nombreBTNCancelar: string;
  estadoBTN: boolean;
  titulo: string;
  dataElement: any = null;
  esEdicion: boolean;
  mostrarFormulario: boolean = false;


  constructor(
    private dialog: MatDialog,
    private generalServices: GeneralesService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private gestionPuntosService: GestionPuntosService) { }


  async ngOnInit(): Promise<void> {
    ManejoFechaToken.manejoFechaToken()
    this.dataElement = this.data.element;
    this.nombreBTN = "Guardar"
    await this.datosDesplegables();
    this.estadoBTN = false
    this.initForm(this.dataElement);
    if (this.data.flag == "crear") {
      this.titulo = "Crear  "
    }
    if (this.data.flag == "info") {
      this.titulo = "Información "
      this.estadoBTN = false
      this.form.get('nombre').disable();
      this.form.get('ciudad').disable();
      this.form.get('codigoCajero').disable();
      this.form.get('bancoAval').disable();
      this.form.get('tarifaRuteo').disable();
      this.form.get('tarifaVerificacion').disable();
      this.form.get('estado').disable();
      this.form.get('depositario').disable();
    }
    if (this.data.flag == "modif") {
      this.titulo = "Modificación "
      this.nombreBTN = "Actualizar"
      this.esEdicion = true;
    }
  }

  /**
   * Metodo encargado de crear un punto segun el tipo de punto
   * @BayronPerez
   */
  crearPunto() {
    const punto = {
      //logica para obtener los campos para crear el tipo de puto segun tipo de punto
    }
    this.gestionPuntosService.crearPunto(punto).subscribe(data => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_CREATE,
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
          }
        }); setTimeout(() => { alert.close() }, 3500);
      },
      (err: any) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_CREATE,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        }); setTimeout(() => { alert.close() }, 3500);
      })
  }

  initForm(param?: any) {
    this.form = new FormGroup({
      'nombre': new FormControl(param != null ? param.nombrePunto : null),
      'ciudad': new FormControl(param ? this.selectCiudad(param) : null),
      'codigoCajero': new FormControl(param.cajeroATM != undefined ? param != null ? param.cajeroATM.codigoATM : null : null),
      'bancoAval': new FormControl(param ? this.selectBanco(param) : null),
      'tarifaRuteo': new FormControl(param.cajeroATM != undefined ? param != null ? param.cajeroATM.tarifaRuteo : null : null),
      'tarifaVerificacion': new FormControl(param.cajeroATM != undefined ? param != null ? param.cajeroATM.tarifaVerificacion : null : null),
      'estado': new FormControl(),
      'depositario': new FormControl(),
    });
    this.mostrarFormulario = true
  }

  selectCiudad(param: any): any {
    if (param.codigoCiudad !== undefined) {
      for (let i = 0; i < this.ciudades.length; i++) {
        const element = this.ciudades[i];
        if (element.codigoCiudad == param.codigoCiudad) {
          return element;
        }
      }
    }
  }

  selectBanco(param: any): any {

    if (param.cajeroATM !== undefined) {
      for (let i = 0; i < this.bancosAval.length; i++) {
        const element = this.bancosAval[i];
        if (element.codigoPunto == param.cajeroATM.codigoBancoAval) {
          return element;
        }
      }
    }
  }

  persistir() {
    let cajero = {
      tipoPunto : "CAJERO",
      nombre: this.form.value['nombre'],
      ciudad: this.form.value['ciudad'],
      codigoCajero: this.form.value['codigoCajero'],
      bancoAval: this.form.value['bancoAval'],
      tarifaRuteo: this.form.value['tarifaRuteo'],
      codigoPunto: this.esEdicion ? this.dataElement.codigoPunto : null,
      tarifaVerificacion: this.form.value['tarifaVerificacion'],
      estado: this.form.value['estado'],
      depositario: this.form.value['depositario'],
    }
    this.gestionPuntosService.crearPunto(cajero).subscribe(response => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_CREATE,
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
          }
        }); setTimeout(() => { alert.close() }, 3000);
        this.initForm();
      },
      (err: any) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: err.error.response.description,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        }); setTimeout(() => { alert.close() }, 3000);
      });

    this.ngOnInit();
  }

  async datosDesplegables() {

    const _ciudades = await this.generalServices.listarCiudades().toPromise();
    this.ciudades = _ciudades.data;

    const _bancos = await this.generalServices.listarBancosAval().toPromise();
    this.bancosAval = _bancos.data;

  }

}
