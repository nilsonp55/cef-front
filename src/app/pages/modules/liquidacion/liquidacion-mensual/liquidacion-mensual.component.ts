import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { GeneralesService } from 'src/app/_service/generales.service';
import { formatDate } from '@angular/common';
import { LiquidacionMensualService } from 'src/app/_service/liquidacion-service/liquidacion-mensual.service';

@Component({
  selector: 'app-liquidacion-mensual',
  templateUrl: './liquidacion-mensual.component.html',
  styleUrls: ['./liquidacion-mensual.component.css']
})
export class LiquidacionMensualComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  //Rgistros paginados
  cantidadRegistros: number;

  fechaSistemaSelectHTML: any;

  //Variable para activar spinner
  spinnerActive: boolean = false;

  //DataSource para pintar tabla de los procesos a ejecutar
  dataSourceInfoProcesos: MatTableDataSource<any>;
  displayedColumnsInfoProcesos: string[] = ['subactividad', 'cantidad', 'estado'];

  dataGenerateContabilidad: any;
  fechaSistemaSelect: any;
  mesSistemaSelect: any;
  selectedTransportadora: any;
  tieneErrores: any = false;
  transportadoras: any[] = [];

  constructor(
    private generalServices: GeneralesService,
    private router: Router,
    @Inject(LOCALE_ID) private locale: string
  ) { }

  ngOnInit(): void {
    this.cargarDatosDesplegables();

  }

    /**
 * Se cargan datos para el inicio de la pantalla
 * @BaironPerez
 */
  async cargarDatosDesplegables() {
    const _transportadoras = await this.generalServices.listarTransportadoras().toPromise();
    this.transportadoras = _transportadoras.data;
    
    const _fecha = await this.generalServices.listarParametroByFiltro({
      codigo: "FECHA_DIA_PROCESO"
    }).toPromise();
   // this.fechaSistemaSelect = _fecha.data[0].valor;
   this.fechaSistemaSelect = _fecha.data[0].valor;
   const [day, month, year] = this.fechaSistemaSelect.split('/');
   this.fechaSistemaSelectHTML = new Date(+year, Number(month) - 1,null);
   console.log(this.fechaSistemaSelect)
  }


  /**
   * Metodo encargado de ejecutar la vista de la tabla de informacion de liquidacion
   * mensual
   * @BaironPerez
   */
  consultar() {
    this.router.navigate(['/liquidacion/guardar-detalle-liquidacion', 
    this.fechaSistemaSelect, this.selectedTransportadora.codigo]);
  }

}
