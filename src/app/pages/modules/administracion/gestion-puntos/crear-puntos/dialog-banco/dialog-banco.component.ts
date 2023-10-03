import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';
import { GestionPuntosService } from 'src/app/_service/administracion-service/gestionPuntos.service';
import { GeneralesService } from 'src/app/_service/generales.service';

@Component({
  selector: 'app-dialog-banco',
  templateUrl: './dialog-banco.component.html',
  styleUrls: ['./dialog-banco.component.css']
})
export class DialogBancoComponent implements OnInit {
  //Variable para activar spinner
  spinnerActive: boolean = false;
  form: FormGroup;
  estado: string;
  tipoEstado: string[] = ['Punto en uso', 'Punto no esta en uso'];
  esGrupoAval = false;
  ciudades: any[] = [];
  nombreBTN: string;
  nombreBTNCancelar: string;
  estadoBTN: boolean;
  titulo: string;
  dataElement: any = null;
  esEdicion: boolean;
  mostrarFormulario: boolean = false;

  mosrarFormBanco = false;
  mosrarFormCliente = false;
  mosrarFormOficina = false;
  mosrarFormCajero = false;
  mosrarFormFondo = false;


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
      this.estadoBTN = true
      this.titulo = "Crear  "
      this.nombreBTNCancelar = "Cancelar"
    }
    if (this.data.flag == "info") {
      this.estadoBTN = false
      this.titulo = "Información "
      this.nombreBTNCancelar = "Cerrar"
      this.form.get('nombre').disable();
      this.form.get('ciudad').disable();
      this.form.get('codigoCompensacion').disable();
      this.form.get('identificacion').disable();
      this.form.get('abreviatura').disable();
      this.form.get('esAval').disable();
    }
    if (this.data.flag == "modif") {
      this.titulo = "Modificación "
      this.nombreBTN = "Actualizar"
      this.nombreBTNCancelar = "Cancelar"
      this.estadoBTN = true
      this.esEdicion = true;

    }
  }

  /**
   * Metodo encargado de crear un punto segun el tipo de punto
   * @BayronPerez
   */
  crearPunto() {
    this.spinnerActive = true;
    const punto = {
      //logica para obtener los campos para crear el tipo de puto segun tipo de punto
    }
    this.gestionPuntosService.crearPunto(punto).subscribe(data => {
        this.spinnerActive = false;
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_CREATE,
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
          }
        }); setTimeout(() => { alert.close() }, 3500);
      },
      (err: any) => {
        this.spinnerActive = false;
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
      'codigoCompensacion': new FormControl(param.bancos != undefined ? param != null ? param.bancos.codigoCompensacion : null : null),
      'identificacion': new FormControl(param.bancos != undefined ? param != null ? param.bancos.numeroNit : null : null),
      'abreviatura': new FormControl(param.bancos != undefined ? param != null ? param.bancos.abreviatura : null : null),
      'esAval': new FormControl(param.bancos != undefined ? param != null ? param.bancos.esAVAL : null : null),
    });
    this.mostrarFormulario = true
  }

  selectCiudad(param: any): any {
    if (param.codigoCiudad !== undefined) {
      for (let i = 0; i < this.ciudades.length; i++) {
        const element = this.ciudades[i];
        if (element.codigoDANE == param.codigoCiudad) {
          return element;
        }
      }
    }
  }

  persistir() {
    let banco = {
      tipoPunto : "BANCO",
      nombre: this.form.value['nombre'],
      ciudad: this.form.value['ciudad'],
      codigoCompensacion: this.form.value['codigoCompensacion'],
      identificacion: this.form.value['identificacion'],
      abreviatura: this.form.value['abreviatura'],
      esAval: this.form.value['esAval'],
      codigoPunto: this.esEdicion ? this.dataElement.codigoPunto : null,
    }
    this.gestionPuntosService.crearPunto(banco).subscribe(response => {
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

  }

}
