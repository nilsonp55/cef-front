import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { ErrorService } from 'src/app/_model/error.model';
import { CierreContabilidadService } from 'src/app/_service/contabilidad-service/cierre-contabilidad.service';
import { GenerarContabilidadService } from 'src/app/_service/contabilidad-service/generar-contabilidad.service';
import { LogProcesoDiarioService } from 'src/app/_service/contabilidad-service/log-proceso-diario.service';
import { GeneralesService } from 'src/app/_service/generales.service';

/**
 * Componente para gestionar el menu de contabilidad PM
 * @BaironPerez
*/
@Component({
  selector: 'app-resultado-contabilidad',
  templateUrl: './resultado-contabilidad.component.html',
  styleUrls: ['./resultado-contabilidad.component.css']
})
export class ResultadoContabilidadComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  //Rgistros paginados
  cantidadRegistros: number;

  fechaSistemaSelect: any;
  codigoBanco: any;

  //Variable para activar spinner
  spinnerActive: boolean = false;

  titulo: any;

  tipo: any = this.data.tipoContabilidad;

  //DataSource para pintar tabla de los procesos a ejecutar
  dataSourceInfoProcesos: MatTableDataSource<any>;
  displayedColumnsInfoProcesos: string[] = [
      'abreviaturaBancoAval','naturalezaContable', 'cuentaMayor',
      'subAuxiliar', 'tipoIdentificacion', 'tipoCambioMonedaDolar', 'tipoCambioMonedaPeso', 
      'valorMoneda', 'valorPesos', 'valorUsd', 'centroCosto', 'centroBeneficio', 'ordenCo',
      'areaFuncional', 'descripcion', 'terceroGL', 'nombreTerceroGL',
      'fechaConversion', 'claveReferencia1', 'claveReferencia2'];

  constructor(
    private dialog: MatDialog,
    private generalServices: GeneralesService,
    private logProcesoDiarioService: LogProcesoDiarioService,
    private cierreContabilidadService: CierreContabilidadService,
    private generarContabilidadService: GenerarContabilidadService,
    private dialogRef: MatDialogRef<ResultadoContabilidadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {respuesta: any, titulo: any, tipoContabilidad: any}
  ) { }

  async ngOnInit(): Promise<void> {
    console.log(this.data)
    this.titulo = this.data.titulo
    this.codigoBanco = this.data.respuesta[0].bancoAval
    this.dataSourceInfoProcesos = new MatTableDataSource(this.data.respuesta);
    this.dataSourceInfoProcesos.sort = this.sort;
    const fecha = await this.generalServices.listarParametroByFiltro({
      codigo: "FECHA_DIA_PROCESO"
    }).toPromise();
    this.fechaSistemaSelect = fecha.data[0].valor;
  }

  /**
  * Se realiza consumo de servicio para listr los resultados de contabilidad
  * @BaironPerez
  
  listarProcesos(pagina = 0, tamanio = 5) {
    this.logProcesoDiarioService.obtenerProcesosDiarios({
      page: pagina,
      size: tamanio,
    }).subscribe((page: any) => {
      this.dataSourceInfoProcesos = new MatTableDataSource(page.data);
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
*/

  /**
   * Metodo encargado de ejecutar el servicio de visualizar archivo excel
   * @BaironPerez
   */
  verArchivoExcel() {
    this.spinnerActive = true;
    this.generarContabilidadService.generarArchivoContabilidad({
       'fecha': this.fechaSistemaSelect, 
       'tipoContabilidad': this.data.tipoContabilidad,
       'codBanco': this.codigoBanco
       }).subscribe(data => {
      //data.saveFile();
      this.spinnerActive = false;
    },
      (err: ErrorService) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: 'Error al generar el archivo',
            codigo: GENERALES.CODE_EMERGENT.ERROR
          } 
        }); setTimeout(() => { alert.close() }, 3000);
      });
  }

  cerrarProceso(){
    this.cierreContabilidadService.cierreContabilidadAutorizacion({
      'fecha': this.fechaSistemaSelect, 
      'tipoContabilidad': this.tipo,
      'estado':'autorizacion1'
    }).subscribe(data => {
      const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
        width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
        data: {
          msn: GENERALES.MESSAGE_ALERT.MESSAGE_CIERRE_CONTABILIDAD_PM.SUCCESFULL_GENERATE_PM,
          codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
        }
      }); setTimeout(() => { alert.close() }, 4000);
    //this.dialogRef.close({event:'Cancel'})
    })

  }

}