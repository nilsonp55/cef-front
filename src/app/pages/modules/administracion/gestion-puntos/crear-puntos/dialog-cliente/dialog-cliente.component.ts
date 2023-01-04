import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
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
  mosrarFormOficina= false;
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
    private gestionPuntosService: GestionPuntosService) 
    { }
  
  
  async ngOnInit(): Promise<void> {debugger
    //Validar que tipo de frmulario se presentará
    this.dataElement = this.data.element;
    this.nombreBTN = "Guardar"
    if(this.data.flag == "crear") {
      this.titulo = "Crear  "
    }
    if(this.data.flag == "info") {
      this.titulo = "Información "
      this.estadoBTN = false
      this.isDisable = false
    }
    if(this.data.flag == "modif") {
      this.titulo = "Modificación "
      this.nombreBTN = "Actualizar"
      this.esEdicion = true;

    }
    await this.datosDesplegables();
    this.estadoBTN = true
    
    


    /*if(this.data == GENERALES.TIPO_PUNTOS.BANCO) {
      this.mosrarFormBanco == true;
      this.mosrarFormCliente = false;
      this.mosrarFormOficina= false;
      this.mosrarFormCajero = false;
      this.mosrarFormFondo= false;
    }
    else if(this.data == GENERALES.TIPO_PUNTOS.CAJERO) {
      this.mosrarFormCajero = true;
      this.mosrarFormBanco == false;
      this.mosrarFormCliente = false;
      this.mosrarFormOficina= false;
      this.mosrarFormFondo= false;
    }
    else if(this.data == GENERALES.TIPO_PUNTOS.FONDO) {
      this.mosrarFormFondo= true;
      this.mosrarFormCajero = false;
      this.mosrarFormBanco == false;
      this.mosrarFormCliente = false;
      this.mosrarFormOficina= false;
    }
    else if(this.data.tipoPunto == GENERALES.TIPO_PUNTOS.OFICINA) {
      this.mosrarFormOficina= true;
      this.mosrarFormFondo= false;
      this.mosrarFormCajero = false;
      this.mosrarFormBanco == false;
      this.mosrarFormCliente = false;
    }*/
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

  initForm(param?: any) {
    this.form = new FormGroup({
      'nombre': new FormControl(param != null ? param.nombrePunto:null),
      'ciudad': new FormControl(param ? this.selectCiudad(param) : null),
      'cliente': new FormControl(param ? this.selectCliente(param) : null),
      'estado': new FormControl(param != null ? param.estado:null),
      'fajado': new FormControl(param != null ? param.fajado:null),
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
  selectCliente(param: any): any {
    for(let i= 0; i < this.clientes.length; i++) {
      const element = this.clientes[i];
      if(element.codigoCliente == param.sitiosClientes.codigoCliente) {
        return element;
      }
    }
  }
  
  persistir() {
    let cliente = {
      nombre: this.form.value['nombre'],
      ciudad: this.form.value['ciudad'],
      cliente: this.form.value['cliente'],
      estado: this.form.value['estado'],
      fajado: this.form.value['fajado'],
    }
    console.log(cliente)
    if (this.esEdicion) {
      //cliente.consecutivo = this.idConfEntity;
      this.gestionPuntosService.actualizarPunto(cliente).subscribe(response => {
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
      this.gestionPuntosService.crearPunto(cliente).subscribe(response => {
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

    const _clientes = await this.generalServices.listarClientes().toPromise();
    this.clientes = _clientes.data;
  
  }
}
