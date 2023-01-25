import { ThisReceiver } from '@angular/compiler';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';
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
  nombreBTN: string;
  nombreBTNCancelar: string;
  estadoBTN: boolean;
  titulo: string;
  dataElement: any = null;
  esEdicion: boolean;
  mostrarFormulario: boolean = false;
  estadoDisable: boolean;


  constructor(
    private dialog: MatDialog,
    private generalServices: GeneralesService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private gestionPuntosService: GestionPuntosService) { }


    async ngOnInit(): Promise<void> {
      ManejoFechaToken.manejoFechaToken()
      this.dataElement = this.data.element;
      this.nombreBTN = "Guardar"
      this.estadoDisable = true
      
      await this.datosDesplegables();
      this.initForm(this.dataElement);
      if(this.data.flag == "crear") {
        this.estadoBTN = true
        this.titulo = "Crear  "
        this.nombreBTNCancelar = "Cancelar"
      }
      if(this.data.flag == "info") {
        this.estadoBTN = false
        this.titulo = "Información "
        this.nombreBTNCancelar = "Cerrar"
        this.form.get('nombre').disable();
        this.form.get('ciudad').disable();
        this.form.get('estado').disable();
      }
      if(this.data.flag == "modif") {
        this.titulo = "Modificación "
        this.nombreBTN = "Actualizar"
        this.nombreBTNCancelar = "Cancelar"
        this.estadoBTN = true
        this.esEdicion = true;
  
      }
    }

  initForm(param?: any) {
    this.form = new FormGroup({
      'nombre': new FormControl(param != null ? param.nombrePunto:null),
      'ciudad': new FormControl(param ? this.selectCiudad(param) : null),
      'estado': new FormControl(),
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

  persistir() {
    let bancRep = {
      nombrePunto: this.form.value['nombre'],
      codigoCiudad: this.form.value['ciudad'].codigoDANE,
      codigoDANE: this.form.value['ciudad'].codigoDANE,
      estado: Number(this.formatearEstadoPersistir(this.form.value['estado'])),
      tipoPunto: this.dataElement.valorTexto,
      codigoPunto: null,
      fajado: null,
      refagillado: null,
      tarifaRuteo:null,
      tarifaVerificacion:null,
      bancoAVAL:null,
      codigoCompensacion:null,
      numeroNit:null,
      abreviatura:null,
      esAVAL:null,
      codigoOficina:null,
      nombreCiudad:this.form.value['ciudad'].nombreCiudad,
      codigoCliente:null,
      codigoTDV:null,
      codigoPropioTDV:null,
      tdv:null,
      nombreFondo:null,
      codigoATM:null,
    }
    console.log("Data que se va a enviar")
    console.log(bancRep)
    if (this.esEdicion) {
      //cliente.consecutivo = this.idConfEntity;
      this.gestionPuntosService.actualizarPunto(bancRep).subscribe(response => {
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
    } else {
      this.gestionPuntosService.crearPunto(bancRep).subscribe(response => {
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
    }
  }

  async datosDesplegables() {

    const _ciudades = await this.generalServices.listarCiudades().toPromise();
    this.ciudades = _ciudades.data;

  }

  formatearEstadoPersistir(param: boolean): any {
    if(param==true){
      return 1
    }else {
      return 2
    }
  }

}
