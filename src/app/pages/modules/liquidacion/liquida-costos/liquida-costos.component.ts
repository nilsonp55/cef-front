import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';
import { GeneralesService } from 'src/app/_service/generales.service';
import { ErroresCostosService } from 'src/app/_service/liquidacion-service/errores-costos.serfvice';
import { LiquidarCostosService } from 'src/app/_service/liquidacion-service/liquidar-costos.service';
import { ErroresCostosComponent } from './errores-costos/errores-costos.component';
import { ResultadoValoresLiquidadosComponent } from './resultado-valores-liquidados/resultado-valores-liquidados.component';
import { ValidacionEstadoProcesosService } from 'src/app/_service/valida-estado-proceso.service';

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
estadoTabla: boolean;
estadoBTN: boolean;
idInterval: any;
//DataSource para pintar tabla de los procesos a ejecutar
dataSourceInfoProcesos: MatTableDataSource<any>;
displayedColumnsInfoProcesos: string[] = ['subactividad', 'cantidad', 'estado'];

dataLiquidacionCosots: any;
fechaSistemaSelect: string;
tieneErrores: any = false;

constructor(
  private dialog: MatDialog,
  private liquidarCostosService: LiquidarCostosService,
  private erroresCostosService: ErroresCostosService,
  private validacionEstadoProcesosService: ValidacionEstadoProcesosService,
  private generalServices: GeneralesService,
) { }

ngOnInit(): void {
  ManejoFechaToken.manejoFechaToken()
  this.estadoTabla = false;
  this.estadoBTN = true;
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

intervalGeneralContabilidad() {
  this.spinnerActive = true;
  this.generarLiquidacionCostos();
  this.idInterval = setInterval(() => {
    this.validacionEstadoProceso()      
  }, 3000);
}

/**
 * Metodo encargado de validar el estado de un proceso en particular
 */
validacionEstadoProceso() {
  
  this.validacionEstadoProcesosService.validarEstadoProceso({
    'codigoProceso': "LIQUIDACION",
    "fechaSistema": this.fechaSistemaSelect
  }).subscribe({
    next: (response: any) => {
      var dataAlert = {
        msn: "Se generó la liquidacion exitosamente",
        codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
      };
      if(response.data.estadoProceso == "PROCESADO"){
        this.spinnerActive = false;
        clearInterval(this.idInterval);
      }
      if(response.data.estadoProceso == "PENDIENTE"){
        dataAlert = {
          msn: "Error al generar el cierre definitivo",
          codigo: GENERALES.CODE_EMERGENT.ERROR
        };
      }
      if(response.data.estadoProceso == "ERROR"){
        dataAlert = {
          msn: response.data.mensaje,
          codigo: GENERALES.CODE_EMERGENT.ERROR
        };
        this.spinnerActive = false;
        clearInterval(this.idInterval);
      }
      const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
        width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
        data: dataAlert
      }); setTimeout(() => { alert.close() }, 5000);
    },
    error: (data: any) => {
      this.spinnerActive = false;
      clearInterval(this.idInterval);
      const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
        width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
        data: {
          msn: data.error.response.description,
          codigo: GENERALES.CODE_EMERGENT.ERROR
        }
      }); setTimeout(() => { alert.close() }, 5000);
    }
  });
}

/**
* Se realiza consumo de servicio para generar la contabilidad AM
* @BaironPerez
*/
generarLiquidacionCostos() {
  const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
    width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
    data: {
      msn: "El proceso se esta ejecutando por favor espere por lo menos 2 minutos y seguido esto click en consultar costos",
      codigo: GENERALES.CODE_EMERGENT.ESPERAR
    }
   }); setTimeout(() => { alert.close() }, 5000);
  this.liquidarCostosService.liquidarCostos().subscribe((data: any) => {
    console.log("data: "+data);
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

consultarCostos() {
  this.liquidarCostosService.consultarCostos().subscribe((data: any) => {
    this.estadoBTN = false;
   this.estadoTabla = true;
   this.dataLiquidacionCosots = data.data;
   //Se construye tabla de info
   const tabla = [
     { nombre: "Cantidad operaciones liquidadas", cantidad: this.dataLiquidacionCosots.cantidadOperacionesLiquidadas, estado: true },
     { nombre: "Registros con error", cantidad: this.dataLiquidacionCosots.registrosConError, estado: true },
   ];
   //Se realizan validaciones
   this.tieneErrores = false;//conteoContabilidadDto.conteoContabilidadDto.conteoErroresContables > 0 ? true : false;
   this.dataSourceInfoProcesos = new MatTableDataSource(tabla);

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
    height:'90%', width: '90%',
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
    'idSeqGrupo':this.dataLiquidacionCosots.respuestaLiquidarCostos[0].seqGrupo,
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
