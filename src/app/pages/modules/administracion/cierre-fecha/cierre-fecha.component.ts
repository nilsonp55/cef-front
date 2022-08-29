import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SpinnerComponent } from 'src/app/pages/shared/components/spinner/spinner.component';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { CierreFechaService } from 'src/app/_service/cierre-fecha.service';
import { GeneralesService } from 'src/app/_service/generales.service';

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
    private generalServices: GeneralesService,
    private dialog: MatDialog,
  ) { }

  
  ngOnInit(): void {
    this.consultaDatos();
  }

  async consultaDatos(){
    const _fecha = await this.generalServices.listarParametroByFiltro({
      codigo: "FECHA_DIA_PROCESO"
    }).toPromise();
    this.fechaSistema = _fecha.data[0].valor;
  }

  /**
   * Metodo encargado de cerrar la fecha para a gestion de programación
   * @BaironPerez
   */
  cierreFecha() {
    this.spinnerActive = true;
    this.cierreFechaService.realizarCierreFecha().subscribe(data => {
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

}
