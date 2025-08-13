import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SpinnerComponent } from 'src/app/pages/shared/components/spinner/spinner.component';
import { DialogConfirmPoliticaComponent } from './dialog-confirm-politica/dialog-confirm-politica.component';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { GenerarPoliticaService } from 'src/app/_service/administracion-service/generar-politica.service';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-generar-politica-retencion',
  templateUrl: './generar-politica-retencion.component.html'
})
export class GenerarPoliticaRetencionComponent implements OnInit {

  constructor(
    public generarPoliticaService: GenerarPoliticaService,
    public spinnerComponent: SpinnerComponent,
    private readonly dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    ManejoFechaToken.manejoFechaToken();
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

  generarPolitica() {
    //ventana de confirmacion
    const validarPolitica = this.dialog.open(DialogConfirmPoliticaComponent, {
      width: '750px',
    });
    validarPolitica.afterClosed().subscribe(result => {
      //Si presiona click en aceptar
      if (result.data.check) {
        this.modalProcesoEjecucion();
        this.generarPoliticaService.generarPolitica().subscribe(data => {
          Swal.close();
          const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
            width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
            data: {
              msn: GENERALES.MESSAGE_ALERT.MESSAGE_POLITICA_RETENCION.SUCCESFULL_POLITICA_RETENCION,
              codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
            }
          }); setTimeout(() => { alert.close() }, 3500);
        },
          (err: any) => {
            Swal.close();
            const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
              width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
              data: {
                msn: err.error.response.description,
                codigo: GENERALES.CODE_EMERGENT.ERROR
              }
            }); setTimeout(() => { alert.close() }, 6000);
          });
      }
    })
  }

}
