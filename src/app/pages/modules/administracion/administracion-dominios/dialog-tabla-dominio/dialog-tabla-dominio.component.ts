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
  tipoContenidoList: any = [
    { value: "T", label: "Texto" }, 
    { value: "N", label: "Númerico" }, 
    { value: "F", label: "Fecha" }
  ];

  estado: string;
  tipoEstadoList: any = [
    {value: "true", label: "Dominio en uso"}, 
    {value: "false", label: "Dominio no esta en uso"}
  ];

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
      this.contenido = this.data.data.tipoContenido;
      this.estado = this.data.data.estado;
    }
  }

  persistirDatos() {
    if(this.data.titulo == "Crear "){
      this.guardarDominio()
    }
    if(this.data.titulo == "Actualizar "){
      this.actualizarDominio()
    }
  }

  guardarDominio() {
    this.dominioMaestroService.crearDominio({
      'dominio': this.nombreDominio.toUpperCase(),
      'descripcion': this.descripcion,
      'tipoContenido': this.contenido,
      'estado': this.estado
    }).subscribe({
      next: (page: any) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_CREATE + " - " + page.response?.description,
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
          }
        });
      },
      error: (err: any) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_CREATE + " - " + err.error?.response?.description,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        });
      }
    })
  }

  actualizarDominio() {
    this.dominioMaestroService.actualizarDominio({
      'dominio': this.nombreDominio.toUpperCase(),
      'descripcion': this.descripcion,
      'tipoContenido': this.contenido,
      'estado': this.estado
    }).subscribe({
      next: (page: any) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_UPDATE + " - " + page.response?.description,
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
          }
        });
      },
      error: (err: any) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_UPDATE + " - " + err.error?.response?.description,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        });
      }
    })
  }

}