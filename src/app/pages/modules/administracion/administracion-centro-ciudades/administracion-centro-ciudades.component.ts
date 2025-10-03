import { Component } from '@angular/core';
import { CentroCiudadBaseComponent } from '../centro-ciudad-base/centro-ciudad-base.component';
import { CentrosCiudadService } from 'src/app/_service/administracion-service/centros-ciudad.service';
import { GeneralesService } from 'src/app/_service/generales.service';
import { MatDialog } from '@angular/material/dialog';
import { SpinnerComponent } from 'src/app/pages/shared/components/spinner/spinner.component';

@Component({
  selector: 'app-administracion-centro-ciudades',
  templateUrl: './administracion-centro-ciudades.component.html',
  styleUrls: ['./administracion-centro-ciudades.component.css']
})
export class AdministracionCentroCiudadesComponent extends CentroCiudadBaseComponent {

  constructor(
    centroCiudadesService: CentrosCiudadService,
    generalServices: GeneralesService,
    dialog: MatDialog,
    spinnerComponent: SpinnerComponent
  ) {
    super(centroCiudadesService, generalServices, dialog, spinnerComponent);
    this.tipoCentroCiudad = '';
  }

}
