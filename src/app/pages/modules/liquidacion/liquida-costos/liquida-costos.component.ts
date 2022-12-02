import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { GeneralesService } from 'src/app/_service/generales.service';
import { ErroresCostosService } from 'src/app/_service/liquidacion-service/errores-costos.serfvice';
import { LiquidarCostosService } from 'src/app/_service/liquidacion-service/liquidar-costos.service';
import { ErroresCostosComponent } from './errores-costos/errores-costos.component';
import { ResultadoValoresLiquidadosComponent } from './resultado-valores-liquidados/resultado-valores-liquidados.component';

@Component({
  selector: 'app-liquida-costos',
  templateUrl: './liquida-costos.component.html',
  styleUrls: ['./liquida-costos.component.css']
})
export class LiquidaCostosComponent implements OnInit {

//Rgistros paginados
cantidadRegistros: number;

@ViewChild(MatPaginator) paginator: MatPaginator;
@ViewChild(MatSort) sort: MatSort;

//Variable para activar spinner
spinnerActive: boolean = false;

//DataSource para pintar tabla de los procesos a ejecutar
dataSourceInfoProcesos: MatTableDataSource<any>;
displayedColumnsInfoProcesos: string[] = ['subactividad', 'cantidad', 'estado'];

dataLiquidacionCosots: any;
fechaSistemaSelect: any;
tieneErrores: any = false;

constructor(
  private dialog: MatDialog,
  private liquidarCostosService: LiquidarCostosService,
  private erroresCostosService: ErroresCostosService,
  private generalServices: GeneralesService,
) { }

ngOnInit(): void {
  this.cargarDatosDesplegables();
  this.generarLiquidacionCostos();
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
generarLiquidacionCostos() {debugger
  this.spinnerActive = true;
  this.liquidarCostosService.liquidarCosots().subscribe((data: any) => {
    this.dataLiquidacionCosots = data.data;
    //Se construye tabla de info
    const tabla = [
      { nombre: "Cantidad operaciones liquidadas", cantidad: this.dataLiquidacionCosots.cantidadOperacionesLiquidadas, estado: true },
      { nombre: "Registros con error", cantidad: this.dataLiquidacionCosots.registrosConError, estado: true },
      
    ];
    //Se realizan validaciones
    this.tieneErrores = false;//conteoContabilidadDto.conteoContabilidadDto.conteoErroresContables > 0 ? true : false;
    this.dataSourceInfoProcesos = new MatTableDataSource(tabla);
    this.spinnerActive = false;
  },
    (err: any) => {
      const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
        width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
        data: {
          msn: err.error.response.description,
          codigo: GENERALES.CODE_EMERGENT.ERROR
        }
      }); setTimeout(() => { alert.close() }, 10000);
    });
}


/**
 * Metodo encargado de ejecutar la vista de la tabla de transacciones 
 * contables
 * @BaironPerez
 */
verValoresLiquidados() {
  const respuesta = this.dialog.open(ResultadoValoresLiquidadosComponent, {
    width: '100%',
    data: {
      respuesta: this.dataLiquidacionCosots.respuestaLiquidarCostos,
      titulo: "Valores Liquidados",
    }
  });
}

/**
* Metodo encargado de ejecutar la vista de la tabla de transacciones 
* contables
* @BaironPerez
*/
verErrores() {
  this.erroresCostosService.erroresCostos({
    'idSeqGrupo':this.dataLiquidacionCosots.respuestaLiquidarCostos[0].idSeqGrupo,
  }).subscribe((data: any) => {    
    this.spinnerActive = false;
    const respuesta = this.dialog.open(ErroresCostosComponent, {
      width: '100%',
      data: {
        respuesta: data.data,
        titulo: "Errores liquidados",
      }
    });

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
