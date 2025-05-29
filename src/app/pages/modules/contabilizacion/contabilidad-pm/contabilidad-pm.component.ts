import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CierreContabilidadService } from 'src/app/_service/contabilidad-service/cierre-contabilidad.service';
import { LogProcesoDiarioService } from 'src/app/_service/contabilidad-service/log-proceso-diario.service';
import { GeneralesService } from 'src/app/_service/generales.service';
import { GenerarArchivoService } from 'src/app/_service/contabilidad-service/generar-archivo.service';
import { ContabilidadBaseComponent } from '../contabilidad-base/contabilidad-base.component';

@Component({
  selector: 'app-contabilidad-pm',
  templateUrl: './contabilidad-pm.component.html',
  styleUrls: ['./contabilidad-pm.component.css'],
})

/**
 * Componente para gestionar el menu de contabilidad PM
 * @BaironPerez
 */
export class ContabilidadPmComponent extends ContabilidadBaseComponent {
  constructor(
    dialog: MatDialog,
    generalServices: GeneralesService,
    cierreContabilidadService: CierreContabilidadService,
    logProcesoDiarioService: LogProcesoDiarioService,
    generarArchivoService: GenerarArchivoService
  ) {
    super(
      dialog,
      generalServices,
      cierreContabilidadService,
      logProcesoDiarioService,
      generarArchivoService
    );
    this.tipoContabilidad = 'PM';
  }
}
