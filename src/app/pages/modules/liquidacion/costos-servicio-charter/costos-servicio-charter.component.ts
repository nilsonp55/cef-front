import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { ErrorService } from 'src/app/_model/error.model';
import { CostosFleteCharterService } from 'src/app/_service/liquidacion-service/costosFleteCharter.service';

@Component({
  selector: 'app-costos-servicio-charter',
  templateUrl: './costos-servicio-charter.component.html',
  styleUrls: ['./costos-servicio-charter.component.css']
})
export class CostosServicioCharterComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  //Rgistros paginados
  cantidadRegistros: number;

  //Variable para activar spinner
  spinnerActive: boolean = false;
  costoEditar: any;
  costoaEditarSeleccionado: any;
  serializedDate: any;
  fecha1: Date;
  fecha2: Date;
  mostrarTabla: any = false;

  //DataSource para pintar tabla de los procesos a ejecutar
  dataSourceInfoProcesos: MatTableDataSource<any>;
  displayedColumnsInfoProcesos: string[] = ['bancoAval', 'tdv', 'puntoOrigen', 'puntoDestino', 'tipoServicioProvision', 'valor', 'costoCharter', 'acciones'];

  constructor(
    private dialog: MatDialog,
    private costosFleteCharterService: CostosFleteCharterService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.serializedDate = new FormControl(new Date().toISOString());
  }

  /**
  * Se realiza consumo de servicio para listar los costos flete chafter
  * @BaironPerez
  */
  listarCostosFleteCharter(fecha_inicial, fecha_final) {
    this.costosFleteCharterService.obtenerCostosFleteCharter({
      'fechaInicial': fecha_inicial,
      'fechaFinal': fecha_final
    }).subscribe((page: any) => {
      this.dataSourceInfoProcesos = new MatTableDataSource(page.data);
      this.dataSourceInfoProcesos.sort = this.sort;
      this.cantidadRegistros = page.data.totalElements;
      this.mostrarTabla = true
    },
      (err: ErrorService) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: 'Error al obtener los costos flete charter',
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
  guardar(param: any) {debugger
    const object = {
      idLiquidacion: param.idLiquidacion,
      costoCharter: this.costoEditar
    };
    this.costosFleteCharterService.guardarCostosFleteCharter(object).subscribe(result => {
      const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
        width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
        data: {
          msn: 'Se actualizó el costo charter exitosamente',
          codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
        }
      }); setTimeout(() => { alert.close() }, 5000);
      this.costoEditar = undefined;
    }, (err: ErrorService) => {
      const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
        width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
        data: {
          msn: 'Error al guardar el nuevo costo charter',
          codigo: GENERALES.CODE_EMERGENT.ERROR
        }
      }); setTimeout(() => { alert.close() }, 3000);
    })
  }

  /**
   * Metodo encargado de ejecutar el servicio de buscar por las fechas
   * seleccionadas
   * @BaironPerez
   */
  buscar() {
    if(this.fecha1 !== undefined && this.fecha1 !== null && this.fecha2 !== undefined && this.fecha2 !== null) {
      this.listarCostosFleteCharter(this.fecha1, this.fecha2);
    } else {
      const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
        width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
        data: {
          msn: 'Seleccione ambas fechas',
          codigo: GENERALES.CODE_EMERGENT.WARNING
        }
      }); setTimeout(() => { alert.close() }, 3000);
    }
  }

  changeValor(param: any) {
    this.costoEditar = param.target.value;;
  }

  onKeypressEvent(event: any):  any {
      if(event.charCode < 48 || event.charCode > 57) return false;
  }
  
}
