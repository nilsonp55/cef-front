import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { OpConciliacionCostosService } from 'src/app/_service/conciliacion-costos-services/op-conciliacion-costos';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ventana-emergente-eliminar',
  templateUrl: './ventana-emergente-eliminar.component.html',
})
export class VentanaEmergenteEliminarComponent implements OnInit {
  observacion: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private readonly dialog: MatDialog, 
    private readonly dialogRef: MatDialogRef<VentanaEmergenteEliminarComponent>,
    private readonly opConciliacionCostosService: OpConciliacionCostosService) { }

  ngOnInit(): void {
  }


  eliminarArchivo() {
    this.modalProcesoEjecucion();
    this.data.msn.forEach(element => {
      element.observacion = this.observacion
      element.estado = "ELIMINADO"
    });
    this.opConciliacionCostosService.eliminarArchivo({
      validacionArchivo: this.data.msn
    }).subscribe({
      next: (response: any) => {
        if (response.response.description === "Success") {
          Swal.fire({
            title: "Archivo(s) eliminados correctamente",
            imageUrl: "assets/img/succesfull.png",
            imageWidth: 80,
            imageHeight: 80,
            confirmButtonText: "Aceptar",
            showConfirmButton: true,
            allowOutsideClick: false
          }).then((result) => {
            Swal.close();
            this.dialogRef.close(response.data.validacionArchivo);
          });
        }
      }, error: (err: any) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: "err.error.response.description",
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        });
        setTimeout(() => { alert.close() }, 3000);
        Swal.close();
      }
    })
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

  closeModal() {
    this.dialogRef.close("cancelar");
  }
}
