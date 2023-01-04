import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { GestionPuntosService } from 'src/app/_service/administracion-service/gestionPuntos.service';
import { GeneralesService } from 'src/app/_service/generales.service';

@Component({
  selector: 'app-dialog-oficina',
  templateUrl: './dialog-oficina.component.html',
  styleUrls: ['./dialog-oficina.component.css']
})
export class DialogOficinaComponent implements OnInit {
  spinnerActive: boolean = false;
  form: FormGroup;
  estado: string;
  tipoEstado: string[] = ['Punto en uso', 'Punto no esta en uso'];
  esGrupoAval = false;
  ciudades: any[] = [];
  bancosAval: any[] = [];
  mosrarFormBanco = false;
  mosrarFormCliente = false;
  mosrarFormOficina= false;
  mosrarFormCajero = false;
  mosrarFormFondo = false;
  labelPosition: 'Refajillado' | 'fajado' = 'fajado';
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
    private gestionPuntosService: GestionPuntosService) 
    { }
  
  
    async ngOnInit(): Promise<void> {
      this.dataElement = this.data.element;
      console.log(this.dataElement)
      this.nombreBTN = "Guardar"
      if(this.data.flag == "crear") {
        this.estadoBTN = true
        this.titulo = "Crear  "
        this.nombreBTNCancelar = "Cancelar"
      }
      if(this.data.flag == "info") {
        this.estadoBTN = false
        this.titulo = "Información "
        this.nombreBTNCancelar = "Cerrar"
      }
      if(this.data.flag == "modif") {
        this.titulo = "Modificación "
        this.nombreBTN = "Actualizar"
        this.nombreBTNCancelar = "Cancelar"
        this.estadoBTN = true
        this.esEdicion = true;
  
      }
      await this.datosDesplegables();
      this.initForm(this.dataElement);
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
  
  initForm(param?: any) {debugger
    this.form = new FormGroup({
      'nombre': new FormControl(param != null ? param.nombrePunto:null),
      'ciudad': new FormControl(param ? this.selectCiudad(param) : null),
      'codigoOficina': new FormControl(param != null ? param.oficinas.codigoOficina:null),
      'bancoAval': new FormControl(param ? this.selectBanco(param) : null),
      'tarifaRuteo': new FormControl(param != null ? param.oficinas.tarifaRuteo:null),
      'tariVerificacion': new FormControl(param != null ? param.oficinas.tarifaVerificacion:null),
      'estado': new FormControl(),
      'fajado': new FormControl(param != null ? param.oficinas.fajado :null),
    });
    this.mostrarFormulario = true
  }

  selectCiudad(param: any): any {
    for(let i= 0; i < this.ciudades.length; i++) {
      const element = this.ciudades[i];
      if(element.codigoDANE == param.codigoCiudad) {
        return element;
      }
    }
  }

  selectBanco(param: any): any {debugger
    for(let i= 0; i < this.bancosAval.length; i++) {
      const element = this.bancosAval[i];
      if(element.codigoPunto == param.codigoPunto) {
        return element;
      }
    }
  }

  persistir() {
    let oficina = {
      nombre: this.form.value['nombre'],
      ciudad: this.form.value['ciudad'],
      codigoOficina: this.form.value['codigoOficina'],
      bancoAval: this.form.value['bancoAval'],
      tarifaRuteo: this.form.value['tarifaRuteo'],
      tariVerificacion: this.form.value['tariVerificacion'],
      estado: this.form.value['estado'],
      fajado: this.form.value['fajado'],
    }
    console.log(oficina)
  }

  async datosDesplegables() {

    const _ciudades = await this.generalServices.listarCiudades().toPromise();
    this.ciudades = _ciudades.data;

    const _bancos = await this.generalServices.listarBancosAval().toPromise();
    this.bancosAval = _bancos.data;
  
  }

}
