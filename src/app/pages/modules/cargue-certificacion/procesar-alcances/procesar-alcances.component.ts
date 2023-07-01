import { Component, OnInit } from '@angular/core';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';
import { GeneralesService } from 'src/app/_service/generales.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-procesar-alcances',
  templateUrl: './procesar-alcances.component.html'
})
export class ProcesarAlcancesComponent implements OnInit {

  //Variable para activar spinner
  spinnerActive: boolean = false;
  fechaSistemaSelect: string;

  constructor(
    private generalServices: GeneralesService
  ) { }

  async ngOnInit(): Promise<void> {
    ManejoFechaToken.manejoFechaToken();
    await lastValueFrom(this.generalServices.listarParametroByFiltro({
      codigo: "FECHA_DIA_PROCESO"
    })).then((response) => {
      this.fechaSistemaSelect = response.data[0].valor;
    });
  }

  procesarAlcances() {}

}
