import { Component, OnInit } from '@angular/core';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';
import { GeneralesService } from 'src/app/_service/generales.service';
import { lastValueFrom } from 'rxjs';
import { CargueProgramacionCertificadaService } from 'src/app/_service/programacion-certificada.service/programacion-certificada-service';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-procesar-alcances',
  templateUrl: './procesar-alcances.component.html'
})
export class ProcesarAlcancesComponent implements OnInit {

  //Variable para activar spinner
  spinnerActive: boolean = false;
  fechaSistemaSelect: string;

  constructor(
    private dialog: MatDialog,
    private generalServices: GeneralesService,
    private cargueProgramacionCertificadaService: CargueProgramacionCertificadaService,
  ) { }

  async ngOnInit(): Promise<void> {
    ManejoFechaToken.manejoFechaToken();
    await lastValueFrom(this.generalServices.listarParametroByFiltro({
      codigo: "FECHA_DIA_PROCESO"
    })).then((response) => {
      this.fechaSistemaSelect = response.data[0].valor;
    });
  }

  procesarAlcances() {
    this.spinnerActive = true;
    this.cargueProgramacionCertificadaService.procesarAlcances().subscribe({
      next: (response: any) => {
        this.spinnerActive = false;
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: response.data + ": " + response.response.description,
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
          }
        });
        setTimeout(() => { alert.close() }, 5000);
      },
      error: (response: any) => {
        this.spinnerActive = false;
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: response.error.response.description,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        });
        setTimeout(() => { alert.close() }, 5000);
      }
    });
  }

}
