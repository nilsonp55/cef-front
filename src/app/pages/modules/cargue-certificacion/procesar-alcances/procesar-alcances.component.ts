import { Component, OnInit } from '@angular/core';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';
import { GeneralesService } from 'src/app/_service/generales.service';
import { lastValueFrom } from 'rxjs';
import { CargueProgramacionCertificadaService } from 'src/app/_service/programacion-certificada.service/programacion-certificada-service';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-procesar-alcances',
  templateUrl: './procesar-alcances.component.html'
})
export class ProcesarAlcancesComponent implements OnInit {

  fechaSistemaSelect: string;

  constructor(
    private readonly dialog: MatDialog,
    private readonly generalServices: GeneralesService,
    private readonly cargueProgramacionCertificadaService: CargueProgramacionCertificadaService,
  ) { }

  async ngOnInit(): Promise<void> {
    ManejoFechaToken.manejoFechaToken();
    await lastValueFrom(this.generalServices.listarParametroByFiltro({
      codigo: "FECHA_DIA_PROCESO"
    })).then((response) => {
      this.fechaSistemaSelect = response.data[0].valor;
    });
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

  procesarAlcances() {
    this.modalProcesoEjecucion()
    this.cargueProgramacionCertificadaService.procesarAlcances().subscribe({
      next: (response: any) => {
        Swal.close()
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: response.data + ": " + response.response.description,
            codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
          }
        });
      },
      error: (response: any) => {
        Swal.close();
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: response.error.response.description,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        });
      }
    });
  }

}
