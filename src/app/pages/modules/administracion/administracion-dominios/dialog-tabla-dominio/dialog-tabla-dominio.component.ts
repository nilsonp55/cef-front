import { ThisReceiver } from '@angular/compiler';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';
import { DominioMaestroService } from 'src/app/_service/administracion-service/dominios-maestro.service';

@Component({
  selector: 'app-dialog-tabla-dominio',
  templateUrl: './dialog-tabla-dominio.component.html',
  styleUrls: ['./dialog-tabla-dominio.component.css']
})
export class DialogTablaDominioComponent implements OnInit {

  titulo: string;
  nombreBTN: string;
  nombreDominio: string = null;
  descripcion: string;

  contenido: string;
  contenidoFinal: any;
  tipoContenido: string[] = ['Texto', 'Númerico', 'Fecha'];

  estado: string;
  estadoFinal: any;
  tipoEstado: string[] = ['Dominio en uso', 'Dominio no esta en uso'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dominioMaestroService: DominioMaestroService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    ManejoFechaToken.manejoFechaToken()
    this.asignandoValores()
  }

  asignandoValores(){
    if(this.data.titulo == "Crear ") {
      this.titulo = this.data.titulo;
      this.nombreBTN = "Guardar"
      this.nombreDominio = null
      this.descripcion = null
    } 
    if(this.data.titulo == "Actualizar ") {
      this.titulo = this.data.titulo;
      this.nombreBTN = "Actualizar"
      this.nombreDominio = this.data.data.dominio;
      this.descripcion = this.data.data.descripcion;
    }
  }

  convertirTexto():string {
    if(this.contenido=="Texto"){
      this.contenidoFinal = "T"
    }
    if(this.contenido=="Númerico"){
      this.contenidoFinal = "N"
    }
    if(this.contenido=="Fecha"){
      this.contenidoFinal = "F"
    }
    return this.contenidoFinal
  }

  convertirTexto2():string {
    if(this.estado=="Dominio en uso"){
      this.estadoFinal = "true"
    }
    if(this.estado=="Dominio no esta en uso"){
      this.estadoFinal = "false"
    }
    return this.estadoFinal
  }

  persistirDatos() {
    if(this.data.titulo == "Crear "){
      this.guardarDominio()
    }
    if(this.data.titulo == "Actualizar "){
      this.actualizarDominio()
    }
  }

  guardarDominio(){
    this.dominioMaestroService.crearDominio({
      'dominio': this.nombreDominio.toUpperCase(),
      'descripcion': this.descripcion,
      'tipo_contenido': this.convertirTexto(),
      'estado': this.convertirTexto2()
    }).subscribe(response => {
      const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
        width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
        data: {
          msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_CREATE,
          codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
        }
      }); setTimeout(() => { alert.close() }, 3000);
    },
      (err: any) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: err.error.response.description,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        }); setTimeout(() => { alert.close() }, 3000);
      })
  }

  actualizarDominio(){
    this.dominioMaestroService.actualizarDominio({
      'dominio': this.nombreDominio.toUpperCase(),
      'descripcion': this.descripcion,
      'tipo_contenido': this.convertirTexto(),
      'estado': this.convertirTexto2()
    }).subscribe(response => {
      const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
        width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
        data: {
          msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_UPDATE,
          codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
        }
      }); setTimeout(() => { alert.close() }, 3000);
    },
      (err: any) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: err.error.response.description,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        }); setTimeout(() => { alert.close() }, 3000);
      })
  }

}