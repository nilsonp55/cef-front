import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { ErrorService } from 'src/app/_model/error.model';
import { GenerarContabilidadService } from 'src/app/_service/contabilidad-service/generar-contabilidad.service';
import { LogProcesoDiarioService } from 'src/app/_service/contabilidad-service/log-proceso-diario.service';
import { GeneralesService } from 'src/app/_service/generales.service';
import { DialogConfirmEjecutarComponentComponent } from '../dialog-confirm-ejecutar-component/dialog-confirm-ejecutar-component.component';
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

  fechaSistemaSelect: any;

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
    const tabla = [ 
      {nombre: "conteoInternasGeneradas", cantidad: 12, estado: true},
      {nombre: "conteoContablesGeneradas", cantidad: 112, estado: false},
      {nombre: "conteoErroresContables", cantidad: 0, estado: true},
      {nombre: "conteoContablesCompletadas", cantidad: 42, estado: false},    
    ];
    this.dataSourceInfoProcesos = new MatTableDataSource(tabla);

    this.generarContabilidadService.generarContabilidad({tipoContabilidad: "AM"}).subscribe((page: any) => {
      
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
   * Metodo encargado de ejecutar el servicio de contabilidad para los 
   * procesos activos
   * @BaironPerez
   */
  ejecutar() {
    let data;
    //ventana de confirmacion
    const validateArchivo = this.dialog.open(DialogConfirmEjecutarComponentComponent, {
      width: '750px',
      data: {
        tipoContabilidad: "PM"
      }
    });

    validateArchivo.afterClosed().subscribe(result => {
      //Si presiona click en aceptar
      if (result.data.check) {
        this.spinnerActive = true;
        let tipoContabilidad = "AM"
        let numeroBancos = result.data.banco.nombreBanco === "Todos"? "TODOS": null;
        let codBanco = result.data.banco.nombreBanco != "Todos"? result.data.banco.codigoPunto: null;
        let fase;

        const generarContabilidadRequest = {
        }
        this.generarContabilidadService.generarContabilidad(generarContabilidadRequest).subscribe(data => {
          const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
            width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
            data: {
              msn: GENERALES.MESSAGE_ALERT.MESSAGE_CONTABILIDAD_PM.SUCCESFULL_GENERATE_PM,
              codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
            }
          }); setTimeout(() => { alert.close() }, 3500);
        },
          (err: any) => {
            this.spinnerActive = false;
            const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
              width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
              data: {
                msn: GENERALES.MESSAGE_ALERT.MESSAGE_CONTABILIDAD_AM.ERROR__GENERATE_AM,
                codigo: GENERALES.CODE_EMERGENT.ERROR
              }
            }); setTimeout(() => { alert.close() }, 3500);
            //Ensayo re respuesta
            const respuesta = this.dialog.open(ResultadoContabilidadComponent, {
              width: '100%',
              data: {
                respuesta: "respuesta preuba",
                titulo: "Generar Contabilidad AM - Resultado",
              }
            });

          });
      }
      else {
         //Si presiona click en cancelar
      }
    })
  }

}
