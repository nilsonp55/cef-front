import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';
import { LiquidacionMensualService } from 'src/app/_service/liquidacion-service/liquidacion-mensual.service';
import { GuardarLiquidacionComponent } from '../guardar-liquidacion/guardar-liquidacion.component';

@Component({
  selector: 'app-detalle-guardar-liquidacion',
  templateUrl: './detalle-guardar-liquidacion.component.html',
  styleUrls: ['./detalle-guardar-liquidacion.component.css']
})
export class DetalleGuardarLiquidacionComponent implements OnInit {

  //Variable para activar spinner
  spinnerActive: boolean = false;
  dataLiquidacion: any;

  //parametros URl
  fechaSelect: any;
  transportadoraSelect: any;

  //Valores capturados AvVillas
  cantidadCapturadaFaljosAvVillas: any;
  cantidadCapturadaRemAvVillas: any
  cantidadCapturadaBolsasAvVillas: any;
  //Valores capturados Occidente
  cantidadCapturadaFaljosOccidente: any;
  cantidadCapturadaRemOccidente: any
  cantidadCapturadaBolsasOccidente: any;
  //Valores Popular
  cantidadCapturadaFaljosPopular: any;
  cantidadCapturadaRemPopular: any
  cantidadCapturadaBolsasPopular: any;
  //Valores Bogota
  cantidadCapturadaFaljosBogota: any;
  cantidadCapturadaRemBogota: any
  cantidadCapturadaBolsasBogota: any;

