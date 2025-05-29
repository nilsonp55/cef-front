import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SpinnerComponent } from 'src/app/pages/shared/components/spinner/spinner.component';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';
import { CierreFechaService } from 'src/app/_service/cierre-fecha.service';
import { GeneralesService } from 'src/app/_service/generales.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-cierre-fecha',
  templateUrl: './cierre-fecha.component.html',
  styleUrls: ['./cierre-fecha.component.css']
})
export class CierreFechaComponent implements OnInit {

  //Variable para activar spinner
  spinnerActive: boolean = false;
  fechaSistema: any = "19/AGO/2022";
  selected: Date | null;

  constructor(
    public cierreFechaService: CierreFechaService,
    public spinnerComponent: SpinnerComponent,
    private readonly generalServices: GeneralesService,
    private readonly dialog: MatDialog,
  ) { }


  ngOnInit(): void {
    ManejoFechaToken.manejoFechaToken()
    this.consultaDatos();
  }

  async consultaDatos(){
    this.spinnerActive = true;
    await lastValueFrom(this.generalServices.listarParametroByFiltro({
      codigo: "FECHA_DIA_PROCESO"
    })).then((response) => {
      this.fechaSistema = response.data[0].valor;
      this.spinnerActive = false;
    });
  }

  /**
   * Metodo encargado de cerrar la fecha para a gestion de programación
   * @BaironPerez
   */
  cierreFecha() {
    this.spinnerActive = true;
    this.cierreFechaService.realizarCierreFecha().subscribe({
      next: (data) => {
        this.consultaDatos();
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CIERRE_FECHA.SUCCESFULL_CIERRE_FECHA,
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
          }
        });
        this.spinnerActive = false;
      },
      error: (err: any) => {
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: err.error.response.description,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        });
        this.spinnerActive = false;
      }
    });
  }

}
