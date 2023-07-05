import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { ConciliacionesModel } from 'src/app/_model/consiliacion-model/conciliacion.model';
import { OpConciliadasService } from 'src/app/_service/conciliacion-service/op-conciliadas.service';
import { DialogDesconciliarComponent } from './dialog-desconciliar/dialog-desconciliar.component';
import { GeneralesService } from 'src/app/_service/generales.service';
import { FormControl } from '@angular/forms';
import { lastValueFrom } from 'rxjs';

@Component({    
  selector: 'app-operaciones-conciliadas',
  templateUrl: './operaciones-conciliadas.component.html',
  styleUrls: ['./operaciones-conciliadas.component.css']
})

/**
 * Clase que lista la operaciones conciliadas y nos permite llamar al Mat Dialog para hacer la desconciliación
 * @JuanMazo
 */
export class OperacionesConciliadasComponent implements OnInit {
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  //Registros paginados
  cantidadRegistros: number;
  estadoConciliacion: string[] = ['CONCILIADA'];
  bancoAVAL: string[];
  fechaOrigen: any;
  transportadora: string;
  fecha1: Date;
  public load: boolean = true;
  pageSizeList: number[] = [5, 10, 25, 100];

  //DataSource para pintar tabla de conciliados
  dataSourceConciliadas: MatTableDataSource<ConciliacionesModel>;
  displayedColumnsConciliadas: string[] = ['banco', 'transPortadora', 'ciudad', 'tipoOperacion', 'nombrePuntoOrigen', 'nombrePuntoDestino', 'ciudadPuntoOrigen', 'ciudadPuntoDestino', 'valor', 'tipoConciliacion', 'fechaEjecucion', 'acciones'];

  constructor(
    private dialog: MatDialog,
    private opConciliadasService: OpConciliadasService,
    private generalServices: GeneralesService) { 
      
    }

  async ngOnInit(): Promise<void> {
    let fechaFormat: string;
    await lastValueFrom(this.generalServices.listarParametroByFiltro({
      codigo: "FECHA_DIA_PROCESO"
    })).then((response) => {
      const [day, month, year] = response.data[0].valor.split('/');
      fechaFormat = year+'/'+month+'/'+day
      this.fecha1 = new Date(fechaFormat);
      this.fechaOrigen = new FormControl(response.data[0].valor);
    });

    this.listarConciliados(this.estadoConciliacion, 
      this.bancoAVAL == undefined ? [] : this.bancoAVAL, 
      this.fechaOrigen == undefined ? "" : fechaFormat, 
      this.transportadora == undefined ? "" : this.transportadora);
  }

   /** 
  * Se realiza consumo de servicio para listar los conciliaciones
  * @JuanMazo
  */
    async listarConciliados(estado?: string[], banco?: string[], fecha?: string, trasportadora?: string, pagina = 0, tamanio = 5) {
      this.load = true;
      this.dataSourceConciliadas = new MatTableDataSource();
      this.opConciliadasService.obtenerConciliados({
        page: pagina,
        size: tamanio,
        estadoConciliacion: estado,
        bancoAval: banco,
        fechaOrigen: fecha,
        tdv: trasportadora
      }).subscribe({
        next: (page: any) => { 
          this.dataSourceConciliadas = new MatTableDataSource(page.data.content);
          this.dataSourceConciliadas.sort = this.sort;
          this.cantidadRegistros = page.data.totalElements;
          this.pageSizeList = [5, 10, 25, 100, page.data.totalElements];
          this.load = false;
        },
        error: (err: any) => {
          this.dataSourceConciliadas = new MatTableDataSource();
          const alert = this.dialog.open(VentanaEmergenteResponseComponent, {
            width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
            data: {
              msn: err.error.response.description,
              codigo: GENERALES.CODE_EMERGENT.ERROR
            }
          });
          setTimeout(() => { alert.close()}, 3000);  
          this.load = false;    
        }
      });
  }

  /**
  * Metodo para gestionar la paginación de la tabla
  * @BaironPerez
  */
   mostrarMas(e: any) {
    const [month, day, year] = new Date(this.fechaOrigen.value).toLocaleDateString().split('/');
    const fechaFormat = year+'/'+month+'/'+day;
    this.listarConciliados(this.estadoConciliacion, 
      this.bancoAVAL == undefined ? [] : this.bancoAVAL, 
      this.fechaOrigen == undefined ? "" : fechaFormat, 
      this.transportadora == undefined ? "" : this.transportadora,
      e.pageIndex, e.pageSize);
  }

  /**
   * Evento que levanta un openDialog para pasar a estado no conciliado los conciliados
   * @JuanMazo
   */
  eventoDesconciliar(event: any) {
    const dialogRef =this.dialog.open(DialogDesconciliarComponent, {
      width: '400PX',
      data: {
        seleccionDescon: event
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      this.listarConciliados()
    });
  }
  
  filter(event) {
    const [month, day, year] = new Date(this.fechaOrigen.value).toLocaleDateString().split('/');
    const fechaFormat = year+'/'+month+'/'+day;
    this.listarConciliados(
      event.estadoConciliacion == undefined ? this.estadoConciliacion : event.estadoConciliacion, 
      event.banco == undefined ? "" : event.banco,
      this.fechaOrigen == undefined ? "" : fechaFormat,
      event.trasportadora == undefined ? "" : event.trasportadora
    );
  }
}
