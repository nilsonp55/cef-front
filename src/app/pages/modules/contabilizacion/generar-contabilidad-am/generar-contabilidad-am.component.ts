import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { ErrorService } from 'src/app/_model/error.model';
import { GenerarContabilidadService } from 'src/app/_service/contabilidad-service/generar-contabilidad.service';
import { GeneralesService } from 'src/app/_service/generales.service';
import { ResultadoContabilidadComponent } from '../resultado-contabilidad/resultado-contabilidad.component';

@Component({
  selector: 'app-generar-contabilidad-am',
  templateUrl: './generar-contabilidad-am.component.html',
  styleUrls: ['./generar-contabilidad-am.component.css']
})

/**
 * Componente para gestionar el menu de contabilidad PM
 * @BaironPerez
*/
export class GenerarContabilidadAmComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  //Rgistros paginados
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
    this.generarContabilidadService.generarContabilidad({ tipoContabilidad: "AM" }).subscribe((data: any) => {
      this.dataGenerateContabilidad = data.data;
      let conteoContabilidadDto = data.data.conteoContabilidadDTO;
      //Se construye tabla de info
      const tabla = [
        { nombre: "conteoInternasGeneradas", cantidad: conteoContabilidadDto.conteoInternasGeneradas, estado: conteoContabilidadDto.estadoInternasGeneradas },
        { nombre: "conteoContablesGeneradas", cantidad: conteoContabilidadDto.conteoContablesGeneradas, estado: conteoContabilidadDto.estadoContablesGeneradas },
        { nombre: "conteoErroresContables", cantidad: conteoContabilidadDto.conteoErroresContables, estado: conteoContabilidadDto.estadoErroresContables },
        { nombre: "conteoContablesCompletadas", cantidad: conteoContabilidadDto.conteoContablesCompletables, estado: conteoContabilidadDto.estadoContablesCompletables },
      ];
      //Se realizan validaciones
      this.tieneErrores = conteoContabilidadDto.conteoContabilidadDto.conteoErroresContables > 0 ? true : false;
      this.dataSourceInfoProcesos = new MatTableDataSource(tabla);
      this.spinnerActive = false;
    },
      (err: ErrorService) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: 'Error al generar contabilidad AM',
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        }); setTimeout(() => { alert.close() }, 3000);
      });
  }


  /**
   * Metodo encargado de ejecutar la vista de la tabla de transacciones 
   * contables
   * @BaironPerez
   */
  verTransactContables() {
    const respuesta = this.dialog.open(ResultadoContabilidadComponent, {
      width: '100%',
      data: {
        respuesta: "respuesta preuba",
        titulo: "Generar Contabilidad AM - Resultado",
      }
    });
  }

  /**
  * Metodo encargado de ejecutar la vista de la tabla de transacciones 
  * contables
  * @BaironPerez
  */
  verErrores() {

  }
}
