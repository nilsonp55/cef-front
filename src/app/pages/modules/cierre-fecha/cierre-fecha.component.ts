import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CierreFechaService } from 'src/app/_service/cierre-fecha.service';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { VentanaEmergenteResponseComponent } from '../../shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from '../../shared/constantes';

@Component({
  selector: 'app-cierre-fecha',
  templateUrl: './cierre-fecha.component.html',
  styleUrls: ['./cierre-fecha.component.css']
})
export class CierreFechaComponent implements OnInit {

  //Variable para activar spinner
  spinnerActive: boolean = false;

  selected: Date | null;

  constructor(
    public cierreFechaService: CierreFechaService,
    public spinnerComponent: SpinnerComponent,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
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
          codigo : GENERALES.CODE_EMERGENT.SUCCESFULL
        }
      }); setTimeout(() => { alert.close() }, 3500);
    });
  }
}