  dataSourceInfoAvVillas: MatTableDataSource<any>;
  dataSourceInfoOccidente: MatTableDataSource<any>;
  dataSourceInfoPopular: MatTableDataSource<any>;
  dataSourceInfoBogota: MatTableDataSource<any>;
  displayedColumnsInfoProcesos: string[] = ['descripcion', 'cantidadEstimada', 'cantidadCapturada'];

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private liquidacionMensualService: LiquidacionMensualService,
  ) { }

  ngOnInit(): void {
    ManejoFechaToken.manejoFechaToken()
    this.fechaSelect = this.route.snapshot.params['fechaSistema'];
    this.transportadoraSelect = this.route.snapshot.params['codTransportadora'];

    this.consultaInfo();
  }

  /**
  * Se realiza consumo de servicio para consultar la liquidacion mensual
  * @BaironPerez
  */
  consultaInfo() {
    this.liquidacionMensualService.obtenerLiquidacionMensal({
      'transportadora': this.transportadoraSelect,
    }).subscribe((data: any) => {

      this.dataLiquidacion = data.data;
      this.spinnerActive = true;
      let dataSourceOccidente;
      let dataSourcePopular;
      let dataSourceBogota;
      let dataSourceAvVillas;

      this.dataLiquidacion.forEach(item => {
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

      const tablaAvVillas = [
        { descripcion: "Clasificación Fajos", cantidadEstimada: dataSourceAvVillas.cantidadEstimadaFajos, cantidadCapturada: "cantidadCapturadaFaljosAvVillas" },
        { descripcion: "Clasificación REM", cantidadEstimada: dataSourceAvVillas.cantidadEstimadaRem, cantidadCapturada: "cantidadCapturadaRemAvVillas" },
        { descripcion: "Clasificación  Bolsas", cantidadEstimada: dataSourceAvVillas.cantidadEstimadaBolsas, cantidadCapturada: "cantidadCapturadaBolsasAvVillas" },
      ];
      const tablaOccidente = [
        { descripcion: "Clasificación Fajos", cantidadEstimada: dataSourceOccidente.cantidadEstimadaFajos, cantidadCapturada: "cantidadCapturadaFaljosOccidente" },
        { descripcion: "Clasificación REM", cantidadEstimada: dataSourceOccidente.cantidadEstimadaRem, cantidadCapturada: "cantidadCapturadaRemOccidente" },
        { descripcion: "Clasificación  Bolsas", cantidadEstimada: dataSourceOccidente.cantidadEstimadaBolsas, cantidadCapturada: "cantidadCapturadaBolsasOccidente" },
      ];
      const tablaPopular = [
        { descripcion: "Clasificación Fajos", cantidadEstimada: dataSourcePopular.cantidadEstimadaFajos, cantidadCapturada: "cantidadCapturadaFaljosPopular" },
        { descripcion: "Clasificación REM", cantidadEstimada: dataSourcePopular.cantidadEstimadaRem, cantidadCapturada: "cantidadCapturadaRemPopular" },
        { descripcion: "Clasificación  Bolsas", cantidadEstimada: dataSourcePopular.cantidadEstimadaBolsas, cantidadCapturada: "cantidadCapturadaBolsasPopular" },
      ];
      const tablaBogota = [
        { descripcion: "Clasificación Fajos", cantidadEstimada: dataSourceBogota.cantidadEstimadaFajos, cantidadCapturada: "cantidadCapturadaFaljosBogota" },
        { descripcion: "Clasificación REM", cantidadEstimada: dataSourceBogota.cantidadEstimadaRem, cantidadCapturada: "cantidadCapturadaRemBogota" },
        { descripcion: "Clasificación  Bolsas", cantidadEstimada: dataSourceBogota.cantidadEstimadaBolsas, cantidadCapturada: "cantidadCapturadaBolsasBogota" },
      ];
      this.dataSourceInfoAvVillas = new MatTableDataSource(tablaAvVillas);
      this.dataSourceInfoOccidente = new MatTableDataSource(tablaOccidente);
      this.dataSourceInfoPopular = new MatTableDataSource(tablaPopular);
      this.dataSourceInfoBogota = new MatTableDataSource(tablaBogota);
      this.spinnerActive = false;

    },
      (err: any) => {
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: 'Error al consultar la liquidación',
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        }); setTimeout(() => { alert.close() }, 3000);
        this.router.navigate(['/liquidacion/liquidacion-mensual']);
      });
  }

  /**
  * Se realiza captura de evento para obtener el valor del campo
  * @BaironPerez
  */
  changeCaptura(element, event) {
    //AvVillas
    if (element.cantidadCapturada == "cantidadCapturadaFaljosAvVillas") {
      this.cantidadCapturadaFaljosAvVillas = event;
    }
    if (element.cantidadCapturada == "cantidadCapturadaRemAvVillas") {
      this.cantidadCapturadaRemAvVillas = event;
    }
    if (element.cantidadCapturada == "cantidadCapturadaBolsasAvVillas") {
      this.cantidadCapturadaBolsasAvVillas = event;
    }
    //Occidente
    if (element.cantidadCapturada == "cantidadCapturadaFaljosOccidente") {
      this.cantidadCapturadaFaljosOccidente = event;
    }
    if (element.cantidadCapturada == "cantidadCapturadaRemOccidente") {
      this.cantidadCapturadaRemOccidente = event;
    }
    if (element.cantidadCapturada == "cantidadCapturadaBolsasOccidente") {
      this.cantidadCapturadaBolsasOccidente = event;
    }
    //Popular
    if (element.cantidadCapturada == "cantidadCapturadaFaljosPopular") {
      this.cantidadCapturadaFaljosPopular = event;
    }
    if (element.cantidadCapturada == "cantidadCapturadaRemPopular") {
      this.cantidadCapturadaRemPopular = event;
    }
    if (element.cantidadCapturada == "cantidadCapturadaBolsasPopular") {
      this.cantidadCapturadaBolsasPopular = event;
    }
    //Bogota
    if (element.cantidadCapturada == "cantidadCapturadaFaljosBogota") {
      this.cantidadCapturadaFaljosBogota = event;
    }
    if (element.cantidadCapturada == "cantidadCapturadaRemBogota") {
      this.cantidadCapturadaRemBogota = event;
    }
    if (element.cantidadCapturada == "cantidadCapturadaBolsasBogota") {
      this.cantidadCapturadaBolsasBogota = event;
    }
  }

  /**
  * Se realiza consumo de servicio para liquidar y guardar
  * @BaironPerez
  */
  liquidar() {
    this.spinnerActive = true;
    //Asignamos valores registrados
    this.dataLiquidacion.forEach(item => {
      if (item.nombreBanco == "BANCO AVVILLAS") {
        item.cantidadAsignadaFajos = this.cantidadCapturadaFaljosAvVillas;
        item.cantidadAsignadaRem = this.cantidadCapturadaRemAvVillas;
        item.cantidadAsignadaBolsas = this.cantidadCapturadaBolsasAvVillas;;
      }
      if (item.nombreBanco == "BANCO DE OCCIDENTE") {
        item.cantidadAsignadaFajos = this.cantidadCapturadaFaljosOccidente;
        item.cantidadAsignadaRem = this.cantidadCapturadaRemOccidente;
        item.cantidadAsignadaBolsas = this.cantidadCapturadaBolsasOccidente;
      }
      if (item.nombreBanco == "BANCO POPULAR") {
        item.cantidadAsignadaFajos = this.cantidadCapturadaFaljosPopular;
        item.cantidadAsignadaRem = this.cantidadCapturadaRemPopular;
        item.cantidadAsignadaBolsas = this.cantidadCapturadaBolsasPopular;
      }
      if (item.nombreBanco == "BANCO DE BOGOTA") {
        item.cantidadAsignadaFajos = this.cantidadCapturadaFaljosBogota;
        item.cantidadAsignadaRem = this.cantidadCapturadaRemBogota;
        item.cantidadAsignadaBolsas = this.cantidadCapturadaBolsasBogota;
      }
    });

    this.liquidacionMensualService.liquidarMensual(this.dataLiquidacion).subscribe(data => {
      this.spinnerActive = false;
      const respuesta = this.dialog.open(GuardarLiquidacionComponent, {
        width: '100%',
        data: {
          respuesta: data.data,
          titulo: "",
        }
      });
    },
      (err: any) => {
        this.spinnerActive = false;
        const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
          width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
          data: {
            msn: 'Error al realizar mi liquidación',
            codigo: GENERALES.CODE_EMERGENT.ERROR
          }
        }); setTimeout(() => { alert.close() }, 3000);
      })
  }

  /**
  * Se realiza cancelación y da retroceso
  * @BaironPerez
  */
  cancelar() {
    this.router.navigate(['/liquidacion/liquidacion-mensual']);
  }

  onKeypressEvent(event: any):  any {
    if(event.charCode < 48 || event.charCode > 57) return false;
  }

}
