import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';
import { CierreContabilidadService } from 'src/app/_service/contabilidad-service/cierre-contabilidad.service';
import { LogProcesoDiarioService } from 'src/app/_service/contabilidad-service/log-proceso-diario.service';
import { GeneralesService } from 'src/app/_service/generales.service';
import { DialogConfirmEjecutarComponentComponent } from '../dialog-confirm-ejecutar-component/dialog-confirm-ejecutar-component.component';
import { ResultadoContabilidadComponent } from '../resultado-contabilidad/resultado-contabilidad.component';
import { BancoModel } from 'src/app/_model/banco.model';
import { GenerarArchivoService } from 'src/app/_service/contabilidad-service/generar-archivo.service';
import { saveAs } from 'file-saver';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-contabilidad-pm',
  templateUrl: './contabilidad-pm.component.html',
  styleUrls: ['./contabilidad-pm.component.css']
})

/**
 * Componente para gestionar el menu de contabilidad PM
 * @BaironPerez
 */
export class ContabilidadPmComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;

  //Registros paginados
  cantidadRegistros: number;

  //Variable para activar spinner
  spinnerActive: boolean = false;

  //DataSource para pintar tabla de los procesos a ejecutar
  fechaSistemaSelect: any;
  dataSourceInfoProcesos: MatTableDataSource<any>;
  displayedColumnsInfoProcesos: string[] = ['fechaCreacion', 'codigoProceso', 'estadoProceso', 'acciones'];
  bancoOptions: BancoModel[];
  load: boolean = false;

  constructor(
    private dialog: MatDialog,
    private generalServices: GeneralesService,
    private cierrecontabilidadService: CierreContabilidadService,
    private logProcesoDiarioService: LogProcesoDiarioService,
    private generarArchivoService: GenerarArchivoService
  ) { }

  async ngOnInit(): Promise<void> {
    ManejoFechaToken.manejoFechaToken()
    const _fecha = await this.generalServices.listarParametroByFiltro({
      codigo: "FECHA_DIA_PROCESO"
    }).toPromise();
    this.fechaSistemaSelect = _fecha.data[0].valor;
    this.listarProcesos();
    this.listarBancos();
  }

  /**
   * Se realiza consumo de servicio para listar los procesos a ejectar
   * @BaironPerez
   */
  listarProcesos(pagina = 0, tamanio = 5) {
    this.logProcesoDiarioService.obtenerProcesosDiarios({
      page: pagina,
      size: tamanio,
    }).subscribe({next: (page: any) => {
        this.dataSourceInfoProcesos = new MatTableDataSource(page.data);
        this.dataSourceInfoProcesos.sort = this.sort;
        this.cantidadRegistros = page.data.totalElements;
      },
      error: (err: any) => {
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_DATA_FILE,
            codigo: GENERALES.CODE_EMERGENT.ERROR,
            showResume: true,
            msgDetalles: JSON.stringify(err.error)
          }
        });
      }
    });
  }

  /**
   * Metodo encargado de ejecutar el servicio de contabilidad para los
   * procesos activos
   * @BaironPerez
   */
  ejecutar() {
    //ventana de confirmacion
    this.dialog.open(DialogConfirmEjecutarComponentComponent, {
      width: '50%',
      data: {
        tipoContabilidad: "PM"
      }
    }).afterClosed().subscribe(result => {
      //Si presiona click en aceptar
      if (result.data.check) {
        this.spinnerActive = true;
        let tipoContabilida = "PM";
        let codBanco = 0;
        this.cierrecontabilidadService.cierreContabilidad({
          'fechaSistema': result.data.fechaSistema,
          'tipoContabilidad': tipoContabilida,
          'codBanco': codBanco,
          'fase': "INICIAL"
        }).subscribe({ next: data => {
            //Ensayo re respuesta
            this.dialog.open(ResultadoContabilidadComponent, {
              width: '100%',
              data: {
                respuesta: data.data,
                titulo: "Generar Contabilidad PM - Resultado",
                tipoContabilidad: "PM",
                flag: "C"
              }
            });
          },
          error: (err: any) => {
            this.spinnerActive = false;
            this.dialog.open(VentanaEmergenteResponseComponent, {
              width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
              data: {
                msn: GENERALES.MESSAGE_ALERT.MESSAGE_CONTABILIDAD_PM.ERROR__GENERATE_PM,
                codigo: GENERALES.CODE_EMERGENT.ERROR,
                showResume: true,
                msgDetalles: JSON.stringify(err.error)
              }
            });
          }
        });
      }
    })
  }


  descargarArchivoContabilidad() {
    this.load = true;
    this.bancoOptions.forEach(codBanco => {
      lastValueFrom(this.generarArchivoService.generarArchivo({
        fecha: this.fechaSistemaSelect,
        tipoContabilidad: "PM",
        codBanco: codBanco.codigoPunto
      })).then(
        response => {
          if (response.headers.has('content-disposition')) {
            const archivo_generar = response.headers.get("content-disposition").split(';')[1].split('=')[1].trim();
            saveAs(response.body, archivo_generar);
          }
        },
        error => {
          this.dialog.open(VentanaEmergenteResponseComponent, {
            width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
            data: {
              msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_DATA_FILE,
              codigo: GENERALES.CODE_EMERGENT.ERROR,
              showResume: true,
              msgDetalles: JSON.stringify(error)
            }
          });
        }
      );
    });
    this.load = false;
  }

  listarBancos() {
    this.generalServices.listarBancosAval().subscribe({next: data => {
        this.bancoOptions = data.data
      },
      error: (err: any) => {
        this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: GENERALES.MESSAGE_ALERT.MESSAGE_BANCO.ERROR_BANCO,
            codigo: GENERALES.CODE_EMERGENT.ERROR,
            showResume: true,
            msgDetalles: JSON.stringify(err.error)
          }
        });
      }
    });
  }

}
