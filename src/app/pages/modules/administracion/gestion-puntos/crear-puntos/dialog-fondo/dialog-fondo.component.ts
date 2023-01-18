import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { GestionPuntosService } from 'src/app/_service/administracion-service/gestionPuntos.service';
import { GeneralesService } from 'src/app/_service/generales.service';

@Component({
  selector: 'app-dialog-fondo',
  templateUrl: './dialog-fondo.component.html',
  styleUrls: ['./dialog-fondo.component.css']
})
export class DialogFondoComponent implements OnInit {
  spinnerActive: boolean = false;
  form: FormGroup;
  estado: string;
  tipoEstado: string[] = ['Punto en uso', 'Punto no esta en uso'];
  esGrupoAval = false;
  ciudades: any[] = [];
  bancosAval: any[] = [];
  tdvs: any[] = [];
  mosrarFormBanco = false;
  mosrarFormCliente = false;
  mosrarFormOficina= false;
  mosrarFormCajero = false;
  mosrarFormFondo = false;
  nombreBTN: string;
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
    console.log("Data que llega del element")
    console.log(this.dataElement)
    this.nombreBTN = "Guardar"
    await this.datosDesplegables();
    this.estadoBTN = true
    this.initForm(this.dataElement);
    if(this.data.flag == "crear") {
      this.titulo = "Crear  "
    }
    if(this.data.flag == "info") {
      this.titulo = "Información "
      this.estadoBTN = false
      this.form.get('nombre').disable();
      this.form.get('ciudad').disable();
      this.form.get('transportadora').disable();
      this.form.get('bancoAval').disable();
      this.form.get('estado').disable();
    }
    if(this.data.flag == "modif") {
      this.titulo = "Modificación "
      this.nombreBTN = "Actualizar"
      this.esEdicion = true;
    }    
  }
  
  initForm(param?: any) {
    this.form = new FormGroup({
      'nombre': new FormControl(param != null ? param.nombrePunto:null),
      'ciudad': new FormControl(param ? this.selectCiudad(param) : null),
      'transportadora': new FormControl(param ? this.selectTransportadorasOrigen(param) : null),
      'bancoAval': new FormControl(param ? this.selectBanco(param) : null),
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

  selectTransportadorasOrigen(param: any): any {
    if(param.fondos !== undefined){
    for(let i= 0; i < this.tdvs.length; i++) {
      const element = this.tdvs[i];
      if(element.codigo == param.fondos.tdv) {
        return element;
      }
    }
  }
  }

  selectBanco(param: any): any {
    if(param.fondos !== undefined){
    for(let i= 0; i < this.bancosAval.length; i++) {
      const element = this.bancosAval[i];
      if(element.codigoPunto == param.fondos.bancoAVAL) {
        return element;
      }
    }
  }
  }
  
  persistir() {
    let fondo = {
      nombrePunto: this.form.value['nombre'],
      codigoDANE: this.form.value['ciudad'].codigoDANE,
      tdv: this.form.value['transportadora'].nombreTransportadora,
      bancoAVAL: Number(this.form.value['bancoAval'].codigoPunto),
      estado: Number(this.formatearEstadoPersistir(this.form.value['estado'])),
      codigoCompensacion: this.form.value['bancoAval'].codigoCompensacion,
      numeroNit: this.form.value['bancoAval'].numeroNit,
      abreviatura: this.form.value['bancoAval'].abreviatura,
      esAVAL: this.form.value['bancoAval'].esAVAL,
      tipoPunto: this.dataElement.valorTexto,
      codigoPunto: Number(this.form.value['bancoAval'].codigoPunto),
      refagillado: null,
      tarifaRuteo: null,
      tarifaVerificacion: null,
      codigoOficina:null,
      nombreCiudad:this.form.value['ciudad'].nombreCiudad,
      codigoCliente:null,
      codigoTDV:this.form.value['transportadora'].codigo,
      codigoPropioTDV:this.form.value['transportadora'].codigo,
      codigoATM:null,
      fajado: null,
      codigoCiudad: this.form.value['ciudad'].codigoDANE,
    }
    console.log("Data que se enviara")
    console.log(fondo)
    if (this.esEdicion) {
      //cliente.consecutivo = this.idConfEntity;
      this.gestionPuntosService.actualizarPunto(fondo).subscribe(response => {
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
      this.gestionPuntosService.crearPunto(fondo).subscribe(response => {
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
    this.ngOnInit();
  }

  async datosDesplegables() {

    const _ciudades = await this.generalServices.listarCiudades().toPromise();
    this.ciudades = _ciudades.data;
  
    const _bancos = await this.generalServices.listarBancosAval().toPromise();
    this.bancosAval = _bancos.data;

    const _transportadoras = await this.generalServices.listarTransportadoras().toPromise();
    this.tdvs = _transportadoras.data;

  }

  formatearEstadoPersistir(param: boolean): any {
    if(param==true){
      return 1
    }else {
      return 2
    }
  }

}
