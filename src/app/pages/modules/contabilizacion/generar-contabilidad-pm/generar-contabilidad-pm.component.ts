import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';
import { GenerarContabilidadService } from 'src/app/_service/contabilidad-service/generar-contabilidad.service';
import { GeneralesService } from 'src/app/_service/generales.service';
import { ErroresContabilidadComponent } from '../errores-contabilidad/errores-contabilidad.component';
import { ResultadoContabilidadComponent } from '../resultado-contabilidad/resultado-contabilidad.component';


@Component({
  selector: 'app-generar-contabilidad-pm',
  templateUrl: './generar-contabilidad-pm.component.html',
  styleUrls: ['./generar-contabilidad-pm.component.css']
})

/**
 * Componente para gestionar el menu de contabilidad PM
 * @BaironPerez
*/
export class GenerarContabilidadPmComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  //Registros paginados
  cantidadRegistros: number;

  //Variable para activar spinner
  spinnerActive: boolean = false;

  //DataSource para pintar tabla de los procesos a ejecutar
  dataSourceInfoProcesos: MatTableDataSource<any>;
  displayedColumnsInfoProcesos: string[] = ['subactividad', 'cantidad', 'estado'];

  dataGenerateContabilidad: any;
  fechaSistemaSelect: any;
  tieneErrores: any = false;

  constructor(
    private dialog: MatDialog,
    private generarContabilidadService: GenerarContabilidadService,
    private generalServices: GeneralesService,
  ) { }

  ngOnInit(): void {
    ManejoFechaToken.manejoFechaToken()
    this.cargarDatosDesplegables();
    this.generarContabilidad();
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
  generarContabilidad() {
    this.spinnerActive = true;
    this.generarContabilidadService.generarContabilidad({ tipoContabilidad: "PM" }).subscribe({
      next: (data: any) => {
      this.dataGenerateContabilidad = data.data;
      let conteoContabilidadDto = data.data.conteoContabilidadDTO;
      //Se construye tabla de info
      const tabla = [
        { nombre: "Conteo Internas Generadas", cantidad: conteoContabilidadDto.conteoInternasGeneradas, estado: conteoContabilidadDto.estadoInternasGeneradas },
        { nombre: "Conteo Contables Generadas", cantidad: conteoContabilidadDto.conteoContablesGeneradas, estado: conteoContabilidadDto.estadoContablesGeneradas },
        { nombre: "Conteo Errores Contables", cantidad: conteoContabilidadDto.conteoErroresContables, estado: conteoContabilidadDto.estadoErroresContables },
        { nombre: "Conteo Contables Completadas", cantidad: conteoContabilidadDto.conteoContablesCompletadas, estado: conteoContabilidadDto.conteoContablesCompletadas },
      ];
      //Se realizan validaciones
      this.tieneErrores = conteoContabilidadDto.conteoErroresContables > 0 ? false : true;
      this.dataSourceInfoProcesos = new MatTableDataSource(tabla);
      this.spinnerActive = false;
    },
    error: (err: any) => {
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CONTABILIDAD_PM.ERROR__GENERATE_PM,
            codigo: GENERALES.CODE_EMERGENT.ERROR,
            showResume: true,
            msgDetalles: JSON.stringify(err.error)
          }
        });
        this.spinnerActive = false;
      }
    });
  }


  /**
   * Metodo encargado de ejecutar la vista de la tabla de transacciones
   * contables
   * @BaironPerez
   */
  verTransactContables() {
    this.dialog.open(ResultadoContabilidadComponent, {//generar
      width: '100%',
      height: '90%',
      data: {
        respuesta: this.dataGenerateContabilidad.respuestasContablesDTO,
        titulo: "Generar Contabilidad PM - Resultado",
        tipoContabilidad: "PM",
        flag: "G"
      }
    });
  }

  /**
  * Metodo encargado de ejecutar la vista de la tabla de transacciones
  * contables
  * @BaironPerez
  */
  verErrores() {
    this.dialog.open(ErroresContabilidadComponent, {
      width: '100%',
      height: '90%',
      data: {
        respuesta: this.dataGenerateContabilidad.erroresContablesDTO,
        titulo: "Generar Contabilidad PM - Errores",
      }
    });
  }
}
