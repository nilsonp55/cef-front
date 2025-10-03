import { Component } from "@angular/core";
import { CentroCiudadBaseComponent } from "../centro-ciudad-base/centro-ciudad-base.component";
import { CentrosCiudadService } from "src/app/_service/administracion-service/centros-ciudad.service";
import { GeneralesService } from "src/app/_service/generales.service";
import { MatDialog } from "@angular/material/dialog";
import { SpinnerComponent } from "src/app/pages/shared/components/spinner/spinner.component";

@Component({
    selector: 'app-centro-ciudad-principal',
    templateUrl: './centro-ciudad-principal.component.html',
    styleUrls: ['./centro-ciudad-principal.component.css']
})
export class CentroCiudadPrincipalComponent extends CentroCiudadBaseComponent {

    constructor(
        centroCiudadesService: CentrosCiudadService,
        generalServices: GeneralesService,
        dialog: MatDialog,
        spinnerComponent: SpinnerComponent
    ) {
        super(centroCiudadesService, generalServices, dialog, spinnerComponent);
        this.tipoCentroCiudad = 'Principal';
    }
}