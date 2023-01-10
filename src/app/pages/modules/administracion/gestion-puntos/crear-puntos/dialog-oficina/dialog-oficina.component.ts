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
  estadoFajado: boolean;
  estadoRefajillado: boolean;
  
  
  constructor(
    private dialog: MatDialog,
    private generalServices: GeneralesService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private gestionPuntosService: GestionPuntosService) 
    { }
  
  
    async ngOnInit(): Promise<void> {
      this.dataElement = this.data.element;
      this.nombreBTN = "Guardar"
      await this.datosDesplegables();
      this.estadoBTN = true
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
        this.form.get('codigoOficina').disable();
        this.form.get('bancoAval').disable();
        this.form.get('tarifaRuteo').disable();
        this.form.get('tariVerificacion').disable();
        this.form.get('estado').disable();
        this.form.get('fajado').disable();
      }
      if(this.data.flag == "modif") {
        this.titulo = "Modificación "
        this.nombreBTN = "Actualizar"
        this.nombreBTNCancelar = "Cancelar"
        this.estadoBTN = true
        this.esEdicion = true;
  
      }
      
    }
    
  initForm(param?: any) {debugger
    this.form = new FormGroup({
      'nombre': new FormControl(param != null ? param.nombrePunto:null),
      'ciudad': new FormControl(param ? this.selectCiudad(param) : null),
      'codigoOficina': new FormControl(param.oficinas != undefined? param != null ? param.oficinas.codigoOficina:null: null),    
      'bancoAval': new FormControl(param ? this.selectBanco(param) : null),
      'tarifaRuteo': new FormControl(param.oficinas != undefined? param != null ? param.oficinas.tarifaRuteo:null: null),
      'tariVerificacion': new FormControl(param.oficinas != undefined? param != null ? param.oficinas.tarifaVerificacion:null: null),
      'estado': new FormControl(),
      'fajado': new FormControl(param.oficinas != undefined? param != null ? param.oficinas.fajado :null: null),
    });
    this.mostrarFormulario = true
  }

  selectCiudad(param: any): any {
    if(param.codigoCiudad !== undefined){
    for(let i= 0; i < this.ciudades.length; i++) {
      const element = this.ciudades[i];
      if(element.codigoDANE == param.codigoCiudad) {
        return element;
      }
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
      nombrePunto: this.form.value['nombre'],
      codigoDANE: this.form.value['ciudad'].codigoDANE,
      codigoOficina: this.form.value['codigoOficina'],
      bancoAVAL: Number(this.form.value['bancoAval'].codigoPunto),
      tarifaRuteo: Number(this.form.value['tarifaRuteo']),
      tariVerificacion: Number(this.form.value['tariVerificacion']),
      estado: Number(this.formatearEstadoPersistir(this.form.value['estado'])),
      fajado: this.formatearEstadoFajillado(this.form.value['fajado']),
      refagillado: this.formatearEstadoFajillado(this.form.value['fajado']),
      tipoPunto: this.dataElement.valorTexto,
      nombreCiudad:this.form.value['ciudad'].nombreCiudad,
      codigoCiudad: Number(this.form.value['ciudad'].codigoDANE),
      codigoCompensacion: Number(this.form.value['bancoAval'].codigoCompensacion),
      numeroNit: this.form.value['bancoAval'].numeroNit,
      abreviatura: this.form.value['bancoAval'].abreviatura,
      esAVAL: this.form.value['bancoAval'].esAVAL,
      codigoPunto: Number(this.form.value['bancoAval'].codigoPunto),
      codigoTDV:null,
      codigoPropioTDV:null,
      tdv: null,
      tarifaVerificacion: null,
      codigoCliente:null,
      codigoATM:null, //integer
    }
    console.log("Data que se va a enviar")
    console.log(oficina)
    if (this.esEdicion) {
      //cliente.consecutivo = this.idConfEntity;
      this.gestionPuntosService.actualizarPunto(oficina).subscribe(response => {
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
    } else {debugger
      this.gestionPuntosService.crearPunto(oficina).subscribe(response => {
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

    const _bancos = await this.generalServices.listarBancosAval().toPromise();
    this.bancosAval = _bancos.data;
  
  }

  formatearEstadoPersistir(param: boolean): any {
    if(param==true){
      return 1
    }else {
      return 2
    }
  }

  formatearEstadoFajillado(param:any):boolean {
    if(param=="fajado"){
      return true;
    }else {
      return false;
    }
  }

  formatearEstadoRefajillado(param:any):boolean {
    if(param=="fajado"){
      return true;
    }else {
      return false;
    }
  }

}
