import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { GestionPuntosService } from 'src/app/_service/administracion-service/gestionPuntos.service';
import { GeneralesService } from 'src/app/_service/generales.service';

@Component({
  selector: 'app-dialog-ban-rep',
  templateUrl: './dialog-ban-rep.component.html',
  styleUrls: ['./dialog-ban-rep.component.css']
})
export class DialogBanRepComponent implements OnInit {
  spinnerActive: boolean = false;
  form: FormGroup;
  estado: string;
  tipoEstado: string[] = ['Punto en uso', 'Punto no esta en uso'];
  esGrupoAval = false;
  ciudades: any[] = [];
  mosrarFormBanco = false;
  mosrarFormCliente = false;
  mosrarFormOficina = false;
  mosrarFormCajero = false;
  mosrarFormFondo = false;


  constructor(
    private dialog: MatDialog,
    private generalServices: GeneralesService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private gestionPuntosService: GestionPuntosService) { }


  ngOnInit(): void {
    this.initForm()
    this.datosDesplegables();
    //Validar que tipo de frmulario se presentará
    if (this.data == GENERALES.TIPO_PUNTOS.BANCO) {
      this.mosrarFormBanco == true;
      this.mosrarFormCliente = false;
      this.mosrarFormOficina = false;
      this.mosrarFormCajero = false;
      this.mosrarFormFondo = false;
    }
    else if (this.data == GENERALES.TIPO_PUNTOS.CAJERO) {
      this.mosrarFormCajero = true;
      this.mosrarFormBanco == false;
      this.mosrarFormCliente = false;
      this.mosrarFormOficina = false;
      this.mosrarFormFondo = false;
    }
    else if (this.data == GENERALES.TIPO_PUNTOS.FONDO) {
      this.mosrarFormFondo = true;
      this.mosrarFormCajero = false;
      this.mosrarFormBanco == false;
      this.mosrarFormCliente = false;
      this.mosrarFormOficina = false;
    }
    else if (this.data == GENERALES.TIPO_PUNTOS.OFICINA) {
      this.mosrarFormOficina = true;
      this.mosrarFormFondo = false;
      this.mosrarFormCajero = false;
      this.mosrarFormBanco == false;
      this.mosrarFormCliente = false;
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
      'nombre': new FormControl(),
      'ciudad': new FormControl(),
      'estado': new FormControl(),
    });
  }

  persistir() {
    let bancRep = {
      nombre: this.form.value['nombre'],
      ciudad: this.form.value['ciudad'],
      estado: this.form.value['estado'],
    }
    console.log(bancRep)
  }

  async datosDesplegables() {

    const _ciudades = await this.generalServices.listarCiudades().toPromise();
    this.ciudades = _ciudades.data;

  }

}
