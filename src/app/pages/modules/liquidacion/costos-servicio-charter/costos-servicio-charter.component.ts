import { Component, OnInit, ViewChild } from '@angular/core';
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
  //DataSource para pintar tabla de los procesos a ejecutar
  dataSourceInfoProcesos: MatTableDataSource<any>;
  displayedColumnsInfoProcesos: string[] = ['bancoAval', 'tdv', 'puntoOrigen', 'puntoDestino', 'tipoServicioProvision', 'valor', 'costoCharter', 'acciones'];

  constructor(
    private dialog: MatDialog,
    private costosFleteCharterService: CostosFleteCharterService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.listarCostosFleteCharter(null, null);
  }

  /**
  * Se realiza consumo de servicio para listar los costos flete chafter
  * @BaironPerez
  */
  listarCostosFleteCharter(fecha_inicial, fecha_final) {
    const data = [
      {
        "idLiquidacion": 1,
        "billetes": "XXX",
        "codigoBanco": 297,
        "codigoTdv": "THO",
        "escala": "CHARTER",
        "fajado": "XXX",
        "fechaEjecucion": "2022-09-02T05:00:00.000+00:00",
        "monedas": "XXX",
        "numeroBolsas": 1,
        "numeroFajos": 1,
        "numeroParadas": 1,
        "puntoDestino": 1,
        "puntoOrigen": 2,
        "residuoBilletes": 1,
        "residuoMonedas": 1,
        "seqGrupo": 1,
        "tipoOperacion": "VENTA",
        "tipoPunto": "FONDO",
        "tipoServicio": "PROGRAMADA",
        "valorBilletes": 1.0,
        "valorMonedas": 1.0,
        "valorTotal": 100.0,
        "valoresLiquidados": {
          "idValoresLiq": 1,
          "clasificacionFajado": 1.0,
          "clasificacionNoFajado": 1.0,
          "costoCharter": 15000.0,
          "costoEmisario": 1.0,
          "costoFijoParada": 1.0,
          "costoMoneda": 1.0,
          "costoPaqueteo": 1.0,
          "idLiquidacion": 1,
          "milajePorRuteo": 1.0,
          "milajeVerificacion": 1.0,
          "modenaResiduo": 1.0,
          "tasaAeroportuaria": 1.0
        },
        "nombreBanco": "BBOG",
        "nombreTdv": "PROSEGUR",
        "nombrePuntoOrigen": "BBOG-SAN ANDRES-ATLAS",
        "nombrePuntoDestino": "BAVV-SAN ANDRES-ATLAS"
      },
      {
        "idLiquidacion": 2,
        "billetes": "XXX",
        "codigoBanco": 297,
        "codigoTdv": "THO",
        "escala": "CHARTER",
        "fajado": "XXX",
        "fechaEjecucion": "2022-09-02T05:00:00.000+00:00",
        "monedas": "XXX",
        "numeroBolsas": 1,
        "numeroFajos": 1,
        "numeroParadas": 1,
        "puntoDestino": 1,
        "puntoOrigen": 2,
        "residuoBilletes": 1,
        "residuoMonedas": 1,
        "seqGrupo": 1,
        "tipoOperacion": "VENTA",
        "tipoPunto": "FONDO",
        "tipoServicio": "PROGRAMADA",
        "valorBilletes": 1.0,
        "valorMonedas": 1.0,
        "valorTotal": 450.0,
        "valoresLiquidados": {
          "idValoresLiq": 1,
          "clasificacionFajado": 1.0,
          "clasificacionNoFajado": 1.0,
          "costoCharter": 15000.0,
          "costoEmisario": 1.0,
          "costoFijoParada": 1.0,
          "costoMoneda": 1.0,
          "costoPaqueteo": 1.0,
          "idLiquidacion": 1,
          "milajePorRuteo": 1.0,
          "milajeVerificacion": 1.0,
          "modenaResiduo": 1.0,
          "tasaAeroportuaria": 1.0
        },
        "nombreBanco": "OCCI",
        "nombreTdv": "OMEGA",
        "nombrePuntoOrigen": "BBOG-SAN ANDRES-ATLAS",
        "nombrePuntoDestino": "BAVV-SAN ANDRES-ATLAS"
      }
    ]

    this.dataSourceInfoProcesos = new MatTableDataSource(data);
    this.dataSourceInfoProcesos.sort = this.sort;
    this.cantidadRegistros = data.length;
    this.costosFleteCharterService.obtenerCostosFleteCharter({
      'fechaInicial': fecha_inicial,
      'fechaFinal': fecha_final
    }).subscribe((page: any) => {
      this.dataSourceInfoProcesos = new MatTableDataSource(page.data);
      this.dataSourceInfoProcesos.sort = this.sort;
      this.cantidadRegistros = page.data.totalElements;
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
  guardar(param: any) {
    debugger
    const object = {
      idLiquidacion: param.idLiquidacion,
      costoCharter: this.costoaEditarSeleccionado
    };
    this.costosFleteCharterService.guardarCostosFleteCharter(object).subscribe(result => {
      const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
        width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
        data: {
          msn: 'Se actualizó el costo charter exitosamente',
          codigo: GENERALES.CODE_EMERGENT.SUCCESFULL
        }
      }); setTimeout(() => { alert.close() }, 5000);
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

  changeCosto(data: any) {

  }
  
}
