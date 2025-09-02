import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';
import { DominioMaestroService } from 'src/app/_service/administracion-service/dominios-maestro.service';
import Swal from 'sweetalert2';

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
  esEdicion: boolean;

  contenido: string;
  tipoContenidoList: any = [
    { value: "T", label: "Texto" },
    { value: "N", label: "Númerico" },
    { value: "F", label: "Fecha" }
  ];

  estado: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly dominioMaestroService: DominioMaestroService,
    private readonly dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogTablaDominioComponent>
  ) { }

  ngOnInit(): void {
    ManejoFechaToken.manejoFechaToken()
    this.asignandoValores()
  }

  asignandoValores() {
    if (this.data.titulo == "Crear ") {
      this.titulo = this.data.titulo;
      this.nombreBTN = "Aceptar";
      this.nombreDominio = null;
      this.descripcion = null;
      this.esEdicion = false;
    }
    if (this.data.titulo == "Actualizar ") {
      this.titulo = this.data.titulo;
      this.nombreBTN = "Aceptar";
      this.nombreDominio = this.data.data.dominio;
      this.descripcion = this.data.data.descripcion;
      this.contenido = this.data.data.tipoContenido;
      this.estado = this.data.data.estado == '1' || this.data.data.estado == true || this.data.data.estado == 'true'
      this.esEdicion = true;
    }
  }

  persistirDatos() {
    if (this.data.titulo == "Crear ") {
      this.guardarDominio()
    }
    if (this.data.titulo == "Actualizar ") {
      this.actualizarDominio()
    }
  }

  guardarDominio() {
    this.modalProcesoEjecucion();
    this.dominioMaestroService.crearDominio({
      'dominio': this.nombreDominio.toUpperCase(),
      'descripcion': this.descripcion,
      'tipoContenido': this.contenido,
      'estado': this.estado ? '1' : '0'
    }).subscribe({
      next: (page: any) => {
        Swal.close();
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_CREATE,
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL,
            showResume: true,
            msgDetalles: JSON.stringify(page?.response)
          }
        }).afterClosed()
        .subscribe(() => {
          this.dialogRef.close();
        });
      },
      error: (err: any) => {
        Swal.close();
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_CREATE,
            codigo: GENERALES.CODE_EMERGENT.ERROR,
            showResume: true,
            msgDetalles: JSON.stringify(err?.error.response)
          }
        });
      }
    });
    this.esEdicion = true;
  }

  modalProcesoEjecucion() {
    Swal.fire({
      title: "Proceso en ejecución",
      imageUrl: "assets/img/loading.gif",
      imageWidth: 80,
      imageHeight: 80,
      showConfirmButton: false,
      allowOutsideClick: false,
      customClass: { popup: "custom-alert-swal-text" }
    });
  }

  actualizarDominio() {
    this.modalProcesoEjecucion();
    this.dominioMaestroService.actualizarDominio({
      'dominio': this.nombreDominio.toUpperCase(),
      'descripcion': this.descripcion,
      'tipoContenido': this.contenido,
      'estado': this.estado ? '1' : '0'
    }).subscribe({
      next: (page: any) => {
        Swal.close();
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_UPDATE,
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL,
            showResume: true,
            msgDetalles: JSON.stringify(page?.response)
          }
        }).afterClosed()
        .subscribe(() => {
          this.dialogRef.close();
        });
      },
      error: (err: any) => {
        Swal.close();
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_UPDATE,
            codigo: GENERALES.CODE_EMERGENT.ERROR,
            showResume: true,
            msgDetalles: JSON.stringify(err?.error.response)
          }
        });
      }
    })
  }
}