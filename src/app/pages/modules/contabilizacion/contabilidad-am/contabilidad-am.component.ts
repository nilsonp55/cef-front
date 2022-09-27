import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { ErrorService } from 'src/app/_model/error.model';
import { CierreContabilidadService } from 'src/app/_service/contabilidad-service/cierre-contabilidad.service';
import { LogProcesoDiarioService } from 'src/app/_service/contabilidad-service/log-proceso-diario.service';
import { GeneralesService } from 'src/app/_service/generales.service';
import { DialogConfirmEjecutarComponentComponent } from '../dialog-confirm-ejecutar-component/dialog-confirm-ejecutar-component.component';
import { ResultadoContabilidadComponent } from '../resultado-contabilidad/resultado-contabilidad.component';

@Component({
  selector: 'app-contabilidad-am',
  templateUrl: './contabilidad-am.component.html',
  styleUrls: ['./contabilidad-am.component.css']
})

/**
 * Componente para gestionar el menu de contabilidad PM
 * @BaironPerez
*/
export class ContabilidadAmComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  //Rgistros paginados
  cantidadRegistros: number;

  //Variable para activar spinner
  spinnerActive: boolean = false;
  fechaSistemaSelect: any;
  //DataSource para pintar tabla de los procesos a ejecutar
  dataSourceInfoProcesos: MatTableDataSource<any>;
  displayedColumnsInfoProcesos: string[] = ['fechaProceso', 'actividad', 'estado', 'acciones'];

  constructor(
    private dialog: MatDialog,
    private generalServices: GeneralesService,
    private cierreContabilidadService: CierreContabilidadService,
    private logProcesoDiarioService: LogProcesoDiarioService
  ) { }

  async ngOnInit(): Promise<void> {
    const _fecha = await this.generalServices.listarParametroByFiltro({
      codigo: "FECHA_DIA_PROCESO"
    }).toPromise();
    this.fechaSistemaSelect = _fecha.data[0].valor;
    this.listarProcesos();
  }

  /**
  * Se realiza consumo de servicio para listr los procesos a ejectar
  * @BaironPerez
  */
  listarProcesos(pagina = 0, tamanio = 5) {
    this.logProcesoDiarioService.obtenerProcesosDiarios({
      page: pagina,
      size: tamanio,
    }).subscribe((page: any) => {
      const [day, month, year] = this.fechaSistemaSelect.split('/'); 
      const fechaSistemaFormat = [year, month, day].join('-');
      let result = page.data.filter(item => item.fechaFinalizacion === fechaSistemaFormat);
      this.dataSourceInfoProcesos = new MatTableDataSource(result);
      this.dataSourceInfoProcesos.sort = this.sort;
      this.cantidadRegistros = page.data.totalElements;
    },
      (err: ErrorService) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: 'Error al obtener los procesos de contabilidad a ejecutar',
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
        tipoContabilidad: "AM",
        
      }
    });

    validateArchivo.afterClosed().subscribe(result => {
      //Si presiona click en aceptar
      if (result.data.check) {
        this.spinnerActive = true;
        let tipoContabilida = "AM"
        let codBanco = 0;

        this.cierreContabilidadService.cierreContabilidad({
          'fechaSistema': result.data.fechaSistema,
          'tipoContabilidad': tipoContabilida,
          'codBanco': codBanco,
          'false': "INICIAL"
        }).subscribe(data => {
          //Ensayo re respuesta
          const respuesta = this.dialog.open(ResultadoContabilidadComponent, {
            width: '100%',
            data: {
              respuesta: data.data,
              titulo: "Generar Contabilidad AM - Resultado",
            }
          });
        },
          (err: any) => {
            this.spinnerActive = false;
            const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
              width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
              data: {
                msn: GENERALES.MESSAGE_ALERT.MESSAGE_CONTABILIDAD_AM.ERROR__GENERATE_AM,
                codigo: GENERALES.CODE_EMERGENT.ERROR
              }
            }); setTimeout(() => { alert.close() }, 4500);
          });
      }
      else {
        //Si presiona click en cancelar
      }
    })
  }

  /**
  * Metodo para gestionar la paginación de la tabla
  * @BaironPerez
  */
  mostrarMas(e: any) {
    this.listarProcesos(e.pageIndex, e.pageSize);
  }

}
