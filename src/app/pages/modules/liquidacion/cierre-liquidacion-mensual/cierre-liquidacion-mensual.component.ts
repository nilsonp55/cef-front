import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { GenerarContabilidadService } from 'src/app/_service/contabilidad-service/generar-contabilidad.service';
import { LiquidacionMensualService } from 'src/app/_service/liquidacion-service/liquidacion-mensual.service';
import { GeneralesService } from 'src/app/_service/generales.service';

@Component({
  selector: 'app-cierre-liquidacion-mensual',
  templateUrl: './cierre-liquidacion-mensual.component.html',
  styleUrls: ['./cierre-liquidacion-mensual.component.css']
})

/**
 * Componente para gestionar el componente de cierre liquidacion mensual
 * @BaironPerez
*/
export class CierreLiquidacionMensualComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  //Rgistros paginados
  cantidadRegistros: number;

  //Variable para activar spinner
  spinnerActive: boolean = false;

  dataGenerateContabilidad: any;
  fechaSistemaSelect: any;
  tieneErrores: any = false;

  constructor(
    private dialog: MatDialog,
    private generalServices: GeneralesService,
    private liquidacionMensualService: LiquidacionMensualService,
  ) { }

  ngOnInit(): void {
    this.cargarDatosDesplegables();
  }

  /**
 * Se cargan datos para el inicio de la pantalla
 * @BaironPerez
 */
async cargarDatosDesplegables() {
  const _fecha = await this.generalServices.listarParametroByFiltro({
    codigo: "FECHA_DIA_PROCESO"
  }).toPromise();
  this.fechaSistemaSelect = _fecha.data[0].valor;
}

  /**
  * Se realiza consumo de servicio para generar la contabilidad AM
  * @BaironPerez
  */
  generarCierreLiquidacionMensual() {
    this.spinnerActive = true;
    this.liquidacionMensualService.cerrarLiquidacionMensal().subscribe((data: any) => {
      this.spinnerActive = false;
      const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
        width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
        data: {
          msn: "Se realizo el cierre de liquidacion mensual exitosamente",
          codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
        }
      }); setTimeout(() => { alert.close() }, 3000);
    },
      (err: any) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: err.error.response.description,
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        }); setTimeout(() => { alert.close() }, 3000);
      });
  }

}
