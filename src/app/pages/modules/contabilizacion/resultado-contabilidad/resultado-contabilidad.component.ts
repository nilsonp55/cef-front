import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';
import { ErrorService } from 'src/app/_model/error.model';
import { CierreContabilidadService } from 'src/app/_service/contabilidad-service/cierre-contabilidad.service';
import { GenerarContabilidadService } from 'src/app/_service/contabilidad-service/generar-contabilidad.service';
import { LogProcesoDiarioService } from 'src/app/_service/contabilidad-service/log-proceso-diario.service';
import { GeneralesService } from 'src/app/_service/generales.service';
import Swal from 'sweetalert2';

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
  nombreBTNCerrar: string = "Ejecutar Cierre";
  bandera: string;
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
    @Inject(MAT_DIALOG_DATA) public data: {respuesta: any, titulo: any, tipoContabilidad: any, flag: any}
  ) { }

  async ngOnInit(): Promise<void> {
    ManejoFechaToken.manejoFechaToken()
    this.titulo = this.data.titulo
    this.bandera = this.data.flag
    if(this.bandera == "G"){
      this.nombreBTNCerrar = "CANCELAR"
    }else {
      this.nombreBTNCerrar = this.nombreBTNCerrar
    }
    this.codigoBanco = this.data.respuesta[0].bancoAval
    this.dataSourceInfoProcesos = new MatTableDataSource(this.data.respuesta);
    this.dataSourceInfoProcesos.sort = this.sort;
    const fecha = await this.generalServices.listarParametroByFiltro({
      codigo: "FECHA_DIA_PROCESO"
    }).toPromise();
    this.fechaSistemaSelect = fecha.data[0].valor;
  }


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
    }).subscribe(
      {
        next: () => {
          this.spinnerActive = false;
        },
        error: () => {
          this.onAlert('Error al generar el archivo', GENERALES.CODE_EMERGENT.ERROR);
        }
      });
  }

  validarFlag(){
    if(this.bandera == undefined){
      this.cerrarProceso();
    }
    if(this.bandera == "C") {
      this.cerrarProceso();
    }
    if(this.bandera == "G"){
      this.dialogRef.close();
    }
  }

  cerrarProceso() {
    this.modalProcesoEjecucion();
    this.cierreContabilidadService.cierreContabilidadAutorizacion({
      'fecha': this.fechaSistemaSelect,
      'tipoContabilidad': this.tipo,
      'estado': 'autorizacion1'
    }).subscribe(
      {
        next: () => {
          Swal.close();
          this.onAlert(
            GENERALES.MESSAGE_ALERT.MESSAGE_CIERRE_CONTABILIDAD_PM.SUCCESFULL_GENERATE_PM,
            GENERALES.CODE_EMERGENT.SUCCESFULL)
            .afterClosed().subscribe(() => {
              this.dialogRef.close();
            });
        },
        error: (err: any) => {
          Swal.close();
          this.onAlert(err.error.response.description, GENERALES.CODE_EMERGENT.ERROR);
        },
      });
  }

  modalProcesoEjecucion() {
    Swal.fire({
      title: "Proceso en ejecución",
      imageUrl: "assets/img/loading.gif",
      imageWidth: 80,
      imageHeight: 80,
      showConfirmButton: false,
      allowOutsideClick: false,
      customClass: { popup: "custom-alert-swal-text" }
    });
  }

  private onAlert(mensaje: string, codigo = GENERALES.CODE_EMERGENT.WARNING) {
    return this.dialog.open(VentanaEmergenteResponseComponent, {
      width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
      data: {
        msn: mensaje,
        codigo: codigo,
      },
    });
  }
}
