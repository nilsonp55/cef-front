import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { OpConciliacionCostosService } from 'src/app/_service/conciliacion-costos-services/op-conciliacion-costos';
import Swal from 'sweetalert2';
import { VentanaEmergenteEliminarComponent } from '../../../archivos-pendientes-carga/ventana-emergente-eliminar/ventana-emergente-eliminar.component';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';

@Component({
  selector: 'app-ventana-emergente-aceptar-rechazar',
  templateUrl: './ventana-emergente-aceptar-rechazar.component.html',
  styleUrls: ['./ventana-emergente-aceptar-rechazar.component.css']
})
export class VentanaEmergenteAceptarRechazarIdentificadasConDifComponent implements OnInit {

  observacion: any = "";

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog, private dialogRef: MatDialogRef<VentanaEmergenteEliminarComponent>,
    private opConciliacionCostosService: OpConciliacionCostosService) { }

  ngOnInit(): void {
  }

  aceptarRechazar() {
    if (this.observacion.length < 1) {
      Swal.fire({
        title: "Se requiere ingresar observaciones.",
        imageUrl: "assets/img/waring.jpg",
        imageWidth: 80,
        imageHeight: 80,
        confirmButtonText: "Aceptar",
        showConfirmButton: true,
        allowOutsideClick: false
      }).then((result) => {
        Swal.close();
      });
    } else {
      this.modalProcesoEjecucion();
      let listaEstructura: any = []
      this.data.lista.forEach(element => {
        listaEstructura.push({
          "idRegistro": element.consecutivo_registro,
          "operacionEstado": this.data.msn.toLowerCase(),
          "observacion": this.observacion,
          "idLiquidacion": element.id_liquidacion,
        });
      });
      this.opConciliacionCostosService.aceptadoRechazadoIdentificadasConDifTransporte({
        registroOperacion: listaEstructura, operacion: this.data.msn.toLowerCase(), observacion: this.observacion
      }).subscribe({
        next: (response: any) => {
          if (response.response.description === "Success") {
            let flagEstado: any = response.data.find((element) => element.operacionEstado === "NO PUDO REALIZAR LA OPERACION") 
            let accion = this.data.msn == "Aceptar" ? "aceptados" : "rechazados"
            Swal.fire({
              title: flagEstado === undefined ? "Registro(s) " + accion + " correctamente" : "Registro(s) " + accion + " correctamente.\n\n La operación solicitada no pudo completarse con algunos registros.",
              imageUrl: "assets/img/succesfull.png",
              imageWidth: 80,
              imageHeight: 80,
              confirmButtonText: "Aceptar",
              showConfirmButton: true,
              allowOutsideClick: false
            }).then((result) => {
              Swal.close();
              this.dialogRef.close(response.data);
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
  }

  modalProcesoEjecucion() {
    Swal.fire({
      title: "Proceso en ejecución",
      imageUrl: "assets/img/loading.gif",
      imageWidth: 80,
      imageHeight: 80,
      showConfirmButton: false,
      allowOutsideClick: false
    });
  }

  closeModal() {
    this.dialogRef.close("cancelar");
  }

}
