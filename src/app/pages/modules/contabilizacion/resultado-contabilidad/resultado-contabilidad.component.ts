import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { ErrorService } from 'src/app/_model/error.model';
import { LogProcesoDiarioService } from 'src/app/_service/contabilidad-service/log-proceso-diario.service';

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

  //Variable para activar spinner
  spinnerActive: boolean = false;

  titulo: any;

  //DataSource para pintar tabla de los procesos a ejecutar
  dataSourceInfoProcesos: MatTableDataSource<any>;
  displayedColumnsInfoProcesos: string[] = ['bancoAval', 'naturalezaContable', 'cuentaMayor',
      'subAuxiliar', 'tipoIdentificacion', 'tipoCambioMonedaDolar', 'tipoCambioMonedaPeso', 
      'valorMoneda', 'valorPesos', 'valorUsd', 'centroCosto', 'centroBeneficio', 'ordenCo',
      'areaFuncional', 'identificador', 'descripcionTransaccion', 'terceroGL', 'nombreTerceroGL',
      'fechaConversion', 'claveReferencia1', 'claveReferencia2'];

  constructor(
    private dialog: MatDialog,
    private logProcesoDiarioService: LogProcesoDiarioService,
    private dialogRef: MatDialogRef<ResultadoContabilidadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {respuesta: any, titulo: any}
  ) { }

  ngOnInit(): void {
    this.titulo = this.data.titulo
    this.listarProcesos();
  }

  /**
  * Se realiza consumo de servicio para listr los resultados de contabilidad
  * @BaironPerez
  */
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

  /**
   * Metodo encargado de ejecutar el servicio de visualizar archivo excel
   * @BaironPerez
   */
  verArchivoExcel() {
  
  }

  /**
   * Metodo encargado de ejecutar el servicio de solicitar autorizacion
  * @BaironPerez
  */
  solicitarAutorizacion() {

  }

  /**
  * Metodo para gestionar la paginación de la tabla
  * @BaironPerez
  */
   mostrarMas(e: any) {
    this.listarProcesos(e.pageIndex, e.pageSize);
  }

}