import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { VentanaEmergenteEliminarComponent } from '../../../archivos-pendientes-carga/ventana-emergente-eliminar/ventana-emergente-eliminar.component';
import { OpConciliacionCostosService } from 'src/app/_service/conciliacion-costos-services/op-conciliacion-costos';
import Swal from 'sweetalert2';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';

@Component({
  selector: 'app-ventana-emergente-desconciliar',
  templateUrl: './ventana-emergente-desconciliar.component.html',
  styleUrls: ['./ventana-emergente-desconciliar.component.css']
})
export class VentanaEmergenteDesconciliarComponent implements OnInit {
  observacion: any = "";
  btnAceptar: boolean = true;
  flagEstadoAutomatico: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog, private dialogRef: MatDialogRef<VentanaEmergenteEliminarComponent>,
    private opConciliacionCostosService: OpConciliacionCostosService) { }

  ngOnInit(): void {
  }


  desconciliar() {
    if (this.observacion.length < 1) {
      Swal.fire({
        title: "Se requiere ingresar observaciones.",
        imageUrl: "assets/img/waring.jpg",
        imageWidth: 80,
        imageHeight: 80,
        confirmButtonText: "Aceptar",
        showConfirmButton: true,
        allowOutsideClick: false,
        customClass: { popup: "custom-alert-swal-text" }
      }).then((result) => {
        Swal.close();
      });
    } else {
      this.modalProcesoEjecucion();
      let listaEstructura: any = []
      this.data.msn.forEach((element, i) => {
        listaEstructura.push({
          "idRegistro": element.consecutivo_registro,
          "operacionEstado": "desconciliar",
          "observacion": this.observacion
        });
      });
      this.flagEstadoAutomatico = this.data.msn.find((element) => element.estado === "AUTOMATICO") 
      this.opConciliacionCostosService.desconciliarConciliadasTransporte({
        registroOperacion: listaEstructura, operacion: "desconciliar", observacion: this.observacion
      }).subscribe({
        next: (response: any) => {
          if (response.response.description === "Success") {
            Swal.fire({
              title: this.flagEstadoAutomatico === undefined ?  "Registro(s) desconciliados correctamente. " : "Registro(s) desconciliados correctamente.\n\n Los registros seleccionados en estado de conciliación automático no han sido procesados.",
              imageUrl: "assets/img/succesfull.png",
              imageWidth: 80,
              imageHeight: 80,
              confirmButtonText: "Aceptar",
              showConfirmButton: true,
              allowOutsideClick: false,
              customClass: { popup: "custom-alert-swal-text" }
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
      allowOutsideClick: false,
      customClass: { popup: "custom-alert-swal-text" }
    });
  }

  closeModal() {
    this.dialogRef.close("cancelar");
  }

}
