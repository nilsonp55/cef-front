import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { LiquidacionMensualService } from 'src/app/_service/liquidacion-service/liquidacion-mensual.service';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';

@Component({
  selector: 'app-guardar-liquidacion',
  templateUrl: './guardar-liquidacion.component.html',
  styleUrls: ['./guardar-liquidacion.component.css']
})
export class GuardarLiquidacionComponent implements OnInit {

  //Variable para activar spinner
  spinnerActive: boolean = false;

  dataSource: any[]= [];
  dataSourceInfoAvVillas: MatTableDataSource<any>;
  dataSourceInfoOccidente: MatTableDataSource<any>;
  dataSourceInfoPopular: MatTableDataSource<any>;
  dataSourceInfoBogota: MatTableDataSource<any>;
  displayedColumnsInfoProcesos: string[] = ['descripcion', 'cantidad', 'valorLiquidado'];

  tablaAvVillas: any[];
  tablaOccidente: any[];
  tablaPopular: any[];
  tablaBogota: any[];

  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<GuardarLiquidacionComponent>,
    private liquidacionMensualService: LiquidacionMensualService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: {respuesta: any, titulo: any}
  ) { }

  ngOnInit(): void {
    ManejoFechaToken.manejoFechaToken()
    this.dataSource = this.data.respuesta;
    this.cargarDatos();
  }

  cargarDatos() {
    this.spinnerActive = true;
    let dataSourceAvVillas;
    let dataSourceOccidente;
    let dataSourcePopular;
    let dataSourceBogota;
    this.dataSource.forEach(item => {
      if (item.nombreBanco == "BANCO AVVILLAS") {
        dataSourceAvVillas = item;
      }
      if (item.nombreBanco == "BANCO DE OCCIDENTE") {
        dataSourceOccidente = item;
      }
      if (item.nombreBanco == "BANCO POPULAR") {
        dataSourcePopular = item;
      }
      if (item.nombreBanco == "BANCO DE BOGOTA") {
        dataSourceBogota = item;
      }
    });

    this.tablaAvVillas = [
      { descripcion: "Clasificación Fajos", cantidad: dataSourceAvVillas.cantidadAsignadaFajos, valorCapturado: dataSourceAvVillas.valorLiquidadoFajos },
      { descripcion: "Clasificación REM", cantidad: dataSourceAvVillas.cantidadAsignadaRem, valorCapturado: dataSourceAvVillas.valorLiquidadoRem },
      { descripcion: "Clasificación  Bolsas", cantidad: dataSourceAvVillas.cantidadAsignadaBolsas, valorCapturado: dataSourceAvVillas.valorLiquidadoBolsas },
    ];
    this.tablaOccidente = [
      { descripcion: "Clasificación Fajos", cantidad: dataSourceOccidente.cantidadAsignadaFajos, valorCapturado: dataSourceOccidente.valorLiquidadoFajos },
      { descripcion: "Clasificación REM", cantidad: dataSourceOccidente.cantidadAsignadaRem, valorCapturado: dataSourceOccidente.valorLiquidadoRem },
      { descripcion: "Clasificación  Bolsas", cantidad: dataSourceOccidente.cantidadAsignadaBolsas, valorCapturado: dataSourceOccidente.valorLiquidadoBolsas },
    ];
    this.tablaPopular = [
      { descripcion: "Clasificación Fajos", cantidad: dataSourcePopular.cantidadAsignadaFajos, valorCapturado: dataSourcePopular.valorLiquidadoFajos },
      { descripcion: "Clasificación REM", cantidad: dataSourcePopular.cantidadAsignadaRem, valorCapturado: dataSourcePopular.valorLiquidadoRem },
      { descripcion: "Clasificación  Bolsas", cantidad: dataSourcePopular.cantidadAsignadaBolsas, valorCapturado: dataSourcePopular.valorLiquidadoBolsas },
    ];
    this.tablaBogota = [
      { descripcion: "Clasificación Fajos", cantidad: dataSourceBogota.cantidadAsignadaFajos, valorCapturado: dataSourceBogota.valorLiquidadoFajos },
      { descripcion: "Clasificación REM", cantidad: dataSourceBogota.cantidadAsignadaRem, valorCapturado: dataSourceBogota.valorLiquidadoFajos },
      { descripcion: "Clasificación  Bolsas", cantidad: dataSourceBogota.cantidadAsignadaBolsas, valorCapturado: dataSourceBogota.valorLiquidadoFajos },
    ];
    this.dataSourceInfoAvVillas = new MatTableDataSource(this.tablaAvVillas);
    this.dataSourceInfoOccidente = new MatTableDataSource(this.tablaOccidente);
    this.dataSourceInfoPopular = new MatTableDataSource(this.tablaPopular);
    this.dataSourceInfoBogota = new MatTableDataSource(this.tablaBogota);
    this.spinnerActive = false;
  }

  /**
 * Se realiza guardado de la informacion de la liquidacion
 * @BaironPerez
 */
   guardar() {
    this.spinnerActive = true;
    this.liquidacionMensualService.guardarLiquidacionMensal(this.dataSource).subscribe(data => {
      const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
        width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
        data: {
          msn: 'La información se guardo exitosamente',
          codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
        }
      }); setTimeout(() => { alert.close() }, 4000);
      this.router.navigate(['/liquidacion/liquidacion-mensual']);
      this.dialogRef.close();
    },
    (err: any) => {
      const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
        width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
        data: {
          msn: 'Error al guardar la información de la liquidación',
          codigo: GENERALES.CODE_EMERGENT.ERROR
        }
      }); setTimeout(() => { alert.close() }, 4000);
      this.router.navigate(['/liquidacion/liquidacion-mensual']);
      this.dialogRef.close();
    })
  }

  /**
 * Se realiza cancelación y da retroceso
 * @BaironPerez
 */
   cancelar() {
    this.router.navigate(['/liquidacion/liquidacion-mensual']);
    this.dialogRef.close();
  }

  /** Gets the total cost of all transactions. */
  getTotalCost() {
    return this.tablaAvVillas.map(t => t.valorCapturado).reduce((acc, value) => acc + value, 0);
  }

}