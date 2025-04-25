import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SpinnerComponent } from 'src/app/pages/shared/components/spinner/spinner.component';
import { DialogConfirmPoliticaComponent } from './dialog-confirm-politica/dialog-confirm-politica.component';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { GenerarPoliticaService } from 'src/app/_service/administracion-service/generar-politica.service';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';

@Component({
  selector: 'app-generar-politica-retencion',
  templateUrl: './generar-politica-retencion.component.html',
  styleUrls: ['./generar-politica-retencion.component.css']
})
export class GenerarPoliticaRetencionComponent implements OnInit {

  constructor(
    public generarPoliticaService: GenerarPoliticaService,
    public spinnerComponent: SpinnerComponent,
    private readonly dialog: MatDialog,
  ) { }

  spinnerActive: boolean = false;


  ngOnInit(): void {
    ManejoFechaToken.manejoFechaToken();
  }

  generarPolitica() {
    //ventana de confirmacion
    const validarPolitica = this.dialog.open(DialogConfirmPoliticaComponent, {
      width: '750px',
    });
    validarPolitica.afterClosed().subscribe(result => {
      //Si presiona click en aceptar
      if (result.data.check) {
        this.spinnerActive = true;
        this.generarPoliticaService.generarPolitica().subscribe(data => {
          this.spinnerActive = false;
          const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
            width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
            data: {
              msn: GENERALES.MESSAGE_ALERT.MESSAGE_POLITICA_RETENCION.SUCCESFULL_POLITICA_RETENCION,
              codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
            }
          }); setTimeout(() => { alert.close() }, 3500);
        },
          (err: any) => {
            this.spinnerActive = false;
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
