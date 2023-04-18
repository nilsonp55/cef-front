import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SpinnerComponent } from 'src/app/pages/shared/components/spinner/spinner.component';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { CierreFechaService } from 'src/app/_service/cierre-fecha.service';
import { GeneralesService } from 'src/app/_service/generales.service';
import { DesencriptarLlavesService } from 'src/app/_service/administracion-service/generar-llaves.service';
import { DialogConfirmEjecutarComponentComponent } from '../../contabilizacion/dialog-confirm-ejecutar-component/dialog-confirm-ejecutar-component.component';
import { DialogConfirmLlavesComponent } from './dialog-confirm-llaves/dialog-confirm-llaves.component';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';

@Component({
  selector: 'app-generar-llave-archivos',
  templateUrl: './generar-llave-archivos.component.html',
  styleUrls: ['./generar-llave-archivos.component.css']
})
export class GenerarLlaveArchivosComponent implements OnInit {

  //Variable para activar spinner
  spinnerActive: boolean = false;
  fechaSistema: any = "19/AGO/2022";
  selected: Date | null;

  constructor(
    public desencriptarLlavesService: DesencriptarLlavesService,
    public spinnerComponent: SpinnerComponent,
    private generalServices: GeneralesService,
    private dialog: MatDialog,
  ) { }


  ngOnInit(): void {
    ManejoFechaToken.manejoFechaToken()
    this.consultaDatos();
  }

  async consultaDatos() {
    const _fecha = await this.generalServices.listarParametroByFiltro({
      codigo: "FECHA_DIA_PROCESO"
    }).toPromise();
    this.fechaSistema = _fecha.data[0].valor;
  }

  /**
   * Metodo encargado de cerrar la fecha para a gestion de programación
   * @BaironPerez
   */
  generarLlave() {
    //ventana de confirmacion
    const validateArchivo = this.dialog.open(DialogConfirmLlavesComponent, {
      width: '750px',
    });
    validateArchivo.afterClosed().subscribe(result => {
      //Si presiona click en aceptar
      if (result.data.check) {
        this.spinnerActive = true;
        this.desencriptarLlavesService.generarLlaves().subscribe(data => {
          this.spinnerActive = false;
          const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
            width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
            data: {
              msn: GENERALES.MESSAGE_ALERT.MESSAGE_CIERRE_FECHA.SUCCESFULL_CIERRE_FECHA,
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